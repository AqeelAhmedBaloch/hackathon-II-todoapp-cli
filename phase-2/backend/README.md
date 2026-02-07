---
title: Todo App Backend API
emoji: 📝
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# 📝 Todo App Backend API

A production-ready FastAPI backend for a full-stack Todo application with JWT authentication, PostgreSQL database, and comprehensive task management.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login
- **Task Management**: Full CRUD operations for tasks
- **PostgreSQL Database**: Robust data persistence with SQLAlchemy
- **RESTful API**: Clean and well-documented endpoints
- **CORS Enabled**: Ready for frontend integration
- **Health Checks**: Built-in monitoring endpoints
- **Production Ready**: Optimized Docker deployment

## 📚 API Documentation

Once deployed, visit:
- **Interactive Docs**: `/docs` (Swagger UI)
- **Alternative Docs**: `/redoc` (ReDoc)
- **Health Check**: `/health`

## 🔧 Environment Variables

Set these in your Hugging Face Space settings:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `JWT_SECRET_KEY` | ✅ Yes | Secret key for JWT tokens |
| `CORS_ORIGINS` | ⚠️ Recommended | Allowed frontend origins |
| `DEBUG` | ❌ Optional | Debug mode (default: false) |

### Example Configuration

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET_KEY=your-super-secret-key-here
CORS_ORIGINS=https://your-frontend.hf.space,http://localhost:5173
DEBUG=false
```

## 🏗️ Tech Stack

- **Framework**: FastAPI 0.115.6
- **Database**: PostgreSQL with SQLAlchemy 2.0
- **Authentication**: JWT with python-jose
- **Validation**: Pydantic 2.12
- **Server**: Uvicorn with async support

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Tasks
- `GET /tasks` - Get all user tasks
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### System
- `GET /` - API information
- `GET /health` - Health check endpoint

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- CORS protection
- Rate limiting ready
- SQL injection protection via SQLAlchemy ORM

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 📦 Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email
- `hashed_password`: Bcrypt hashed password
- `created_at`: Timestamp

### Tasks Table
- `id`: Primary key
- `title`: Task title
- `description`: Task details
- `completed`: Boolean status
- `user_id`: Foreign key to users
- `created_at`: Timestamp
- `updated_at`: Timestamp

## 🤝 Contributing

Built for Hackathon Q4 - Phase 2

## 📄 License

MIT License

---

**Built with FastAPI** 🚀 | **Deployed on Hugging Face Spaces** 🤗
