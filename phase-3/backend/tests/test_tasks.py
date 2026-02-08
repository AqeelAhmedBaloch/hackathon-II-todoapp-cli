import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.models.user import User
from app.models.task import Task

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_tasks.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def auth_token():
    # Register and login to get token
    client.post(
        "/api/auth/register",
        json={"email": "taskuser@example.com", "password": "password123", "full_name": "Task User"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "taskuser@example.com", "password": "password123"}
    )
    return response.json()["access_token"]

def test_create_task(auth_token):
    response = client.post(
        "/api/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_get_tasks(auth_token):
    # Create a task first
    client.post(
        "/api/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_update_task(auth_token):
    # Create a task
    res = client.post(
        "/api/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    task_id = res.json()["id"]
    
    response = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Updated Task", "description": "Updated Description"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Task"

def test_delete_task(auth_token):
    # Create a task
    res = client.post(
        "/api/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    task_id = res.json()["id"]
    
    response = client.delete(
        f"/api/tasks/{task_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 204

def test_data_isolation():
    # User A registers and creates a task
    client.post("/api/auth/register", json={"email": "usera@example.com", "password": "password", "full_name": "User A"})
    a_login = client.post("/api/auth/login", json={"email": "usera@example.com", "password": "password"})
    a_token = a_login.json()["access_token"]
    a_task = client.post("/api/tasks", json={"title": "User A Task"}, headers={"Authorization": f"Bearer {a_token}"}).json()
    
    # User B registers and tries to access User A's task
    client.post("/api/auth/register", json={"email": "userb@example.com", "password": "password", "full_name": "User B"})
    b_login = client.post("/api/auth/login", json={"email": "userb@example.com", "password": "password"})
    b_token = b_login.json()["access_token"]
    
    # Try to access User A's task via GET /{id}
    response = client.get(f"/api/tasks/{a_task['id']}", headers={"Authorization": f"Bearer {b_token}"})
    assert response.status_code == 404 # Or 403 depending on implementation, but 404 is common for non-existent/unauthorized resource
