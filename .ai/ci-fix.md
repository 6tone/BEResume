---
name: ci-fix
description: Diagnose and fix failing CI pipeline jobs by reading logs, identifying root causes, and applying targeted fixes. Use when CI checks are failing on a PR or branch, when tests pass locally but fail in CI, or when asked to "fix CI", "make the pipeline green", or "unblock the PR".
---

# CI Fix — Pipeline Failure Diagnosis & Resolution

---

## 1. Trigger Conditions

- "CI is failing", "fix the pipeline", "make it green", "unblock the PR"
- A PR is blocked due to failing checks
- Tests pass locally but fail in the CI environment

---

## 2. Diagnosis Flow (Always in This Order)

```
Step 1: Read the CI log
    └─ Identify the failing job name (e.g., "test", "lint", "build")

Step 2: Classify the failure type
    ├─ Test failure       → Section 3
    ├─ Lint / format error → Section 4
    ├─ Build error        → Section 5
    └─ Environment error  → Section 6
```

**Never guess the fix without reading the actual CI log first.**

---

## 3. Test Failure Resolution

### 3a. Read the failing test output

```bash
# Reproduce locally first
npm test -- --verbose 2>&1 | head -100

# Run only the failing test file
npx jest path/to/failing.test.js --verbose
```

### 3b. Common causes & fixes

| CI Log Pattern | Root Cause | Fix |
|:---|:---|:---|
| `Cannot connect to MongoDB` | Test DB not configured in CI env | Add `MONGO_URI` to CI secrets/env vars |
| `Nock: No match for request` | Real HTTP call attempted in test | Add nock mock for the missing request |
| `Timeout exceeded` | `afterAll` not closing DB connection | Add `await mongoose.disconnect()` to teardown |
| `Expected X, received undefined` | Mock return shape mismatch | Check `.mockResolvedValue()` structure |
| `ECONNREFUSED 127.0.0.1:6379` | Redis not available in CI | Add Redis service to CI config (see 3c) |

### 3c. Adding services to CI

**GitHub Actions** (`.github/workflows/test.yml`):
```yaml
services:
  mongodb:
    image: mongo:6
    ports:
      - 27017:27017
  redis:
    image: redis:7
    ports:
      - 6379:6379
```

**GitLab CI** (`.gitlab-ci.yml`):
```yaml
test:
  services:
    - mongo:6
    - redis:7
  variables:
    MONGO_URI: mongodb://localhost:27017/testdb
    REDIS_URL: redis://localhost:6379
```

---

## 4. Lint / Format Error Resolution

```bash
# Run lint locally to reproduce
npm run lint

# Auto-fix fixable issues
npm run lint -- --fix

# Run prettier check
npx prettier --check "src/**/*.js"

# Auto-fix prettier
npx prettier --write "src/**/*.js"
```

**After fixing**: Commit only the formatting changes separately:
```bash
git add -p  # Stage selectively
# Use type: fix or chore for lint-only commits
git commit -m "chore(lint): 修正 ESLint 警告與 Prettier 格式"
```

---

## 5. Build Error Resolution

```bash
# Reproduce locally
npm run build 2>&1 | head -50
```

| CI Log Pattern | Root Cause | Fix |
|:---|:---|:---|
| `Module not found` | Import path incorrect or missing dep | Check file path, run `npm install` |
| `SyntaxError: Unexpected token` | Node version mismatch | Align CI Node version with local (check `.nvmrc`) |
| `Cannot find module 'X'` | Dependency not in `package.json` | Run `npm install X --save` and commit `package.json` |
| `Heap out of memory` | Bundle too large for CI runner | Add `NODE_OPTIONS=--max-old-space-size=4096` to CI env |

---

## 6. Environment / Configuration Errors

```bash
# Common pattern in CI log:
# Error: Missing required environment variable: JWT_SECRET
```

**Resolution checklist:**
1. Check `.env.example` — is the variable documented?
2. Add the variable to CI secrets (GitHub: Settings → Secrets → Actions)
3. Reference it in the CI workflow file:
   ```yaml
   env:
     JWT_SECRET: ${{ secrets.JWT_SECRET }}
     NODE_ENV: test
   ```
4. **Never hardcode secrets in workflow files** — always use `${{ secrets.VAR_NAME }}`

---

## 7. "Passes Locally, Fails in CI" Checklist

Work through this list before guessing:

- [ ] Node version matches? Check `.nvmrc` vs CI `node-version`
- [ ] All env variables present in CI secrets?
- [ ] `npm ci` used instead of `npm install` in CI? (`npm ci` is deterministic)
- [ ] Test database configured and reachable in CI?
- [ ] Any `console.log` or `nock.recorder.rec()` left in test files?
- [ ] File paths case-sensitive? (macOS is case-insensitive, Linux CI is not)
- [ ] Any `test.only` or `describe.only` that skips required setup tests?

---

## 8. After Fixing

```bash
# Verify fix locally before pushing
npm test
npm run lint
npm run build  # if applicable

# Commit the fix
git add -p
# Propose commit message following git-commit.md conventions
# Example: fix(ci): 補充 Redis service 設定至 GitHub Actions workflow
```

**Then push to trigger CI again — do not force push.**

---

## 9. Anti-patterns

| ❌ DON'T | ✅ DO |
|:---|:---|
| Guess the fix without reading CI logs | Always read the actual failure output first |
| `test.skip` failing tests to pass CI | Fix the root cause |
| Hardcode secrets in workflow files | Use `${{ secrets.VAR_NAME }}` |
| `git push -f` to "retry" CI | Push a proper fix commit |
| Fix lint and logic in the same commit | Separate commits for lint vs logic changes |
