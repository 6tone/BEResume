---
name: testing
description: Write, run, and debug tests following AAA structure with proper mocking and coverage targets. Use when adding new features that require tests, fixing failing tests, setting up the test environment, or determining which test type to write for a given scenario.
---

# Testing — Testing Execution Handbook

---

## 1. Decision Tree: Choosing Your Test Type

```
What are you testing?
│
├─ An API route / HTTP endpoint?
│   └─ → Integration Test (supertest + nock)
│
├─ A pure function / computation / state machine?
│   └─ → Unit Test (jest)
│
├─ A critical user flow (login → action → result)?
│   └─ → E2E Test (Playwright or supertest chain)
│
└─ A simple CRUD proxy pass-through?
    └─ → Skip. Write 1 happy-path integration test only.
         Over-testing proxies wastes maintenance budget.
```

**Priority order**: Integration > Unit > E2E

---

## 2. Environment Setup (Run Once)

### Required files

```bash
# 1. Create test env file (NEVER use .env.production)
cp .env .env.test
# Edit .env.test: point DB_URI to test DB, set NODE_ENV=test

# 2. Verify jest config in package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFiles": ["dotenv/config"],
    "setupFilesAfterEnv": ["./tests/setup.js"]
  }
}
```

### Test setup file (`tests/setup.js`)

```js
// Connect to test DB before all tests, disconnect after
// (Note: This template is for Mongoose/MongoDB. Replace with your DB driver setup if using another DB, or remove if the project is stateless / HAS_DATABASE = false)
const mongoose = require('mongoose');

beforeAll(async () => {
  if (process.env.DB_URI) {
    await mongoose.connect(process.env.DB_URI);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase(); // Clean slate
    } catch (err) {
      // Ignore if dropDatabase is not supported/needed
    }
    await mongoose.disconnect();
  }
});
```

---

## 3. Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Run a single file
npx jest userService.test.js

# Run tests matching a name pattern
npx jest --testNamePattern="should return token"

# Run with coverage report
npm run test:coverage

# Run only integration tests
npx jest tests/integration/
```

---

## 4. Arrange-Act-Assert (AAA) Structure

All tests **must** follow AAA with blank lines separating the three phases:

```js
describe('UserService.login', () => {
  it('should return token when credentials are valid', async () => {
    // Arrange
    const mockUser = { username: 'testUser', passwordHash: 'hashed' };
    jest.spyOn(UserModel, 'findOne').mockResolvedValue(mockUser);

    // Act
    const result = await UserService.login('testUser', 'plainPassword');

    // Assert
    expect(result.token).toBeDefined();
    expect(result.userId).toBe(mockUser._id);
  });
});
```

---

## 5. Integration Test Pattern (API Routes)

Use `supertest` for HTTP-level testing. Always test both happy path and error path.

```js
const request = require('supertest');
const nock = require('nock');
const app = require('../../src/app');

describe('POST /api/bet', () => {
  afterEach(() => {
    nock.cleanAll(); // Reset HTTP mocks after each test
  });

  it('should place bet and return betId', async () => {
    // Arrange: Mock upstream API
    nock('https://upstream-api.com')
      .post('/bet/place')
      .reply(200, { betId: 'abc123', status: 'PLACED' });

    // Act
    const res = await request(app)
      .post('/api/bet')
      .set('Authorization', 'Bearer valid-token')
      .send({ gameId: 'g001', amount: 100, selection: 'BIG' });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.betId).toBe('abc123');
  });

  it('should return 502 when upstream API fails', async () => {
    // Arrange: Simulate upstream failure
    nock('https://upstream-api.com')
      .post('/bet/place')
      .reply(500, { error: 'Internal Server Error' });

    // Act
    const res = await request(app)
      .post('/api/bet')
      .set('Authorization', 'Bearer valid-token')
      .send({ gameId: 'g001', amount: 100, selection: 'BIG' });

    // Assert — should map upstream 500 to 502 Bad Gateway
    expect(res.status).toBe(502);
  });
});
```

---

## 6. Unit Test Pattern (Services / Pure Functions)

Mock at the boundary — mock the dependency, not the unit under test.

```js
const SettlementService = require('../../src/services/settlementService');
const BetModel = require('../../src/models/betModel');

