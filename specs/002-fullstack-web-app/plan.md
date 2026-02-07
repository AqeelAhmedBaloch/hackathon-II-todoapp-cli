# Implementation Plan: Full-Stack Web Application (Phase-2)

**Feature**: Full-Stack Web Application
**Spec**: `specs/002-fullstack-web-app/spec.md`
**Created**: 2026-01-04
**Status**: Ready for Implementation

---

## Executive Summary

This plan outlines the technical approach for transforming the Phase-1 console Todo application into a production-ready full-stack web application. The architecture follows a 3-tier pattern: React frontend (client), FastAPI backend (API server), and PostgreSQL database (data layer). The implementation will be completed in 6 phases with clear milestones and dependencies.

**Estimated Complexity**: High (3-4 weeks for full implementation)
**Risk Level**: Medium (new technologies, database integration, authentication)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │         React 18 + TypeScript Frontend             │     │
│  │  - Components (Login, Register, TaskList, etc.)    │     │
│  │  - State Management (Context API)                  │     │
│  │  - HTTP Client (Axios)                             │     │
│  │  - Routing (React Router)                          │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │ HTTPS + JWT                              │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │         FastAPI Backend (Python 3.11+)             │     │
│  │  - Routers (auth, tasks)                           │     │
│  │  - Services (business logic)                       │     │
│  │  - Schemas (Pydantic validation)                   │     │
│  │  - Auth Middleware (JWT verification)              │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │ SQLAlchemy ORM                           │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA TIER                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │            PostgreSQL 15+ Database                 │     │
│  │  - Tables: users, tasks                            │     │
│  │  - Indexes: user_id on tasks                       │     │
│  │  - Foreign Keys: tasks.user_id → users.id          │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Justification

**Backend: FastAPI**
- ✅ Modern, fast (async support)
- ✅ Automatic OpenAPI documentation
- ✅ Built-in Pydantic validation
- ✅ Easy to learn, great developer experience
- ⚠️ Newer than Flask/Django (less mature ecosystem)

**Frontend: React + TypeScript**
- ✅ Industry standard, large ecosystem
- ✅ Component-based architecture
- ✅ TypeScript adds type safety
- ✅ Excellent tooling (Vite, ESLint, etc.)
- ⚠️ Requires JavaScript knowledge

**Database: PostgreSQL**
- ✅ Robust, production-ready
- ✅ ACID compliant
- ✅ Excellent performance
- ✅ Strong community support
- ⚠️ Requires separate server (vs SQLite)

**ORM: SQLAlchemy 2.0**
- ✅ Mature, powerful ORM
- ✅ Async support in 2.0
- ✅ Good migration support (Alembic)
- ⚠️ Steeper learning curve than raw SQL

---

## Data Model Design

### Database Schema (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_users_email ON users(email);
```

### SQLAlchemy Models

**User Model** (`backend/app/models/user.py`):
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
```

**Task Model** (`backend/app/models/task.py`):
```python
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    owner = relationship("User", back_populates="tasks")
```

### Pydantic Schemas

**Request/Response Schemas** (`backend/app/schemas/`):

```python
# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: datetime

# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

---

## API Design

### Authentication Flow

```
1. Registration Flow:
   Client → POST /api/auth/register (email, password, name)
   Server → Validate, hash password, create user
   Server → Return user info (no token yet)
   Client → Redirect to login

2. Login Flow:
   Client → POST /api/auth/login (email, password)
   Server → Verify credentials, generate JWT token
   Server → Return {access_token, user}
   Client → Store token in localStorage
   Client → Redirect to dashboard

3. Protected Request Flow:
   Client → GET /api/tasks (with Authorization: Bearer <token>)
   Server → Verify JWT token
   Server → Extract user_id from token
   Server → Query tasks WHERE user_id = current_user
   Server → Return tasks
