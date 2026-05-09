import pytest
from fastapi.testclient import TestClient


class TestUserStats:
    def test_get_my_stats(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/analytics/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        # Fields from UserStatsResponse schema
        assert "tokens_used_total" in data
        assert "courses_enrolled" in data
        assert "tools_run" in data

    def test_stats_are_numeric(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/analytics/me", headers=auth_headers)
        data = resp.json()
        for key, val in data.items():
            assert isinstance(val, (int, float)), f"{key} should be numeric, got {type(val)}"

    def test_stats_requires_auth(self, client: TestClient):
        resp = client.get("/api/analytics/me")
        assert resp.status_code == 401


class TestPlatformStats:
    def test_platform_stats_admin_only(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/analytics/platform", headers=auth_headers)
        assert resp.status_code == 403

    def test_platform_stats_as_admin(self, client: TestClient, admin_headers: dict):
        resp = client.get("/api/analytics/platform", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        # Fields from PlatformStatsResponse schema
        assert "total_users" in data
        assert "top_tools" in data

    def test_platform_stats_requires_auth(self, client: TestClient):
        resp = client.get("/api/analytics/platform")
        assert resp.status_code == 401


class TestEventTracking:
    def test_track_event(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/analytics/event", json={
            "event_type": "page_view",
            "metadata": {"page": "/dashboard"},
        }, headers=auth_headers)
        assert resp.status_code in (200, 201)

    def test_track_event_without_auth(self, client: TestClient):
        resp = client.post("/api/analytics/event", json={
            "event_type": "anonymous_visit",
            "metadata": {},
        })
        assert resp.status_code in (200, 201, 401)

    def test_track_event_missing_type(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/analytics/event", json={"metadata": {}}, headers=auth_headers)
        # May return 422 (validation) or 400 depending on implementation
        assert resp.status_code in (400, 422)
