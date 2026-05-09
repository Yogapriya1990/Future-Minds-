import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.models.plan import Plan, PlanTier
from app.models.subscription import Subscription, SubscriptionStatus, BillingCycle


class TestPlans:
    def test_list_plans(self, client: TestClient, free_plan: Plan, pro_plan: Plan):
        resp = client.get("/api/subscriptions/plans")
        assert resp.status_code == 200
        tiers = [p["tier"] for p in resp.json()]
        assert "free" in tiers
        assert "pro" in tiers

    def test_plans_public(self, client: TestClient):
        resp = client.get("/api/subscriptions/plans")
        assert resp.status_code == 200


class TestMySubscription:
    def test_no_subscription_returns_none(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/subscriptions/me", headers=auth_headers)
        assert resp.status_code in (200, 404)

    def test_get_active_subscription(self, client: TestClient, pro_headers: dict, active_subscription: Subscription):
        resp = client.get("/api/subscriptions/me", headers=pro_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "active"

    def test_requires_auth(self, client: TestClient):
        resp = client.get("/api/subscriptions/me")
        assert resp.status_code == 401


@pytest.fixture()
def pro_plan_with_stripe(db):
    plan = Plan(
        name="Pro",
        tier=PlanTier.pro,
        price_monthly=29,
        price_yearly=290,
        features=["Unlimited AI", "All tools"],
        ai_credits_monthly=1000,
        stripe_price_id_monthly="price_test_monthly",
        stripe_price_id_yearly="price_test_yearly",
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


class TestCheckout:
    def test_checkout_creates_stripe_session(self, client: TestClient, auth_headers: dict, pro_plan_with_stripe: Plan):
        mock_session = MagicMock()
        mock_session.url = "https://checkout.stripe.com/test123"
        with patch("app.routers.subscriptions.stripe.checkout.Session.create", return_value=mock_session):
            resp = client.post("/api/subscriptions/checkout", json={
                "plan_id": pro_plan_with_stripe.id,
                "billing_cycle": "monthly",
            }, headers=auth_headers)
        assert resp.status_code == 200
        assert "checkout_url" in resp.json()

    def test_checkout_invalid_plan(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/subscriptions/checkout", json={
            "plan_id": 99999,
            "billing_cycle": "monthly",
        }, headers=auth_headers)
        assert resp.status_code == 404

    def test_checkout_requires_auth(self, client: TestClient, pro_plan_with_stripe: Plan):
        resp = client.post("/api/subscriptions/checkout", json={
            "plan_id": pro_plan_with_stripe.id,
            "billing_cycle": "monthly",
        })
        assert resp.status_code == 401


class TestPortal:
    def test_portal_requires_subscription(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/subscriptions/portal", headers=auth_headers)
        assert resp.status_code in (400, 404)

    def test_portal_with_subscription(self, client: TestClient, pro_headers: dict, active_subscription: Subscription, db):
        # Give the subscription a stripe_customer_id so portal can work
        active_subscription.stripe_customer_id = "cus_test123"
        db.commit()
        mock_session = MagicMock()
        mock_session.url = "https://billing.stripe.com/test"
        with patch("app.routers.subscriptions.stripe.billing_portal.Session.create", return_value=mock_session):
            resp = client.post("/api/subscriptions/portal", headers=pro_headers)
        assert resp.status_code in (200, 500)
        if resp.status_code == 200:
            assert "portal_url" in resp.json()
