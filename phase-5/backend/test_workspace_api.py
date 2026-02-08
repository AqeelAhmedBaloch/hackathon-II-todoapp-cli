import requests
import sys

BASE_URL = "http://localhost:8000"

def test_workspace_flow():
    # 1. Register/Login a user
    email = "test_workspace_user@example.com"
    password = "password123"
    
    print(f"Authenticating as {email}...")
    
    # Try register
    try:
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": password,
            "full_name": "Test Workspace User"
        })
    except:
        pass # User might exist

    # Login
    auth_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email,
        "password": password
    })
    
    if auth_resp.status_code != 200:
        print(f"Login failed: {auth_resp.text}")
        return
        
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Create Workspace
    print("Creating workspace...")
    ws_data = {
        "name": "My AI Startup",
        "description": "Building the future of AI"
    }
    create_resp = requests.post(f"{BASE_URL}/api/workspaces/", json=ws_data, headers=headers)
    
    if create_resp.status_code != 201:
        print(f"Create workspace failed: {create_resp.text}")
        return
        
    workspace = create_resp.json()
    print(f"Workspace created: {workspace['id']} - {workspace['name']}")
    
    # 3. List Workspaces
    print("Listing workspaces...")
    list_resp = requests.get(f"{BASE_URL}/api/workspaces/", headers=headers)
    workspaces = list_resp.json()
    print(f"Found {len(workspaces)} workspaces.")
    
    # 4. Get Workspace Details
    if workspaces:
        ws_id = workspaces[0]['id']
        print(f"Getting details for workspace {ws_id}...")
        get_resp = requests.get(f"{BASE_URL}/api/workspaces/{ws_id}", headers=headers)
        if get_resp.status_code == 200:
            print("Workspace details retrieved successfully.")
        else:
            print(f"Failed to get details: {get_resp.text}")

if __name__ == "__main__":
    test_workspace_flow()
