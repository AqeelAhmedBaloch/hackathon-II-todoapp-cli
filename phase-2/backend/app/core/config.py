"""
Configuration settings for the application.
Loads environment variables from .env file.
Optimized for Hugging Face Spaces deployment.
"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, Field
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    # REQUIRED: Must be set in Hugging Face Space secrets
    DATABASE_URL: str = Field(
        ...,
        description="PostgreSQL connection string (required)"
    )

    # JWT Authentication
    JWT_SECRET_KEY: str = Field(
        default="CHANGE-THIS-IN-PRODUCTION",
        description="Secret key for JWT tokens (REQUIRED in production)"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

    # CORS
    CORS_ORIGINS: str = Field(
        default="*",
        description="Comma-separated list of allowed origins"
    )

    # Application
    APP_NAME: str = "Todo App API - Phase 2"
    DEBUG: bool = Field(
        default=False,
        description="Debug mode (set to false in production)"
    )
    API_VERSION: str = "1.0.0"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = Field(
        default=int(os.getenv("PORT", "7860")),
        description="Server port (Hugging Face uses 7860)"
    )

    # Security
    BCRYPT_ROUNDS: int = 12
    RATE_LIMIT_PER_MINUTE: int = 100

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = ""

    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra='ignore',
        env_file_encoding='utf-8'
    )

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list."""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    def model_post_init(self, __context):
        """Post-initialization validation and warnings."""
        # Warn if using default JWT secret in production
        if not self.DEBUG and self.JWT_SECRET_KEY == "CHANGE-THIS-IN-PRODUCTION":
            import warnings
            warnings.warn(
                "⚠️  WARNING: Using default JWT_SECRET_KEY in production! "
                "Please set a secure secret key in environment variables.",
                UserWarning
            )


# Global settings instance
settings = Settings()
