import os
from typing import List, Set
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RoomRedesign AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI Engine & Hugging Face Config
    # Users can set HUGGINGFACE_API_KEY in backend/.env or via UI settings
    HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")
    HUGGINGFACE_MODEL_ID: str = os.getenv(
        "HUGGINGFACE_MODEL_ID", 
        "timbrooks/instruct-pix2pix"
    )
    REPLICATE_API_TOKEN: str = os.getenv("REPLICATE_API_TOKEN", "")
    
    # Active AI provider: "auto", "huggingface", "replicate", or "local-engine"
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "auto")
    
    # Image constraints
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
    ALLOWED_EXTENSIONS: Set[str] = {"jpg", "jpeg", "png", "webp"}
    TARGET_WIDTH: int = 1024
    TARGET_HEIGHT: int = 768
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
