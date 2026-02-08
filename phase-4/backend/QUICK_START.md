# ⚡ Quick Start - Deploy to Hugging Face in 5 Minutes

Fast-track deployment guide for your Todo App Backend.

---

## 🎯 3 Steps to Deploy

### **Step 1: Get Database (2 min)**

**Option A: Neon (Recommended)**
```
1. Go to: https://console.neon.tech
2. Click "Create Project"
3. Copy connection string
```

**Option B: Supabase**
```
1. Go to: https://supabase.com
2. Create new project
3. Settings → Database → Copy URI
```

Your `DATABASE_URL` should look like:
```
postgresql://user:password@host.region.provider.tech/database?sslmode=require
```

### **Step 2: Generate Secret (30 sec)**

Run in terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Save the output as your `JWT_SECRET_KEY`.

### **Step 3: Deploy (2 min)**

#### Push to Hugging Face:

```bash
# Clone your Space
git clone https://huggingface.co/spaces/balochaqeel/todo-app-backend
cd todo-app-backend

# Copy backend files
cp -r "D:\Q4-Hackathon\Hackthon-2\hackathon-II-todoapp-cli\phase-2\backend\*" .

# Commit and push
git add .
git commit -m "Deploy backend API"
git push
```

#### Add Secrets:

1. Go to Space Settings: https://huggingface.co/spaces/balochaqeel/todo-app-backend/settings
2. Find "Repository secrets"
3. Add:
   - `DATABASE_URL` = Your database connection string
   - `JWT_SECRET_KEY` = Your generated secret
   - `CORS_ORIGINS` = Your frontend URL (optional)

---

## ✅ Verify Deployment

Once deployed (3-5 min build time), test:

```bash
# Health check
curl https://balochaqeel-todo-app-backend.hf.space/health

# Expected: {"status":"healthy"}
```

Visit docs:
```
https://balochaqeel-todo-app-backend.hf.space/docs
```

---

## 🎉 Done!

Your API is live at:
```
https://balochaqeel-todo-app-backend.hf.space
```

### **Next Steps:**

1. Test registration: `/docs` → POST `/auth/register`
2. Test login: `/docs` → POST `/auth/login`
3. Update frontend API URL to your HF Space
4. Deploy frontend and test integration

---

## 📚 Need Help?

- **Full Guide**: `HUGGINGFACE_DEPLOYMENT.md`
- **Troubleshooting**: See `HUGGINGFACE_DEPLOYMENT.md` Section 🔍
- **Environment Template**: `.env.huggingface`

---

## 🚨 Troubleshooting

### Build Fails
```
✓ Check all files uploaded
✓ Verify Dockerfile exists
✓ Check logs tab in Space
```

### Database Error
```
✓ DATABASE_URL set in secrets?
✓ Add ?sslmode=require to URL
✓ Test connection from another tool
```

### Can't Access API
```
✓ Space status is "Running"?
✓ Check /health endpoint
✓ Verify port 7860 in configs
```

---

**Time to deploy: ~5 minutes** ⏱️

Good luck! 🚀
