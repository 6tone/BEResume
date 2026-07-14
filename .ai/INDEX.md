---
name: skill-index
description: Master routing index. READ THIS FILE FIRST before any task. Identifies which skill files are required based on task type.
---

# Skill Index — AI Task Router

## MANDATORY PROTOCOL

You MUST follow these steps at the start of EVERY task, without exception:

1. **Identify** the task type from the user's request using the routing table below.
2. **Read** each skill file listed for that task type.
3. **Only then** proceed with implementation.

> If you skip this step and proceed from memory alone, you are violating the project protocol.

---

## Skill File Location

All skill files are located in the **same directory as this INDEX.md**.

| File | Skill Name | Core Responsibility |
|:---|:---|:---|
| `sop.md` | `ai-sop` | Trust Boundary, Authorization Flow, AI Persona |
| `architecture.md` | `architecture` | Directory Rules, SoC, DB/No-DB Branches |
| `coding.md` | `coding-standards` | Layered Architecture, SRP, Naming, Error Handling, React Hooks |
| `security.md` | `security-guidelines` | Data Masking, Secrets Management, CORS, Rate Limiting |
| `danger-zone.md` | `danger-zone` | Prohibited Terminal / Git / DB Operations |
| `logging.md` | `logging` | Log Levels, Structured JSON, PII Masking, Error Code Design |
| `glossary.template.md` | `glossary` | Domain Terms, Status Codes, Abbreviations, Disambiguation |
| `git-commit.md` | `git-commit` | Commitizen Format, Confirmation Flow, Anti-automation |
| `create-pull-request.md` | `create-pull-request` | Branch Push, PR/MR Title/Body, GitHub/GitLab CLI, Confirmation Flow |
| `testing.md` | `testing` | Decision Tree, Jest/Nock Execution, Debug Workflows, Coverage |
| `ci-fix.md` | `ci-fix` | CI Log Diagnosis, Test/Lint/Build/Env Fixes |
| `web-performance-audit.md` | `web-performance-audit` | Lighthouse / CWV Audit, Bundle Analysis, Fix Patterns |

---

## Routing Table (Follow Exactly)

Read ONLY the files listed. Do not load extra files speculatively.

### 🔵 Starting a new session / unclear task type
→ READ: `sop.md`

---

### 🟢 Code — Add or Modify API / Service / Business Logic
Triggers: "add API", "modify service", "implement feature", "add endpoint"
→ READ: `sop.md`, `coding.md`, `architecture.md`

---

### 🟢 Code — Refactor or Restructure Directory / Files
Triggers: "refactor", "reorganize", "restructure", "move files", "rename"
→ READ: `sop.md`, `architecture.md`

---

### 🟢 Code — Frontend UI / Component / React
Triggers: "component", "UI", "page", "CSS", "style", "hook", "React"
→ READ: `coding.md`, `architecture.md`

---

### 🟢 Code — Authentication / Security / CORS / Sensitive Data
Triggers: "auth", "JWT", "CORS", "token", "password", "permission", "session"
→ READ: `security.md`, `architecture.md`

---

### 🟢 Code — Logging / Error Handling / Error Codes
Triggers: "log", "logger", "error code", "PII", "mask", "AppError"
→ READ: `logging.md`, `security.md`

---

### 🟢 Code — Write or Modify Tests
Triggers: "test", "unit test", "integration test", "jest", "coverage", "mock"
→ READ: `testing.md`, `coding.md`

---

### 🟡 System — Package Installation / Environment Config
Triggers: "npm install", "add dependency", "package", ".env", "environment variable"
→ READ: `sop.md`, `danger-zone.md`
⚠️ This is a Red Zone operation. Do NOT proceed without explicit user authorization.

---

### 🟡 System — Destructive / High-Risk Terminal Commands
Triggers: "delete", "remove", "drop", "reset", "force push", "rm -rf"
→ READ: `danger-zone.md`, `sop.md`
⚠️ STOP immediately after reading. Propose a plan and wait for authorization.

---

### 🔵 Workflow — Git Commit
Triggers: "commit", "pack", "save progress", "wrap up", "done", "提交", "打包"
→ READ: `git-commit.md`

---

### 🔵 Workflow — Push to Remote / Open Pull Request
Triggers: "push", "PR", "pull request", "open PR", "submit for review"
→ READ: `create-pull-request.md`, `git-commit.md`

---

### 🔵 Workflow — CI Pipeline Failure
Triggers: "CI failing", "pipeline red", "fix CI", "make it green", "tests fail in CI"
→ READ: `ci-fix.md`

---

### 🔵 Workflow — Frontend Performance / Lighthouse
Triggers: "slow", "Lighthouse", "LCP", "bundle size", "performance audit", "CWV"
→ READ: `web-performance-audit.md`

---

## Ambiguous Task Handling

If the task matches **more than one category**, read all matched skill files.
If the task matches **no category**, default to:
→ READ: `sop.md`, `coding.md`, `architecture.md`

---

## What NOT to Load

- `INDEX.md` itself — you are already reading it.
- `README.md` — human-facing documentation, not AI rules.
- `glossary.template.md` — reference only; do not load unless you need term definitions.
- All skill files at once — this defeats the purpose of this index.
