# Environment Variables Setup Guide

Complete step-by-step guide for setting up `.env` files in Phase-2.

---

## 📋 Quick Setup (Copy-Paste Commands)

```bash
# Navigate to phase-2 directory
cd phase-2

# Copy backend .env.example to .env
cp backend/.env.example backend/.env

# Copy frontend .env.example to .env
cp frontend/.env.example frontend/.env

# Generate JWT secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🔧 Step 1: Backend Environment Setup

### 1.1 Create Backend .env File

```bash
cd phase-2/backend
cp .env.example .env
```

### 1.2 Generate JWT Secret Key

**Option A: Using Python**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -base64 32
```

**Option C: Using Online Generator**
- Visit: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Key" (256-bit)

**Example Output:**
```
vF3mK9pL2qN8rT5wX7yZ1aC4bE6dG0hJ8iKmL1nO3pQ
```

### 1.3 Edit Backend .env File

Open `backend/.env` in your text editor and update:

```env
# Database (for Docker Compose)
DATABASE_URL=postgresql://postgres:postgres@db:5432/todoapp

# JWT Secret (paste the generated key)
JWT_SECRET_KEY=vF3mK9pL2qN8rT5wX7yZ1aC4bE6dG0hJ8iKmL1nO3pQ

# JWT Algorithm
JWT_ALGORITHM=HS256

# Token expiry (24 hours)
ACCESS_TOKEN_EXPIRE_HOURS=24

# CORS (frontend URLs that can access API)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Debug mode
DEBUG=true

# App name
APP_NAME=Todo App API - Phase 2
```

### 1.4 Verify Backend .env File

Check that your `.env` file looks like this:

```bash
cat backend/.env
```

Should contain:
- ✅ DATABASE_URL (PostgreSQL connection string)
- ✅ JWT_SECRET_KEY (your generated random key, NOT the example)
- ✅ CORS_ORIGINS (frontend URLs)

---

## 🎨 Step 2: Frontend Environment Setup

### 2.1 Create Frontend .env File

```bash
cd phase-2/frontend
cp .env.example .env
```

### 2.2 Edit Frontend .env File

Open `frontend/.env` and verify/update:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# App settings
VITE_APP_NAME=Todo App - Phase 2
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### 2.3 Verify Frontend .env File

```bash
cat frontend/.env
```

Should contain:
- ✅ VITE_API_URL=http://localhost:8000

---

## 🐳 Step 3: Docker Compose Environment (Optional)

If using Docker Compose, you can also set variables in `docker-compose.yml` or create a `.env` file in the root `phase-2/` directory.

### 3.1 Create Root .env (Optional)

```bash
cd phase-2
touch .env
```

### 3.2 Add Docker-Specific Variables

```env
# PostgreSQL Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=todoapp

# Backend
JWT_SECRET_KEY=vF3mK9pL2qN8rT5wX7yZ1aC4bE6dG0hJ8iKmL1nO3pQ
DATABASE_URL=postgresql://postgres:postgres@db:5432/todoapp

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## ✅ Step 4: Verify Setup

### 4.1 Check Files Exist

```bash
cd phase-2

# Backend .env should exist
ls -la backend/.env

# Frontend .env should exist
ls -la frontend/.env
```

### 4.2 Verify JWT Secret is Set

```bash
# Check if JWT_SECRET_KEY is NOT the example value
grep "JWT_SECRET_KEY" backend/.env
```

**Should show your generated key**, NOT:
```
JWT_SECRET_KEY=CHANGE_THIS_TO_A_SECURE_RANDOM_KEY_IN_PRODUCTION
```

### 4.3 Verify Database URL

```bash
grep "DATABASE_URL" backend/.env
```

**For Docker Compose:**
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/todoapp
```

**For Local PostgreSQL:**
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/todoapp
```

---

## 🚀 Step 5: Test Configuration

### 5.1 Test Backend

```bash
cd phase-2/backend

# Install dependencies
pip install -r requirements.txt

# Start backend (will use .env automatically)
uvicorn app.main:app --reload
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Visit: http://localhost:8000/docs (Swagger UI should load)

### 5.2 Test Frontend

```bash
cd phase-2/frontend

# Install dependencies
npm install

# Start frontend (will use .env automatically)
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Visit: http://localhost:5173 (Frontend should load)

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Generated strong JWT_SECRET_KEY (32+ characters, random)
- [ ] Changed default DATABASE_URL credentials
- [ ] Set DEBUG=false in backend/.env
- [ ] Updated CORS_ORIGINS to production domain only
- [ ] Never committed .env files to Git (they're in .gitignore)
- [ ] Stored production secrets in secure vault (AWS Secrets Manager, etc.)
- [ ] Used HTTPS in production (configure reverse proxy/load balancer)
- [ ] Enabled rate limiting in production
- [ ] Set up database backups
- [ ] Reviewed all environment variables

---

## 🐛 Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'dotenv'"

**Solution:**
```bash
pip install python-dotenv
```

### Problem: Backend can't read .env file

**Solution:**
```bash
# Check file exists
ls -la backend/.env

