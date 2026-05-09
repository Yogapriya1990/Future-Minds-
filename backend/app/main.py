import logging
import stripe
from contextlib import asynccontextmanager

from anthropic import AsyncAnthropic
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import AsyncOpenAI

from app.config import settings
from app.exceptions import AppException

logger = logging.getLogger(__name__)

openai_client: AsyncOpenAI | None = None
anthropic_client: AsyncAnthropic | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global openai_client, anthropic_client
    logger.info("Starting %s v%s", settings.APP_NAME, settings.VERSION)
    if settings.OPENAI_API_KEY:
        openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    if settings.ANTHROPIC_API_KEY:
        anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    if settings.STRIPE_SECRET_KEY:
        stripe.api_key = settings.STRIPE_SECRET_KEY
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"error": "VALIDATION_ERROR", "message": "Invalid request data", "detail": exc.errors()},
    )


@app.get("/health", tags=["system"])
async def health() -> dict:
    return {"status": "healthy", "version": settings.VERSION}


# Register routers — each wrapped so missing Phase 2 modules don't crash startup
try:
    from app.routers.auth import router as auth_router
    app.include_router(auth_router, tags=["auth"])
except ImportError:
    logger.debug("Auth router not yet available")

try:
    from app.routers.conversations import router as conversations_router
    app.include_router(conversations_router, prefix="/api", tags=["chat"])
except ImportError:
    logger.debug("Conversations router not yet available")

try:
    from app.routers.courses import router as courses_router
    app.include_router(courses_router, prefix="/api", tags=["courses"])
except ImportError:
    logger.debug("Courses router not yet available")

try:
    from app.routers.tools import router as tools_router
    app.include_router(tools_router, prefix="/api", tags=["tools"])
except ImportError:
    logger.debug("Tools router not yet available")

try:
    from app.routers.workflows import router as workflows_router
    app.include_router(workflows_router, prefix="/api", tags=["workflows"])
except ImportError:
    logger.debug("Workflows router not yet available")

try:
    from app.routers.subscriptions import router as subscriptions_router
    app.include_router(subscriptions_router, prefix="/api", tags=["subscriptions"])
except ImportError:
    logger.debug("Subscriptions router not yet available")

try:
    from app.routers.admin import router as admin_router
    app.include_router(admin_router, prefix="/api", tags=["admin"])
except ImportError:
    logger.debug("Admin router not yet available")

try:
    from app.routers.analytics import router as analytics_router
    app.include_router(analytics_router, prefix="/api", tags=["analytics"])
except ImportError:
    logger.debug("Analytics router not yet available")

try:
    from app.routers.webhooks import router as webhooks_router
    app.include_router(webhooks_router, tags=["webhooks"])
except ImportError:
    logger.debug("Webhooks router not yet available")
