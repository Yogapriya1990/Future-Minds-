import pytest
from fastapi.testclient import TestClient

from app.models.user import User, UserRole
from app.models.course import Course, Difficulty
from app.models.tool import Tool, ToolModel


@pytest.fixture()
def course_for_admin(db, pro_user):
    c = Course(
        instructor_id=pro_user.id,
        title="Admin Test Course",
        description="For admin tests",
        category="Testing",
        difficulty=Difficulty.beginner,
        is_published=True,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


class TestAdminAuth:
    def test_non_admin_blocked(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/admin/users", headers=auth_headers)
        assert resp.status_code == 403

    def test_no_token_blocked(self, client: TestClient):
        resp = client.get("/api/admin/users")
        assert resp.status_code == 401


class TestAdminUsers:
    def test_list_users(self, client: TestClient, admin_headers: dict, student_user: User):
        resp = client.get("/api/admin/users", headers=admin_headers)
        assert resp.status_code == 200
        emails = [u["email"] for u in resp.json()]
        assert student_user.email in emails

    def test_change_user_role(self, client: TestClient, admin_headers: dict, student_user: User):
        resp = client.put(f"/api/admin/users/{student_user.id}/role", json={"role": "creator"}, headers=admin_headers)
        assert resp.status_code == 200

    def test_change_role_invalid_value(self, client: TestClient, admin_headers: dict, student_user: User):
        resp = client.put(f"/api/admin/users/{student_user.id}/role", json={"role": "superuser"}, headers=admin_headers)
        # Router returns 400 for invalid role string
        assert resp.status_code in (400, 422)

    def test_ban_user(self, client: TestClient, admin_headers: dict, student_user: User):
        resp = client.post(f"/api/admin/users/{student_user.id}/ban", headers=admin_headers)
        assert resp.status_code == 200
        assert resp.json()["is_active"] is False

    def test_ban_toggles_active(self, client: TestClient, admin_headers: dict, student_user: User, db):
        # Ban then unban (call ban twice to toggle back, or use the same endpoint)
        client.post(f"/api/admin/users/{student_user.id}/ban", headers=admin_headers)
        resp = client.post(f"/api/admin/users/{student_user.id}/ban", headers=admin_headers)
        assert resp.status_code == 200

    def test_ban_nonexistent_user(self, client: TestClient, admin_headers: dict):
        resp = client.post("/api/admin/users/99999/ban", headers=admin_headers)
        assert resp.status_code == 404


class TestAdminCourses:
    def test_list_all_courses(self, client: TestClient, admin_headers: dict, course_for_admin: Course):
        resp = client.get("/api/admin/courses", headers=admin_headers)
        assert resp.status_code == 200
        ids = [c["id"] for c in resp.json()]
        assert course_for_admin.id in ids

    def test_delete_course(self, client: TestClient, admin_headers: dict, course_for_admin: Course):
        resp = client.delete(f"/api/admin/courses/{course_for_admin.id}", headers=admin_headers)
        assert resp.status_code in (200, 204)

    def test_delete_nonexistent_course(self, client: TestClient, admin_headers: dict):
        resp = client.delete("/api/admin/courses/99999", headers=admin_headers)
        assert resp.status_code == 404


class TestAdminTools:
    def test_create_tool(self, client: TestClient, admin_headers: dict):
        resp = client.post("/api/admin/tools", json={
            "name": "Admin Tool",
            "slug": "admin-tool",
            "description": "Created by admin",
            "category": "Admin",
            "prompt_template": "You are a helpful assistant. {{input}}",
            "model": "gpt-4o",
            "is_premium": False,
        }, headers=admin_headers)
        assert resp.status_code in (200, 201)
        assert resp.json()["slug"] == "admin-tool"

    def test_create_tool_duplicate_slug(self, client: TestClient, admin_headers: dict):
        payload = {
            "name": "Tool A",
            "slug": "dup-slug",
            "description": "X",
            "category": "X",
            "prompt_template": "X {{input}}",
            "model": "gpt-4o",
        }
        client.post("/api/admin/tools", json=payload, headers=admin_headers)
        payload["name"] = "Tool B"
        resp = client.post("/api/admin/tools", json=payload, headers=admin_headers)
        assert resp.status_code == 409

    def test_delete_tool(self, client: TestClient, admin_headers: dict):
        create_resp = client.post("/api/admin/tools", json={
            "name": "To Delete",
            "slug": "to-delete-tool",
            "description": "X",
            "category": "X",
            "prompt_template": "X {{input}}",
            "model": "gpt-4o",
        }, headers=admin_headers)
        assert create_resp.status_code in (200, 201)
        tool_id = create_resp.json()["id"]
        resp = client.delete(f"/api/admin/tools/{tool_id}", headers=admin_headers)
        assert resp.status_code in (200, 204)
