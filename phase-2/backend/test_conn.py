import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

def test_connection():
    load_dotenv()
    url = os.getenv("DATABASE_URL")
    print(f"Testing connection to: {url[:20]}...")
    
    if not url or "<DB_HOST>" in url:
        print("ERROR: DATABASE_URL is missing or contains placeholders.")
        sys.exit(1)
        
    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print(f"SUCCESS: {result.fetchone()}")
    except Exception as e:
        print(f"FAILURE: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection()
