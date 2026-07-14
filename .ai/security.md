---
name: security-guidelines
description: Apply security requirements covering input validation, data masking, secrets management, CORS, rate limiting, and session protection. Use when adding authentication flows, handling user-sensitive data, configuring CORS policies, or installing third-party packages.
---

# Security — Security Guidelines

This document defines universal security requirements for all projects.

---

## 1. Input Validation & Injection Prevention

- The backend must perform sanitization on all incoming inputs (e.g., filtering for XSS, SQL injection, NoSQL injection).
- Immediately return a `400 Bad Request` if injection attempt patterns are detected; do not proceed with request processing.
- Downstream services or APIs handle complex business validations; the backend acts as the primary safety perimeter.

---

## 2. Data Masking & Logging Guidelines

PII (Personally Identifiable Information) or authentication tokens must NEVER appear in plain text in any logs.
Please refer to `logging.md` Section 3 for the complete PII masking rules and implementation guidelines.

```js
// ✅ Correct: Log non-sensitive identifiers only
logger.info(`User login attempt: ${username}`);

// ❌ Prohibited: Leaking token data
logger.info(`Login: ${username}, token: ${token}`);
```

---

## 3. Secrets Management

- **Strictly Prohibited**: Hardcoding API keys, external service URLs, or secrets in source code.
- Always load environment variables using `.env` files via `dotenv`.
- Ensure `.env` is listed in your `.gitignore` file (verify if it exists, or add it immediately).
- Provide a `.env.example` template containing keys with blank values.

```bash
# .env.example (Correct Template)
DB_URI=
JWT_SECRET=
THIRD_PARTY_API_KEY=
```

---

## 4. CORS Security

- Restrict access to trusted frontend domains. **Do not use wildcard origins (`origin: '*'`)**.
- Only expose custom headers that are absolutely necessary (e.g., `X-Server-Id`).

```js
// ✅ Correct
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));

// ❌ Prohibited
app.use(cors()); // Defaults to allowing all origins
```

---

## 5. HTTP Security Headers & Rate Limiting

- Use the `helmet` middleware to set standard HTTP security headers (CSP, HSTS, etc.).
- Implement rate limiting on sensitive, high-frequency, or resource-heavy routes:

| Route Type | Recommended Limit |
|:---|:---|
| `/login` / `/register` | 10 attempts per 15 minutes per IP |
| Public API Search | 60 requests per minute |
| High-frequency Webhooks | Set based on business volume requirements |

---

## 6. Session Exclusivity (Single Session Protection)

---

### 6-A. Stateful Services (HAS_DATABASE = true)

Required for systems enforcing single active session per user account:

**Backend Implementation**:
- Upon login, generate a unique `sessionId` (UUID) and store it in Redis with the `userId` as key. Older sessions automatically expire.
- On each authenticated request, verify the incoming token's `sessionId` matches the Redis record. If not, return `401 AUTH_SESSION_KICKED`.

**Frontend Implementation**:
- The frontend Axios interceptor detects a `401 AUTH_SESSION_KICKED` response:
  1. Clear the frontend `localStorage` tokens and user data.
  2. Force a full page reload and redirect the user to the login page.

---

### 6-B. Stateless Proxy / BFF (HAS_DATABASE = false)

> 📌 Do **not** use Redis session storage in stateless projects. Use the `X-Server-Id` header mechanism defined in `architecture.md` Section 3-B-3 instead.

- The backend generates a unique `X-Server-Id` (UUID) upon startup and attaches it to all HTTP responses.
- The frontend Axios interceptor monitors the `X-Server-Id` header.
- On `X-Server-Id` mismatch or `401 Unauthorized`:
  1. Clear the frontend `localStorage` tokens and user data.
  2. Force a `window.location.reload()` to redirect to the login page.

---

## 7. Package Security

- Review monthly download numbers and last update times before installing packages to avoid deprecated libraries.
- Periodically run `npm audit` to check for security vulnerabilities.
- Keep production dependencies (`dependencies`) strictly separated from build utilities (`devDependencies`).
