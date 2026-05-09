export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: 'student' | 'creator' | 'admin';
  avatar_url: string | null;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  is_active: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  model: 'gpt-4o' | 'gpt-4o-mini' | 'claude-sonnet' | 'claude-haiku';
  total_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number;
  created_at: string;
}

export interface Course {
  id: number;
  instructor_id: number;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  total_lessons: number;
  enrollment_count?: number;
  price?: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  video_url: string | null;
  order_index: number;
  duration_minutes: number;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress_percent: number;
  completed_at: string | null;
  created_at: string;
}

export interface LessonProgress {
  id: number;
  enrollment_id: number;
  lesson_id: number;
  completed: boolean;
  completed_at: string | null;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon_url: string | null;
  model: 'gpt-4o' | 'claude-sonnet';
  is_active: boolean;
  is_premium: boolean;
}

export interface ToolUsage {
  id: number;
  tool_id: number;
  input_text: string;
  output_text: string;
  tokens_used: number;
  created_at: string;
}

export interface WorkflowStep {
  action: string;
  tool_slug: string;
  input_template: string;
}

export interface Workflow {
  id: number;
  user_id: number;
  name: string;
  description: string;
  trigger_type: 'manual' | 'scheduled' | 'webhook';
  steps: WorkflowStep[];
  is_active: boolean;
  schedule_cron: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRun {
  id: number;
  workflow_id: number;
  status: 'running' | 'completed' | 'failed';
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown> | null;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface Plan {
  id: number;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  price_monthly: number;
  price_yearly: number;
  features: string[];
  ai_credits_monthly: number;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: 'active' | 'canceled' | 'past_due';
  billing_cycle: 'monthly' | 'yearly';
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
}

export interface TopTool {
  name: string;
  slug: string;
  usage_count: number;
}

export interface PlatformStats {
  total_users: number;
  dau: number;
  total_courses: number;
  total_enrollments: number;
  total_tool_runs: number;
  total_tokens_used: number;
  active_subscriptions: number;
  total_revenue: number;
  top_tools: TopTool[];
  subscription_breakdown: Record<string, number>;
}

export interface UserStats {
  total_tokens_used: number;
  total_conversations: number;
  total_courses_enrolled: number;
  total_tool_runs: number;
  total_workflows: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