```

### JWT Token Structure

```json
{
  "sub": "1",          // user_id
  "email": "user@example.com",
  "exp": 1704470400,   // expiration timestamp (24 hours)
  "iat": 1704384000    // issued at timestamp
}
```

### REST API Endpoints

**Authentication Endpoints**:

| Method | Endpoint               | Description           | Auth Required |
|--------|------------------------|-----------------------|---------------|
| POST   | /api/auth/register     | Register new user     | No            |
| POST   | /api/auth/login        | Login user            | No            |

**Task Endpoints**:

| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| GET    | /api/tasks                | List all user's tasks    | Yes           |
| POST   | /api/tasks                | Create new task          | Yes           |
| GET    | /api/tasks/{id}           | Get single task          | Yes           |
| PUT    | /api/tasks/{id}           | Update task              | Yes           |
| DELETE | /api/tasks/{id}           | Delete task              | Yes           |
| PATCH  | /api/tasks/{id}/toggle    | Toggle task completion   | Yes           |

**Health Check**:

| Method | Endpoint     | Description        | Auth Required |
|--------|--------------|--------------------|---------------|
| GET    | /health      | Health check       | No            |

---

## Security Design

### Password Security

**Hashing Strategy**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**Password Requirements**:
- Minimum 8 characters
- No maximum length (up to bcrypt limit)
- No complexity requirements (Phase-2), can add in Phase-3

### JWT Authentication

**Token Generation**:
```python
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

**Token Verification Middleware**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)) -> User:
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Input Validation & Sanitization

**XSS Prevention**:
- Pydantic schemas validate input types and lengths
- React automatically escapes HTML in JSX
- Never use `dangerouslySetInnerHTML` without sanitization

**SQL Injection Prevention**:
- SQLAlchemy ORM uses parameterized queries automatically
- Never construct raw SQL with string concatenation

**CORS Configuration**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Frontend Architecture

### React Component Structure

```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx          # Create/Edit form
│   │   ├── DeleteConfirmDialog.tsx
│   │   └── TaskStats.tsx         # Total/Completed count
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── Button.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
├── services/
│   ├── api.ts                    # Axios instance
│   ├── authService.ts            # Auth API calls
│   └── taskService.ts            # Task API calls
├── contexts/
│   ├── AuthContext.tsx           # User state
│   └── TaskContext.tsx           # Task state (optional)
├── hooks/
│   ├── useAuth.ts                # Auth hook
│   └── useTasks.ts               # Tasks hook
├── types/
│   ├── user.ts
│   └── task.ts
├── utils/
│   ├── tokenStorage.ts
│   └── validators.ts
├── App.tsx
└── main.tsx
```

### State Management Strategy

**Authentication State** (Context API):
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

**Task State** (Local state or Context):
```typescript
// Option 1: Local state in DashboardPage
const [tasks, setTasks] = useState<Task[]>([]);

// Option 2: Context (if needed across multiple components)
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<void>;
  updateTask: (id: number, data: TaskUpdate) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
}
```

### Routing Structure

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Backend Architecture

### FastAPI Application Structure

```
backend/
├── app/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py               # User SQLAlchemy model
│   │   └── task.py               # Task SQLAlchemy model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py               # User Pydantic schemas
│   │   └── task.py               # Task Pydantic schemas
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py               # /api/auth routes
│   │   └── tasks.py              # /api/tasks routes
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py       # Auth business logic
│   │   └── task_service.py       # Task business logic
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py             # Settings (env vars)
│   │   ├── security.py           # JWT, password hashing
│   │   └── database.py           # DB connection
│   ├── dependencies.py           # FastAPI dependencies
│   └── main.py                   # FastAPI app entry point
├── alembic/
│   ├── versions/                 # Migration files
│   ├── env.py
│   └── alembic.ini
├── tests/
│   ├── conftest.py               # Test fixtures
│   ├── test_auth.py
│   └── test_tasks.py
├── requirements.txt
├── .env.example
└── Dockerfile
```

### Dependency Injection Pattern

```python
# dependencies.py
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user

async def get_current_active_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user
```

### Service Layer Pattern

```python
# services/task_service.py
class TaskService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_tasks(self, user_id: int) -> List[Task]:
        return self.db.query(Task).filter(Task.user_id == user_id).all()

    def create_task(self, user_id: int, task_data: TaskCreate) -> Task:
        task = Task(user_id=user_id, **task_data.dict())
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self, task_id: int, user_id: int, task_data: TaskUpdate) -> Task:
        task = self.get_task_by_id(task_id, user_id)
        for key, value in task_data.dict(exclude_unset=True).items():
            setattr(task, key, value)
        self.db.commit()
        self.db.refresh(task)
        return task

    # ... other methods
```

---

## Development Environment Setup

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 15+
- Docker & Docker Compose (optional but recommended)

### Environment Variables

**Backend** (`.env`):
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp

# JWT
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24

# CORS
CORS_ORIGINS=http://localhost:5173

# App
DEBUG=true
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

