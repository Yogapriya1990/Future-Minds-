import enum

from sqlalchemy import Column, Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=0, nullable=False)

    conversation = relationship("Conversation", back_populates="messages")
