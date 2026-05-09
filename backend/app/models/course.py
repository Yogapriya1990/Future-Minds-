import enum

from sqlalchemy import Boolean, Column, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin, SoftDeleteMixin


class Difficulty(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Course(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    thumbnail_url = Column(String(500), nullable=True)
    difficulty = Column(Enum(Difficulty), default=Difficulty.beginner, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    total_lessons = Column(Integer, default=0, nullable=False)

    __table_args__ = (
        Index("ix_courses_category_published", "category", "is_published"),
    )

    instructor = relationship("User", back_populates="taught_courses")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan", order_by="Lesson.order_index")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
