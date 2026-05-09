# PRP: Future Minds AI Tech

> Implementation blueprint for parallel agent execution

---

## METADATA

| Field | Value |
|-------|-------|
| **Product** | Future Minds AI Tech |
| **Type** | SaaS |
| **Version** | 1.0 |
| **Created** | 2026-05-09 |
| **Complexity** | High |

---

## PRODUCT OVERVIEW

**Description:** An AI-powered SaaS ecosystem combining intelligent learning, AI tools, automation, and productivity solutions for students, creators, startups, and businesses.

**Value Proposition:** One platform replaces multiple subscriptions — AI chat, structured learning, ready-made AI tools, and no-code automation — gated by a Stripe subscription that upgrades access with one click.

**MVP Scope:**
- [ ] User registration and login (email + Google OAuth)
- [ ] AI Chat with OpenAI and Claude model selection, streaming responses
- [ ] Course creation, publishing, enrollment, and lesson progress tracking
- [ ] AI Tools Marketplace with at least 5 built-in tools
- [ ] Automation workflow builder with manual trigger support
- [ ] Stripe subscription with Free and Pro tiers
- [ ] Admin panel: user management and tool management
- [ ] User analytics dashboard (usage summary)
- [ ] Role-based access (student / creator / admin)
- [ ] Responsive UI with Tailwind + Framer Motion animations

---

## TECH STACK

| Layer | Technology | Skill Reference |
|-------|------------|-----------------|
| Backend | FastAPI + Python 3.11+ | skills/BACKEND.md |
| Frontend | React + TypeScript + Vite | skills/FRONTEND.md |
| Database | PostgreSQL 15+ + SQLAlchemy 2.0+ + Alembic | skills/DATABASE.md |
| Auth | JWT (HS256) + bcrypt + Google OAuth 2.0 | skills/BACKEND.md |
| UI | Tailwind CSS + Framer Motion | skills/FRONTEND.md |
| Payments | Stripe (subscriptions + webhooks) | skills/BACKEND.md |
| AI | OpenAI API + Anthropic Claude API (SSE streaming) | skills/BACKEND.md |
| Testing | pytest + Vitest + RTL | skills/TESTING.md |
| Deployment | Docker + docker-compose + GitHub Actions (Vercel/Railway targets) | skills/DEPLOYMENT.md |

---

## DATABASE MODELS

### User
- id, email (unique), hashed_password, full_name
- role: enum(student, creator, admin)
- avatar_url (nullable), subscription_tier: enum(free, pro, enterprise)
- is_active: bool, google_id (nullable)
- created_at, updated_at (TimestampMixin)

### RefreshToken
- id, user_id: FK(User), token: str (unique), expires_at: datetime, revoked: bool

### Conversation
- id, user_id: FK(User), title: str
- model: enum(gpt-4o, gpt-4o-mini, claude-sonnet, claude-haiku)
- total_tokens: int, created_at, updated_at

### Message
- id, conversation_id: FK(Conversation)
- role: enum(user, assistant, system), content: text
- tokens_used: int, created_at

### Course
- id, instructor_id: FK(User), title: str, description: text
- category: str, thumbnail_url (nullable)
- difficulty: enum(beginner, intermediate, advanced)
- is_published: bool, total_lessons: int, created_at, updated_at

### Lesson
- id, course_id: FK(Course), title: str, content: text
- video_url (nullable), order_index: int, duration_minutes: int

### Enrollment
- id, user_id: FK(User), course_id: FK(Course)
- progress_percent: float, completed_at (nullable), created_at
- Unique constraint: (user_id, course_id)

### LessonProgress
- id, enrollment_id: FK(Enrollment), lesson_id: FK(Lesson)
- completed: bool, completed_at (nullable)

### Tool
- id, name: str, slug: str (unique), description: text
- category: str, icon_url (nullable), prompt_template: text
- model: enum(gpt-4o, claude-sonnet), is_active: bool, is_premium: bool

### ToolUsage
- id, user_id: FK(User), tool_id: FK(Tool)
- input_text: text, output_text: text, tokens_used: int, created_at

### Workflow
- id, user_id: FK(User), name: str, description: str
- trigger_type: enum(manual, scheduled, webhook)
- steps: JSON, is_active: bool, schedule_cron (nullable)
- created_at, updated_at

### WorkflowRun
- id, workflow_id: FK(Workflow)
- status: enum(running, completed, failed)
- input_data: JSON, output_data: JSON
- started_at: datetime, completed_at (nullable), error_message (nullable)

### Plan
- id, name: str, tier: enum(free, pro, enterprise)
- price_monthly: float, price_yearly: float, features: JSON
- stripe_price_id_monthly: str, stripe_price_id_yearly: str
- ai_credits_monthly: int

