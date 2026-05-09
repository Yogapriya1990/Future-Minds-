from datetime import datetime
from pydantic import BaseModel


class PlanResponse(BaseModel):
    id: int
    name: str
    tier: str
    price_monthly: float
    price_yearly: float
    features: list[str]
    ai_credits_monthly: int

    model_config = {"from_attributes": True}


class CheckoutRequest(BaseModel):
    plan_id: int
    billing_cycle: str = "monthly"


class CheckoutResponse(BaseModel):
    checkout_url: str


class PortalResponse(BaseModel):
    portal_url: str


class SubscriptionResponse(BaseModel):
    id: int
    plan_id: int
    status: str
    billing_cycle: str
    current_period_end: datetime | None
    canceled_at: datetime | None

    model_config = {"from_attributes": True}
