# Deploy guide — Todo App backend (FastAPI)

This document shows quick deploy steps for two recommended hosts: Render and Fly.io. It also includes local test/run commands and the environment variables needed.

Files added:
- [.env.example](./.env.example)

Local quick test
```bash
# from repository root
cd phase-2/backend
cp .env.example .env   # edit values
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# or with Docker
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```

Render (recommended, simple GitHub integration)
1. Push your repo to GitHub.
2. Create a Render account and New → Web Service → Connect GitHub.
3. Choose your repo and branch.
4. Set the Build Command to blank (Render will use Dockerfile) and the Start Command will be the default from `Dockerfile`.
5. In the Environment section, add these Environment Variables (use production values):
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
   - `CORS_ORIGINS`
   - `DEBUG=false`
6. If you need Postgres, create a Render PostgreSQL service and use its `DATABASE_URL`.
7. Deploy and watch logs. Verify `https://<your-service>.onrender.com/health` and `/docs`.

Fly.io (alternative, global regions)
```bash
# install flyctl: https://fly.io/docs/hands-on/install-flyctl/
fly launch    # choose Dockerfile, app name, region
fly secrets set DATABASE_URL=... JWT_SECRET_KEY=...
fly deploy
```

Post-deploy verification
- Visit `/health` endpoint.
- Visit `/docs` for API docs.
- Check logs in the platform dashboard.
- Ensure DB tables created (app uses SQLAlchemy `Base.metadata.create_all`).

CI/CD notes
- Render auto-deploys on GitHub push by default. For GitHub Actions based deploys, create a workflow to build/push an image to a registry and then trigger a deploy.
