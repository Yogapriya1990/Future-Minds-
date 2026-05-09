from datetime import datetime
from typing import Literal
from pydantic import BaseModel

AIModelLiteral = Literal["gpt-4o", "gpt-4o-mini", "claude-sonnet", "claude-haiku"]


class ConversationCreate(BaseModel):
    model: AIModelLiteral = "gpt-4o"
    title: str | None = None


class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    model: str
    total_tokens: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    tokens_used: int
    created_at: datetime | None = None

    model_config = {"from_attributes": True}
