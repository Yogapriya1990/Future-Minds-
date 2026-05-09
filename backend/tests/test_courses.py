import pytest
from fastapi.testclient import TestClient

from app.models.course import Course, Difficulty  # noqa
from app.models.lesson import Lesson
from app.models.enrollment import Enrollment


@pytest.fixture()
def course(db, pro_user):
    c = Course(
        instructor_id=pro_user.id,
        title="Python Basics",
        description="Learn Python",
        category="Programming",
        difficulty=Difficulty.beginner,
        is_published=False,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@pytest.fixture()
def published_course(db, pro_user):
    c = Course(
        instructor_id=pro_user.id,
        title="Advanced Python",
        description="Deep dive",
        category="Programming",
        difficulty=Difficulty.advanced,
        is_published=True,
        total_lessons=1,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    lesson = Lesson(course_id=c.id, title="Lesson 1", content="Content", order_index=1, duration_minutes=10)
    db.add(lesson)
    db.commit()
    return c


@pytest.fixture()
def lesson(db, course):
    l = Lesson(
        course_id=course.id,
        title="Intro to Python",
        content="First lesson content",
        order_index=1,
        duration_minutes=15,
    )
    db.add(l)
    course.total_lessons = 1
    db.commit()
    db.refresh(l)
    return l


class TestCourseCatalog:
    def test_list_published_courses(self, client: TestClient, auth_headers: dict, published_course: Course):
        resp = client.get("/api/courses", headers=auth_headers)
        assert resp.status_code == 200
        ids = [c["id"] for c in resp.json()]
        assert published_course.id in ids

    def test_draft_course_not_in_catalog(self, client: TestClient, auth_headers: dict, course: Course):
        resp = client.get("/api/courses", headers=auth_headers)
        assert resp.status_code == 200
        ids = [c["id"] for c in resp.json()]
        assert course.id not in ids

    def test_filter_by_category(self, client: TestClient, auth_headers: dict, published_course: Course):
        resp = client.get("/api/courses?category=Programming", headers=auth_headers)
        assert resp.status_code == 200

    def test_list_is_public(self, client: TestClient, published_course: Course):
        # course catalog is publicly browsable
        resp = client.get("/api/courses")
        assert resp.status_code == 200


class TestCourseCreate:
    def test_create_course(self, client: TestClient, pro_headers: dict):
        resp = client.post("/api/courses", json={
            "title": "New Course",
            "description": "Learn stuff",
            "category": "Design",
            "difficulty": "beginner",
        }, headers=pro_headers)
        assert resp.status_code in (200, 201)
        assert resp.json()["title"] == "New Course"
        assert resp.json()["is_published"] is False

    def test_create_course_missing_fields(self, client: TestClient, pro_headers: dict):
        resp = client.post("/api/courses", json={"title": "No desc"}, headers=pro_headers)
        assert resp.status_code == 422

    def test_student_cannot_create_course(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/courses", json={
            "title": "X", "description": "Y", "category": "Z", "difficulty": "beginner",
        }, headers=auth_headers)
        assert resp.status_code == 403


class TestCourseDetail:
    def test_get_course(self, client: TestClient, auth_headers: dict, published_course: Course):
        resp = client.get(f"/api/courses/{published_course.id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == published_course.id

    def test_get_nonexistent_course(self, client: TestClient, auth_headers: dict):
        resp = client.get("/api/courses/99999", headers=auth_headers)
        assert resp.status_code == 404


class TestCourseUpdate:
    def test_update_own_course(self, client: TestClient, pro_headers: dict, course: Course):
        resp = client.put(f"/api/courses/{course.id}", json={"title": "Updated Title"}, headers=pro_headers)
        assert resp.status_code == 200
        assert resp.json()["title"] == "Updated Title"

    def test_update_others_course_forbidden(self, client: TestClient, auth_headers: dict, course: Course):
        resp = client.put(f"/api/courses/{course.id}", json={"title": "Hack"}, headers=auth_headers)
        assert resp.status_code in (403, 404)


class TestPublish:
    def test_publish_course_without_lessons_fails(self, client: TestClient, pro_headers: dict, course: Course):
        resp = client.post(f"/api/courses/{course.id}/publish", headers=pro_headers)
        assert resp.status_code == 400

    def test_publish_course_with_lesson(self, client: TestClient, pro_headers: dict, course: Course, lesson: Lesson):
        resp = client.post(f"/api/courses/{course.id}/publish", headers=pro_headers)
        assert resp.status_code == 200
        assert resp.json()["is_published"] is True


class TestEnrollment:
    def test_enroll_in_course(self, client: TestClient, auth_headers: dict, published_course: Course):
        resp = client.post(f"/api/courses/{published_course.id}/enroll", headers=auth_headers)
        assert resp.status_code in (200, 201)

    def test_enroll_twice_fails(self, client: TestClient, auth_headers: dict, published_course: Course, db, student_user):
        db.add(Enrollment(user_id=student_user.id, course_id=published_course.id, progress_percent=0.0))
        db.commit()
        resp = client.post(f"/api/courses/{published_course.id}/enroll", headers=auth_headers)
        assert resp.status_code == 409


class TestLessons:
    def test_add_lesson(self, client: TestClient, pro_headers: dict, course: Course):
        resp = client.post(f"/api/courses/{course.id}/lessons", json={
            "title": "Lesson One",
            "content": "Some content",
            "duration_minutes": 20,
        }, headers=pro_headers)
        assert resp.status_code in (200, 201)
        assert resp.json()["title"] == "Lesson One"

    def test_list_lessons(self, client: TestClient, auth_headers: dict, published_course: Course):
        resp = client.get(f"/api/courses/{published_course.id}/lessons", headers=auth_headers)
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)
