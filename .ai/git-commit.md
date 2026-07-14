---
name: git-commit
description: Generate and execute git commit. Triggered when the user expresses commit intent, including explicit commands ("commit", "pack", "clean up progress", "save progress", "wrap up") and conversational continuations.
---

# Git Commit — Version Control Commit Style

---

## 1. Trigger Conditions

**Wait for explicit intent before starting; executing any git commands autonomously is strictly prohibited.**

Common trigger expressions:
"commit", "commit please", "pack", "save progress", "wrap up", "done with this stage", "save", "that's it for now"

Vague phrases such as "current progress" or "current state" — if uncommitted changes exist in the working directory, default to treating this as a commit request.

---

## 2. Change Source Priority

1. **Staged Changes Exist** (`git diff --cached` has content) → **Use only staged changes as the sole source**.
2. **No Staged Changes** → Stop and inform the user:
   > "There are currently no staged changes. Please run `git add` to stage the files you want to commit first."

### Isolation Rule

- **Never run `git add .` or `git add -A`**; do not modify the staging area autonomously.
- Only run `git diff --cached`, do not run `git diff` (unstaged).
- **Do not mention unstaged files** in the commit message, body, or any user-facing outputs.
- Treat unstaged changes as out-of-scope and ignore them entirely.

---

## 3. Commit Format (Commitizen Convention)

```
<type>(<scope>): <subject>

[body — Optional]

[footer — Optional]
```

### Type Mapping Table

| Type | Use Case |
|:---|:---|
| `feat` | New features, pages, API integrations, UI components, environment templates |
| `fix` | Bug fixes, visual styling adjustments, logic corrections |
| `refactor` | Component refactoring, code formatting, dead code removal |
| `chore` | Dependency updates, `.env` file maintenance, script renaming |
| `docs` | README updates, API documentation, environment variable guides |

### Scope Rules

- Use lowercase module/component names: `auth`, `middleware`, `api`, `db`
- Separate multiple scopes with commas: `(app, lib/footer)`
- Path-based scopes are acceptable: `lib/server-util`

### Subject Language Rules

| Nature of Changes | Language | Example |
|:---|:---|:---|
| Functional changes | **Traditional Chinese** | `新增共用元件 dialog` |
| Technical / Code naming | **English** | `update import paths for OAuthConfig` |
| Mixed changes | Determine by primary intent, Chinese takes priority | — |

- Begin directly with a verb; do not end the subject with a period.

---

## 4. Execution Flow (Strict Order Required)

```
1. Run git diff --cached → Analyze changes.
2. Print the proposed commit message inside a fenced code block.
3. Ask the user: "Confirm to execute commit?"
4. Act based on the response:
   - User approves (e.g., "OK", "yes", "do it") → Run git commit -m "..."
   - User requests changes → Revise the message immediately, reprint the code block, and ask again.
   - User declines (e.g., "no", "cancel") → Halt the flow without committing.
```

**IMPORTANT: Never execute `git commit` before the user explicitly confirms.**

---

## 5. Technical Execution Standards

```bash
# ✅ Correct (Single-line message)
git commit -m "feat(auth): 新增 JWT 驗證中介層"

# ✅ Correct (Multi-line message with body using ANSI-C quoting)
git commit -m $'feat(auth): 新增 JWT 驗證中介層\n\n- 實作 verifyToken middleware\n- 整合至 /api 路由'

# ❌ Prohibited: Using HEREDOC or subshell substitutions (causes .git/index.lock conflicts)
git commit -m "$(cat <<'EOF'
subject

body
EOF
)"
```

**No trailers allowed**: Do not append `Co-Authored-By: Claude ...` or any AI signature lines to the commit message.

---

## 6. Output Rules

- Always generate a single commit message regardless of change volume.
- Only if changes are **clearly unrelated** (e.g., a bug fix mixed with a new feature), append a one-liner suggestion:
  > "You can also split this into 2 commits. Would you like a reference?"
  > Keep it brief; do not explain in detail.

---

## 7. Commit Examples

```
feat(app, lib/footer): 新增 Footer warningList props 支援客製化警告列表

fix(auth): 修正登入頁 Token 過期後未自動導回的問題

refactor(app): 建立 icon item 元件並替換重複程式碼

chore(env): 更新 .env.example，補充 REDIS_URL 欄位說明

docs(api): 更新注單查詢 API 的 response 欄位定義
```

---

## 8. Anti-patterns

| ❌ DON'T | ✅ DO |
|:---|:---|
| Run `git add .` or `git commit -a` autonomously | Commit only what is already staged. |
| Describe unstaged files in the commit body | Ignore unstaged files completely; analyze `git diff --cached` only. |
| Append `Co-Authored-By: Claude ...` | Keep commit messages strictly in Commitizen format with no trailers. |
| Use HEREDOC syntax for multi-line commits | Use `-m` flag or ANSI-C quote formatting (`$'...\n...'`). |
| Commit immediately upon vague user feedback | Wait for explicit confirmation keywords. |
