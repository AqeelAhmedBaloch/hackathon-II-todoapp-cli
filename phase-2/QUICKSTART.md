# Phase-2 Quick Start Guide

Complete setup guide to get the Phase-2 Todo App running in 5 minutes.

---

## Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Python 3.11+** and **Node.js 18+** (for local development)
- **PostgreSQL 15+** (if running locally without Docker)

---

## Option 1: Docker Setup (Recommended)

### Step 1: Setup Environment Variables

```bash
cd phase-2

# Run automated setup script
bash setup-env.sh   # Linux/Mac
# OR
setup-env.bat       # Windows
```

This will:
- Create `.env` files for backend and frontend
- Generate a secure JWT secret key
- Configure database connections

### Step 2: Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- FastAPI backend (port 8000)
- React frontend (port 5173)

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Step 4: Stop Services

```bash
docker-compose down
```

---

## Option 2: Local Development Setup

### Step 1: Setup Backend

```bash
cd phase-2/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and set:
# - DATABASE_URL (your PostgreSQL connection)
# - JWT_SECRET_KEY (run: python -c "import secrets; print(secrets.token_urlsafe(32))")

# Start backend
uvicorn app.main:app --reload
```

Backend will run at http://localhost:8000

### Step 2: Setup Frontend

```bash
cd phase-2/frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# .env should have:
# VITE_API_URL=http://localhost:8000

# Start frontend
npm run dev
```

Frontend will run at http://localhost:5173

### Step 3: Setup Database (PostgreSQL)

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE todoapp;
```

The application will automatically create tables on first run.

---

## First Time Usage

1. **Register an Account**
   - Open http://localhost:5173/register
   - Enter email, password, and full name
   - You'll be automatically logged in

2. **Create Your First Task**
   - Click "+ New Task" button
   - Enter task title and optional description
   - Click "Create Task"

3. **Manage Tasks**
   - **Complete**: Click checkbox to mark as done
   - **Edit**: Click "Edit" button to modify
   - **Delete**: Click "Delete" button to remove
   - **Filter**: Use "All", "Pending", "Completed" tabs

---

## Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Check what's using the port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Change ports in docker-compose.yml if needed
```

**Database connection failed:**
```bash
# Check if database is healthy
docker-compose ps

# View logs
docker-compose logs db
docker-compose logs backend
```

### Local Development Issues

**Module not found errors (Backend):**
```bash
# Make sure you're in the virtual environment
pip install -r requirements.txt
```

**CORS errors (Frontend):**
- Check that `CORS_ORIGINS` in backend `.env` includes frontend URL
- Default: `http://localhost:5173,http://localhost:3000`

**JWT errors:**
- Make sure `JWT_SECRET_KEY` in backend `.env` is set (not the example value)
- Generate new key: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

---

## Useful Commands

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild containers
docker-compose up -d --build

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

### Backend (Local)

```bash
# Run tests
pytest

# Format code
black .

# Lint code
flake8

# Type check
mypy .
```

### Frontend (Local)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Next Steps

- Read the full [README.md](README.md) for architecture details
- Check [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for environment variable reference
- View API documentation at http://localhost:8000/docs
- Explore the source code in `backend/app/` and `frontend/src/`

---

**Need Help?**
- Check logs: `docker-compose logs -f`
- Verify services: `docker-compose ps`
- Review `.env` files for correct configuration
