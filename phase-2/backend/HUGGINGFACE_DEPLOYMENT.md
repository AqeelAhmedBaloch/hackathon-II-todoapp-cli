# 🚀 Hugging Face Spaces Deployment Guide

Complete guide to deploy your Todo App Backend to Hugging Face Spaces.

---

## 📋 Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **PostgreSQL Database**: Get a free database from:
   - [Neon](https://neon.tech) - Recommended
   - [Supabase](https://supabase.com)
   - [ElephantSQL](https://www.elephantsql.com)
   - [Railway](https://railway.app)

---

## 🎯 Step-by-Step Deployment

### **Step 1: Create New Space**

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Configure:
   - **Name**: `todo-app-backend` (or your choice)
   - **License**: MIT
   - **SDK**: Docker
   - **Visibility**: Public or Private

### **Step 2: Upload Backend Files**

Upload these files to your Space:

```
📁 Your Space Root
├── README.md              ✅ (with YAML frontmatter)
├── Dockerfile             ✅
├── .dockerignore          ✅
├── .python-version        ✅
├── requirements.txt       ✅
├── startup.sh             ✅
└── app/
    ├── __init__.py
    ├── main.py
    ├── core/
    │   ├── config.py
    │   ├── database.py
    │   └── database_init.py
    ├── models/
    ├── routers/
    └── schemas/
```

**Two Ways to Upload:**

#### Option A: Git Push (Recommended)
```bash
# Clone your Space
git clone https://huggingface.co/spaces/balochaqeel/todo-app-backend
cd todo-app-backend

# Copy backend files
cp -r /path/to/backend/* .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

#### Option B: Web Interface
- Use the **"Files"** tab in your Space
- Click **"Add file"** → **"Upload files"**
- Drag and drop all backend files

### **Step 3: Configure Environment Variables**

1. Go to your Space **Settings** tab
2. Scroll to **"Repository secrets"** or **"Variables"** section
3. Add these secrets:

#### Required Secrets

| Name | Value | Example |
|------|-------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET_KEY` | Secure random string | Generate below ⬇️ |

#### Recommended Secrets

| Name | Value | Example |
|------|-------|---------|
| `CORS_ORIGINS` | Your frontend URLs | `https://your-frontend.hf.space` |
| `DEBUG` | `false` | For production |
| `LOG_LEVEL` | `WARNING` | Less verbose logs |

#### Generate JWT Secret Key

**Option 1: Python**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Option 2: OpenSSL**
```bash
openssl rand -base64 32
```

**Option 3: Online**
- Use [Random.org](https://www.random.org/strings/)
- Generate a 32+ character string

### **Step 4: Get Your Database URL**

#### Using Neon (Recommended - Free PostgreSQL)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Add it as `DATABASE_URL` in HF Spaces secrets

#### Using Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Add it as `DATABASE_URL` in HF Spaces secrets

### **Step 5: Deploy and Verify**

1. After adding secrets, your Space will automatically rebuild
2. Wait for the build to complete (3-5 minutes)
3. Once running, test your endpoints:

```bash
# Health check
curl https://YOUR_USERNAME-todo-app-backend.hf.space/health

# API info
curl https://YOUR_USERNAME-todo-app-backend.hf.space/

# API docs
# Visit: https://YOUR_USERNAME-todo-app-backend.hf.space/docs
```

### **Step 6: Test Authentication**

```bash
# Register a user
curl -X POST https://YOUR_USERNAME-todo-app-backend.hf.space/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword123"
  }'

# Login
curl -X POST https://YOUR_USERNAME-todo-app-backend.hf.space/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=securepassword123"
```

---

## 🔍 Troubleshooting

### **Build Fails**

**Problem**: Space shows build error

**Solutions**:
1. Check **Build logs** in Space
2. Verify all files are uploaded correctly
3. Ensure `Dockerfile` is in root directory
4. Check `requirements.txt` for syntax errors

### **Database Connection Error**

**Problem**: `pydantic_core.ValidationError: DATABASE_URL Field required`

**Solutions**:
1. ✅ Verify `DATABASE_URL` is set in Space secrets
2. ✅ Check DATABASE_URL format is correct
3. ✅ Ensure database is accessible from internet
4. ✅ For Neon, add `?sslmode=require` at the end

### **JWT Errors**

**Problem**: Authentication not working

**Solutions**:
1. Verify `JWT_SECRET_KEY` is set
2. Generate a new secure key
3. Ensure key is at least 32 characters

### **CORS Errors**

**Problem**: Frontend can't connect

**Solutions**:
1. Add your frontend URL to `CORS_ORIGINS`
2. Format: `https://your-frontend.hf.space,http://localhost:5173`
3. Use comma-separated list, no spaces

### **Port Issues**

**Problem**: Service not accessible

**Solutions**:
1. ✅ Ensure Dockerfile uses port 7860
2. ✅ Check `app_port: 7860` in README.md YAML
3. ✅ Verify startup.sh uses correct port

---

## 🎨 Customize Your Space

### **Update Space Card**

Edit `README.md` YAML frontmatter:

```yaml
---
title: My Todo API
emoji: 🎯
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: true
---
```

### **Add Custom Domain**

1. Go to Space **Settings**
2. Scroll to **"Custom domain"**
3. Follow instructions to connect your domain

---

## 📊 Monitoring

### **Check Logs**

1. Go to your Space
2. Click **"Logs"** tab
3. View real-time application logs

### **Health Monitoring**

Monitor your API health:
```bash
# Automated monitoring
while true; do
  curl -s https://YOUR_USERNAME-todo-app-backend.hf.space/health
  sleep 60
done
```

---

## 🔄 Updates and Redeployment

### **Update Code**

```bash
# Make changes locally
git add .
git commit -m "Update feature X"
git push
```

Space will automatically rebuild and redeploy.

### **Update Environment Variables**

1. Go to Space **Settings**
2. Update secrets
3. Space will automatically restart

### **Rollback**

```bash
# View commit history
git log

# Rollback to previous version
git reset --hard COMMIT_HASH
git push --force
```

---

## ✅ Production Checklist

Before going live, ensure:

- [ ] `DATABASE_URL` is set and working
- [ ] `JWT_SECRET_KEY` is secure (32+ characters)
- [ ] `DEBUG` is set to `false`
- [ ] `CORS_ORIGINS` includes your frontend URL
- [ ] Database has proper backups enabled
- [ ] Tested all endpoints via `/docs`
- [ ] Authentication flow works
- [ ] CRUD operations for tasks work
- [ ] Health check returns 200 OK

---

## 🆘 Support

- **Hugging Face Docs**: [huggingface.co/docs/hub/spaces](https://huggingface.co/docs/hub/spaces)
- **Spaces Discord**: [hf.co/join/discord](https://hf.co/join/discord)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)

---

## 🎉 Success!

Your backend is now live at:
```
https://YOUR_USERNAME-todo-app-backend.hf.space
```

**Next Steps**:
1. Update frontend `VITE_API_URL` to point to your HF Space
2. Deploy frontend to Vercel/Netlify/HF Spaces
3. Test full-stack integration
4. Share your project!

---

**Built with FastAPI** 🚀 | **Deployed on Hugging Face Spaces** 🤗
