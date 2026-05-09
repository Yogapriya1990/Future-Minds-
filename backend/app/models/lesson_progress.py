from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database import Base


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    enrollment = relationship("Enrollment", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="progress_records")
