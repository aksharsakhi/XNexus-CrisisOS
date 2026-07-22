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

from backend.app.services.physics_engine import physics_engine

@mcp.tool()
async def get_landslide_susceptibility(sector_id: str) -> dict:
    """Fetch GSI soil shear saturation index, slope angle, and hazard classification."""
    data = GSI_SECTOR_DATABASE.get(sector_id, GSI_SECTOR_DATABASE["GSI-SEC-WYD"])
    return data

@mcp.tool()
async def compute_combined_hazard_score(sector_id: str, rain_rate_mm_hr: float) -> dict:
    """Compute infinite slope stability Factor of Safety (FS) using geotechnical equations."""
    sector = await get_landslide_susceptibility(sector_id)
    slope_angle = sector.get("slope_angle_deg", 38.5)
    saturation_ratio = min(max(sector.get("soil_moisture_shear_pct", 88.0) / 100.0 + (rain_rate_mm_hr / 200.0), 0.5), 1.0)
    
    fs_calc = physics_engine.infinite_slope_factor_of_safety(
        slope_angle_deg=slope_angle,
        water_table_ratio=saturation_ratio
    )
    
    return {
        "sector_id": sector_id,
        "sector_name": sector["sector_name"],
        "factor_of_safety_FS": fs_calc["factor_of_safety_FS"],
        "combined_hazard_score": fs_calc["landslide_hazard_index"],
        "is_critical": fs_calc["factor_of_safety_FS"] < 1.1,
        "recommendation": "EVACUATE_SLOPE" if fs_calc["factor_of_safety_FS"] < 1.1 else "MONITOR"
    }

if __name__ == "__main__":
    mcp.run()