# Check file permissions
chmod 644 backend/.env

# Verify python-dotenv is installed
pip list | grep dotenv
```

### Problem: Frontend can't read .env variables

**Cause:** Vite requires restart after .env changes

**Solution:**
```bash
# Stop frontend (Ctrl+C)
# Restart
npm run dev
```

### Problem: "DATABASE connection failed"

**Check:**
1. PostgreSQL is running:
   ```bash
   docker-compose ps db
   # OR
   systemctl status postgresql
   ```

2. Database exists:
   ```bash
   docker-compose exec db psql -U postgres -l
   # Should list 'todoapp' database
   ```

3. DATABASE_URL is correct in .env

### Problem: CORS errors in browser

**Cause:** CORS_ORIGINS doesn't include frontend URL

**Solution:**
Update `backend/.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Restart backend server.

### Problem: JWT token invalid/expired

**Check:**
1. JWT_SECRET_KEY is same in backend/.env (don't change after generating tokens)
2. Token hasn't expired (default 24 hours)
3. Check browser console for token value

**Solution:**
- Logout and login again to get new token
- Clear localStorage: `localStorage.clear()`

---

## 📝 Environment Variable Reference

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | ✅ Yes | - | PostgreSQL connection string |
| JWT_SECRET_KEY | ✅ Yes | - | Secret for signing JWT tokens |
| JWT_ALGORITHM | No | HS256 | JWT signing algorithm |
| ACCESS_TOKEN_EXPIRE_HOURS | No | 24 | Token expiry in hours |
| CORS_ORIGINS | ✅ Yes | - | Allowed origins (comma-separated) |
| DEBUG | No | true | Enable debug mode |
| APP_NAME | No | Todo App API | Application name |
| LOG_LEVEL | No | INFO | Logging level |
| BCRYPT_ROUNDS | No | 12 | Password hashing rounds |

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | ✅ Yes | - | Backend API base URL |
| VITE_APP_NAME | No | Todo App | Application name |
| VITE_APP_VERSION | No | 1.0.0 | Application version |
| VITE_ENV | No | development | Environment name |

---

## 🌍 Environment-Specific Configurations

### Development (.env.development)

```env
# Backend
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp_dev
JWT_SECRET_KEY=dev_secret_key_not_for_production
DEBUG=true
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=DEBUG

# Frontend
VITE_API_URL=http://localhost:8000
VITE_ENV=development
```

### Staging (.env.staging)

```env
# Backend
DATABASE_URL=postgresql://staging_user:password@staging-db.example.com:5432/todoapp_staging
JWT_SECRET_KEY=staging_secure_random_key
DEBUG=false
CORS_ORIGINS=https://staging.todoapp.com
LOG_LEVEL=INFO

# Frontend
VITE_API_URL=https://api-staging.todoapp.com
VITE_ENV=staging
```

### Production (.env.production)

```env
# Backend
DATABASE_URL=postgresql://prod_user:strong_password@prod-db.example.com:5432/todoapp_prod
JWT_SECRET_KEY=production_ultra_secure_random_key_32_chars
DEBUG=false
CORS_ORIGINS=https://todoapp.com,https://www.todoapp.com
LOG_LEVEL=WARNING
BCRYPT_ROUNDS=12
RATE_LIMIT_PER_MINUTE=60

# Frontend
VITE_API_URL=https://api.todoapp.com
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
```

---

## 🔐 Secrets Management Best Practices

### Development
- Use `.env` files (never commit to Git)
- Share `.env.example` in repository
- Keep secrets local

### Production
**Option 1: Environment Variables (Simple)**
```bash
export DATABASE_URL="postgresql://..."
export JWT_SECRET_KEY="..."
```

**Option 2: Docker Secrets**
```yaml
services:
  backend:
    secrets:
      - db_password
      - jwt_secret
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

**Option 3: Cloud Secrets Manager (Recommended)**
- AWS Secrets Manager
- Google Secret Manager
- Azure Key Vault
- HashiCorp Vault

---

## 📚 Additional Resources

- [python-dotenv Documentation](https://github.com/theskumar/python-dotenv)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [12-Factor App Config](https://12factor.net/config)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated**: 2026-01-04
**Phase**: Phase-2 Full-Stack Web Application
