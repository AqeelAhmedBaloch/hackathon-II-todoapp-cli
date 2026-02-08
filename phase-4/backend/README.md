---
title: Todo App - Phase 3 Backend
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# Phase 3: Full-Stack Web Todo Application

This directory contains the final touches for Phase 2 of the Todo Application CLI (Web Evolution).

## Deployment Guide
Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## API Documentation
### Auth Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and receive JWT
- `GET /api/auth/me`: Get current user info

### Tasks Endpoints
- `GET /api/tasks`: List all tasks (supports `?completed=true/false`)
- `POST /api/tasks`: Create a new task
- `GET /api/tasks/{id}`: Get task details
- `PUT /api/tasks/{id}`: Update task
- `DELETE /api/tasks/{id}`: Delete task
- `PATCH /api/tasks/{id}/toggle`: Toggle task status
