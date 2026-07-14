# 🏛️ Universal AI Skill Set — Common Guidelines Template v1.1

> **Origin**: Synthesized from the comparative analysis of NHGame (Backend Game Platform) and ChampBot (React + Express Proxy).
> **Design Principle**: Project-Agnostic, using `[PLACEHOLDER]` tags for project-specific customization.
> **Usage**: Copy the entire `universal/` directory into your new project's `.ai/` directory, search for all `[...]` placeholders, and fill in the actual project details.
> **Format**: All skills follow the [Agent Skills](https://agentskills.io) open standard with YAML frontmatter for auto-discovery.

---

## 📑 Skill Index

### 🔴 Behavior Governance Skills (AI What-Not-To-Do)

| No. | File | Name | Core Responsibility |
|:---:|:---|:---|:---|
| 1 | `sop.md` | `ai-sop` | Trust Boundary, Authorization Flow, AI Persona |
| 2 | `architecture.md` | `architecture` | Directory Rules, SoC, DB/No-DB Branches |
| 3 | `coding.md` | `coding-standards` | Layered Architecture, SRP, Naming, Error Handling |
| 4 | `security.md` | `security-guidelines` | Data Masking, Secrets Management, CORS, Rate Limiting |
| 5 | `danger-zone.md` | `danger-zone` | Prohibited Terminal / Git / DB Operations |
| 6 | `logging.md` | `logging` | Log Levels, Structured JSON, PII Masking, Error Code Design |
| 7 | `glossary.template.md` | `glossary` | Domain Terms, Status Codes, Abbreviations, Disambiguation |

### 🟡 Workflow Skills (AI How-To Execution Handbooks)

| No. | File | Name | Core Responsibility |
|:---:|:---|:---|:---|
| 6 | `git-commit.md` | `git-commit` | Commitizen Format, Confirmation Flow, Anti-automation |
| 7 | `create-pull-request.md` | `create-pull-request` | Branch Push, PR Title/Body Generation, Confirmation Flow |
| 8 | `testing.md` | `testing` | Decision Tree, Jest/Nock Execution, Debug Workflows, Coverage |
| 9 | `ci-fix.md` | `ci-fix` | CI Log Diagnosis, Test/Lint/Build/Env Fixes |
| 10 | `web-performance-audit.md` | `web-performance-audit` | Lighthouse / CWV Audit, Bundle Analysis, Fix Patterns |

---

## 🔀 Task Routing Table

| Task Type | Required Skill Files |
|:---|:---|
| Add / Modify API or Service | `sop.md` + `coding.md` + `architecture.md` |
| Refactor / Modify Directory Structure | `sop.md` + `architecture.md` |
| Security / Auth / CORS Related | `security.md` + `architecture.md` |
| Write or Modify Tests | `testing.md` + `coding.md` |
| Frontend UI / Component Modification | `coding.md` + `architecture.md` |
| Package Installation / Environment Settings | `sop.md` + `danger-zone.md` (Red Zone) |
| Adding Logs / Error Codes / PII Handling | `logging.md` + `security.md` |
| Git Commit / Version Control | `git-commit.md` |
| Push to Remote + Open PR / MR | `create-pull-request.md` + `git-commit.md` |
| CI Pipeline Failure | `ci-fix.md` |
| Page Load Performance | `web-performance-audit.md` |

---

## 📌 Required Project Placeholders

| Placeholder | Description |
|:---|:---|
| `[PROJECT_NAME]` | Project name (e.g., `NHGame`) |
| `[TECH_STACK]` | Core technology stack (e.g., `Node.js + MongoDB + React`) |
| `[PROJECT_UTIL_DIR]` | Directory for utility functions (e.g., `lib/server-util`) |
| `[HAS_DATABASE]` | `true` / `false`, determines the database rules in `architecture.md` |
| `[DB_TYPE]` | Type of database (e.g., `MongoDB` / `PostgreSQL` / `Redis` / `None`) |
| `[GLOSSARY]` | Project terminology glossary (recommended to create a `glossary.md`) |

---

## 🔁 Version History

| Version | Date | Description |
|:---|:---|:---|
| v1.0 | 2026-06-15 | Initial release synthesized from NHGame and ChampBot comparison |
| v1.1 | 2026-06-15 | Added YAML frontmatter to all skills; upgraded testing.md to execution handbook; added create-pull-request, ci-fix, web-performance-audit |
| v1.2 | 2026-06-15 | Bug fixes: testing.md Jest key typo (setupFilesAfterEnv), security.md Session 6 prerequisite; expanded sop.md auth keywords; fixed create-pull-request.md gh CLI; added GitLab CI to ci-fix.md; added React Hooks rules to coding.md; added logging.md |
| v1.3 | 2026-06-15 | Optimization & Cleanup: Removed cross-file duplication between architecture.md/coding.md/security.md; consolidated DRY rules; fixed Winston duplicate console logging bug; prioritized Windows PowerShell in PR creation; made testing DB setup conditional for stateless compatibility |
| v1.4 | 2026-06-16 | Quality fixes: architecture.md Section 7 generic example; coding.md asyncHandler path → placeholder; security.md Section 6 split into 6-A/6-B; create-pull-request.md added GitLab glab Section 8; README routing table synced with INDEX.md; added glossary.template.md |
