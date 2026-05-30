from pydantic import BaseModel


class UserStatsResponse(BaseModel):
    tokens_used_total: int
    courses_enrolled: int
    courses_completed: int
    tools_run: int
    workflow_runs: int


class TopToolResponse(BaseModel):
    name: str
    slug: str
    usage_count: int


class PlatformStatsResponse(BaseModel):
    total_users: int
    dau: int
    total_courses: int
    total_enrollments: int
    total_tool_runs: int
    total_tokens_used: int
    active_subscriptions: int
    total_revenue: float
    top_tools: list[TopToolResponse]
    subscription_breakdown: dict[str, int]
