from datetime import datetime
from pydantic import BaseModel


class ToolResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    category: str
    icon_url: str | None
    model: str
    is_active: bool
    is_premium: bool

    model_config = {"from_attributes": True}


class ToolRunRequest(BaseModel):
    input_text: str


class ToolRunResponse(BaseModel):
    output_text: str
    tokens_used: int
    tool_slug: str


class ToolUsageResponse(BaseModel):
    id: int
    tool_id: int
    input_text: str
    output_text: str
    tokens_used: int
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class ToolCreate(BaseModel):
    name: str
    slug: str
    description: str
    category: str
    prompt_template: str
    model: str = "gpt-4o"
    is_active: bool = True
    is_premium: bool = False
    icon_url: str | None = None


class ToolUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    category: str | None = None
    prompt_template: str | None = None
    model: str | None = None
    is_active: bool | None = None
    is_premium: bool | None = None
