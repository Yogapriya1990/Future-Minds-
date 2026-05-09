from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.enrollment import Enrollment
from app.models.event import Event
from app.models.tool_usage import ToolUsage
from app.models.user import User, UserRole
from app.models.workflow_run import WorkflowRun
from pydantic import BaseModel
from app.schemas.analytics import PlatformStatsResponse, UserStatsResponse

router = APIRouter(prefix="/analytics")


@router.get("/me", response_model=UserStatsResponse)
async def my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from sqlalchemy import func

    tokens_used = db.query(func.sum(ToolUsage.tokens_used)).filter(ToolUsage.user_id == current_user.id).scalar() or 0
    courses_enrolled = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).count()
    courses_completed = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.progress_percent >= 100,
    ).count()
    tools_run = db.query(ToolUsage).filter(ToolUsage.user_id == current_user.id).count()

    from app.models.workflow import Workflow
    user_workflow_ids = [w.id for w in db.query(Workflow).filter(Workflow.user_id == current_user.id).all()]
    workflow_runs = db.query(WorkflowRun).filter(WorkflowRun.workflow_id.in_(user_workflow_ids)).count() if user_workflow_ids else 0

    return UserStatsResponse(
        tokens_used_total=int(tokens_used),
        courses_enrolled=courses_enrolled,
        courses_completed=courses_completed,
        tools_run=tools_run,
        workflow_runs=workflow_runs,
    )


@router.get("/platform", response_model=PlatformStatsResponse)
async def platform_stats(
    _: User = Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timezone, timedelta
    from sqlalchemy import func

    total_users = db.query(User).count()
    today = datetime.now(timezone.utc).date()
    active_today = db.query(Event).filter(
        func.date(Event.created_at) == today
    ).distinct(Event.user_id).count()

    top_tools_raw = (
        db.query(ToolUsage.tool_id, func.count(ToolUsage.id).label("count"))
        .group_by(ToolUsage.tool_id)
        .order_by(func.count(ToolUsage.id).desc())
        .limit(5)
        .all()
    )
    from app.models.tool import Tool
    top_tools = []
    for tool_id, count in top_tools_raw:
        tool = db.query(Tool).filter(Tool.id == tool_id).first()
        if tool:
            top_tools.append({"name": tool.name, "slug": tool.slug, "runs": count})

    new_enrollments = db.query(Enrollment).filter(func.date(Enrollment.created_at) == today).count()

    return PlatformStatsResponse(
        total_users=total_users,
        active_users_today=active_today,
        total_revenue=0.0,
        top_tools=top_tools,
        new_enrollments_today=new_enrollments,
    )


class EventRequest(BaseModel):
    event_type: str
    metadata: dict = {}


@router.post("/event")
async def track_event(
    body: EventRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = Event(
        user_id=current_user.id,
        event_type=body.event_type,
        event_metadata=body.metadata,
    )
    db.add(event)
    db.commit()
    return {"tracked": True}
