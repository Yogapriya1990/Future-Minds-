from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class Enrollment(Base, TimestampMixin):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    progress_percent = Column(Float, default=0.0, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_enrollment_user_course"),
    )

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    lesson_progress = relationship("LessonProgress", back_populates="enrollment", cascade="all, delete-orphan")
