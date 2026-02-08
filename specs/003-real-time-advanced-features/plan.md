# Architectural Plan: Real-time & Advanced Features (Phase-3)

## Proposed Changes

### Backend Enhancements
- Integrate **Redis** as a message broker and cache layer.
- Implement **WebSocket** endpoints in FastAPI.
- Add **Celery** for background email notifications.
- Update Database models to include `priority`, `category`, `due_date`, and `parent_id` (for subtasks).

### Frontend Enhancements
- Implement a WebSocket client (e.g., using `socket.io-client` or native WebSockets).
- Add UI components for Priorities, Tags, and Due Date pickers.
- Implement a Notification bell and drawer.

## Implementation Steps
1. Setup Redis container in `docker-compose.yml`.
2. Update SQL models and run Alembic migrations.
3. Implement WebSocket manager in Backend.
4. Integrate WebSocket context in Frontend.
