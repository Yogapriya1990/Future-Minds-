from datetime import datetime
from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str = "beginner"
    thumbnail_url: str | None = None


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    difficulty: str | None = None
    thumbnail_url: str | None = None


class CourseResponse(BaseModel):
    id: int
    instructor_id: int
    title: str
    description: str
    category: str
    thumbnail_url: str | None
    difficulty: str
    is_published: bool
    total_lessons: int
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class LessonCreate(BaseModel):
    title: str
    content: str
    video_url: str | None = None
    order_index: int = 0
    duration_minutes: int = 0


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    content: str
    video_url: str | None
    order_index: int
    duration_minutes: int

    model_config = {"from_attributes": True}


class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    progress_percent: float
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class ProgressResponse(BaseModel):
    enrollment: EnrollmentResponse
    completed_lessons: list[int]
