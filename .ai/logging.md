---
name: logging
description: Apply structured logging conventions, log level strategies, PII masking rules, and error code design. Use when adding new log statements, designing error responses, setting up a logging library (Winston/Pino), or reviewing log output for sensitive data leakage.
---

# Logging — Structured Logging & Error Code Standards

This document defines universal logging conventions and error code design for all projects.

---

## 1. Log Level Strategy

Use the correct log level for every statement. Wrong levels pollute monitoring dashboards and obscure real incidents.

| Level | When to Use | Examples |
|:---|:---|:---|
| `error` | Unrecoverable failures; requires human attention | DB connection lost, uncaught exception, payment failure |
| `warn` | Recoverable but unexpected; track for patterns | Rate limit hit, deprecated API used, retry succeeded |
| `info` | Normal operational milestones | Server started, user logged in, job completed |
| `debug` | Developer diagnostics; **disabled in production** | Function entry/exit, intermediate values |
| `verbose` / `trace` | Deep tracing; **never in production** | Full request/response bodies, SQL queries |

```js
// ✅ Correct level usage
logger.info(`Server started on port ${PORT}`);
logger.warn(`Rate limit reached for IP: ${ip} — throttling`);
logger.error(`Failed to connect to DB: ${err.message}`, { stack: err.stack });

// ❌ Prohibited: Using console.log in production code
console.log('user data:', user); // Bypasses log level filtering and masking
```

> 📌 **Rule**: `console.log` / `console.error` are **strictly prohibited** in production source code. Use the project's configured logger instance exclusively.

---

## 2. Structured Log Format (JSON)

All logs **must** be structured JSON in production environments. Plain text logs are not machine-parseable.

### Required Fields

```json
{
  "level": "info",
  "timestamp": "2026-06-15T08:30:00.000Z",
  "service": "[PROJECT_NAME]",
  "requestId": "uuid-v4",
  "message": "User login successful",
  "userId": "u_12345"
}
```

| Field | Required | Description |
|:---|:---:|:---|
| `level` | ✅ | Log severity level |
| `timestamp` | ✅ | ISO 8601 UTC format |
| `service` | ✅ | Project/service name from `[PROJECT_NAME]` |
| `requestId` | ✅ | Unique per-request ID for log correlation |
| `message` | ✅ | Human-readable description |
| `userId` | When applicable | Non-sensitive user identifier (ID, not email) |
| `stack` | Error only | Stack trace for `error` level logs |

### Attaching requestId

```js
// In Express middleware — generate requestId at request entry point
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// In service layer — pass requestId through context, not global state
logger.info('Processing bet', { requestId: ctx.requestId, betId });
```

---

## 3. PII Masking Rules (Complete)

**Never log the following fields in plain text under any circumstances:**

| Data Type | Masking Rule | ✅ Correct Output |
|:---|:---|:---|
| Password / secret | Never log. Period. | *(omit entirely)* |
| JWT / session token | Log first 8 chars + `...` | `eyJhbGci...` |
| Full credit card | Mask all but last 4 digits | `****-****-****-1234` |
| Identity number | Mask middle digits | `A12****89` |
| Email address | Mask local part | `j***@example.com` |
| Phone number | Mask middle digits | `09**-***-678` |
| IP address | Log full in backend; mask in client-facing logs | `192.168.x.x` |

```js
// ✅ Correct masking utility
function maskToken(token) {
  if (!token || token.length < 8) return '[REDACTED]';
  return `${token.slice(0, 8)}...`;
}

function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
}

// ✅ Correct: Log only non-sensitive identifiers
logger.info('Login attempt', { username, ip });

// ❌ Prohibited: Any of these
logger.info('Login', { username, password });         // plaintext password
logger.info('Auth', { token });                       // full token
logger.debug('User record', { user });                // may contain PII fields
```

---

## 4. Error Code Design

All API error responses must use a **consistent error envelope** with a project-scoped error code:

### Response Envelope

```json
{
  "success": false,
  "code": "AUTH_TOKEN_EXPIRED",
  "message": "Your session has expired. Please log in again.",
  "requestId": "uuid-v4"
}
```

### Error Code Naming Convention

```
[DOMAIN]_[NOUN]_[CONDITION]
```

| Domain | Example Codes |
|:---|:---|
| `AUTH` | `AUTH_TOKEN_EXPIRED`, `AUTH_INVALID_CREDENTIALS`, `AUTH_SESSION_KICKED` |
| `BET` | `BET_INSUFFICIENT_BALANCE`, `BET_MARKET_CLOSED`, `BET_DUPLICATE_ORDER` |
| `USER` | `USER_NOT_FOUND`, `USER_ALREADY_EXISTS` |
| `SYSTEM` | `SYSTEM_DB_UNAVAILABLE`, `SYSTEM_UPSTREAM_TIMEOUT` |

### HTTP Status Code Mapping

| HTTP Status | When to Use |
|:---:|:---|
| `200` | Success |
| `400` | Client input validation failure |
| `401` | Authentication required / token invalid |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict (e.g., duplicate order) |
| `422` | Business rule violation (valid input, rejected by logic) |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error (never expose internal stack to client) |
| `502` | Upstream API / third-party service failure |
| `503` | Service temporarily unavailable |

```js
// ✅ Correct: AppError class with code + status
class AppError extends Error {
  constructor(code, statusCode, message) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

throw new AppError('BET_INSUFFICIENT_BALANCE', 422, 'Wallet balance is below the required bet amount.');
```

---

## 5. Logger Setup (Winston / Pino)

### Winston (Node.js)

```js
// lib/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: process.env.SERVICE_NAME || '[PROJECT_NAME]' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    })
  ],
});

module.exports = logger;
```

### Pino (Higher performance alternative)

```js
// lib/logger.js
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: '[PROJECT_NAME]' },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['req.headers.authorization', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
});

module.exports = logger;
```

> 📌 **Use Pino's `redact` option** as a safety net to catch any fields that slip through manual masking.

---

## 6. Anti-patterns

| ❌ DON'T | ✅ DO |
|:---|:---|
| `console.log(user)` in production | Use logger with proper level and masking |
| Log full JWT or password at any level | Mask or omit entirely |
| Use `logger.error` for 404s | 404 is a `warn` or `info` — it's not a server error |
| Log inside loops without sampling | Add a counter; log only first occurrence or aggregate |
| Different error shapes per route | Use a global error handler with consistent envelope |
| Expose `err.stack` in API response | Log stack internally; return only `code` + `message` to client |
