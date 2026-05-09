import enum

from sqlalchemy import Boolean, Column, Enum, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin, SoftDeleteMixin


class ToolModel(str, enum.Enum):
    gpt_4o = "gpt-4o"
    claude_sonnet = "claude-sonnet"


class Tool(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    icon_url = Column(String(500), nullable=True)
    prompt_template = Column(Text, nullable=False)
    model = Column(Enum(ToolModel), default=ToolModel.gpt_4o, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_premium = Column(Boolean, default=False, nullable=False)

    usages = relationship("ToolUsage", back_populates="tool", cascade="all, delete-orphan")
