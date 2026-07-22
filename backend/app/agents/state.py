# backend/app/agents/state.py
# LangGraph Shared Disaster State Schema
from typing import TypedDict, List, Dict, Any

class DisasterState(TypedDict):
    incident_active: bool
    incident_name: str
    location: str
    latitude: float
    longitude: float
    telemetry_logs: List[str]
    
    # WeatherIntel parameters
    precipitation_rate_mm_hr: float
    radar_z_reflectivity: float
    weather_warning_level: str
    
    # HydroMonitor parameters
    cwc_river_level_m: float
    cwc_danger_mark_m: float
    cwc_river_trend: str
    discharge_cusecs: float
    
    # GeoRisk parameters
    landslide_risk_score: float
    soil_shear_saturation_pct: float
    slope_angle_deg: float
    
    # RouteOptimizer parameters
    blocked_highways: List[str]
    evacuation_bypasses: List[str]
    
    # MedResponse parameters
    icu_beds_available: int
    primary_triage_hospital: str
    
    # PopDensity parameters
    exposed_households: int
    exposed_population: int
    
    # AlertBroadcast & Commander parameters
    recommended_action: str
    sachet_alert_status: str
    execution_completed_in_seconds: float