### Docker Compose Setup

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todoapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/todoapp
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    depends_on:
      - db
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    command: npm run dev -- --host
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## Implementation Phases

### Phase 1: Project Setup & Infrastructure (Week 1, Days 1-2)

**Goals**:
- Set up project structure for backend and frontend
- Configure development environment
- Set up database and migrations
- Create base models and schemas

**Deliverables**:
- [ ] Backend folder structure created
- [ ] Frontend React app initialized (Vite)
- [ ] PostgreSQL database running
- [ ] SQLAlchemy models defined
- [ ] Alembic migrations configured
- [ ] First migration created (users, tasks tables)
- [ ] Docker Compose file working

---

### Phase 2: Backend API - Authentication (Week 1, Days 3-4)

**Goals**:
- Implement user registration and login
- Set up JWT authentication
- Create auth middleware

**Deliverables**:
- [ ] POST /api/auth/register endpoint working
- [ ] POST /api/auth/login endpoint working
- [ ] Password hashing with bcrypt
- [ ] JWT token generation and validation
- [ ] get_current_user dependency working
- [ ] Unit tests for auth endpoints

---

### Phase 3: Backend API - Task CRUD (Week 1, Day 5 - Week 2, Day 1)

**Goals**:
- Implement all task CRUD endpoints
- Enforce user-based data isolation
- Add validation and error handling

**Deliverables**:
- [ ] GET /api/tasks endpoint working
- [ ] POST /api/tasks endpoint working
- [ ] GET /api/tasks/{id} endpoint working
- [ ] PUT /api/tasks/{id} endpoint working
- [ ] DELETE /api/tasks/{id} endpoint working
- [ ] PATCH /api/tasks/{id}/toggle endpoint working
- [ ] Data isolation enforced (users can only access their tasks)
- [ ] Unit tests for all task endpoints
- [ ] OpenAPI documentation generated

---

### Phase 4: Frontend - Authentication UI (Week 2, Days 2-3)

**Goals**:
- Create login and registration pages
- Implement AuthContext for state management
- Set up protected routes

**Deliverables**:
- [ ] LoginForm component working
- [ ] RegisterForm component working
- [ ] AuthContext implemented
- [ ] Token storage in localStorage
- [ ] ProtectedRoute component working
- [ ] Login/register form validation
- [ ] API integration for auth endpoints

---

### Phase 5: Frontend - Task Management UI (Week 2, Days 4-5 - Week 3, Days 1-2)

**Goals**:
- Create task list and task item components
- Implement task creation, editing, deletion
- Add task completion toggle

**Deliverables**:
- [ ] TaskList component rendering tasks
- [ ] TaskItem component with actions
- [ ] TaskForm component (create/edit)
- [ ] Delete confirmation dialog
- [ ] Task toggle functionality
- [ ] Loading and error states
- [ ] API integration for all task endpoints
- [ ] Responsive design (mobile, tablet, desktop)

---

### Phase 6: Testing, Polish & Deployment (Week 3, Days 3-5)

**Goals**:
- Write comprehensive tests
- Fix bugs and improve UX
- Prepare for deployment

**Deliverables**:
- [ ] Backend test coverage > 80%
- [ ] Frontend component tests
- [ ] E2E tests (optional, can use Playwright)
- [ ] Error handling improved
- [ ] Loading states polished
- [ ] UI/UX refinements
- [ ] Docker images optimized
- [ ] Deployment documentation
- [ ] README.md updated

---

## Testing Strategy

### Backend Testing

**Unit Tests** (pytest):
```python
# tests/test_auth.py
def test_register_user(client):
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    })
    assert response.status_code == 201
    assert response.json()["user"]["email"] == "test@example.com"

def test_login_user(client, test_user):
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

**Integration Tests**:
```python
# tests/test_tasks.py
def test_create_task_authenticated(client, auth_token):
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task", "description": "Test"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_get_tasks_only_own(client, auth_token, other_user_task):
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    tasks = response.json()["tasks"]
    # Should not include other_user_task
    assert all(task["id"] != other_user_task.id for task in tasks)
