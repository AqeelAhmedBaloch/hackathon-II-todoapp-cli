# 🐙 Phase-3: GitHub Setup Guide

Follow these steps to sync your local code to a new GitHub repository.

## 🎯 Step-by-Step

### 1. Create Repository
1. Go to [GitHub New Repository](https://github.com/new).
2. Name it `todo-app-cli-p3`.
3. Do **not** initialize with README or License.

### 2. Initialize Git Locally
Open your terminal in `d:\Q4-Hackathon\Hackthon-2\hackathon-II-todoapp-cli`:
```bash
git init
git add .
git commit -m "Phase-3: Subtasks, Notifications, and Real-time sync"
```

### 3. Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/todo-app-cli-p3.git
git branch -M main
git push -u origin main
```

### 4. Benefits
- **Automated Deploys**: Every push to GitHub will trigger a new build on Vercel.
- **Code Safety**: Your work is backed up in the cloud.
