# 🌐 Phase-3: Vercel Deployment Guide

Follow these steps to deploy your **Phase-3 Frontend** to Vercel.

## 📋 Prerequisites
1. **Vercel Account**: [Sign up here](https://vercel.com/signup)
2. **GitHub Account**: To connect your repository.

## 🎯 Step-by-Step Deployment

### 1. Push to GitHub
If your code isn't on GitHub yet:
1. Create a new repository on GitHub.
2. Push your `phase-3` folder (or the whole project).

### 2. Import Project to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/new).
2. Connect your GitHub and select the repository.
3. **Root Directory**: Select `phase-3/frontend`.
4. **Framework Preset**: Vite.

### 3. Configure Environment Variables
In Vercel **Settings** → **Environment Variables**, add:
- `VITE_API_URL`: Your Hugging Face Space URL (e.g., `https://balochaqeel-todo-app-backend-p3.hf.space/api`).
- `VITE_WS_URL`: Your Hugging Face Space WebSocket URL (e.g., `wss://balochaqeel-todo-app-backend-p3.hf.space/ws`).

### 4. Deploy
Click **Deploy**. Vercel will build your app and give you a production URL.