### Subscription
- id, user_id: FK(User, unique), plan_id: FK(Plan)
- status: enum(active, canceled, past_due)
- billing_cycle: enum(monthly, yearly)
- stripe_subscription_id: str, stripe_customer_id: str
- current_period_end: datetime, canceled_at (nullable)

### Event
- id, user_id: FK(User, nullable)
- event_type: str (e.g. "tool_used", "lesson_completed", "workflow_run")
- metadata: JSON, created_at

---

## MODULES

### Module 1: Authentication
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create account with email + password |
| POST | /auth/login | Email login, return access + refresh tokens |
| POST | /auth/refresh | Exchange refresh token for new access token |
| POST | /auth/logout | Revoke refresh token |
| GET | /auth/me | Return current authenticated user |
| GET | /auth/google | Redirect to Google OAuth consent |
| GET | /auth/google/callback | Handle Google callback, issue tokens |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /login | LoginPage | LoginForm, GoogleOAuthButton, GradientButton |
| /register | RegisterPage | RegisterForm, GoogleOAuthButton |
| /profile | ProfilePage | AvatarUpload, ProfileForm |
| /settings | SettingsPage | PasswordChangeForm, DangerZone |

**Notes:** Dependency `get_current_user` injected on all protected routes. Role enum enforced via `require_role(role)` dependency. Google OAuth uses `authlib` or `httpx` callback flow.

---

### Module 2: AI Chat Assistant
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/conversations | List user's conversations |
| POST | /api/conversations | Create new conversation |
| DELETE | /api/conversations/{id} | Delete conversation |
| POST | /api/conversations/{id}/messages | Send message; stream AI response via SSE |
| GET | /api/conversations/{id}/messages | List all messages in conversation |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /chat | NewChatPage | ModelSelector, NewChatPrompt |
| /chat/{id} | ChatPage | MessageList, MessageBubble, ChatInput, StreamingIndicator |

**Special workflows:**
- SSE streaming via `StreamingResponse` (FastAPI) using `openai.chat.completions.create(stream=True)` / Anthropic `messages.stream()`
- Auto-generate conversation title from first user message (background task)
- Model routing: detect provider from model enum prefix (`gpt-*` → OpenAI, `claude-*` → Anthropic)

---

### Module 3: Learning Management System
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | List published courses (paginated, filterable by category/difficulty) |
| POST | /api/courses | Create course (creator role required) |
| GET | /api/courses/{id} | Course detail with lessons |
| PUT | /api/courses/{id} | Update course (owner only) |
| POST | /api/courses/{id}/publish | Publish draft course |
| POST | /api/courses/{id}/enroll | Enroll current user |
| GET | /api/courses/{id}/progress | Get enrollment + lesson progress |
| POST | /api/lessons/{id}/complete | Mark lesson complete; recalculate progress_percent |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /learn | CourseCatalogPage | CourseGrid, CategoryFilter, CourseCard |
| /learn/{id} | CourseDetailPage | CourseHero, LessonList, EnrollButton |
| /learn/{id}/lesson/{lid} | LessonViewerPage | LessonContent, VideoPlayer, ProgressBar, NextButton |
| /teach | InstructorDashboardPage | MyCoursesList, StatsCard |
| /teach/courses/new | CreateCoursePage | CourseForm, LessonBuilder |
| /teach/courses/{id}/edit | EditCoursePage | CourseForm, LessonReorder, PublishButton |

**Special workflows:**
- Draft → Published state machine (validate min 1 lesson before publish)
- progress_percent auto-calculated: `completed_lessons / total_lessons * 100`

---

### Module 4: AI Tools Marketplace
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tools | List active tools (filterable by category) |
| GET | /api/tools/{slug} | Tool detail + prompt_template |
| POST | /api/tools/{slug}/run | Execute tool with user input; return AI output |
| GET | /api/tools/history | Current user's ToolUsage history |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /tools | ToolMarketplacePage | ToolGrid, CategoryFilter, ToolCard, PremiumBadge |
| /tools/{slug} | ToolRunnerPage | ToolForm, OutputCard, TokenCounter |
| /tools/history | ToolHistoryPage | UsageTable |

**Special workflows:**
- Premium tool gate: check `user.subscription_tier != free` before running; return 403 with upgrade prompt
- 5 seeded tools: Text Summarizer, Code Explainer, Image Prompt Generator, Email Drafter, Blog Outline Generator

---

### Module 5: Automation Workflows
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/workflows | List user's workflows |
| POST | /api/workflows | Create workflow |
| PUT | /api/workflows/{id} | Update workflow definition |
| DELETE | /api/workflows/{id} | Delete workflow |
| POST | /api/workflows/{id}/toggle | Activate / deactivate |
| POST | /api/workflows/{id}/run | Manually trigger; execute steps sequentially |
| GET | /api/workflows/{id}/runs | Workflow run history |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /automations | WorkflowListPage | WorkflowCard, StatusBadge, RunButton |
| /automations/new | WorkflowBuilderPage | TriggerPicker, StepBuilder, ToolSelector |
| /automations/{id}/edit | EditWorkflowPage | WorkflowBuilderPage (edit mode) |
| /automations/{id}/runs | RunHistoryPage | RunTable, RunDetailDrawer |

