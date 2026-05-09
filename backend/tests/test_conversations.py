import pytest
from fastapi.testclient import TestClient

from app.models.conversation import Conversation, AIModel
from app.models.message import Message, MessageRole


@pytest.fixture()
def conversation(db, student_user):
    conv = Conversation(
        user_id=student_user.id,
        title="Test Chat",
        model=AIModel.gpt_4o_mini,
        total_tokens=0,
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


class TestConversationList:
    def test_list_empty(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/conversations", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_list_returns_own_conversations(self, client: TestClient, auth_headers: dict, conversation: Conversation):
        resp = client.get("/api/conversations", headers=auth_headers)
        assert resp.status_code == 200
        ids = [c["id"] for c in resp.json()]
        assert conversation.id in ids

    def test_list_requires_auth(self, client: TestClient):
        resp = client.get("/api/conversations")
        assert resp.status_code == 401


class TestConversationCreate:
    def test_create_conversation(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/conversations", json={
            "title": "My Chat",
            "model": "gpt-4o-mini",
        }, headers=auth_headers)
        assert resp.status_code in (200, 201)
        data = resp.json()
        assert data["model"] == "gpt-4o-mini"

    def test_create_invalid_model(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/conversations", json={
            "title": "X",
            "model": "not-a-model",
        }, headers=auth_headers)
        assert resp.status_code in (422, 400)


class TestConversationGet:
    def test_get_own_conversation(self, client: TestClient, auth_headers: dict, conversation: Conversation):
        resp = client.get(f"/api/conversations/{conversation.id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == conversation.id

    def test_get_nonexistent(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/conversations/99999", headers=auth_headers)
        assert resp.status_code == 404

    def test_get_other_users_conversation_forbidden(self, client: TestClient, pro_headers: dict, conversation: Conversation):
        resp = client.get(f"/api/conversations/{conversation.id}", headers=pro_headers)
        assert resp.status_code in (403, 404)


class TestMessages:
    def test_list_messages(self, client: TestClient, auth_headers: dict, conversation: Conversation, db):
        msg = Message(
            conversation_id=conversation.id,
            role=MessageRole.user,
            content="Hello",
            tokens_used=5,
        )
        db.add(msg)
        db.commit()
        resp = client.get(f"/api/conversations/{conversation.id}/messages", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()) >= 1

    def test_delete_conversation(self, client: TestClient, auth_headers: dict, conversation: Conversation):
        resp = client.delete(f"/api/conversations/{conversation.id}", headers=auth_headers)
        assert resp.status_code in (200, 204)
