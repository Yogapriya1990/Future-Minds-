import logging

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.plan import Plan
from app.models.subscription import Subscription
from app.models.user import User, SubscriptionTier
from app.schemas.subscription import (
    CheckoutRequest, CheckoutResponse, PlanResponse,
    PortalResponse, SubscriptionResponse,
)

router = APIRouter(prefix="/subscriptions")
logger = logging.getLogger(__name__)


@router.get("/plans", response_model=list[PlanResponse])
async def list_plans(db: Session = Depends(get_db)):
    return db.query(Plan).order_by(Plan.price_monthly).all()


@router.get("/me", response_model=SubscriptionResponse | None)
async def my_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Subscription).filter(Subscription.user_id == current_user.id).first()


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = db.query(Plan).filter(Plan.id == body.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    price_id = plan.stripe_price_id_monthly if body.billing_cycle == "monthly" else plan.stripe_price_id_yearly
    if not price_id:
        raise HTTPException(status_code=400, detail="Stripe price not configured for this plan")

    try:
        session = stripe.checkout.Session.create(
            mode="subscription",
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=f"{settings.FRONTEND_URL}/billing?success=1",
            cancel_url=f"{settings.FRONTEND_URL}/pricing?canceled=1",
            customer_email=current_user.email,
            metadata={"user_id": str(current_user.id), "plan_id": str(plan.id)},
        )
        return CheckoutResponse(checkout_url=session.url)
    except stripe.StripeError as e:
        logger.error("Stripe checkout error: %s", e)
        raise HTTPException(status_code=500, detail="Payment service error")


@router.post("/portal", response_model=PortalResponse)
async def customer_portal(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if not sub or not sub.stripe_customer_id:
        raise HTTPException(status_code=404, detail="No active subscription found")
    try:
        session = stripe.billing_portal.Session.create(
            customer=sub.stripe_customer_id,
            return_url=f"{settings.FRONTEND_URL}/billing",
        )
        return PortalResponse(portal_url=session.url)
    except stripe.StripeError as e:
        logger.error("Stripe portal error: %s", e)
        raise HTTPException(status_code=500, detail="Payment service error")
