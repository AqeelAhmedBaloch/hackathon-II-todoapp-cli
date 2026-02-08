from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from app.core.config import settings
import json
import os

# Define scopes
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

class GoogleCalendarService:
    def __init__(self):
        # We can use a client_secret.json file or environment variables
        self.client_secrets_file = "client_secret.json"
        
    def _get_flow_config(self):
        """Helper to get flow configuration from file or environment."""
        if os.path.exists(self.client_secrets_file):
            return {"from_file": True, "config": self.client_secrets_file}
        
        if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
            config = {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
                }
            }
            return {"from_file": False, "config": config}
        
        return None

    def get_auth_url(self, redirect_uri: str):
        """Generates the Google OAuth authorization URL."""
        flow_config = self._get_flow_config()
        
        from fastapi import HTTPException
        if not flow_config:
             # Hackathon Fix: Return None instead of raising error
             return None

        if flow_config["from_file"]:
            flow = Flow.from_client_secrets_file(
                flow_config["config"],
                scopes=SCOPES,
                redirect_uri=redirect_uri
            )
        else:
            flow = Flow.from_client_config(
                flow_config["config"],
                scopes=SCOPES,
                redirect_uri=redirect_uri
            )
        
        auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
        return auth_url

    def get_credentials(self, code: str, redirect_uri: str):
        """Exchanges the auth code for credentials."""
        flow_config = self._get_flow_config()
        
        from fastapi import HTTPException
        if not flow_config:
             raise HTTPException(
                 status_code=400, 
                 detail="Google Calendar is not configured."
             )

        if flow_config["from_file"]:
            flow = Flow.from_client_secrets_file(
                flow_config["config"],
                scopes=SCOPES,
                redirect_uri=redirect_uri
            )
        else:
            flow = Flow.from_client_config(
                flow_config["config"],
                scopes=SCOPES,
                redirect_uri=redirect_uri
            )
            
        flow.fetch_token(code=code)
        return flow.credentials

    def create_event(self, credentials_json: str, task_data: dict):
        """Creates an event in the user's primary calendar."""
        creds = Credentials.from_authorized_user_info(json.loads(credentials_json), SCOPES)
        service = build('calendar', 'v3', credentials=creds)

        event = {
            'summary': task_data.get('title'),
            'description': task_data.get('description', ''),
            'start': {
                'dateTime': task_data.get('due_date'), # Format: '2023-01-01T09:00:00-07:00'
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': task_data.get('due_date'), # Assuming 1 hour or same time for now
                'timeZone': 'UTC',
            },
        }

        # If it's a deadline, maybe set end time to +1 hour
        # This logic can be refined
        
        event = service.events().insert(calendarId='primary', body=event).execute()
        return event.get('htmlLink')

calendar_service = GoogleCalendarService()
