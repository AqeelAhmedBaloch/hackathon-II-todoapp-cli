# Todo Application - Phase 2: Full-Stack Web Application

Production-ready Todo application with React frontend, FastAPI backend, and PostgreSQL database.

## 🎯 Features

### User Management
- ✅ User registration with email and password
- ✅ Secure login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Session management with 24-hour token expiry

### Task Management
- ✅ Create tasks with title and optional description
- ✅ View all personal tasks
- ✅ Update task title and description
- ✅ Delete tasks with confirmation
- ✅ Toggle task completion status
- ✅ Data isolation (users only see their own tasks)

### User Interface
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern React 18 with TypeScript
- ✅ Clean and intuitive UI
- ✅ Loading states and error handling
- ✅ Form validation

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0+
- **Migrations**: Alembic
- **Authentication**: JWT (PyJWT)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic v2
- **Testing**: pytest
- **Python**: 3.11+

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript 5+
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS / Material-UI
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Routing**: React Router v6

### DevOps
- **Containerization**: Docker, Docker Compose
- **Web Server**: Uvicorn (ASGI)
- **Database**: PostgreSQL in Docker

---

## 📁 Project Structure

```
phase-2/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routers/           # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── core/              # Config, security, database
│   │   └── main.py            # FastAPI app
│   ├── alembic/               # Database migrations
│   ├── tests/                 # Backend tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml          # Docker orchestration
└── README.md
```

---

## 🚀 Quick Start

**See [QUICKSTART.md](QUICKSTART.md) for detailed setup guide.**

### Fast Setup (3 Steps)

1. **Setup Environment Variables**
```bash
cd phase-2
bash setup-env.sh      # Linux/Mac
# OR
setup-env.bat          # Windows
```

2. **Start All Services**
```bash
docker-compose up -d
```

3. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs

### Prerequisites

- Docker and Docker Compose installed
- OR: Python 3.11+, Node.js 18+, PostgreSQL 15+

For detailed instructions, troubleshooting, and local development setup, see [QUICKSTART.md](QUICKSTART.md).

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL**
```bash
# Create database
createdb todoapp

# Or using psql
psql -U postgres
CREATE DATABASE todoapp;
\q
```

5. **Configure environment**
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL and JWT_SECRET_KEY
```

6. **Run migrations**
```bash
alembic upgrade head
```

7. **Start backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:8000
```

4. **Start frontend dev server**
```bash
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe"
}
```

**Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

### Task Endpoints (Require Authentication)

All task endpoints require JWT token in `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Tasks
```http
GET /api/tasks
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

#### Get Single Task
```http
GET /api/tasks/{id}
```

#### Update Task
```http
PUT /api/tasks/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
```

#### Toggle Task Completion
```http
PATCH /api/tasks/{id}/toggle
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

---

## 🔒 Security

### Authentication
- JWT tokens with 24-hour expiry
- Password hashing using bcrypt (12 rounds)
- Secure token storage in localStorage

### Data Protection
- Input validation with Pydantic
- SQL injection protection (SQLAlchemy ORM)
- XSS prevention (React automatic escaping)
- CORS configuration

### Best Practices
- Environment variables for secrets
- Never commit `.env` files
- HTTPS required in production
- Rate limiting (recommended for production)

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# Rebuild containers
docker-compose up -d --build

# Run migrations
docker-compose exec backend alembic upgrade head

# Access PostgreSQL
docker-compose exec db psql -U postgres -d todoapp

# Run backend tests
docker-compose exec backend pytest

# Remove all containers and volumes
docker-compose down -v
```

---

## 🗄️ Database Management

### Migrations

```bash
# Create a new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# View migration history
alembic history
```

### Connect to Database

```bash
# Using Docker
docker-compose exec db psql -U postgres -d todoapp

# Using local PostgreSQL
psql -U postgres -d todoapp
```

### Useful SQL Queries

```sql
-- View all users
SELECT id, email, full_name, created_at FROM users;

-- View all tasks
SELECT id, user_id, title, completed, created_at FROM tasks;

-- Count tasks by user
SELECT user_id, COUNT(*) as task_count
FROM tasks
GROUP BY user_id;
```

---

## 🌍 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24

# CORS (comma-separated origins)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Application
DEBUG=true
APP_NAME="Todo App API"
```

### Frontend (.env)

```env
# API URL
VITE_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use**:
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
```

**Database connection error**:
```bash
# Check if PostgreSQL is running
docker-compose ps db

# Check database exists
docker-compose exec db psql -U postgres -l
```

**Migration errors**:
```bash
# Reset migrations (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
docker-compose exec backend alembic upgrade head
```

### Frontend Issues

**Port 5173 already in use**:
```bash
# Change port in vite.config.ts
server: {
  port: 3000
}
```

**API connection error**:
- Check `VITE_API_URL` in `.env`
- Verify backend is running: http://localhost:8000/docs
- Check browser console for CORS errors

**Module not found errors**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Performance

### Backend
- Response time: < 500ms (p95)
- Connection pooling enabled
- Database indexes on frequently queried fields

### Frontend
- Initial load: < 3 seconds (3G)
- Bundle size: < 500KB gzipped
- React.memo for expensive components

### Database
- Indexes: user_id, email, completed
- Foreign keys with CASCADE delete
- Connection pooling via SQLAlchemy

---

## 🚀 Deployment

See `DEPLOYMENT.md` for production deployment guide.

### Quick Production Checklist

- [ ] Set strong JWT_SECRET_KEY (32+ characters)
- [ ] Use production PostgreSQL database (not Docker)
- [ ] Set DEBUG=false in backend
- [ ] Configure CORS_ORIGINS to production domains only
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Run security audit
- [ ] Test with production-like data

---

## 📝 Development Workflow

### Making Changes

1. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**
```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

3. **Commit with meaningful message**
```bash
git add .
git commit -m "feat: add task filtering feature"
```

4. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### Code Style

**Backend (Python)**:
- Follow PEP 8
- Use Black for formatting
- Use type hints

**Frontend (TypeScript)**:
- Follow ESLint rules
- Use Prettier for formatting
- Write type-safe code

---

## 📖 Documentation

- **Spec**: `specs/002-fullstack-web-app/spec.md`
- **Plan**: `specs/002-fullstack-web-app/plan.md`
- **Tasks**: `specs/002-fullstack-web-app/tasks.md`
- **Constitution**: `.specify/memory/constitution.md`

---

## 🤝 Contributing

1. Follow Spec-Driven Development (SDD) workflow
2. All code must be generated via Claude Code (no manual coding)
3. Write tests for new features
4. Update documentation
5. Ensure all tests pass before PR

---

## 📄 License

This project is part of Hackathon-II: "The Evolution of Todo"

---

## 🎓 Learning Resources

### FastAPI
- [Official Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/)
- [JWT Authentication](https://fastapi.tiangolo.com/tutorial/security/)

### React
- [Official Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router](https://reactrouter.com/)

### Docker
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Check backend logs: `docker-compose logs backend`

---

**Version**: 1.0.0
**Phase**: Phase-2 (Full-Stack Web Application)
**Status**: Ready for Implementation
**Last Updated**: 2026-01-04
