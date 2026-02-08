# 🚀 Phase-3: Hugging Face Deployment Guide

Follow these steps to deploy your **Phase-3 Backend** to Hugging Face Spaces.

## 📋 Prerequisites
1. **Hugging Face Account**: [Sign up here](https://huggingface.co/join)
2. **PostgreSQL Database**: Get a free database from [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
   - **IMPORTANT**: Copy the connection string (e.g., `postgresql://user:pass@host/db?sslmode=require`).

## 🎯 Step-by-Step Deployment

### 1. Create a New Space
1. Go to [Hugging Face Spaces](https://huggingface.co/new-space).
2. **Name**: `todo-app-backend-p3`
3. **SDK**: Docker (choose the default "Blank" or "Dockerfile" template).
4. **Visibility**: Public (recommended for testing).

### 2. Upload and Deploy (Fastest Way)
Instead of Git, you can use the Hugging Face CLI. Run these in your terminal:

1. **Login**:
   ```bash
   huggingface-cli login
   ```
   (Paste your token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))

2. **Deploy**:
   ```bash
   cd phase-3/backend
   huggingface-cli upload balochaqeel/phase-3-backend . --repo-type space
   ```

### 3. Configure Secrets
Go to your Space **Settings** → **Repository secrets** and add:
- `DATABASE_URL`: Your PostgreSQL link.
- `JWT_SECRET_KEY`: A random string (e.g., `python -c "import secrets; print(secrets.token_urlsafe(32))"`).
- `CORS_ORIGINS`: `https://your-vercel-app-url.vercel.app` (Add after frontend deployment).

### 4. Verify
Once the build is "Running", visit:
`https://huggingface.co/spaces/YOUR_USERNAME/todo-app-backend-p3/docs`
