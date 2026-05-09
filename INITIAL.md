# INITIAL.md - Define Your Product

> Fill this out, then run `/generate-prp INITIAL.md`

---

## PRODUCT

**Name:** Future Minds AI Tech

**Description:** An AI-powered SaaS ecosystem combining intelligent learning, AI tools, automation, and productivity solutions for students, creators, startups, and businesses.

**Type:** SaaS

---

## TECH STACK

| Layer | Choice |
|-------|--------|
| Backend | FastAPI + Python |
| Frontend | React + TypeScript + Vite |
| Database | PostgreSQL |
| Auth | JWT + Google OAuth |
| UI | Tailwind CSS + Framer Motion |
| Payments | Stripe |
| AI | OpenAI API + Anthropic Claude API |
| Deployment | Vercel (frontend) + Railway (backend + DB) |

---

## MODULES

### Module 1: Authentication (Built-in)

**Models:** User, RefreshToken

**Fields (User):**
```
User:
  - email: str (unique)
  - hashed_password: str
  - full_name: str
  - role: enum (student, creator, admin)
  - avatar_url: str (nullable)
  - subscription_tier: enum (free, pro, enterprise)
  - is_active: bool
  - google_id: str (nullable)
```

**Endpoints:**
- POST /auth/register, /auth/login, /auth/refresh, /auth/logout
- GET /auth/me, /auth/google, /auth/google/callback

**Pages:** /login, /register, /profile, /settings

---

### Module 2: AI Chat Assistant

**Description:** Multi-model AI chat interface supporting OpenAI and Claude APIs. Users create conversations, send messages, and get AI responses with full history persistence.

**Models:**
```
Conversation:
  - user_id: FK(User)
  - title: str
  - model: enum (gpt-4o, gpt-4o-mini, claude-sonnet, claude-haiku)
  - total_tokens: int

Message:
  - conversation_id: FK(Conversation)
  - role: enum (user, assistant, system)
  - content: text
  - tokens_used: int
```

**Endpoints:**
```
GET    /api/conversations           - List user conversations
POST   /api/conversations           - Create conversation
DELETE /api/conversations/{id}      - Delete conversation
POST   /api/conversations/{id}/messages  - Send message, stream AI response
GET    /api/conversations/{id}/messages  - List messages
```

**Pages:**
```
/chat               - New chat (model selector)
/chat/{id}          - Active conversation
```

**Special workflows:** Streaming AI response via SSE (Server-Sent Events); auto-title generation from first message.

---

### Module 3: Learning Management System

**Description:** Course creation platform where instructors publish structured courses with lessons and quizzes; learners enroll and track progress.

**Models:**
```
Course:
  - instructor_id: FK(User)
  - title: str
  - description: text
  - category: str
  - thumbnail_url: str (nullable)
  - difficulty: enum (beginner, intermediate, advanced)
  - is_published: bool
  - total_lessons: int

Lesson:
  - course_id: FK(Course)
  - title: str
  - content: text
  - video_url: str (nullable)
  - order_index: int
  - duration_minutes: int

Enrollment:
  - user_id: FK(User)
  - course_id: FK(Course)
  - progress_percent: float
  - completed_at: datetime (nullable)

LessonProgress:
  - enrollment_id: FK(Enrollment)
  - lesson_id: FK(Lesson)
  - completed: bool
  - completed_at: datetime (nullable)
```

**Endpoints:**
```
GET    /api/courses                  - List published courses
POST   /api/courses                  - Create course (instructor)
GET    /api/courses/{id}             - Course detail + lessons
PUT    /api/courses/{id}             - Update course
POST   /api/courses/{id}/publish     - Publish course
POST   /api/courses/{id}/enroll      - Enroll learner
GET    /api/courses/{id}/progress    - Get enrollment progress
POST   /api/lessons/{id}/complete    - Mark lesson complete
```

**Pages:**
```
/learn                    - Course catalog
/learn/{id}               - Course detail + enroll
/learn/{id}/lesson/{lid}  - Lesson viewer
/teach                    - Instructor dashboard
/teach/courses/new        - Create course
/teach/courses/{id}/edit  - Edit course
```

**Special workflows:** Publish (draft → published); auto-calculate progress on lesson completion.

---

### Module 4: AI Tools Marketplace

**Description:** Curated library of AI-powered tools (text summarizer, image prompt generator, code explainer, etc.) that users can browse and run directly in the platform.

**Models:**
```
Tool:
  - name: str
  - slug: str (unique)
  - description: text
  - category: str
  - icon_url: str (nullable)
  - prompt_template: text
  - model: enum (gpt-4o, claude-sonnet)
  - is_active: bool
  - is_premium: bool

ToolUsage:
  - user_id: FK(User)
  - tool_id: FK(Tool)
  - input_text: text
  - output_text: text
  - tokens_used: int
```

**Endpoints:**
```
GET    /api/tools              - List active tools (filterable by category)
GET    /api/tools/{slug}       - Tool detail
POST   /api/tools/{slug}/run   - Run tool with user input, return AI output
GET    /api/tools/history      - User's tool usage history
```

**Pages:**
```
/tools                - Tool marketplace (grid + category filter)
/tools/{slug}         - Tool runner UI
/tools/history        - Usage history
```

---

### Module 5: Automation Workflows

**Description:** Simple rule-based automation builder where users define trigger → action workflows (e.g. "When I paste text → summarize it → save to notes").

