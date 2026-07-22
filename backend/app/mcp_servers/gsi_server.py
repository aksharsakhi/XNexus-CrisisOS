# backend/app/mcp_servers/gsi_server.py
# MCP Tool Server for Geological Survey of India (GSI) Landslide & Soil Moisture
try:
    from fastmcp import FastMCP
except ImportError:
    class FastMCP:
        def __init__(self, name: str): self.name = name
        def tool(self):
            def decorator(func): return func
            return decorator
        def run(self): pass

import math

mcp = FastMCP("GSI-Geology-Server")

GSI_SECTOR_DATABASE = {
    "GSI-SEC-WYD": {
        "sector_name": "Chooralmala-Mundakkai Slope",
        "district": "Wayanad",
        "soil_moisture_shear_pct": 88.0,
        "slope_angle_deg": 38.5,
        "susceptibility_index": 0.88,
        "hazard_classification": "VERY_HIGH"
    },
    "GSI-SEC-UKD": {
        "sector_name": "Chamoli Highway Corridor",
        "district": "Chamoli",
        "soil_moisture_shear_pct": 74.0,
        "slope_angle_deg": 42.0,
        "susceptibility_index": 0.76,
        "hazard_classification": "HIGH"
    }
}

@mcp.tool()
async def get_landslide_susceptibility(sector_id: str) -> dict:
    """Fetch GSI soil shear saturation index, slope angle, and hazard classification."""
    data = GSI_SECTOR_DATABASE.get(sector_id)
    if not data:
        return {"error": f"GSI Sector '{sector_id}' not found in landslide database."}
    return data

@mcp.tool()
async def compute_combined_hazard_score(sector_id: str, rain_rate_mm_hr: float) -> dict:
    """
    Compute combined landslide hazard score (0.0 to 1.0) by integrating GSI slope parameters
    with real-time rainfall intensity from WeatherIntel.
    """
    sector = await get_landslide_susceptibility(sector_id)
    if "error" in sector:
        return sector
        
    soil = sector["soil_moisture_shear_pct"] / 100.0
    slope_rad = math.radians(sector["slope_angle_deg"])
    rain_weight = min(rain_rate_mm_hr / 60.0, 1.0)
    
    combined = 0.4 * soil + 0.3 * math.tan(slope_rad) + 0.3 * rain_weight
    combined = min(max(combined, 0.0), 1.0)
    
    return {
        "sector_id": sector_id,
        "sector_name": sector["sector_name"],
        "combined_hazard_score": round(combined, 2),
        "is_critical": combined >= 0.75,
        "recommendation": "EVACUATE_SLOPE" if combined >= 0.75 else "MONITOR"
    }

if __name__ == "__main__":
    mcp.run()
