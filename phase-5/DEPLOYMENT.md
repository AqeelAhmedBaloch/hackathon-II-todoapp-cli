# Deployment Guide - Phase 2 (Full-Stack Web App)

This guide outlines the steps to deploy the Todo Application (Phase 2) to a production environment.

## Prerequisites
- Docker and Docker Compose
- Domain name (optional for local production testing)
- SMTP server (for future notification features)

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://user:password@db:5432/todoapp
JWT_SECRET_KEY=your_very_secure_secret_key
CORS_ORIGINS=https://yourdomain.com,app.yourdomain.com
DEBUG=False
```

## Deployment with Docker Compose
1. Clone the repository
2. Configure `.env` files
3. Run deployment command:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## Manual Backend Deployment (without Docker)
1. Install dependencies: `pip install -r requirements.txt`
2. Run migrations: `python init_db.py`
3. Start production server:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
   ```

## Manual Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using Nginx or Apache.
