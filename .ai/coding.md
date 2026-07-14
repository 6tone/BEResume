---
name: coding-standards
description: Apply universal coding conventions, naming rules, error handling patterns, and quality standards. Use when writing new functions, refactoring existing code, adding API endpoints, handling async operations, or reviewing naming consistency.
---

# Coding — Coding Standards

This document defines the universal coding conventions, naming rules, and quality standards.

---

## 1. Strict Layered Architecture

```
Request → Controller → Service → [Repository → DB]
```

| Layer | Allowed Operations | Strict Prohibitions |
|:---|:---|:---|
| Controller | Input validation, Service invocation, HTTP responses | Writing business logic, directly querying the DB |
| Service | Business logic, coordinating multiple Repositories | Direct interaction with HTTP `req`/`res` objects |
| Repository | Database query encapsulation | Containing business logic checks |

---

## 2. Single Responsibility Principle (SRP)

- Functions/Methods: Maximum **50–80 lines**. If it exceeds this, you **must** extract private helper functions. No exceptions are allowed for "keeping the flow together."
- React Components: Avoid deep nesting (extract sub-components if JSX nesting exceeds 3 levels).
- Each file must handle a single concept (e.g., one Service handles one domain).

---

## 3. Global Error Handling

**Avoid scattered `try-catch` blocks** in controllers. Route errors through a global error handler middleware:

```js
// ✅ Correct: Use an asyncHandler wrapper
// 📌 Replace '[PROJECT_UTIL_DIR]' with your actual util path (e.g., '../lib/errorHandler')
const asyncHandler = require('../[PROJECT_UTIL_DIR]/errorHandler');

router.get('/users', asyncHandler(async (req, res) => {
  const users = await UserService.getAll();
  res.json({ success: true, data: users });
}));

// Throw a semantic AppError when business rules are violated
throw new AppError('INSUFFICIENT_BALANCE', 400);
```

---

## 4. Semantic State Declaration (No Mathematical Shortcuts)

When dealing with business states (such as win/loss outcomes, order status, or transaction types), **you must explicitly declare semantic variables**:

```js
// ❌ Prohibited: Using mathematical shortcuts to infer business status
if (amount > 0) { /* Guessing it is a win? */ }

// ✅ Required: Explicit boolean flags or string status codes
const isWin = settlement.result === 'WIN';
const isRefund = settlement.result === 'DRAW';
if (isWin) { /* ... */ }
```

**Rule**: Future state additions (e.g., "draw and refund") should not break existing conditional logic.

---

## 5. Naming Conventions

| Type | Format | Example |
|:---|:---|:---|
| Variables / Functions | `camelCase` | `getUserBalance` |
| Classes / React Components | `PascalCase` | `UserService`, `LoginButton` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| File Names (JS services) | `camelCase.js` | `userService.js` |
| Prohibited | Vague names | ~~`data`~~, ~~`obj`~~, ~~`temp`~~ |

---

## 6. Network Request Conventions

- **Strictly Prohibited**: Using global `axios` or raw `fetch` directly.

```js
// ✅ Frontend: Use a unified apiClient with token injection and 401 interceptors
import apiClient from '../services/apiClient';
const data = await apiClient.get('/api/users');

// ✅ Backend: Use a factory function to prevent token leakage across users
const client = createClient(req.headers.authorization);
const result = await client.post('/upstream/api', payload);

// ❌ Prohibited: Global axios defaults containing previous user tokens
axios.defaults.headers.common['Authorization'] = token; // Dangerous!
```

---

## 7. Loops & Collection Operations

Before executing `forEach` or `map` on arrays, **always verify that the target is a valid array**:

```js
// ✅ Correct
if (Array.isArray(orders) && orders.length > 0) {
  orders.forEach(order => settle(order));
}
```

---

## 8. Asynchronous Flow Rules

- Use `async/await` exclusively. Do not mix `.then().catch()` chains with `async/await` syntax.
- Use `Promise.all()` only for parallel operations that have no execution dependencies. Use sequential `await` statements for dependent steps.

---

## 9. React / Frontend Component Rules

### 9-1. Hooks Usage

```js
// ✅ Correct: Always declare full dependency array
useEffect(() => {
  fetchUserData(userId);
}, [userId]); // Declare every reactive value used inside

// ❌ Prohibited: Empty dependency array when the effect uses reactive values
useEffect(() => {
  fetchUserData(userId); // userId is reactive but missing from deps!
}, []);

// ✅ Correct: Custom Hook naming must start with "use"
function useAuthToken() { ... }

// ❌ Prohibited: Non-prefixed custom hooks
function getAuthToken() { ... } // Not recognized as a Hook by linters/React
```

### 9-2. State Management Boundary

| State Type | Where to Store | Example |
|:---|:---|:---|
| UI-local (toggle, hover, form input) | `useState` in component | modal open/close |
| Shared across sibling components | Lift to nearest common parent | selected tab |
| Global / cross-page | Context or external store (Redux/Zustand) | auth user, cart |

**Rule**: Do not reach for global state until local `useState` + prop drilling becomes genuinely painful (more than 2 levels deep).

### 9-3. Props Discipline

```js
// ✅ Correct: Define PropTypes or TypeScript interface at top of file
import PropTypes from 'prop-types';

UserCard.propTypes = {
  userId: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

// ❌ Prohibited: Spreading unknown props onto DOM elements
const Button = ({ ...props }) => <button {...props} />; // Leaks unknown attributes to DOM
```

### 9-4. Async in Effects

```js
// ✅ Correct: Define async function inside useEffect, call it immediately
useEffect(() => {
  async function loadData() {
    const data = await fetchData();
    setData(data);
  }
  loadData();
}, []);

// ❌ Prohibited: Making the useEffect callback itself async
useEffect(async () => { ... }, []); // Returns a Promise, breaks cleanup
```

