from pydantic import BaseModel


class UserStatsResponse(BaseModel):
    tokens_used_total: int
    courses_enrolled: int
    courses_completed: int
    tools_run: int
    workflow_runs: int


class PlatformStatsResponse(BaseModel):
    total_users: int
    active_users_today: int
    total_revenue: float
    top_tools: list[dict]
    new_enrollments_today: int