```

### Frontend Testing

**Component Tests** (Vitest + React Testing Library):
```typescript
// TaskList.test.tsx
describe('TaskList', () => {
  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('renders tasks when provided', () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ];
    render(<TaskList tasks={tasks} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
```

---

## Deployment Strategy

### Production Environment

**Hosting Options**:
- **Backend**: Render.com, Railway.app, or AWS EC2
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Database**: Render PostgreSQL, Railway, or AWS RDS

**Environment Configuration**:
- Separate `.env` for production
- Use secrets management (AWS Secrets Manager, Doppler)
- Enable HTTPS (Let's Encrypt)
- Set secure CORS origins

**Database Migrations**:
```bash
# Run migrations on deployment
alembic upgrade head
```

### CI/CD Pipeline (Optional for Phase-2, Recommended for Phase-3+)

**GitHub Actions**:
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm test
```

---

## Risk Analysis & Mitigation

### High Risks

**Risk 1: JWT Token Security**
- **Impact**: If JWT secret is compromised, attackers can forge tokens
- **Probability**: Low (if environment vars are secure)
- **Mitigation**:
  - Use strong, random JWT_SECRET_KEY (32+ characters)
  - Store in environment variables, never commit to Git
  - Rotate keys periodically
  - Consider short token expiry (currently 24 hours)

**Risk 2: SQL Injection**
- **Impact**: Database compromise, data theft
- **Probability**: Very Low (SQLAlchemy ORM protects)
- **Mitigation**:
  - Always use ORM methods, never raw SQL with string concat
  - Code review all database queries
  - Run static analysis tools

**Risk 3: CORS Misconfiguration**
- **Impact**: Unauthorized origins can access API
- **Probability**: Medium (easy to misconfigure)
- **Mitigation**:
  - Explicitly set `allow_origins` in production
  - Never use `allow_origins=["*"]` in production
  - Test CORS from different origins

### Medium Risks

**Risk 4: Password Storage**
- **Impact**: User passwords compromised if DB is breached
- **Probability**: Low (bcrypt is secure)
- **Mitigation**:
  - Use bcrypt with 12+ rounds
  - Never log passwords
  - Consider adding 2FA in Phase-3

**Risk 5: Database Connection Failures**
- **Impact**: API downtime, users can't access tasks
- **Probability**: Medium
- **Mitigation**:
  - Implement connection pooling
  - Add retry logic
  - Set up database monitoring
  - Have database backups

**Risk 6: Frontend State Management Complexity**
- **Impact**: Bugs, difficult maintenance
- **Probability**: Medium (as app grows)
- **Mitigation**:
  - Keep state simple in Phase-2 (Context API)
  - Consider Redux/Zustand in Phase-3 if needed
  - Write tests for state logic

### Low Risks

**Risk 7: Browser Compatibility**
- **Impact**: Some users can't access app
- **Probability**: Low (modern React supports recent browsers)
- **Mitigation**:
  - Test on Chrome, Firefox, Safari, Edge
  - Specify minimum browser versions in README
  - Use Babel polyfills if targeting older browsers

---

## Performance Considerations

### Backend Optimization

- Use connection pooling (SQLAlchemy default)
- Add database indexes on frequently queried fields (user_id, completed)
- Use async endpoints where appropriate
- Implement query pagination (Phase-3)

### Frontend Optimization

- Use React.memo for expensive components
- Implement lazy loading for routes
- Minimize bundle size (tree shaking)
- Use CDN for assets in production

### Database Optimization

- Index on `tasks.user_id` (frequent filtering)
- Index on `users.email` (login queries)
- Use connection pooling
- Consider read replicas in Phase-5

---

## Constitution Compliance Checklist

- [x] **Specification First**: spec.md created before this plan
- [x] **Traceability**: All features map to FR requirements in spec
- [x] **Progressive Complexity**: Building on Phase-1 foundation
- [x] **Determinism**: API responses are predictable and testable
- [x] **Clean Structure**: 3-tier architecture (Frontend/Backend/DB)
- [x] **Phase-2 Constraints**: Using approved tech stack (React, FastAPI, PostgreSQL)
- [x] **No Manual Coding**: All code will be generated via Claude Code
- [x] **SDD Workflow**: Following spec → plan → tasks → implement
- [x] **Security**: JWT auth, password hashing, input validation
- [x] **Testing**: Unit tests, integration tests, >80% coverage

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Create tasks.md** with concrete, testable tasks
3. **Set up development environment** (Docker, PostgreSQL, etc.)
4. **Begin Phase 1 implementation** (project setup)
5. **Follow SDD workflow** strictly (no manual coding)

---

**Version**: 1.0.0
**Status**: Ready for Task Breakdown
**Estimated Timeline**: 3-4 weeks full-time development
**Next Document**: `tasks.md`
