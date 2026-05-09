import logging

import stripe
from fastapi import APIRouter, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi import Depends

from app.config import settings
from app.database import get_db
from app.models.plan import Plan, PlanTier
from app.models.subscription import Subscription, SubscriptionStatus, BillingCycle
from app.models.user import User, SubscriptionTier

router = APIRouter(prefix="/webhooks")
logger = logging.getLogger(__name__)

TIER_MAP = {
    "free": SubscriptionTier.free,
    "pro": SubscriptionTier.pro,
    "enterprise": SubscriptionTier.enterprise,
}


@router.post("/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        _handle_checkout_complete(db, data)
    elif event_type in ("customer.subscription.updated", "customer.subscription.created"):
        _handle_subscription_updated(db, data)
    elif event_type == "customer.subscription.deleted":
        _handle_subscription_canceled(db, data)
    elif event_type == "invoice.payment_failed":
        _handle_payment_failed(db, data)

    return {"received": True}


def _handle_checkout_complete(db: Session, session: dict) -> None:
    user_id = int(session.get("metadata", {}).get("user_id", 0))
    plan_id = int(session.get("metadata", {}).get("plan_id", 0))
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")

    user = db.query(User).filter(User.id == user_id).first()
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not user or not plan:
        return

    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if sub:
        sub.plan_id = plan_id
        sub.stripe_customer_id = customer_id
        sub.stripe_subscription_id = subscription_id
        sub.status = SubscriptionStatus.active
    else:
        sub = Subscription(
            user_id=user_id,
            plan_id=plan_id,
            stripe_customer_id=customer_id,
            stripe_subscription_id=subscription_id,
            status=SubscriptionStatus.active,
        )
        db.add(sub)

    user.subscription_tier = TIER_MAP.get(plan.tier.value, SubscriptionTier.free)
    db.commit()
    logger.info("Subscription created for user %d plan %d", user_id, plan_id)


def _handle_subscription_updated(db: Session, stripe_sub: dict) -> None:
    sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == stripe_sub["id"]).first()
    if not sub:
        return
    status_map = {"active": SubscriptionStatus.active, "canceled": SubscriptionStatus.canceled, "past_due": SubscriptionStatus.past_due}
    sub.status = status_map.get(stripe_sub.get("status", "active"), SubscriptionStatus.active)
    db.commit()


def _handle_subscription_canceled(db: Session, stripe_sub: dict) -> None:
    sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == stripe_sub["id"]).first()
    if not sub:
        return
    sub.status = SubscriptionStatus.canceled
    user = db.query(User).filter(User.id == sub.user_id).first()
    if user:
        user.subscription_tier = SubscriptionTier.free
    db.commit()
    logger.info("Subscription canceled for user %d", sub.user_id)


def _handle_payment_failed(db: Session, invoice: dict) -> None:
    sub = db.query(Subscription).filter(Subscription.stripe_customer_id == invoice.get("customer")).first()
    if sub:
        sub.status = SubscriptionStatus.past_due
        db.commit()
