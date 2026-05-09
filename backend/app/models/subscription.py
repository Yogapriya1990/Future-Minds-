import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    canceled = "canceled"
    past_due = "past_due"


class BillingCycle(str, enum.Enum):
    monthly = "monthly"
    yearly = "yearly"


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.active, nullable=False)
    billing_cycle = Column(Enum(BillingCycle), default=BillingCycle.monthly, nullable=False)
    stripe_subscription_id = Column(String(255), nullable=True)
    stripe_customer_id = Column(String(255), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    canceled_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")
