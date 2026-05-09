import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.jwt import hash_password, verify_password, create_access_token, decode_token
from app.models.user import User, UserRole, SubscriptionTier


class TestJWT:
    def test_hash_and_verify_password(self):
        pw = "supersecret"
        hashed = hash_password(pw)
        assert hashed != pw
        assert verify_password(pw, hashed)
        assert not verify_password("wrong", hashed)

    def test_create_and_decode_token(self):
        token = create_access_token({"sub": "42"})
        payload = decode_token(token)
        assert payload["sub"] == "42"

    def test_decode_invalid_token(self):
        payload = decode_token("not.a.valid.token")
        assert payload is None


class TestRegister:
    def test_register_success(self, client: TestClient):
        resp = client.post("/auth/register", json={
            "email": "newuser@test.com",
            "password": "password123",
            "full_name": "New User",
        })
        assert resp.status_code in (200, 201)
        data = resp.json()
        # Register returns UserResponse (user object), login separately for token
        assert data["email"] == "newuser@test.com"

    def test_register_duplicate_email(self, client: TestClient, student_user: User):
        resp = client.post("/auth/register", json={
            "email": student_user.email,
            "password": "password123",
        })
        assert resp.status_code == 409

    def test_register_invalid_payload(self, client: TestClient):
        resp = client.post("/auth/register", json={"email": "notanemail"})
        assert resp.status_code == 422


class TestLogin:
    def test_login_success(self, client: TestClient, student_user: User):
        resp = client.post("/auth/login", data={
            "username": student_user.email,
            "password": "password123",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["token_type"] == "bearer"
        assert "access_token" in data

    def test_login_wrong_password(self, client: TestClient, student_user: User):
        resp = client.post("/auth/login", data={
            "username": student_user.email,
            "password": "wrongpassword",
        })
        assert resp.status_code == 401

    def test_login_nonexistent_user(self, client: TestClient):
        resp = client.post("/auth/login", data={
            "username": "nobody@example.com",
            "password": "password",
        })
        assert resp.status_code == 401


class TestMe:
    def test_get_me(self, client: TestClient, auth_headers: dict, student_user: User):
        resp = client.get("/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == student_user.email
        assert data["role"] == "student"

    def test_get_me_no_token(self, client: TestClient):
        resp = client.get("/auth/me")
        assert resp.status_code == 401

    def test_update_profile(self, client: TestClient, auth_headers: dict):
        resp = client.put("/auth/me", json={"full_name": "Updated Name"}, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["full_name"] == "Updated Name"

    def test_update_profile_no_token(self, client: TestClient):
        resp = client.put("/auth/me", json={"full_name": "X"})
        assert resp.status_code == 401


class TestRefresh:
    def test_refresh_token(self, client: TestClient, student_user: User):
        from app.auth.jwt import create_refresh_token
        refresh = create_refresh_token({"sub": str(student_user.id)})
        resp = client.post("/auth/refresh", json={"refresh_token": refresh})
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_refresh_invalid_token(self, client: TestClient):
        resp = client.post("/auth/refresh", json={"refresh_token": "bad.token"})
        assert resp.status_code == 401
