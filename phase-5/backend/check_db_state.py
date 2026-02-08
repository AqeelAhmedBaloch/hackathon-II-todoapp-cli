import sqlite3

def check_db():
    conn = sqlite3.connect('todoapp.db')
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"Tables: {tables}")
    
    if 'workspaces' in tables:
        print("Workspaces table exists.")
        
    if 'workspace_members' in tables:
        print("Workspace_members table exists.")
        
    if 'tasks' in tables:
        cursor.execute("PRAGMA table_info(tasks)")
        columns = [row[1] for row in cursor.fetchall()]
        print(f"Tasks columns: {columns}")
        if 'workspace_id' in columns:
            print("Tasks has workspace_id column.")
        else:
            print("Tasks MISSING workspace_id column.")

    conn.close()

if __name__ == "__main__":
    check_db()
