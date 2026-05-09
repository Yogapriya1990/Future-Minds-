import enum

from sqlalchemy import Boolean, Column, Enum, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class TriggerType(str, enum.Enum):
    manual = "manual"
    scheduled = "scheduled"
    webhook = "webhook"


class Workflow(Base, TimestampMixin):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False, default="")
    trigger_type = Column(Enum(TriggerType), default=TriggerType.manual, nullable=False)
    steps = Column(JSON, nullable=False, default=list)
    is_active = Column(Boolean, default=True, nullable=False)
    schedule_cron = Column(String(100), nullable=True)

    user = relationship("User", back_populates="workflows")
    runs = relationship("WorkflowRun", back_populates="workflow", cascade="all, delete-orphan")
