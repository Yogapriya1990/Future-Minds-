import enum

from sqlalchemy import Column, Enum, Float, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class PlanTier(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


class Plan(Base, TimestampMixin):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    tier = Column(Enum(PlanTier), unique=True, nullable=False)
    price_monthly = Column(Float, default=0.0, nullable=False)
    price_yearly = Column(Float, default=0.0, nullable=False)
    features = Column(JSON, nullable=False, default=list)
    stripe_price_id_monthly = Column(String(255), nullable=True)
    stripe_price_id_yearly = Column(String(255), nullable=True)
    ai_credits_monthly = Column(Integer, default=0, nullable=False)

    subscriptions = relationship("Subscription", back_populates="plan")
