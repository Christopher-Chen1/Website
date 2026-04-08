# AGENTS.md

## Project Overview

This repository contains two parts:

Frontend:
- Path: /frontEnd/react_vite
- Stack: React + Vite + TypeScript

Backend:
- Path: /backEnd
- Stack: Node.js + Express
- Entry: app.js

---

## General Rules

- Only modify code related to the current task
- Do NOT refactor unrelated files
- Do NOT fix legacy issues unless explicitly requested
- Keep changes minimal and scoped
- Preserve existing structure and naming

---

## Critical Workflow

Before making ANY code changes:

1. Identify scope:
   - frontend / backend / both
2. Setup environment
3. Validate baseline (build or run)

---

## Frontend Setup

Always run:

cd /workspace/Website/frontEnd/react_vite
npm ci || npm install

Then verify:

npm run build

---

## Frontend Rules

- Build MUST pass before finishing task
- Do NOT introduce TypeScript errors
- Remove unused imports/variables if blocking build
- Do NOT add dependencies unless necessary

---

## Backend Setup

Always run:

cd /workspace/Website/backEnd
npm ci || npm install

Run server:

npm run start

For dev:

npm run dev

---

## Backend Rules

- Keep app.js as entry
- Do NOT change startup structure unless required
- Do NOT hardcode:
  - database config
  - credentials
  - API keys
- Respect dotenv usage
- Be careful with mssql and file upload logic

---

## Dependency Rules

- Prefer existing dependencies
- Do NOT randomly upgrade versions
- Do NOT remove dependencies unless safe
- If adding dependency:
  - explain why
  - update package.json

---

## Environment Notes

Codex runs in cloud environment:

- dependencies may NOT be installed
- env variables may be missing
- Node/npm version may differ

Always install dependencies before build/run

---

## Error Classification

When errors occur, classify first:

1. Environment issue
   - missing dependencies
   - missing env
2. Pre-existing issue
   - existing TS errors
   - historical problems
3. Current task issue

Do NOT treat (1)(2) as caused by current task

---

## Scope Control

- Frontend task → do NOT change backend
- Backend task → do NOT change frontend
- Full-stack → keep API changes minimal

---

## Code Style

- Prefer small targeted changes
- Keep naming consistent
- Avoid dead code
- Avoid unused variables/imports

---

## Validation

If frontend changed:

cd /workspace/Website/frontEnd/react_vite
npm run build

If backend changed:

cd /workspace/Website/backEnd
npm run start

---

## Completion Checklist

- Correct scope handled
- Dependencies installed
- Frontend build passes (if modified)
- Backend runs (if modified)
- No unrelated files changed
- No unnecessary dependencies added
- No secrets hardcoded

---

## Important

- If local works but cloud fails → environment issue first
- If error existed before → not current task
- When unsure → minimal safe change
- Do NOT continue coding if validation fails