import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models import *  # noqa: F401,F403 — ensures all models are registered
from app.auth.jwt import hash_password, create_access_token
from app.models.user import User, UserRole, SubscriptionTier
from app.models.plan import Plan, PlanTier
from app.models.subscription import Subscription, SubscriptionStatus, BillingCycle

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def create_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def student_user(db):
    user = User(
        email="student@test.com",
        hashed_password=hash_password("password123"),
        full_name="Test Student",
        role=UserRole.student,
        subscription_tier=SubscriptionTier.free,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture()
def admin_user(db):
    user = User(
        email="admin@test.com",
        hashed_password=hash_password("adminpass"),
        full_name="Admin User",
        role=UserRole.admin,
        subscription_tier=SubscriptionTier.enterprise,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture()
def pro_user(db):
    user = User(
        email="pro@test.com",
        hashed_password=hash_password("propass"),
        full_name="Pro User",
        role=UserRole.creator,
        subscription_tier=SubscriptionTier.pro,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture()
def student_token(student_user):
    return create_access_token({"sub": str(student_user.id)})


@pytest.fixture()
def admin_token(admin_user):
    return create_access_token({"sub": str(admin_user.id)})


@pytest.fixture()
def pro_token(pro_user):
    return create_access_token({"sub": str(pro_user.id)})


@pytest.fixture()
def auth_headers(student_token):
    return {"Authorization": f"Bearer {student_token}"}


@pytest.fixture()
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture()
def pro_headers(pro_token):
    return {"Authorization": f"Bearer {pro_token}"}


@pytest.fixture()
def free_plan(db):
    plan = Plan(
        name="Free",
        tier=PlanTier.free,
        price_monthly=0,
        price_yearly=0,
        features=["5 AI credits/month", "3 tools"],
        ai_credits_monthly=5,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@pytest.fixture()
def pro_plan(db):
    plan = Plan(
        name="Pro",
        tier=PlanTier.pro,
        price_monthly=29,
        price_yearly=290,
        features=["Unlimited AI", "All tools", "Priority support"],
        ai_credits_monthly=1000,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@pytest.fixture()
def active_subscription(db, pro_user, pro_plan):
    sub = Subscription(
        user_id=pro_user.id,
        plan_id=pro_plan.id,
        status=SubscriptionStatus.active,
        billing_cycle=BillingCycle.monthly,
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub
