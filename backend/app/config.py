# backend/app/config.py — Configuration settings & Threshold parameters
import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "XNexus-CrisisOS"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Telemetry Threshold Limits
    HEAVY_RAINFALL_THRESHOLD_MM_HR: float = 45.0
    CRITICAL_LANDSLIDE_RISK_THRESHOLD: float = 0.75
    EMERGENCY_RESPONSE_TARGET_SECONDS: float = 300.0  # 5 minutes target
    
    # Default Coordinates (Wayanad, Kerala)
    DEFAULT_LATITUDE: float = 11.6854
    DEFAULT_LONGITUDE: float = 76.1320
    DEFAULT_REGION: str = "Wayanad, Kerala"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WS_PATH: str = "/ws/live-stream"

settings = Settings()
