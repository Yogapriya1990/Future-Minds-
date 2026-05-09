import enum

from sqlalchemy import Column, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class AIModel(str, enum.Enum):
    gpt_4o = "gpt-4o"
    gpt_4o_mini = "gpt-4o-mini"
    claude_sonnet = "claude-sonnet"
    claude_haiku = "claude-haiku"


class Conversation(Base, TimestampMixin):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), default="New Chat", nullable=False)
    model = Column(Enum(AIModel), default=AIModel.gpt_4o, nullable=False)
    total_tokens = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
