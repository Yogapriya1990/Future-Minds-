import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class RunStatus(str, enum.Enum):
    running = "running"
    completed = "completed"
    failed = "failed"


class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(RunStatus), default=RunStatus.running, nullable=False)
    input_data = Column(JSON, nullable=False, default=dict)
    output_data = Column(JSON, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String(1000), nullable=True)

    workflow = relationship("Workflow", back_populates="runs")
