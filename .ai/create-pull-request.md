---
name: create-pull-request
description: Generate a structured pull request from staged commits including title, body, and checklist. Use when the user has commits ready to push and wants to open a PR, or when asked to "open a PR", "submit for review", or "push and PR".
---

# Create Pull Request — PR Workflow

---

## 1. Trigger Conditions

**Wait for explicit intent before executing any push or PR command.**

Common trigger expressions:
- "open a PR", "submit for review", "push and PR", "prepare PR", "create pull request"
- After a `git commit`, if the user says "push" — treat this as PR intent

---

## 2. Pre-flight Checks (Run in Order)

```bash
# Step 1: Verify you are NOT on main/master
git branch --show-current
# If on main/master → STOP. Ask the user which branch to use.

# Step 2: Check for unpushed commits
git log origin/$(git branch --show-current)..HEAD --oneline
# If empty → nothing to push. Inform user.

# Step 3: Check for uncommitted changes
git status --short
# If dirty → remind user to commit first (do NOT auto-stage)
```

---

## 3. Push to Remote

```bash
# Push current branch (first time: set upstream)
git push -u origin $(git branch --show-current)

# Subsequent pushes
git push
```

> ⚠️ `git push --force` / `git push -f` is **strictly prohibited**. If push is rejected, report the conflict and ask the user how to proceed.

---

## 4. PR Title Format

Follow the same Commitizen convention as `git-commit`:

```
<type>(<scope>): <subject>
```

| Type | Use Case |
|:---|:---|
| `feat` | New feature or API integration |
| `fix` | Bug fix |
| `refactor` | Restructuring without behavior change |
| `chore` | Dependency update, config change |
| `docs` | Documentation only |

**Subject language**: Traditional Chinese for functional changes, English for technical naming.

**Examples:**
```
feat(auth): 新增 JWT 過期自動登出機制
fix(bet): 修正押注金額為零時未回傳錯誤的問題
refactor(api): 拆分 oneApiService 為 debit / payout 雙函式
```

---

## 5. PR Body Template

Always generate a PR body using this structure:

```markdown
## Summary

<!-- 1-3 sentences describing what this PR does and why -->

## Changes

- 
- 
- 

## Testing

- [ ] Unit tests added / updated
- [ ] Integration tests pass (`npm test`)
- [ ] Tested manually on local dev server

## Notes

<!-- Breaking changes, migration steps, or reviewer notes (delete if none) -->
```

---

## 6. Execution Flow

```
1. Run pre-flight checks (branch, unpushed commits, dirty state)
2. Print proposed PR title in a fenced code block
3. Print proposed PR body in a fenced code block
4. Ask: "Confirm push and open PR?"
5a. User approves → git push, then output GitHub CLI command or PR URL
5b. User requests changes → Revise, reprint, ask again
5c. User declines → Halt without pushing
```

**IMPORTANT: Never execute `git push` before explicit user confirmation.**

---

## 7. GitHub CLI (Optional, If gh is Installed)

### Windows PowerShell (Primary)

```powershell
# Check if gh is available
gh --version

# Step 1: Get current branch name (must store in variable — inline subexpression does NOT work in PowerShell)
$currentBranch = git branch --show-current

# Step 2: Write the PR body to a temp file
$prBody | Out-File -FilePath "$env:TEMP\pr_body.md" -Encoding utf8

# Step 3: Create PR using --body-file (avoids shell quoting issues)
gh pr create `
  --title "feat(auth): 新增 JWT 過期自動登出機制" `
  --body-file "$env:TEMP\pr_body.md" `
  --base main `
  --head $currentBranch

# Step 4: Clean up temp file immediately after
Remove-Item "$env:TEMP\pr_body.md"
```

### Linux / macOS / Git Bash Equivalent

```bash
# Check if gh is available
gh --version

# Step 1: Write the PR body to a temp file (uses workspace scratch dir or /tmp)
cat > ./scratch_pr_body.md << 'EOF'
[paste the generated PR body here]
EOF

# Step 2: Create PR
gh pr create \
  --title "feat(auth): 新增 JWT 過期自動登出機制" \
  --body-file ./scratch_pr_body.md \
  --base main \
  --head $(git branch --show-current)

# Step 3: Clean up
rm ./scratch_pr_body.md
```

If `gh` is not installed, output the PR title + body as a formatted code block for the user to paste manually.

---

## 8. GitLab MR (If Using GitLab)

### Detect Platform

```bash
# Check remote URL to determine platform
git remote get-url origin
# Contains "github.com" → use gh CLI (Section 7)
# Contains "gitlab.com" or self-hosted GitLab → use glab CLI (below)
```

### Windows PowerShell (glab CLI)

```powershell
# Check if glab is available
glab --version

# Step 1: Get current branch name (must store in variable — inline subexpression does NOT work in PowerShell)
$currentBranch = git branch --show-current

# Step 2: Write the MR body to a temp file
$mrBody | Out-File -FilePath "$env:TEMP\mr_body.md" -Encoding utf8

# Step 3: Create MR using glab
glab mr create `
  --title "feat(auth): 新增 JWT 過期自動登出機制" `
  --description-file "$env:TEMP\mr_body.md" `
  --target-branch main `
  --source-branch $currentBranch `
  --remove-source-branch

# Step 4: Clean up
Remove-Item "$env:TEMP\mr_body.md"
```

### Linux / macOS / Git Bash

```bash
glab mr create \
  --title "feat(auth): 新增 JWT 過期自動登出機制" \
  --description-file ./scratch_mr_body.md \
  --target-branch main \
  --source-branch $(git branch --show-current) \
  --remove-source-branch

rm ./scratch_mr_body.md
```

If `glab` is not installed, output the MR title + body as a formatted code block for the user to paste manually into the GitLab UI.

---

## 9. Anti-patterns

| ❌ DON'T | ✅ DO |
|:---|:---|
| `git push -f` to resolve conflicts | Report conflict, ask user to resolve |
| Auto-push without confirmation | Always confirm before push |
| Push directly to `main`/`master` | Ensure feature branch is active |
| Skip pre-flight checks | Always run Steps 1-3 first |
| Leave PR body empty | Always generate title + body from commits |
