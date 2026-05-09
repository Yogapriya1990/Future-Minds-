from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class Lesson(Base, TimestampMixin):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    video_url = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False, default=0)
    duration_minutes = Column(Integer, default=0, nullable=False)

    course = relationship("Course", back_populates="lessons")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
