import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.workflow import Workflow
from app.models.workflow_run import WorkflowRun, RunStatus
from app.models.user import User
from app.schemas.workflow import WorkflowCreate, WorkflowResponse, WorkflowRunResponse, WorkflowUpdate

router = APIRouter(prefix="/workflows")
logger = logging.getLogger(__name__)


@router.get("", response_model=list[WorkflowResponse])
async def list_workflows(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Workflow).filter(Workflow.user_id == current_user.id).order_by(Workflow.created_at.desc()).all()


@router.post("", response_model=WorkflowResponse, status_code=201)
async def create_workflow(
    body: WorkflowCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wf = Workflow(
        user_id=current_user.id,
        name=body.name,
        description=body.description,
        trigger_type=body.trigger_type,
        steps=[s.model_dump() for s in body.steps],
        schedule_cron=body.schedule_cron,
    )
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: int,
    body: WorkflowUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    for field, value in body.model_dump(exclude_none=True).items():
        if field == "steps" and value is not None:
            setattr(wf, field, [s.model_dump() if hasattr(s, "model_dump") else s for s in value])
        else:
            setattr(wf, field, value)
    db.commit()
    db.refresh(wf)
    return wf


@router.delete("/{workflow_id}", status_code=204)
async def delete_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    db.delete(wf)
    db.commit()


@router.post("/{workflow_id}/toggle", response_model=WorkflowResponse)
async def toggle_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    wf.is_active = not wf.is_active
    db.commit()
    db.refresh(wf)
    return wf


@router.post("/{workflow_id}/run", response_model=WorkflowRunResponse)
async def run_workflow(
    workflow_id: int,
    body: dict = {},
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    run = WorkflowRun(workflow_id=workflow_id, input_data=body, status=RunStatus.running)
    db.add(run)
    db.commit()
    db.refresh(run)

    try:
        from app.routers.tools import run_tool
        output_data = {}
        current_input = body.get("input", "")

        for step in (wf.steps or []):
            tool_slug = step.get("tool_slug", "")
            input_template = step.get("input_template", "{input}")
            step_input = input_template.replace("{input}", str(current_input))

            from app.models.tool import Tool
            from app.schemas.tool import ToolRunRequest
            tool = db.query(Tool).filter(Tool.slug == tool_slug, Tool.is_active == True).first()
            if tool:
                from app.main import anthropic_client, openai_client
                prompt = tool.prompt_template.replace("{input}", step_input)
                step_output = ""
                try:
                    if tool.model.value == "gpt-4o" and openai_client:
                        resp = await openai_client.chat.completions.create(
                            model="gpt-4o",
                            messages=[{"role": "user", "content": prompt}],
                            max_tokens=512,
                        )
                        step_output = resp.choices[0].message.content or ""
                    elif anthropic_client:
                        resp = await anthropic_client.messages.create(
                            model="claude-sonnet-4-6",
                            max_tokens=512,
                            messages=[{"role": "user", "content": prompt}],
                        )
                        step_output = resp.content[0].text if resp.content else ""
                except Exception as e:
                    step_output = f"Error: {e}"
                output_data[tool_slug] = step_output
                current_input = step_output

        run.status = RunStatus.completed
        run.output_data = output_data
        run.completed_at = datetime.now(timezone.utc)
    except Exception as e:
        logger.error("Workflow run error: %s", e)
        run.status = RunStatus.failed
        run.error_message = str(e)
        run.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(run)
    return run


@router.get("/{workflow_id}/runs", response_model=list[WorkflowRunResponse])
async def list_runs(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wf = db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.user_id == current_user.id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return db.query(WorkflowRun).filter(WorkflowRun.workflow_id == workflow_id).order_by(WorkflowRun.started_at.desc()).limit(50).all()
