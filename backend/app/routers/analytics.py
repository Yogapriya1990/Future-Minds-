from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_role
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.event import Event
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.tool import Tool
from app.models.tool_usage import ToolUsage
from app.models.user import User, UserRole, SubscriptionTier
from app.models.workflow import Workflow
from app.models.workflow_run import WorkflowRun
from pydantic import BaseModel
from app.schemas.analytics import PlatformStatsResponse, TopToolResponse, UserStatsResponse

router = APIRouter(prefix="/analytics")


@router.get("/me", response_model=UserStatsResponse)
async def my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tokens_used = (
        db.query(func.sum(ToolUsage.tokens_used))
        .filter(ToolUsage.user_id == current_user.id)
        .scalar() or 0
    )
    courses_enrolled = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).count()
    courses_completed = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.progress_percent >= 100,
    ).count()
    tools_run = db.query(ToolUsage).filter(ToolUsage.user_id == current_user.id).count()

    user_workflow_ids = [
        w.id for w in db.query(Workflow).filter(Workflow.user_id == current_user.id).all()
    ]
    workflow_runs = (
        db.query(WorkflowRun).filter(WorkflowRun.workflow_id.in_(user_workflow_ids)).count()
        if user_workflow_ids else 0
    )

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
    from datetime import datetime, timezone

    today = datetime.now(timezone.utc).date()

    total_users = db.query(User).count()

    dau = (
        db.query(func.count(func.distinct(Event.user_id)))
        .filter(func.date(Event.created_at) == today)
        .scalar() or 0
    )

    total_courses = db.query(Course).filter(Course.is_deleted == False).count()
    total_enrollments = db.query(Enrollment).count()
    total_tool_runs = db.query(ToolUsage).count()
    total_tokens_used = db.query(func.sum(ToolUsage.tokens_used)).scalar() or 0

    active_subscriptions = db.query(Subscription).filter(
        Subscription.status == SubscriptionStatus.active
    ).count()

    top_tools_raw = (
        db.query(ToolUsage.tool_id, func.count(ToolUsage.id).label("cnt"))
        .group_by(ToolUsage.tool_id)
        .order_by(func.count(ToolUsage.id).desc())
        .limit(5)
        .all()
    )
    top_tools = []
    for tool_id, cnt in top_tools_raw:
        tool = db.query(Tool).filter(Tool.id == tool_id).first()
        if tool:
            top_tools.append(TopToolResponse(name=tool.name, slug=tool.slug, usage_count=cnt))

    subscription_breakdown: dict[str, int] = {}
    for tier in SubscriptionTier:
        subscription_breakdown[tier.value] = (
            db.query(User).filter(User.subscription_tier == tier).count()
        )

    return PlatformStatsResponse(
        total_users=total_users,
        dau=dau,
        total_courses=total_courses,
        total_enrollments=total_enrollments,
        total_tool_runs=total_tool_runs,
        total_tokens_used=int(total_tokens_used),
        active_subscriptions=active_subscriptions,
        total_revenue=0.0,
        top_tools=top_tools,
        subscription_breakdown=subscription_breakdown,
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
