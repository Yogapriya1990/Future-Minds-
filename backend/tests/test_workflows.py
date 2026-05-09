import pytest
from fastapi.testclient import TestClient

from app.models.workflow import Workflow, TriggerType
from app.models.workflow_run import WorkflowRun, RunStatus


@pytest.fixture()
def workflow(db, student_user):
    wf = Workflow(
        user_id=student_user.id,
        name="My Automation",
        description="Runs daily summarization",
        trigger_type=TriggerType.manual,
        steps=[{"action": "run_tool", "tool_slug": "text-summarizer", "input_template": "Summarize: {{input}}"}],
        is_active=True,
    )
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf


@pytest.fixture()
def workflow_run(db, workflow):
    run = WorkflowRun(
        workflow_id=workflow.id,
        status=RunStatus.completed,
        input_data={},
        output_data={"result": "done"},
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


class TestWorkflowList:
    def test_list_workflows(self, client: TestClient, auth_headers: dict, workflow: Workflow):
        resp = client.get("/api/workflows", headers=auth_headers)
        assert resp.status_code == 200
        ids = [w["id"] for w in resp.json()]
        assert workflow.id in ids

    def test_list_requires_auth(self, client: TestClient):
        resp = client.get("/api/workflows")
        assert resp.status_code == 401


class TestWorkflowCreate:
    def test_create_workflow(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/workflows", json={
            "name": "Email Digest",
            "description": "Daily email digest",
            "trigger_type": "manual",
            "steps": [{"action": "run_tool", "tool_slug": "text-summarizer", "input_template": "{{input}}"}],
        }, headers=auth_headers)
        assert resp.status_code in (200, 201)
        data = resp.json()
        assert data["name"] == "Email Digest"
        assert data["is_active"] is True

    def test_create_workflow_missing_name(self, client: TestClient, auth_headers: dict):
        resp = client.post("/api/workflows", json={
            "trigger_type": "manual",
            "steps": [],
        }, headers=auth_headers)
        assert resp.status_code == 422


class TestWorkflowUpdate:
    def test_update_workflow(self, client: TestClient, auth_headers: dict, workflow: Workflow):
        resp = client.put(f"/api/workflows/{workflow.id}", json={"name": "Renamed"}, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["name"] == "Renamed"

    def test_update_others_workflow(self, client: TestClient, pro_headers: dict, workflow: Workflow):
        resp = client.put(f"/api/workflows/{workflow.id}", json={"name": "Hack"}, headers=pro_headers)
        assert resp.status_code in (403, 404)


class TestWorkflowToggle:
    def test_toggle_active(self, client: TestClient, auth_headers: dict, workflow: Workflow):
        original = workflow.is_active
        resp = client.post(f"/api/workflows/{workflow.id}/toggle", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["is_active"] != original


class TestWorkflowDelete:
    def test_delete_workflow(self, client: TestClient, auth_headers: dict, workflow: Workflow):
        resp = client.delete(f"/api/workflows/{workflow.id}", headers=auth_headers)
        assert resp.status_code in (200, 204)
        # Verify it's removed from the list
        list_resp = client.get("/api/workflows", headers=auth_headers)
        ids = [w["id"] for w in list_resp.json()]
        assert workflow.id not in ids


class TestRunHistory:
    def test_get_run_history(self, client: TestClient, auth_headers: dict, workflow: Workflow, workflow_run: WorkflowRun):
        resp = client.get(f"/api/workflows/{workflow.id}/runs", headers=auth_headers)
        assert resp.status_code == 200
        ids = [r["id"] for r in resp.json()]
        assert workflow_run.id in ids

    def test_run_history_empty_for_new_workflow(self, client: TestClient, auth_headers: dict):
        create_resp = client.post("/api/workflows", json={
            "name": "Empty WF",
            "trigger_type": "manual",
            "steps": [],
        }, headers=auth_headers)
        wf_id = create_resp.json()["id"]
        resp = client.get(f"/api/workflows/{wf_id}/runs", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json() == []
