---
name: danger-zone
description: Restrict AI terminal, file system, git, and database operations to prevent irreversible damage. Use when the AI is about to execute any package management command, file deletion, git operation, or database write in production environments.
---

# Danger Zone — Danger Zone Rules

This document restricts the AI agent's terminal and system-level behaviors to prevent irreversible damage.

---

## 1. Package Management (NPM)

For any package management operations, the AI **must propose a plan first and wait for explicit user approval** before executing:

| Prohibited Autonomous Command | Reason |
|:---|:---|
| `npm install <pkg>` | Mutates `package.json` and `node_modules` state |
| `npm uninstall <pkg>` | May break existing system dependencies |
| `npm update` | May introduce breaking version updates |
| `npm run build` | Generates build artifacts, impacting deployment |

---

## 2. File System Protection

| Prohibited Operation | Alternative Approach |
|:---|:---|
| `rm -rf [Any directory except node_modules]` | List target files, request confirmation, then delete |
| PowerShell `Remove-Item -Recurse -Force` | Same as above |
| Modifying or deleting hidden directories (`.git/`, `.env`, `.vscode/`) | Strictly Prohibited. No alternatives. |

> Deleting `node_modules` using `rm -rf` / `Remove-Item` is allowed (as it can be recreated), but still requires informing the user beforehand.

---

## 3. Git Version Control Restrictions

### ✅ Exempted (Read-Only — No Authorization Required)

The following read-only git commands may be executed autonomously without user authorization:

| Allowed Command | Purpose |
|:---|:---|
| `git status` / `git status --short` | Check working tree state |
| `git diff --cached` | Inspect staged changes (required by `git-commit.md`) |
| `git log --oneline` / `git log -n <N>` | Read commit history |
| `git branch --show-current` | Identify current branch |
| `git remote get-url origin` | Detect remote platform (GitHub / GitLab) |

### 🚫 Prohibited (Write / Destructive — Requires Authorization)

| Prohibited Operation | Description |
|:---|:---|
| Running **write** `git` commands autonomously | You must wait for explicit user instructions (e.g., "commit", "push") |
| `git push -f` / `git push --force` | Strictly Prohibited. Overwriting remote history causes team collaboration disasters. |
| `git reset --hard` | Strictly Prohibited unless explicit user consent is given. Use `git stash` instead. |
| `git branch -D <name>` | Prohibited from force-deleting branches without confirmation. |
| `git add .` / `git add -A` | Prohibited from staging all files autonomously. The user must select files to stage. |

> `git add -p` (interactive patch staging) is **allowed** — the user selects each hunk manually, so it is not considered autonomous staging.

---

## 4. Database Operation Restrictions

- Prohibited from using the terminal to connect directly to the **production database** and executing:
  - `db.dropDatabase()`
  - `db.collection.deleteMany({})`
  - Any batch delete/overwrite scripts
- Prohibited from executing untrusted external scripts directly using `curl | bash` or `wget | bash`.

---

## 5. System-Level Operation Prohibitions

| Prohibited Operation | Description |
|:---|:---|
| `kill -9 <PID>` (Non-project process) | Prohibited from terminating unknown processes |
| `taskkill /F /PID <PID>` (Windows) | Same as above |
| `export VAR=value` modifying system env vars | Project variables must be written to the `.env` file |
| PowerShell `[Environment]::SetEnvironmentVariable` | Same as above |

---

## 6. External Connection Protection

- Prohibited from using terminal commands to connect directly to any **production API** endpoint (including your own project's production backend) to test or mutate data.
- Testing should use Postman, local dev servers, or structured integration tests, rather than raw terminal `curl` requests sent to production.
