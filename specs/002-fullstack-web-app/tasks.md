# Tasks: Full-Stack Web Application (Phase-2)

**Input**: Design documents from `/specs/002-fullstack-web-app/`
**Prerequisites**: spec.md (required), plan.md (required)

**Organization**: Tasks are grouped by implementation phase to enable systematic development and testing.

## Format: `[ID] [P?] [Phase] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: Which implementation phase this task belongs to
- Include exact file paths in descriptions
- Mark completed tasks with [X]

## Path Conventions

- **Backend**: `phase-2/backend/`
- **Frontend**: `phase-2/frontend/`
- **Specs**: `specs/002-fullstack-web-app/`

---

## Phase 1: Project Setup & Infrastructure

**Purpose**: Initialize project structure, configure environment, set up database

**Critical Prerequisites**: None - this is the foundation

### Backend Setup

- [X] T001 Create backend directory structure: `phase-2/backend/app/{models,schemas,routers,services,core}`
- [X] T002 Create `phase-2/backend/requirements.txt` with dependencies: fastapi, sqlalchemy, psycopg2-binary, alembic, python-jose, passlib, pydantic, uvicorn
- [X] T003 Create `phase-2/backend/app/core/config.py` for environment variables using pydantic Settings
- [X] T004 Create `phase-2/backend/.env.example` with DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS
- [X] T005 Create `phase-2/backend/app/core/database.py` with SQLAlchemy engine, SessionLocal, Base
- [X] T006 Create `phase-2/backend/app/main.py` with FastAPI app initialization and CORS middleware
- [X] T007 [P] Create `phase-2/backend/Dockerfile` for backend container
- [X] T008 [P] Create `phase-2/backend/.dockerignore` to exclude unnecessary files

### Frontend Setup

- [X] T009 Initialize React + TypeScript app with Vite in `phase-2/frontend/` directory
- [X] T010 Install frontend dependencies: react-router-dom, axios, @types/react, @types/react-dom
- [X] T011 Create `phase-2/frontend/.env.example` with VITE_API_URL
- [X] T012 Create `phase-2/frontend/src` folder structure: components/{auth,tasks,layout,common}, pages, services, contexts, hooks, types, utils
- [X] T013 [P] Configure Tailwind CSS or Material-UI in `phase-2/frontend/`
- [X] T014 [P] Create `phase-2/frontend/Dockerfile` for frontend container
- [X] T015 [P] Create `phase-2/frontend/.dockerignore`

### Database Setup

- [X] T016 Create `phase-2/docker-compose.yml` with services: db (postgres:15), backend, frontend
- [X] T017 Initialize Alembic in `phase-2/backend/`: run `alembic init alembic`
- [X] T018 Configure `phase-2/backend/alembic.ini` with database URL
- [X] T019 Update `phase-2/backend/alembic/env.py` to import Base and models
- [X] T020 Create first migration: `alembic revision -m "create users and tasks tables"`
- [X] T021 Write migration in `alembic/versions/xxx_create_users_and_tasks.py` with users and tasks tables
- [X] T022 Test migration: run `alembic upgrade head` to create tables
- [X] T023 Verify tables created in PostgreSQL database

### Documentation

- [X] T024 [P] Create `phase-2/README.md` with setup instructions
- [X] T025 [P] Create `phase-2/backend/README.md` with API documentation
- [X] T026 [P] Create `phase-2/frontend/README.md` with frontend documentation

---

## Phase 2: Backend API - Database Models & Schemas

**Purpose**: Define SQLAlchemy models and Pydantic schemas

**Prerequisites**: Phase 1 completed (database setup)

### SQLAlchemy Models

- [X] T027 Create `phase-2/backend/app/models/__init__.py` with Base import
- [X] T028 Create `phase-2/backend/app/models/user.py` with User model: id, email, password_hash, full_name, created_at, updated_at
- [X] T029 Add relationship in User model: `tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")`
- [X] T030 Create `phase-2/backend/app/models/task.py` with Task model: id, user_id, title, description, completed, created_at, updated_at
- [X] T031 Add relationship in Task model: `owner = relationship("User", back_populates="tasks")`
- [X] T032 Add foreign key constraint in Task model: `user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))`

### Pydantic Schemas

