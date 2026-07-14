---
name: glossary
description: Project-specific terminology glossary. Defines domain terms, status codes, and module boundaries to ensure consistent naming across AI-generated code and human-written code. Read this file when encountering unfamiliar domain terms or when naming new concepts.
---

# Glossary — Project Terminology

> 📌 **Instructions**: Replace all `[...]` placeholders with your project's actual terms.
> Keep this file updated whenever a new domain concept is introduced.

---

## Domain Terms

| Term | Definition | Module / Owner |
|:---|:---|:---|
| `[TERM_1]` | [What it means in this project's context] | `[services/xxx]` |
| `[TERM_2]` | [What it means in this project's context] | `[models/xxx]` |
| `[TERM_3]` | [What it means in this project's context] | `[routes/xxx]` |

**Example** (delete after filling in):

| Term | Definition | Module / Owner |
|:---|:---|:---|
| `Bet` | A single wager placed by a user on a game round | `services/betService` |
| `Settlement` | The process of calculating and distributing payouts after a round closes | `services/settlementService` |
| `Debit` | Deducting funds from user wallet before a bet is confirmed | `services/walletService` |

---

## Status / State Codes

| Code | Meaning | Used In |
|:---|:---|:---|
| `[STATUS_1]` | [Description] | `[Model / API field]` |
| `[STATUS_2]` | [Description] | `[Model / API field]` |

**Example** (delete after filling in):

| Code | Meaning | Used In |
|:---|:---|:---|
| `PENDING` | Bet placed, awaiting round result | `BetModel.status` |
| `WIN` | Bet won; payout issued | `BetModel.result` |
| `LOSE` | Bet lost; no payout | `BetModel.result` |
| `DRAW` | Round voided; bet refunded | `BetModel.result` |

---

## Abbreviations & Acronyms

| Abbreviation | Full Form | Notes |
|:---|:---|:---|
| `[ABBR_1]` | [Full form] | [When to use] |
| `[ABBR_2]` | [Full form] | [When to use] |

**Example** (delete after filling in):

| Abbreviation | Full Form | Notes |
|:---|:---|:---|
| `BFF` | Backend For Frontend | Used for proxy-only backends with no DB |
| `PII` | Personally Identifiable Information | Must be masked in all logs |
| `CWV` | Core Web Vitals | LCP, INP, CLS — see `web-performance-audit.md` |

---

## Naming Conflicts / Disambiguation

> List terms that sound similar but have different meanings to prevent confusion.

| Term A | Term B | Difference |
|:---|:---|:---|
| `[TERM_A]` | `[TERM_B]` | [How they differ] |

---

## Version History

| Version | Date | Description |
|:---|:---|:---|
| v1.0 | [YYYY-MM-DD] | Initial glossary created |
