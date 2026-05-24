import json
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.conversation import Conversation, AIModel
from app.models.message import Message, MessageRole
from app.models.user import User
from app.schemas.conversation import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse

router = APIRouter(prefix="/conversations")
logger = logging.getLogger(__name__)


@router.get("", response_model=list[ConversationResponse])
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Conversation).filter(Conversation.user_id == current_user.id).order_by(Conversation.created_at.desc()).all()


@router.post("", response_model=ConversationResponse, status_code=201)
async def create_conversation(
    body: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = Conversation(
        user_id=current_user.id,
        title=body.title or "New Chat",
        model=body.model,
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id,
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


@router.delete("/{conversation_id}", status_code=204)
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id,
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conv)
    db.commit()


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
async def list_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id,
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()


@router.post("/{conversation_id}/messages")
async def send_message(
    conversation_id: int,
    body: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id,
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    user_msg = Message(
        conversation_id=conversation_id,
        role=MessageRole.user,
        content=body.content,
    )
    db.add(user_msg)
    db.commit()

    history = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    messages = [{"role": m.role.value, "content": m.content} for m in history]

    async def stream_response():
        from app.main import anthropic_client, openai_client
        full_content = ""
        tokens_used = 0

        try:
            if conv.model.value.startswith("gpt") and openai_client:
                stream = await openai_client.chat.completions.create(
                    model=conv.model.value,
                    messages=messages,
                    max_tokens=2048,
                    stream=True,
                    stream_options={"include_usage": True},
                )
                async for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        delta = chunk.choices[0].delta.content
                        full_content += delta
                        yield f"data: {json.dumps({'content': delta})}\n\n"
                    if chunk.usage:
                        tokens_used = chunk.usage.total_tokens
            elif conv.model.value.startswith("claude") and anthropic_client:
                model_map = {
                    "claude-sonnet": "claude-sonnet-4-6",
                    "claude-haiku": "claude-haiku-4-5-20251001",
                }
                model_id = model_map.get(conv.model.value, "claude-sonnet-4-6")
                async with anthropic_client.messages.stream(
                    model=model_id,
                    max_tokens=2048,
                    messages=messages,
                ) as stream:
                    async for text in stream.text_stream:
                        full_content += text
                        yield f"data: {json.dumps({'content': text})}\n\n"
                    final = await stream.get_final_message()
                    tokens_used = final.usage.input_tokens + final.usage.output_tokens
            else:
                full_content = "AI service not configured. Please add API keys."
                yield f"data: {json.dumps({'content': full_content})}\n\n"
        except Exception as e:
            logger.error("Streaming error: %s", e)
            full_content = f"Error: {str(e)}"
            yield f"data: {json.dumps({'content': full_content, 'error': True})}\n\n"

        assistant_msg = Message(
            conversation_id=conversation_id,
            role=MessageRole.assistant,
            content=full_content,
            tokens_used=tokens_used,
        )
        db.add(assistant_msg)
        conv.total_tokens = (conv.total_tokens or 0) + tokens_used
        if conv.title == "New Chat" and body.content:
            conv.title = body.content[:50]
        db.commit()
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")
