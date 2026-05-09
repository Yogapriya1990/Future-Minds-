import enum

from sqlalchemy import Boolean, Column, Enum, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin, SoftDeleteMixin


class UserRole(str, enum.Enum):
    student = "student"
    creator = "creator"
    admin = "admin"


class SubscriptionTier(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(100), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.free, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    google_id = Column(String(255), unique=True, nullable=True, index=True)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    tool_usages = relationship("ToolUsage", back_populates="user", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
    taught_courses = relationship("Course", back_populates="instructor", cascade="all, delete-orphan")
