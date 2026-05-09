from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class ToolUsage(Base, TimestampMixin):
    __tablename__ = "tool_usages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tool_id = Column(Integer, ForeignKey("tools.id", ondelete="CASCADE"), nullable=False, index=True)
    input_text = Column(Text, nullable=False)
    output_text = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="tool_usages")
    tool = relationship("Tool", back_populates="usages")
