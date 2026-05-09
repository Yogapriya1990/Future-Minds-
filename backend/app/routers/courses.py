from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.lesson import Lesson
from app.models.lesson_progress import LessonProgress
from app.models.user import User, UserRole
from app.schemas.course import (
    CourseCreate, CourseResponse, CourseUpdate,
    EnrollmentResponse, LessonCreate, LessonResponse, ProgressResponse,
)

router = APIRouter(prefix="/courses")


@router.get("", response_model=list[CourseResponse])
async def list_courses(
    category: str | None = None,
    difficulty: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Course).filter(Course.is_published == True, Course.is_deleted == False)
    if category:
        query = query.filter(Course.category == category)
    if difficulty:
        query = query.filter(Course.difficulty == difficulty)
    return query.order_by(Course.created_at.desc()).all()


@router.post("", response_model=CourseResponse, status_code=201)
async def create_course(
    body: CourseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in (UserRole.creator, UserRole.admin):
        raise HTTPException(status_code=403, detail="Only creators can create courses")
    course = Course(instructor_id=current_user.id, **body.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).options(selectinload(Course.lessons)).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    body: CourseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


@router.post("/{course_id}/publish", response_model=CourseResponse)
async def publish_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    if course.total_lessons == 0:
        raise HTTPException(status_code=400, detail="Add at least one lesson before publishing")
    course.is_published = True
    db.commit()
    db.refresh(course)
    return course


@router.post("/{course_id}/enroll", response_model=EnrollmentResponse, status_code=201)
async def enroll(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id, Course.is_published == True).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not published")
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already enrolled")
    enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/{course_id}/progress", response_model=ProgressResponse)
async def get_progress(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Not enrolled")
    completed = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.completed == True,
    ).all()
    return ProgressResponse(enrollment=enrollment, completed_lessons=[p.lesson_id for p in completed])


@router.get("/{course_id}/lessons", response_model=list[LessonResponse])
async def list_lessons(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()


@router.post("/{course_id}/lessons", response_model=LessonResponse, status_code=201)
async def add_lesson(
    course_id: int,
    body: LessonCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.instructor_id != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    order = db.query(Lesson).filter(Lesson.course_id == course_id).count()
    lesson = Lesson(course_id=course_id, order_index=body.order_index or order + 1, **{
        k: v for k, v in body.model_dump().items() if k != "order_index"
    })
    db.add(lesson)
    course.total_lessons = order + 1
    db.commit()
    db.refresh(lesson)
    return lesson


@router.post("/lessons/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == lesson.course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    progress = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.lesson_id == lesson_id,
    ).first()
    if not progress:
        progress = LessonProgress(enrollment_id=enrollment.id, lesson_id=lesson_id)
        db.add(progress)
    if not progress.completed:
        progress.completed = True
        progress.completed_at = datetime.now(timezone.utc)
    db.flush()
    total = db.query(Lesson).filter(Lesson.course_id == lesson.course_id).count()
    done = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.completed == True,
    ).count()
    enrollment.progress_percent = (done / total * 100) if total > 0 else 0
    if enrollment.progress_percent >= 100:
        enrollment.completed_at = datetime.now(timezone.utc)
    db.commit()
    return {"progress_percent": enrollment.progress_percent}