**Special workflows:**
- Step execution: iterate `workflow.steps` JSON, call Tool runner for each step, pass output as next step input
- WorkflowRun record created before execution; status updated to completed/failed on finish

---

### Module 6: Subscription & Payments
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/plans | List all plans with features |
| POST | /api/subscriptions/checkout | Create Stripe Checkout Session (monthly/yearly) |
| POST | /api/subscriptions/portal | Return Stripe Customer Portal URL |
| GET | /api/subscriptions/me | Current user subscription |
| POST | /api/webhooks/stripe | Handle Stripe lifecycle events (no auth middleware) |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /pricing | PricingPage | PlanCard, BillingToggle, SubscribeButton |
| /billing | BillingPage | CurrentPlanBadge, ManageBillingButton |

**Special workflows:**
- Stripe webhook events handled: `customer.subscription.created`, `updated`, `deleted`, `invoice.payment_failed`
- `require_pro()` FastAPI dependency: check `user.subscription_tier in [pro, enterprise]` or raise 403
- Plan seed data: Free (0 credits), Pro (100k credits/mo), Enterprise (unlimited)

---

### Module 7: Admin Panel
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | List all users (paginated, search by email) |
| PUT | /api/admin/users/{id}/role | Change user role |
| POST | /api/admin/users/{id}/ban | Ban or unban user (toggle is_active) |
| GET | /api/admin/courses | List all courses including unpublished |
| DELETE | /api/admin/courses/{id} | Remove course |
| GET | /api/admin/tools | List all tools |
| POST | /api/admin/tools | Create tool |
| PUT | /api/admin/tools/{id} | Update tool |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /admin | AdminOverviewPage | StatsCard, QuickLinks |
| /admin/users | UserManagementPage | UserTable, RoleDropdown, BanButton |
| /admin/courses | CourseModPage | CourseTable, DeleteButton |
| /admin/tools | ToolManagementPage | ToolTable, ToolFormModal |

**Notes:** All `/api/admin/*` routes require `require_role(admin)` dependency. Frontend routes guarded by `AdminRoute` wrapper that checks `user.role === "admin"`.

---

### Module 8: Analytics Dashboard
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/me | Personal stats: tokens used, courses enrolled, tools run, workflow runs |
| GET | /api/analytics/platform | Admin-only: DAU, total users, revenue, top tools |
| POST | /api/analytics/event | Internal event tracking (called by other services) |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /dashboard | UserDashboardPage | StatCard, CreditUsageBar, RecentActivityFeed, EnrolledCourses |
| /admin/analytics | PlatformAnalyticsPage | DAUChart, RevenueChart, TopToolsTable |

---

## PHASE EXECUTION PLAN

### Phase 1: Foundation (4 agents in parallel)

**DATABASE-AGENT** — `skills/DATABASE.md`
- Create all 15 models with correct FK relationships and enums
- TimestampMixin on all entities with timestamps
- SoftDeleteMixin where applicable (User, Course, Tool)
- Alembic initial migration (`001_initial_schema`)
- Seed data: 3 Plans, 5 Tools, 1 admin user
- Outputs: `backend/app/models/`, `backend/alembic/versions/001_initial_schema.py`

**BACKEND-AGENT** — `skills/BACKEND.md`
- FastAPI app scaffold: `main.py`, `config.py`, `database.py`, `dependencies.py`
- Settings via Pydantic BaseSettings (all env vars)
- CORS config for Vite dev origin
- Router registration stubs (to be filled in Phase 2)
- OpenAI + Anthropic client initialization
- Stripe client initialization
- Outputs: `backend/app/main.py`, `backend/app/config.py`, `backend/app/database.py`

**FRONTEND-AGENT** — `skills/FRONTEND.md`
- Vite + React + TypeScript scaffold
- Tailwind CSS + Framer Motion configured
- Folder structure: `components/`, `pages/`, `hooks/`, `services/`, `context/`, `types/`
- AuthContext with JWT + refresh token logic
- Axios instance with auth interceptor + refresh retry
- React Router v6 with `PrivateRoute` and `AdminRoute` guards
- Base UI components: `PageWrapper`, `GradientButton`, `GlassCard`, `MeshBackground`, `AnimatedList`
- Outputs: `frontend/src/`

