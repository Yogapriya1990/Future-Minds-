from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_role
from app.models.course import Course
from app.models.tool import Tool
from app.models.user import User, UserRole
from app.schemas.auth import UserResponse
from app.schemas.course import CourseResponse
from app.schemas.tool import ToolCreate, ToolResponse, ToolUpdate

router = APIRouter(prefix="/admin")
_require_admin = require_role(UserRole.admin)


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    page: int = 1,
    per_page: int = 20,
    search: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    query = db.query(User)
    if search:
        query = query.filter(User.email.ilike(f"%{search}%"))
    offset = (page - 1) * per_page
    return query.offset(offset).limit(per_page).all()


@router.put("/users/{user_id}/role", response_model=UserResponse)
async def change_role(
    user_id: int,
    body: dict,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    role_str = body.get("role", "")
    try:
        user.role = UserRole(role_str)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid role: {role_str}")
    db.commit()
    db.refresh(user)
    return user


@router.post("/users/{user_id}/ban", response_model=UserResponse)
async def ban_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


@router.post("/users/{user_id}/unban", response_model=UserResponse)
async def unban_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()
    db.refresh(user)
    return user


@router.get("/courses", response_model=list[CourseResponse])
async def admin_list_courses(
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    return db.query(Course).filter(Course.is_deleted == False).order_by(Course.created_at.desc()).all()


@router.post("/courses/{course_id}/feature", response_model=CourseResponse)
async def feature_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.delete("/courses/{course_id}", status_code=204)
async def admin_delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    course.is_deleted = True
    db.commit()


@router.get("/tools", response_model=list[ToolResponse])
async def admin_list_tools(
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    return db.query(Tool).order_by(Tool.name).all()


@router.post("/tools", response_model=ToolResponse, status_code=201)
async def admin_create_tool(
    body: ToolCreate,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    if db.query(Tool).filter(Tool.slug == body.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    tool = Tool(**body.model_dump())
    db.add(tool)
    db.commit()
    db.refresh(tool)
    return tool


@router.put("/tools/{tool_id}", response_model=ToolResponse)
async def admin_update_tool(
    tool_id: int,
    body: ToolUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(tool, field, value)
    db.commit()
    db.refresh(tool)
    return tool


@router.delete("/tools/{tool_id}", status_code=204)
async def admin_delete_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(_require_admin),
):
    tool = db.query(Tool).filter(Tool.id == tool_id).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    tool.is_deleted = True
    db.commit()
