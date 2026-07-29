try:
    from fastmcp import FastMCP
except ImportError:
    class FastMCP:
        def __init__(self, name: str): self.name = name
        def tool(self):
            def decorator(func): return func
            return decorator
        def run(self): pass

mcp = FastMCP("IMD-Weather-Server")

from backend.app.services.live_ingestion import live_ingestor
from backend.app.services.physics_engine import physics_engine

IMD_RADAR_REGISTRY = {
    "IMD-RADAR-WYD": {
        "station_name": "Kochi Doppler Radar array",
        "sector": "Wayanad & Western Ghats",
        "azimuth_deg": 182.4,
        "radar_reflectivity_z": 48.5,  # dBZ
        "precipitation_density_mm_hr": 55.4,
        "warning_level": "RED_ALERT"
    }
}

@mcp.tool()
async def get_radar_reflectivity(radar_id: str) -> dict:
    """Fetch Doppler radar Z-reflectivity and live RainViewer tile metadata."""
    live_radar = await live_ingestor.fetch_rainviewer_radar()
    live_weather = await live_ingestor.fetch_open_meteo_weather(lat=11.6854, lon=76.1320)
    
    data = IMD_RADAR_REGISTRY.get(radar_id, IMD_RADAR_REGISTRY["IMD-RADAR-WYD"]).copy()
    data["precipitation_density_mm_hr"] = live_weather.get("precipitation_mm", data["precipitation_density_mm_hr"])
    if data["precipitation_density_mm_hr"] > 20:
        data["warning_level"] = "RED_ALERT"
    else:
        data["warning_level"] = "NORMAL"
        
    data["live_rainviewer_tile"] = live_radar.get("tile_template", "")
    data["live_api_status"] = live_weather.get("status")
    return data

@mcp.tool()
async def calculate_rain_rate(reflectivity_z: float) -> dict:
    """Calculate rain rate R (mm/hr) using Marshall-Palmer relationship."""
    return physics_engine.marshall_palmer_rain_rate(reflectivity_z)

if __name__ == "__main__":
    mcp.run()
