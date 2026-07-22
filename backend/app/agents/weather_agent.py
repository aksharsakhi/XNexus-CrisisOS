# backend/app/agents/weather_agent.py
# WeatherIntel Agent Logic — Interacts with IMD Radar Telemetry
from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.imd_server import IMD_RADAR_REGISTRY, calculate_rain_rate

async def run_weather_agent(state: DisasterState) -> dict:
    radar_data = IMD_RADAR_REGISTRY.get("IMD-RADAR-WYD", {
        "radar_reflectivity_z": 48.5,
        "precipitation_density_mm_hr": 55.4,
        "warning_level": "RED_ALERT"
    })
    
    z_val = radar_data["radar_reflectivity_z"]
    rain_calc = await calculate_rain_rate(z_val)
    precip_rate = rain_calc["rain_rate_mm_hr"]
    
    log = f"[WeatherIntel] IMD Doppler Radar (Z={z_val} dBZ) calculated precipitation density: {precip_rate} mm/hr."
    
    return {
        "precipitation_rate_mm_hr": precip_rate,
        "radar_z_reflectivity": z_val,
        "weather_warning_level": radar_data["warning_level"],
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