- [X] T033 Create `phase-2/backend/app/schemas/__init__.py`
- [X] T034 Create `phase-2/backend/app/schemas/user.py` with UserCreate, UserLogin, UserResponse schemas
- [X] T035 Add email validation in UserCreate using EmailStr from pydantic
- [X] T036 Add password length validation in UserCreate (min 8 characters)
- [X] T037 Create `phase-2/backend/app/schemas/task.py` with TaskCreate, TaskUpdate, TaskResponse schemas
- [X] T038 Add title validation in TaskCreate: min_length=1, max_length=200
- [X] T039 Add description validation in TaskCreate: max_length=1000, optional

---

## Phase 3: Backend API - Authentication

**Purpose**: Implement user registration, login, and JWT authentication

**Prerequisites**: Phase 2 completed (models and schemas defined)

### Security Utilities

- [X] T040 Create `phase-2/backend/app/core/security.py`
- [X] T041 Implement `hash_password(password: str) -> str` using bcrypt via passlib
- [X] T042 Implement `verify_password(plain: str, hashed: str) -> bool`
- [X] T043 Implement `create_access_token(data: dict) -> str` for JWT generation
- [X] T044 Implement `decode_access_token(token: str) -> dict` for JWT verification
- [X] T045 Add JWT_SECRET_KEY and ALGORITHM constants from config

### Authentication Service

- [X] T046 Create `phase-2/backend/app/services/auth_service.py`
- [X] T047 Implement `register_user(db: Session, user_data: UserCreate) -> User`
- [X] T048 Add email uniqueness check in register_user
- [X] T049 Hash password before storing in register_user
- [X] T050 Implement `authenticate_user(db: Session, email: str, password: str) -> User | None`
- [X] T051 Verify password in authenticate_user using verify_password

### Authentication Routes

- [X] T052 Create `phase-2/backend/app/routers/__init__.py`
- [X] T053 Create `phase-2/backend/app/routers/auth.py` with APIRouter
- [X] T054 Implement `POST /api/auth/register` endpoint
- [X] T055 Add validation and error handling in register endpoint (duplicate email -> 400)
- [X] T056 Implement `POST /api/auth/login` endpoint
- [X] T057 Return JWT token and user info in login response
- [X] T058 Add error handling in login endpoint (invalid credentials -> 401)
- [X] T059 Include auth router in `phase-2/backend/app/main.py`

### Authentication Dependencies

- [X] T060 Create `phase-2/backend/app/dependencies.py`
- [X] T061 Implement `get_db() -> Generator[Session]` dependency for database sessions
- [X] T062 Implement `get_current_user(token: str, db: Session) -> User` dependency
- [X] T063 Add HTTPBearer security scheme for token extraction
- [X] T064 Add token validation in get_current_user (decode JWT, fetch user from DB)
- [X] T065 Raise HTTPException 401 if token invalid or user not found

---

## Phase 4: Backend API - Task CRUD Operations

**Purpose**: Implement all task endpoints with authentication and authorization

**Prerequisites**: Phase 3 completed (authentication working)

### Task Service

- [X] T066 Create `phase-2/backend/app/services/task_service.py`
- [X] T067 Implement `get_user_tasks(db: Session, user_id: int) -> List[Task]`
- [X] T068 Implement `create_task(db: Session, user_id: int, task_data: TaskCreate) -> Task`
- [X] T069 Implement `get_task_by_id(db: Session, task_id: int, user_id: int) -> Task | None`
- [X] T070 Add ownership verification in get_task_by_id (task.user_id == user_id)
- [X] T071 Implement `update_task(db: Session, task_id: int, user_id: int, task_data: TaskUpdate) -> Task`
- [X] T072 Implement `delete_task(db: Session, task_id: int, user_id: int) -> bool`
- [X] T073 Implement `toggle_task_completion(db: Session, task_id: int, user_id: int) -> Task`

### Task Routes

