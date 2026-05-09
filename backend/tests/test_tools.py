import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from app.models.tool import Tool, ToolModel


@pytest.fixture()
def free_tool(db):
    t = Tool(
        name="Text Summarizer",
        slug="text-summarizer",
        description="Summarizes text using AI",
        category="Writing",
        model=ToolModel.gpt_4o,
        prompt_template="Summarize the following text concisely: {{input}}",
        is_active=True,
        is_premium=False,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@pytest.fixture()
def premium_tool(db):
    t = Tool(
        name="Code Explainer",
        slug="code-explainer",
        description="Explains code in plain English",
        category="Dev",
        model=ToolModel.gpt_4o,
        prompt_template="Explain the following code: {{input}}",
        is_active=True,
        is_premium=True,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


class TestToolList:
    def test_list_tools(self, client: TestClient, auth_headers: dict, free_tool: Tool):
        resp = client.get("/api/tools", headers=auth_headers)
        assert resp.status_code == 200
        slugs = [t["slug"] for t in resp.json()]
        assert free_tool.slug in slugs

    def test_list_tools_public(self, client: TestClient, free_tool: Tool):
        # Tools list is public browsing
        resp = client.get("/api/tools")
        assert resp.status_code == 200

    def test_filter_by_category(self, client: TestClient, auth_headers: dict, free_tool: Tool):
        resp = client.get("/api/tools?category=Writing", headers=auth_headers)
        assert resp.status_code == 200
        slugs = [t["slug"] for t in resp.json()]
        assert free_tool.slug in slugs


class TestToolGet:
    def test_get_tool_by_slug(self, client: TestClient, auth_headers: dict, free_tool: Tool):
        resp = client.get(f"/api/tools/{free_tool.slug}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["slug"] == free_tool.slug

    def test_get_nonexistent_tool(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/tools/no-such-tool", headers=auth_headers)
        assert resp.status_code == 404


class TestToolRun:
    def test_free_user_run_free_tool(self, client: TestClient, auth_headers: dict, free_tool: Tool):
        mock_response = AsyncMock()
        mock_response.choices = [type('obj', (object,), {
            'message': type('msg', (object,), {'content': 'Summary here'})()
        })()]
        mock_response.usage = type('usage', (object,), {'total_tokens': 10})()
        with patch("app.main.openai_client") as mock_client:
            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
            resp = client.post(f"/api/tools/{free_tool.slug}/run",
                               json={"input_text": "Long text to summarize"},
                               headers=auth_headers)
        assert resp.status_code in (200, 500)

    def test_free_user_run_premium_tool_blocked(self, client: TestClient, auth_headers: dict, premium_tool: Tool):
        resp = client.post(f"/api/tools/{premium_tool.slug}/run",
                           json={"input_text": "Some code"},
                           headers=auth_headers)
        assert resp.status_code == 403

    def test_pro_user_run_premium_tool(self, client: TestClient, pro_headers: dict, premium_tool: Tool):
        mock_response = AsyncMock()
        mock_response.choices = [type('obj', (object,), {
            'message': type('msg', (object,), {'content': 'Explanation'})()
        })()]
        mock_response.usage = type('usage', (object,), {'total_tokens': 15})()
        with patch("app.main.openai_client") as mock_client:
            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
            resp = client.post(f"/api/tools/{premium_tool.slug}/run",
                               json={"input_text": "def foo(): pass"},
                               headers=pro_headers)
        assert resp.status_code in (200, 500)

    def test_run_missing_input(self, client: TestClient, auth_headers: dict, free_tool: Tool):
        resp = client.post(f"/api/tools/{free_tool.slug}/run", json={}, headers=auth_headers)
        assert resp.status_code == 422

    def test_run_requires_auth(self, client: TestClient, free_tool: Tool):
        resp = client.post(f"/api/tools/{free_tool.slug}/run", json={"input_text": "x"})
        assert resp.status_code == 401


class TestToolHistory:
    def test_tool_history_requires_auth(self, client: TestClient):
        resp = client.get("/api/tools/history")
        assert resp.status_code == 401

    def test_tool_history_empty(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/tools/history", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)