**Models:**
```
Workflow:
  - user_id: FK(User)
  - name: str
  - description: str
  - trigger_type: enum (manual, scheduled, webhook)
  - steps: JSON  # list of {action, tool_slug, input_template}
  - is_active: bool
  - schedule_cron: str (nullable)

WorkflowRun:
  - workflow_id: FK(Workflow)
  - status: enum (running, completed, failed)
  - input_data: JSON
  - output_data: JSON
  - started_at: datetime
  - completed_at: datetime (nullable)
  - error_message: str (nullable)
```

**Endpoints:**
```
GET    /api/workflows              - List user workflows
POST   /api/workflows              - Create workflow
PUT    /api/workflows/{id}         - Update workflow
DELETE /api/workflows/{id}         - Delete workflow
POST   /api/workflows/{id}/toggle  - Activate / deactivate
POST   /api/workflows/{id}/run     - Manually trigger run
GET    /api/workflows/{id}/runs    - Run history
```

**Pages:**
```
/automations              - Workflow list
/automations/new          - Workflow builder
/automations/{id}/edit    - Edit workflow
/automations/{id}/runs    - Run history
```

---

### Module 6: Subscription & Payments

**Description:** Stripe-powered subscription system with Free, Pro, and Enterprise tiers. Controls feature access across modules.

**Models:**
```
Plan:
  - name: str
  - tier: enum (free, pro, enterprise)
  - price_monthly: float
  - price_yearly: float
  - features: JSON  # list of feature strings
  - stripe_price_id_monthly: str
  - stripe_price_id_yearly: str
  - ai_credits_monthly: int  # token budget

Subscription:
  - user_id: FK(User, unique)
  - plan_id: FK(Plan)
  - status: enum (active, canceled, past_due)
  - billing_cycle: enum (monthly, yearly)
  - stripe_subscription_id: str
  - stripe_customer_id: str
  - current_period_end: datetime
  - canceled_at: datetime (nullable)
```

**Endpoints:**
```
GET    /api/plans                        - List plans
POST   /api/subscriptions/checkout       - Create Stripe checkout session
POST   /api/subscriptions/portal         - Stripe customer portal URL
GET    /api/subscriptions/me             - Current subscription
POST   /api/webhooks/stripe              - Stripe webhook handler
```

**Pages:**
```
/pricing            - Plan comparison + subscribe
/billing            - Manage subscription (portal redirect)
```

**Special workflows:** Stripe webhook handles subscription lifecycle (created, updated, canceled, payment_failed); tier gates enforced via dependency `require_pro()`.

---

### Module 7: Admin Panel

**Description:** Internal admin interface for user management, content moderation, and platform oversight.

**Endpoints:**
```
GET    /api/admin/users              - List all users (paginated, filterable)
PUT    /api/admin/users/{id}/role    - Change user role
POST   /api/admin/users/{id}/ban    - Ban / unban user
GET    /api/admin/courses            - List all courses (inc. unpublished)
DELETE /api/admin/courses/{id}       - Remove course
GET    /api/admin/tools              - List all tools
POST   /api/admin/tools              - Create tool
PUT    /api/admin/tools/{id}         - Update tool
```

**Pages:**
```
/admin                    - Admin overview
/admin/users              - User management table
/admin/courses            - Course moderation
/admin/tools              - Tool management
```

---

### Module 8: Analytics Dashboard

**Description:** Usage metrics for users (personal stats) and admins (platform-wide stats). Tracks AI usage, learning progress, and automation runs.

**Models:**
```
Event:
  - user_id: FK(User, nullable)
  - event_type: str  # e.g. "tool_used", "lesson_completed", "workflow_run"
  - metadata: JSON
```

**Endpoints:**
```
GET    /api/analytics/me             - User's personal stats (tokens used, courses, tools)
GET    /api/analytics/platform       - Admin-only: platform-wide metrics
POST   /api/analytics/event          - Track event (internal use)
```

**Pages:**
```
/dashboard               - User analytics (credits used, courses, recent activity)
/admin/analytics         - Platform analytics (DAU, revenue, top tools)
```

---

## MVP SCOPE

Must Have:
- [x] User registration and login (email + Google OAuth)
- [x] AI Chat with OpenAI and Claude model selection, streaming responses
- [x] Course creation, publishing, enrollment, and lesson progress tracking
- [x] AI Tools Marketplace with at least 5 built-in tools
- [x] Automation workflow builder with manual trigger support
- [x] Stripe subscription with Free and Pro tiers
- [x] Admin panel: user management and tool management
- [x] User analytics dashboard (usage summary)
- [x] Role-based access (student / creator / admin)
- [x] Responsive UI with Tailwind + Framer Motion animations

---

## ACCEPTANCE CRITERIA

- [ ] User can register, log in via email and Google OAuth, and update profile
- [ ] AI Chat returns streamed responses from OpenAI and Claude APIs
- [ ] Instructor can create a course with lessons and publish it; learner can enroll and mark lessons complete with progress saved
- [ ] User can browse, run an AI tool, and view usage history
- [ ] User can create an automation workflow, run it manually, and view run output
- [ ] User can subscribe to Pro plan via Stripe and access gated features
- [ ] Admin can manage users (ban/unban, change role) and create/edit AI tools
- [ ] User dashboard shows correct credit usage, enrolled courses, and recent activity
- [ ] Free-tier users are blocked from premium tools and Pro features
- [ ] 80%+ test coverage; Docker builds successfully

---

## RUN

```bash
/generate-prp INITIAL.md
/execute-prp PRPs/future-minds-ai-tech-prp.md
```
