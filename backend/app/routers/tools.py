import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.tool import Tool
from app.models.tool_usage import ToolUsage
from app.models.user import User, SubscriptionTier
from app.schemas.tool import ToolResponse, ToolRunRequest, ToolRunResponse, ToolUsageResponse

router = APIRouter(prefix="/tools")
logger = logging.getLogger(__name__)


@router.get("", response_model=list[ToolResponse])
async def list_tools(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Tool).filter(Tool.is_active == True, Tool.is_deleted == False)
    if category:
        query = query.filter(Tool.category == category)
    return query.order_by(Tool.name).all()


@router.get("/history", response_model=list[ToolUsageResponse])
async def tool_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(ToolUsage)
        .filter(ToolUsage.user_id == current_user.id)
        .order_by(ToolUsage.created_at.desc())
        .limit(50)
        .all()
    )


@router.get("/{slug}", response_model=ToolResponse)
async def get_tool(slug: str, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug, Tool.is_active == True).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool


@router.post("/{slug}/run", response_model=ToolRunResponse)
async def run_tool(
    slug: str,
    body: ToolRunRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tool = db.query(Tool).filter(Tool.slug == slug, Tool.is_active == True).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    if tool.is_premium and current_user.subscription_tier == SubscriptionTier.free:
        raise HTTPException(status_code=403, detail="Pro subscription required to use premium tools. Upgrade at /pricing")

    prompt = tool.prompt_template.replace("{input}", body.input_text)
    output = ""
    tokens_used = 0

    try:
        from app.main import anthropic_client, openai_client
        if tool.model.value == "gpt-4o" and openai_client:
            resp = await openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1024,
            )
            output = resp.choices[0].message.content or ""
            tokens_used = resp.usage.total_tokens if resp.usage else 0
        elif tool.model.value == "claude-sonnet" and anthropic_client:
            resp = await anthropic_client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            output = resp.content[0].text if resp.content else ""
            tokens_used = resp.usage.input_tokens + resp.usage.output_tokens
        else:
            output = f"[AI service not configured] Prompt: {prompt[:200]}..."
    except Exception as e:
        logger.error("Tool run error: %s", e)
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    usage = ToolUsage(
        user_id=current_user.id,
        tool_id=tool.id,
        input_text=body.input_text,
        output_text=output,
        tokens_used=tokens_used,
    )
    db.add(usage)
    db.commit()

    return ToolRunResponse(output_text=output, tokens_used=tokens_used, tool_slug=slug)