**DEVOPS-AGENT** — `skills/DEPLOYMENT.md`
- Multi-stage Dockerfile for backend (Python 3.11-slim)
- Dockerfile for frontend (node:20-alpine → nginx)
- `docker-compose.yml`: postgres + backend + frontend services
- `.env.example` with all required variables
- GitHub Actions CI: lint → type-check → test → build
- Outputs: `Dockerfile.backend`, `Dockerfile.frontend`, `docker-compose.yml`, `.env.example`, `.github/workflows/ci.yml`

**Validation Gate 1:**
```bash
alembic upgrade head
pip install -r requirements.txt
npm install
docker-compose config
```

---

### Phase 2: Modules (8 backend+frontend pairs in parallel)

Each pair runs concurrently. Backend must complete before frontend within each pair (intra-pair sequential; inter-pair parallel).

1. **Auth Module** — JWT + bcrypt + Google OAuth endpoints + Login/Register/Profile pages
2. **AI Chat Module** — SSE streaming endpoints + Chat UI with model selector
3. **LMS Module** — Course CRUD + enrollment + progress endpoints + all LMS pages
4. **AI Tools Module** — Tool listing + execution endpoints + marketplace + runner pages
5. **Automation Module** — Workflow CRUD + step execution + builder + run history pages
6. **Subscriptions Module** — Stripe checkout + webhook handler + pricing + billing pages
7. **Admin Module** — Admin CRUD endpoints + user/course/tool management pages
8. **Analytics Module** — Stats aggregation endpoints + dashboard + platform analytics pages

**Validation Gate 2:**
```bash
ruff check backend/
mypy backend/
npm run lint
npm run type-check
```

---

### Phase 3: Quality (3 agents in parallel)

**TEST-AGENT** — `skills/TESTING.md`
- pytest fixtures: test DB, test client, factory functions per model
- Auth tests: register, login, refresh, Google OAuth mock
- AI Chat tests: mock OpenAI/Anthropic clients, test streaming
- LMS tests: course lifecycle, enrollment, progress calculation
- Tools tests: run tool (mock AI), premium gate
- Automation tests: workflow run, step execution
- Subscription tests: Stripe webhook simulation
- Admin tests: role-gated endpoints
- Vitest + RTL: test 1 component per module (at minimum)
- Coverage gate: 80%+
- Outputs: `backend/tests/`, `frontend/src/__tests__/`

**REVIEW-AGENT**
- Security audit: JWT secret strength, SQL injection surface (SQLAlchemy ORM safe), Stripe webhook signature verification
- Check all admin routes have `require_role(admin)`
- Check all premium routes have `require_pro()`
- Verify no secrets hardcoded; all from `config.py` / env
- Performance: N+1 query check on course list with lessons; add `selectinload`

**RESEARCH-AGENT**
- Validate SSE streaming pattern matches FastAPI best practices
- Confirm Stripe webhook idempotency approach
- Verify Alembic migration reversibility
- Check Google OAuth callback PKCE / state parameter

**Final Validation:**
```bash
pytest --cov=app --cov-fail-under=80 -v
npm test
docker-compose build
docker-compose up -d
curl localhost:8000/health
curl localhost:5173
```

---

## VALIDATION GATES

| Gate | Commands |
|------|----------|
| 1 — Foundation | `alembic upgrade head`, `pip install -r requirements.txt`, `npm install`, `docker-compose config` |
| 2 — Modules | `ruff check backend/`, `mypy backend/`, `npm run lint`, `npm run type-check` |
| 3 — Quality | `pytest --cov=app --cov-fail-under=80`, `npm test` |
| Final | `docker-compose build`, `docker-compose up -d`, `curl localhost:8000/health` |

---

## ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/future_minds

# Auth
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## AGENT ASSIGNMENTS SUMMARY

```yaml
DATABASE-AGENT:
  models: [User, RefreshToken, Conversation, Message, Course, Lesson,
           Enrollment, LessonProgress, Tool, ToolUsage, Workflow,
           WorkflowRun, Plan, Subscription, Event]
  skills: [skills/DATABASE.md]

BACKEND-AGENT:
  modules: [auth, chat, lms, tools, automations, subscriptions, admin, analytics]
  skills: [skills/BACKEND.md]

FRONTEND-AGENT:
  modules: [auth, chat, lms, tools, automations, subscriptions, admin, analytics]
  skills: [skills/FRONTEND.md]

DEVOPS-AGENT:
  tasks: [Docker, docker-compose, GitHub Actions, env files]
  skills: [skills/DEPLOYMENT.md]

TEST-AGENT:
  coverage: [all 8 modules, 80%+ gate]
  skills: [skills/TESTING.md]

REVIEW-AGENT:
  review: [security, performance, role gates, stripe webhook verification]

RESEARCH-AGENT:
  validate: [SSE streaming, Stripe idempotency, OAuth PKCE, Alembic reversibility]
```

---

## NEXT STEP

Execute with parallel agents:
```
/execute-prp PRPs/future-minds-ai-tech-prp.md
```
