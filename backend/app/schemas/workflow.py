from datetime import datetime
from pydantic import BaseModel


class WorkflowStep(BaseModel):
    action: str
    tool_slug: str
    input_template: str


class WorkflowCreate(BaseModel):
    name: str
    description: str = ""
    trigger_type: str = "manual"
    steps: list[WorkflowStep] = []
    schedule_cron: str | None = None


class WorkflowUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    trigger_type: str | None = None
    steps: list[WorkflowStep] | None = None
    schedule_cron: str | None = None


class WorkflowResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: str
    trigger_type: str
    steps: list[dict]
    is_active: bool
    schedule_cron: str | None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class WorkflowRunResponse(BaseModel):
    id: int
    workflow_id: int
    status: str
    input_data: dict
    output_data: dict | None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error_message: str | None

    model_config = {"from_attributes": True}