describe('SettlementService.settle', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Always restore after each test
  });

  it('should mark order as WIN when result matches', async () => {
    // Arrange
    const mockBet = { _id: 'bet001', selection: 'BIG', amount: 100 };
    jest.spyOn(BetModel, 'findById').mockResolvedValue(mockBet);
    jest.spyOn(BetModel, 'findByIdAndUpdate').mockResolvedValue({ ...mockBet, result: 'WIN', payout: 190 });

    // Act
    const result = await SettlementService.settle('bet001', { outcome: 'BIG', total: 15 });

    // Assert
    expect(result.result).toBe('WIN');
    expect(result.payout).toBe(190);
  });

  it('should refund bet when outcome is a push/draw', async () => {
    // Arrange
    const mockBet = { _id: 'bet002', selection: 'BIG', amount: 100 };
    jest.spyOn(BetModel, 'findById').mockResolvedValue(mockBet);
    jest.spyOn(BetModel, 'findByIdAndUpdate').mockResolvedValue({ ...mockBet, result: 'DRAW', payout: 100 });

    // Act
    const result = await SettlementService.settle('bet002', { outcome: 'PUSH', total: 20 });

    // Assert
    expect(result.result).toBe('DRAW');
    expect(result.payout).toBe(mockBet.amount); // Full refund
  });
});
```

---

## 7. Mocking Principles

| Scenario | Tool | Rule |
|:---|:---|:---|
| External HTTP API calls | `nock` | Mock at network level, not at the service layer |
| Internal module methods | `jest.spyOn()` | Prefer spyOn over jest.mock() for better restore control |
| Full module mock | `jest.mock('../../src/models/...')` | Only when spyOn is insufficient |
| Timers / Date | `jest.useFakeTimers()` | Always restore with `jest.useRealTimers()` after |

**Critical rules:**
- Always call `nock.cleanAll()` or `jest.restoreAllMocks()` in `afterEach`
- Simulate **error scenarios**, not just the happy path
- **Do NOT over-mock internal services** in integration tests — that defeats validation

---

## 8. Debugging Failing Tests

```bash
# Step 1: Run in verbose mode to see each test's name
npx jest --verbose

# Step 2: Run only the failing test file
npx jest path/to/failing.test.js

# Step 3: Add --detectOpenHandles if tests hang after completion
npx jest --detectOpenHandles

# Step 4: Check if nock is blocking real HTTP calls
# Add this temporarily at the top of the test file:
nock.recorder.rec(); // Records real HTTP requests for debugging

# Step 5: Print nock's interceptor list to verify mocks are set up
console.log(nock.pendingMocks());
```

**Common failure patterns:**

| Symptom | Likely Cause | Fix |
|:---|:---|:---|
| Test hangs indefinitely | DB connection not closed | Check `afterAll(mongoose.disconnect)` |
| `Nock: No match for request` | Mock URL mismatch | Log `req.path` and compare with nock path |
| Flaky tests (pass sometimes) | Shared state between tests | Add `afterEach(() => jest.restoreAllMocks())` |
| `Cannot read properties of undefined` | Mock not returning correct shape | Verify `.mockResolvedValue(...)` return shape |

---

## 9. Test Naming Conventions

```js
// describe: Name of the module or function being tested
describe('SettlementService.settle', () => {

  // it: "should [expected behavior] when [condition]"
  it('should mark order as WIN when draw result matches bet numbers', async () => { ... });
  it('should mark order as LOSE when no numbers match', async () => { ... });
  it('should refund bet when draw result is a push/draw', async () => { ... });
  it('should throw AppError when bet is not found', async () => { ... });
});
```

---

## 10. Coverage Requirements

| Module Type | Requirement |
|:---|:---|
| Balance mutations, settlements, debit/payout logic | **90%+ branch + statement coverage** |
| API Routes (CRUD) | Minimum: 1 happy path + 1 error path |
| Utilities (`lib/`) | All critical paths and edge cases |
| Frontend UI Components | Interactive behaviors (clicks, inputs); visual-only is optional |

```bash
# Check coverage report
npm run test:coverage
# Open: coverage/lcov-report/index.html
```

---

## 11. Test File Placement Rules

```
project/
├── src/
│   ├── services/
│   │   ├── userService.js
│   │   └── userService.test.js      ← Unit test: co-located
│   └── lib/
│       └── encryption.test.js       ← Unit test: co-located
└── tests/
    └── integration/
        ├── auth.test.js              ← Integration: centralized
        └── bet.test.js              ← Integration: centralized
```

- **Unit tests**: Co-located next to target files (or `__tests__/` subfolder)
- **Integration tests**: Centralized under `tests/integration/`
- Test files must use `.test.js` or `.spec.js` suffix
- **CI rule**: Test failures block merging. `test.skip` is strictly prohibited in production branches.