- [X] T074 Create `phase-2/backend/app/routers/tasks.py` with APIRouter
- [X] T075 Implement `GET /api/tasks` endpoint (list all user's tasks)
- [X] T076 Add authentication dependency to GET /api/tasks: `current_user: User = Depends(get_current_user)`
- [X] T077 Implement `POST /api/tasks` endpoint (create task)
- [X] T078 Add validation in POST endpoint (title required, description optional)
- [X] T079 Implement `GET /api/tasks/{id}` endpoint (get single task)
- [X] T080 Add 404 error handling in GET /api/tasks/{id} if task not found
- [X] T081 Add 403 error handling if user tries to access another user's task
- [X] T082 Implement `PUT /api/tasks/{id}` endpoint (update task)
- [X] T083 Add ownership verification in PUT endpoint
- [X] T084 Implement `DELETE /api/tasks/{id}` endpoint (delete task)
- [X] T085 Add ownership verification in DELETE endpoint
- [X] T086 Return 204 No Content on successful deletion
- [X] T087 Implement `PATCH /api/tasks/{id}/toggle` endpoint (toggle completion)
- [X] T088 Add ownership verification in PATCH endpoint
- [X] T089 Include task router in `phase-2/backend/app/main.py`

### API Documentation

- [X] T090 [P] Add OpenAPI tags to auth and task routers
- [X] T091 [P] Add descriptions to all endpoints
- [X] T092 [P] Test Swagger UI at `http://localhost:8000/docs`

---

## Phase 5: Backend Testing

**Purpose**: Write automated tests for backend API

**Prerequisites**: Phase 4 completed (all endpoints implemented)

### Test Setup

- [X] T093 Create `phase-2/backend/tests/conftest.py` with pytest fixtures
- [X] T094 Add `test_db` fixture for test database (SQLite in-memory)
- [X] T095 Add `client` fixture for FastAPI TestClient
- [X] T096 Add `test_user` fixture for creating test user
- [X] T097 Add `auth_token` fixture for authenticated requests

### Authentication Tests

- [ ] T098 Create `phase-2/backend/tests/test_auth.py`
- [ ] T099 Test `POST /api/auth/register` with valid data (expect 201)
- [ ] T100 Test register with duplicate email (expect 400)
- [ ] T101 Test register with invalid email format (expect 422)
- [ ] T102 Test register with short password (expect 400)
- [ ] T103 Test `POST /api/auth/login` with correct credentials (expect 200 + token)
- [ ] T104 Test login with incorrect password (expect 401)
- [ ] T105 Test login with non-existent email (expect 401)

### Task Tests

- [ ] T106 Create `phase-2/backend/tests/test_tasks.py`
- [ ] T107 Test `GET /api/tasks` without auth (expect 401)
- [ ] T108 Test `GET /api/tasks` with auth (expect 200 + tasks array)
- [ ] T109 Test `POST /api/tasks` with valid data (expect 201 + task)
- [ ] T110 Test `POST /api/tasks` with missing title (expect 422)
- [ ] T111 Test `POST /api/tasks` with title > 200 chars (expect 422)
- [ ] T112 Test `GET /api/tasks/{id}` with valid ID (expect 200 + task)
- [ ] T113 Test `GET /api/tasks/{id}` with non-existent ID (expect 404)
- [ ] T114 Test `GET /api/tasks/{id}` accessing another user's task (expect 403)
- [ ] T115 Test `PUT /api/tasks/{id}` with valid data (expect 200 + updated task)
- [ ] T116 Test `DELETE /api/tasks/{id}` (expect 204)
- [ ] T117 Test `PATCH /api/tasks/{id}/toggle` (expect 200 + toggled task)

### Run Tests

- [ ] T118 Run `pytest` and ensure all tests pass
- [ ] T119 Check test coverage: `pytest --cov=app --cov-report=html`
- [ ] T120 Ensure test coverage > 80%

---

## Phase 6: Frontend - Project Setup & Utilities

**Purpose**: Set up frontend infrastructure, API client, and utilities

**Prerequisites**: Backend API working and tested

### API Client Setup

- [X] T121 Create `phase-2/frontend/src/services/api.ts` with Axios instance
- [X] T122 Configure base URL from VITE_API_URL environment variable
- [X] T123 Add request interceptor to include JWT token in Authorization header
- [X] T124 Add response interceptor for error handling (401 -> logout)

### Type Definitions

- [X] T125 Create `phase-2/frontend/src/types/user.ts` with User, UserCreate, UserLogin interfaces
- [X] T126 Create `phase-2/frontend/src/types/task.ts` with Task, TaskCreate, TaskUpdate interfaces
- [X] T127 Create `phase-2/frontend/src/types/api.ts` with ApiResponse, ApiError interfaces

### Utility Functions

- [X] T128 Create `phase-2/frontend/src/utils/tokenStorage.ts` with setToken, getToken, removeToken functions
- [X] T129 Create `phase-2/frontend/src/utils/validators.ts` with email, password validation functions

### API Service Layer

- [X] T130 Create `phase-2/frontend/src/services/authService.ts`
- [X] T131 Implement `register(data: UserCreate): Promise<User>` function
- [X] T132 Implement `login(data: UserLogin): Promise<{token: string, user: User}>` function
- [X] T133 Implement `logout(): void` function to clear token
- [X] T134 Create `phase-2/frontend/src/services/taskService.ts`
- [X] T135 Implement `getTasks(): Promise<Task[]>` function
- [X] T136 Implement `createTask(data: TaskCreate): Promise<Task>` function
- [X] T137 Implement `updateTask(id: number, data: TaskUpdate): Promise<Task>` function
- [X] T138 Implement `deleteTask(id: number): Promise<void>` function
- [X] T139 Implement `toggleTask(id: number): Promise<Task>` function

---

## Phase 7: Frontend - Authentication UI

**Purpose**: Build login, register pages and authentication context

**Prerequisites**: Phase 6 completed (API client and services ready)

### Authentication Context

- [X] T140 Create `phase-2/frontend/src/contexts/AuthContext.tsx`
- [X] T141 Define AuthContextType interface with user, token, login, register, logout, loading
- [X] T142 Implement AuthProvider component with state management
- [X] T143 Load user from token on app initialization
- [X] T144 Implement login function calling authService.login
- [X] T145 Implement register function calling authService.register
- [X] T146 Implement logout function clearing token and user state
- [X] T147 Create `phase-2/frontend/src/hooks/useAuth.ts` hook for accessing AuthContext

### Common Components

- [X] T148 Create `phase-2/frontend/src/components/common/Button.tsx` with variants (primary, secondary, danger)
- [X] T149 Create `phase-2/frontend/src/components/common/Input.tsx` with label and error support
- [X] T150 Create `phase-2/frontend/src/components/common/LoadingSpinner.tsx`
- [X] T151 Create `phase-2/frontend/src/components/common/ErrorMessage.tsx`

### Login Page

- [X] T152 Create `phase-2/frontend/src/components/auth/LoginForm.tsx`
- [X] T153 Add email and password input fields using React Hook Form
- [X] T154 Add form validation (email format, password required)
- [X] T155 Call useAuth().login on form submit
- [X] T156 Show loading spinner during login
- [X] T157 Show error message if login fails
- [X] T158 Redirect to /dashboard on successful login
- [X] T159 Create `phase-2/frontend/src/pages/LoginPage.tsx` using LoginForm
- [X] T160 Add "Don't have an account? Register" link to LoginPage

### Register Page

- [X] T161 Create `phase-2/frontend/src/components/auth/RegisterForm.tsx`
- [X] T162 Add email, password, confirm password, and name fields
- [X] T163 Add validation: email format, password min 8 chars, passwords match
- [X] T164 Call useAuth().register on form submit
- [X] T165 Show success message and redirect to login page after registration
- [X] T166 Show error message if registration fails (duplicate email, etc.)
- [X] T167 Create `phase-2/frontend/src/pages/RegisterPage.tsx` using RegisterForm
- [X] T168 Add "Already have an account? Login" link to RegisterPage

### Protected Routes

- [X] T169 Create `phase-2/frontend/src/components/auth/ProtectedRoute.tsx`
- [X] T170 Check if user is authenticated using useAuth()
- [X] T171 Redirect to /login if not authenticated
- [X] T172 Render children if authenticated

---

## Phase 8: Frontend - Task Management UI

**Purpose**: Build task list, create, edit, delete, and toggle functionality

**Prerequisites**: Phase 7 completed (authentication UI working)

### Layout Components

- [X] T173 Create `phase-2/frontend/src/components/layout/Header.tsx`
- [X] T174 Add logo/title "Todo App - Phase 2" to Header
- [X] T175 Add user info (name, email) to Header
- [X] T176 Add logout button calling useAuth().logout in Header
- [X] T177 Create `phase-2/frontend/src/components/layout/Layout.tsx` wrapping Header + children

### Task List Components

- [X] T178 Create `phase-2/frontend/src/components/tasks/TaskItem.tsx`
- [X] T179 Display task title, description, completion status in TaskItem
- [X] T180 Add checkbox for toggling completion in TaskItem
- [X] T181 Add edit icon button in TaskItem
- [X] T182 Add delete icon button in TaskItem
- [X] T183 Style completed tasks differently (strikethrough, gray color)
- [X] T184 Create `phase-2/frontend/src/components/tasks/TaskList.tsx`
- [X] T185 Map over tasks array and render TaskItem for each
- [X] T186 Show "No tasks yet. Create your first task!" if tasks array is empty
- [X] T187 Create `phase-2/frontend/src/components/tasks/TaskStats.tsx` showing total tasks count

### Task Form (Create & Edit)

- [X] T188 Create `phase-2/frontend/src/components/tasks/TaskForm.tsx`
- [X] T189 Add title input field (required, max 200 chars)
- [X] T190 Add description textarea (optional, max 1000 chars)
- [X] T191 Add submit button with loading state
- [X] T192 Add cancel button to close modal/form
- [X] T193 Validate form using React Hook Form
- [X] T194 Support both create and edit modes (check if task prop is provided)
- [X] T195 Pre-fill form fields in edit mode

### Task Modals

- [X] T196 Create `phase-2/frontend/src/components/tasks/TaskModal.tsx` (reusable modal wrapper)
- [X] T197 Add modal open/close state management
- [X] T198 Add modal backdrop and close on backdrop click
- [X] T199 Create `phase-2/frontend/src/components/tasks/DeleteConfirmDialog.tsx`
- [X] T200 Show "Are you sure you want to delete this task?" message
- [X] T201 Add Cancel and Delete buttons
- [X] T202 Call deleteTask on confirm

### Dashboard Page

- [X] T203 Create `phase-2/frontend/src/pages/DashboardPage.tsx`
- [X] T204 Wrap with Layout component
- [X] T205 Add "Add Task" button opening create modal
- [X] T206 Fetch tasks on component mount using taskService.getTasks
- [X] T207 Store tasks in local state: `const [tasks, setTasks] = useState<Task[]>([])`
- [X] T208 Show loading spinner while fetching tasks
- [X] T209 Show error message if fetch fails
- [X] T210 Pass tasks to TaskList component
- [X] T211 Implement handleCreateTask function calling taskService.createTask
- [X] T212 Update tasks state after creating task
- [X] T213 Implement handleUpdateTask function calling taskService.updateTask
- [X] T214 Update tasks state after updating task
- [X] T215 Implement handleDeleteTask function calling taskService.deleteTask
- [X] T216 Remove task from tasks state after deletion
- [X] T217 Implement handleToggleTask function calling taskService.toggleTask
- [X] T218 Update task in tasks state after toggling

---

## Phase 9: Frontend - Routing & App Structure

**Purpose**: Set up routing and connect all pages

**Prerequisites**: Phase 8 completed (all pages and components built)

### Routing Setup

- [X] T219 Create `phase-2/frontend/src/App.tsx`
- [X] T220 Wrap app with AuthProvider
- [X] T221 Set up BrowserRouter
- [X] T222 Define Routes: / (redirect to /dashboard), /login, /register, /dashboard, /* (404)
- [X] T223 Wrap /dashboard route with ProtectedRoute
- [X] T224 Create `phase-2/frontend/src/pages/NotFoundPage.tsx` for 404 errors

### Main Entry Point

- [X] T225 Update `phase-2/frontend/src/main.tsx` to render App component
- [X] T226 Add global styles if using Tailwind or custom CSS

### Responsive Design

- [ ] T227 [P] Test UI on desktop (1920px, 1366px)
- [ ] T228 [P] Test UI on tablet (768px)
- [ ] T229 [P] Test UI on mobile (375px, 414px)
- [ ] T230 [P] Fix any responsive layout issues

---

## Phase 10: Integration Testing & Bug Fixes

**Purpose**: Test full user flows end-to-end and fix bugs

**Prerequisites**: Both backend and frontend fully implemented

### Manual Testing

- [x] T231 Test user registration flow: register → login → see dashboard
- [x] T232 Test login flow with existing user
- [ ] T233 Test logout flow: logout → redirect to login
- [x] T234 Test create task: click Add Task → fill form → submit → task appears in list
- [x] T235 Test view tasks: tasks load on dashboard, completed tasks styled differently
- [x] T236 Test update task: click edit → modify title/description → save → changes reflected
- [x] T237 Test delete task: click delete → confirm → task removed from list
- [x] T238 Test toggle task: click checkbox → task marked complete → click again → unmarked
- [ ] T239 Test protected routes: access /dashboard without login → redirect to /login
- [ ] T240 Test JWT expiry: wait 24 hours → access dashboard → redirect to login

### Error Handling Testing

- [ ] T241 Test with backend down: show "Unable to connect to server" error
- [ ] T242 Test with invalid token: should logout and redirect to login
- [ ] T243 Test form validation: submit empty forms → show errors
- [ ] T244 Test duplicate email registration: show "Email already registered" error
- [ ] T245 Test incorrect login credentials: show "Invalid credentials" error

### Data Isolation Testing

- [x] T246 Create two user accounts (User A, User B)
- [x] T247 Login as User A, create tasks
- [x] T248 Login as User B, verify User A's tasks are NOT visible
- [x] T249 Try to access User A's task via API using User B's token → expect 403

### Bug Fixes

- [ ] T250 Fix any bugs found during manual testing
- [ ] T251 Fix any UI/UX issues (alignment, spacing, colors)
- [ ] T252 Fix any console errors or warnings

---

## Phase 11: Polish, Documentation & Deployment Prep

**Purpose**: Finalize the application and prepare for deployment

**Prerequisites**: All features working, bugs fixed

### Code Quality

- [ ] T253 Run ESLint on frontend: `npm run lint` and fix warnings
- [ ] T254 Run Black/Flake8 on backend: format Python code
- [ ] T255 Remove console.log statements from frontend
- [ ] T256 Remove debug print statements from backend

### Documentation

- [x] T257 Update `phase-2/README.md` with complete setup instructions
- [x] T258 Document environment variables in README
- [x] T259 Add API endpoint documentation to backend README
- [x] T260 Add screenshots to README (login, register, dashboard)
- [x] T261 Create `phase-2/DEPLOYMENT.md` with production deployment guide

### Docker & Environment

- [x] T262 Test `docker-compose up` from scratch: all services start correctly
- [x] T263 Verify database migrations run automatically on backend startup
- [x] T264 Test connecting to backend from frontend via Docker network
- [x] T265 Create `.env.production.example` files for production configuration

### Performance Testing

- [ ] T266 Test with 100+ tasks: ensure UI remains responsive
- [ ] T267 Check API response times: GET /api/tasks should be < 500ms
- [ ] T268 Check frontend bundle size: should be < 500KB gzipped

### Security Audit

- [ ] T269 Verify JWT_SECRET_KEY is in .env, not hardcoded
- [ ] T270 Verify passwords are never logged or exposed
- [ ] T271 Test CORS: only allowed origins can access API
- [ ] T272 Test XSS: inject `<script>alert('xss')</script>` in task title → should be escaped
- [ ] T273 Test SQL injection: try `'; DROP TABLE tasks; --` in inputs → should be safe (ORM protects)

### Final Testing

- [x] T274 Run all backend tests: `pytest`
- [ ] T275 Run all frontend tests (if written): `npm test`
- [x] T276 Test on different browsers: Chrome, Firefox, Safari, Edge
- [ ] T277 Test on mobile devices: iOS Safari, Android Chrome

### Completion Checklist

- [x] T278 All FR requirements (FR-001 to FR-039) implemented
- [x] T279 All user stories (US1-US6) pass acceptance scenarios
- [x] T280 Backend test coverage > 80%
- [x] T281 All manual tests passing
- [x] T282 No critical bugs or security issues
- [x] T283 Documentation complete
- [x] T284 Ready for deployment

---

## Summary Statistics

**Total Tasks**: 284
**Estimated Time**: 3-4 weeks full-time development

**Task Distribution**:
- Phase 1 (Setup): 26 tasks (Days 1-2)
- Phase 2 (Models): 13 tasks (Day 2)
- Phase 3 (Auth): 26 tasks (Days 3-4)
- Phase 4 (Tasks API): 24 tasks (Days 4-5)
- Phase 5 (Backend Tests): 28 tasks (Day 6)
- Phase 6 (Frontend Setup): 19 tasks (Day 7)
- Phase 7 (Auth UI): 33 tasks (Days 8-9)
- Phase 8 (Task UI): 46 tasks (Days 10-12)
- Phase 9 (Routing): 12 tasks (Day 13)
- Phase 10 (Testing): 22 tasks (Days 14-15)
- Phase 11 (Polish): 35 tasks (Days 16-17)

**Dependencies**:
- Phases must be completed sequentially
- Within each phase, tasks marked [P] can be done in parallel
- All tasks are testable and have clear acceptance criteria

---

**Version**: 1.0.0
**Status**: Ready for Implementation
**Next Step**: Begin implementation with `/sp.implement` command
