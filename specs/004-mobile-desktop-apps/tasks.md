# Tasks: AI & Mobile Integration (Phase-4)

## Phase 1: AI Integration (Backend)
- [ ] T401 Create `phase-4/backend/app/services/ai_service.py` for LLM interaction.
- [ ] T402 Implement `suggest_task_attributes(title: str) -> dict` in `ai_service.py`.
- [ ] T403 Create `phase-4/backend/app/routers/ai.py` with `POST /api/ai/suggest`.
- [ ] T404 Register AI router in `app/main.py`.

## Phase 2: PWA & Mobile Setup
- [ ] T405 Install `vite-plugin-pwa` in `phase-4/frontend`.
- [ ] T406 Configure `vite.config.ts` for PWA manifest and service worker.
- [ ] T407 Create app icons and place them in `public/icons/`.
- [ ] T408 Update `index.html` with theme-color meta tag.

## Phase 3: Frontend AI Features
- [ ] T409 Update `TaskForm.tsx` to include "Smart Suggest" functionality.
- [ ] T410 Implement UI to apply AI suggestions to task fields.
- [ ] T411 Add loading states and error handling for AI requests.

## Phase 4: Mobile Polish
- [ ] T412 Audit CSS for touch-friendliness (buttons, inputs).
- [ ] T413 Implement offline "Read-only" mode using cached data.
- [ ] T414 Test PWA installation on desktop/mobile.
