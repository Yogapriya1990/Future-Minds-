# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Repo Is

This is a **multi-agent generative template** for bootstrapping full-stack SaaS applications. It does not contain a runnable app — it contains skills, agent definitions, and slash commands that produce one. Running `/execute-prp` dispatches 6 parallel agents that generate a complete codebase from scratch in 20–30 minutes.

---

## Workflow

```
1. Edit INITIAL.md        → Define your product (name, modules, features)
2. /generate-prp          → Parses INITIAL.md, outputs PRPs/[name]-prp.md
3. /execute-prp           → ORCHESTRATOR reads PRP, dispatches agents in phases
```

Custom slash commands live in `.claude/commands/`:
- `generate-prp.md` — Converts INITIAL.md into a structured PRP blueprint
- `execute-prp.md` — Orchestrates all agents across 3 phases
- `setup-project.md` — Interactive wizard; generates INITIAL.md and customized CLAUDE.md for your product

---

## Agent Execution Model

Agents run in 3 phases with validation gates between each:

**Phase 1 — Foundation (4 agents in parallel)**
- `DATABASE-AGENT` → SQLAlchemy models, Alembic migrations, seed data
- `BACKEND-AGENT` → FastAPI app structure, config, dependencies
- `FRONTEND-AGENT` → React/Vite scaffold, AuthContext, API client
- `DEVOPS-AGENT` → Dockerfiles, docker-compose, GitHub Actions, `.env`

**Phase 2 — Modules (backend + frontend agent pairs, per module)**
- Each module (auth, billing, etc.) runs as a parallel backend+frontend pair

**Phase 3 — Quality (3 agents in parallel)**
- `TEST-AGENT` → pytest fixtures + Vitest component tests (80%+ coverage required)
- `REVIEW-AGENT` → Security audit, code quality
- `RESEARCH-AGENT` → Best practices validation

Agent definitions: `agents/ORCHESTRATOR.md`, `agents/backend-agent.md`, `agents/frontend-agent.md`, `agents/database-agent.md`

---

## Tech Stack (Generated Output)

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI 0.109+, Python 3.11+, Uvicorn |
| Frontend | React + TypeScript, Vite, React Router, TanStack Query |
| Database | PostgreSQL 15+, SQLAlchemy 2.0+, Alembic |
| Auth | JWT (HS256), bcrypt, Google OAuth 2.0 |
| UI | Chakra UI or Tailwind + Framer Motion |
| Deployment | Docker multi-stage, docker-compose, Nginx, GitHub Actions |

---

## Generated Project Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── main.py, config.py, database.py
│   │   ├── models/, schemas/, routers/, services/, auth/
│   ├── alembic/
│   └── tests/
├── frontend/
│   └── src/
│       ├── components/, pages/, hooks/, services/, context/, types/
├── skills/           # Knowledge base for agents
├── agents/           # Agent role definitions
└── .claude/commands/ # /generate-prp, /execute-prp, /setup-project
```

---

## Skills Reference

Agents read these files as their knowledge base — do not delete or rename them:

| File | Covers |
|------|--------|
| `skills/BACKEND.md` | FastAPI app setup, JWT auth, Google OAuth, routers, schemas, error handling |
| `skills/FRONTEND.md` | React setup, AuthContext, Axios interceptors, 6 UI components |
| `skills/DATABASE.md` | SQLAlchemy ORM, TimestampMixin, SoftDeleteMixin, Alembic, eager loading |
| `skills/TESTING.md` | pytest fixtures, TestClient, Vitest + RTL, 80%+ coverage patterns |
| `skills/DEPLOYMENT.md` | Multi-stage Dockerfiles, docker-compose, Nginx, GitHub Actions CI/CD |

---

## Commands (for generated projects)

**Backend**
```bash
ruff check backend/                                        # Lint
ruff format backend/                                       # Format
mypy backend/                                              # Type check
pytest backend/tests -v                                    # All tests
pytest backend/tests/test_auth.py::test_login -v          # Single test
pytest --cov=app --cov-fail-under=80                      # Coverage gate
alembic upgrade head                                       # Apply migrations
alembic revision --autogenerate -m "description"          # Generate migration
```

**Frontend**
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript strict check
npm test              # Vitest
npm run build         # Production build
```

**Docker**
```bash
docker-compose up -d      # Start all services (postgres + backend + frontend)
docker-compose build      # Rebuild images
docker-compose down -v    # Stop and remove volumes
```

---

## Code Standards

**Python** — type hints required on all functions, async endpoints, use `logging` not `print`

**TypeScript** — interfaces required for all data shapes, no `any` types, no `console.log` in production code

**UI** — every page uses `PageWrapper`, buttons use `GradientButton`, cards use `GlassCard`, auth pages use `MeshBackground`, lists use `AnimatedList`. No inline styles.

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
VITE_API_URL=http://localhost:8000
```
