"""Run with: python -m app.seed"""
import logging

from app.auth.jwt import hash_password
from app.database import SessionLocal
from app.models.plan import Plan, PlanTier
from app.models.tool import Tool, ToolModel
from app.models.user import User, UserRole, SubscriptionTier

logger = logging.getLogger(__name__)


def seed_plans(db) -> None:
    if db.query(Plan).count() > 0:
        return
    plans = [
        Plan(
            name="Free",
            tier=PlanTier.free,
            price_monthly=0.0,
            price_yearly=0.0,
            features=["5 AI tool runs/day", "3 course enrollments", "Community support"],
            ai_credits_monthly=10000,
        ),
        Plan(
            name="Pro",
            tier=PlanTier.pro,
            price_monthly=19.99,
            price_yearly=199.00,
            features=[
                "Unlimited AI tool runs",
                "Unlimited course enrollments",
                "AI Chat with GPT-4o & Claude",
                "Workflow automation",
                "Priority support",
            ],
            ai_credits_monthly=100000,
        ),
        Plan(
            name="Enterprise",
            tier=PlanTier.enterprise,
            price_monthly=99.00,
            price_yearly=990.00,
            features=[
                "Everything in Pro",
                "Unlimited AI credits",
                "Custom integrations",
                "Dedicated support",
                "Team management",
                "SLA guarantee",
            ],
            ai_credits_monthly=-1,
        ),
    ]
    db.add_all(plans)
    logger.info("Seeded %d plans", len(plans))


def seed_tools(db) -> None:
    if db.query(Tool).count() > 0:
        return
    tools = [
        Tool(
            name="Text Summarizer",
            slug="text-summarizer",
            description="Condense long articles, documents, or text into clear, concise summaries.",
            category="Writing",
            prompt_template="Summarize the following text in 3-5 concise bullet points, capturing the key ideas:\n\n{input}",
            model=ToolModel.gpt_4o,
            is_active=True,
            is_premium=False,
        ),
        Tool(
            name="Code Explainer",
            slug="code-explainer",
            description="Paste any code snippet and get a plain-English explanation of what it does.",
            category="Development",
            prompt_template="Explain the following code in plain English. Describe what it does, how it works, and any important patterns or concepts used:\n\n```\n{input}\n```",
            model=ToolModel.gpt_4o,
            is_active=True,
            is_premium=False,
        ),
        Tool(
            name="Image Prompt Generator",
            slug="image-prompt-generator",
            description="Generate detailed, creative prompts for AI image generation tools like Midjourney or DALL-E.",
            category="Creative",
            prompt_template="Create 3 detailed, creative image generation prompts based on this concept. Include style, lighting, mood, and technical details:\n\n{input}",
            model=ToolModel.claude_sonnet,
            is_active=True,
            is_premium=False,
        ),
        Tool(
            name="Email Drafter",
            slug="email-drafter",
            description="Write professional, personalized emails for any situation in seconds.",
            category="Business",
            prompt_template="Write a professional email based on this request. Include subject line, greeting, body, and sign-off. Tone should be professional yet friendly:\n\n{input}",
            model=ToolModel.gpt_4o,
            is_active=True,
            is_premium=False,
        ),
        Tool(
            name="Blog Outline Generator",
            slug="blog-outline-generator",
            description="Create structured, SEO-friendly blog outlines with sections, subheadings, and key points.",
            category="Writing",
            prompt_template="Create a detailed blog post outline for the following topic. Include an engaging title, introduction hook, 5-7 main sections with subpoints, and conclusion:\n\n{input}",
            model=ToolModel.claude_sonnet,
            is_active=True,
            is_premium=True,
        ),
    ]
    db.add_all(tools)
    logger.info("Seeded %d tools", len(tools))


def seed_admin(db) -> None:
    if db.query(User).filter(User.email == "admin@futureminds.ai").first():
        return
    admin = User(
        email="admin@futureminds.ai",
        hashed_password=hash_password("Admin1234!"),
        full_name="Platform Admin",
        role=UserRole.admin,
        subscription_tier=SubscriptionTier.enterprise,
        is_active=True,
    )
    db.add(admin)
    logger.info("Seeded admin user")


def run() -> None:
    logging.basicConfig(level=logging.INFO)
    db = SessionLocal()
    try:
        seed_plans(db)
        seed_tools(db)
        seed_admin(db)
        db.commit()
        logger.info("Seed complete")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
