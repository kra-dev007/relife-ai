from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "ReLife AI API"
    app_tagline: str = "Diagnose. Refurbish. Resell. Don’t Discard."
    version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True
    host: str = "127.0.0.1"
    port: int = 8000

    # CORS origins
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
