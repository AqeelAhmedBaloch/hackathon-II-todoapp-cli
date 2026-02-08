# Tasks: Real-time & Advanced Features (Phase-3)

## Phase 1: Infrastructure & Data Model
- [x] T301 Add Redis service to `docker-compose.yml`.
- [x] T302 Update `Task` model with `priority`, `category`, `due_date`.
- [x] T303 Create migration for new task fields.
- [x] T304 Update Pydantic schemas for expanded Task model.

## Phase 2: Real-time Implementation
- [x] T305 Implement WebSocket manager in `backend/app/core/websockets.py`.
- [x] T306 Broadcast task changes (Create/Update/Delete) to connected users.
- [x] T307 Create `useWebSocket` hook in Frontend.

## Phase 3: Advanced UI Features
- [x] T308 Add Priority dropdown to TaskForm.
- [x] T309 Implement Category/Tag management.
- [x] T310 Add Due Date selector.
- [x] T311 Implement Subtasks UI logic.

## Phase 4: Notifications
- [ ] T312 Setup background worker for due date checks.
- [x] T313 Implement in-app notification component.
