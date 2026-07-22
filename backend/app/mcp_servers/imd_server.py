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

IMD_RADAR_REGISTRY = {
    "IMD-RADAR-WYD": {
        "station_name": "Kochi Doppler Radar array",
        "sector": "Wayanad & Western Ghats",
        "azimuth_deg": 182.4,
        "radar_reflectivity_z": 48.5,  # dBZ
        "precipitation_density_mm_hr": 55.4,
        "warning_level": "RED_ALERT"
    },
    "IMD-RADAR-DEL": {
        "station_name": "Palam Doppler Radar array",
        "sector": "NCR & Yamuna Basin",
        "azimuth_deg": 45.0,
        "radar_reflectivity_z": 32.0,
        "precipitation_density_mm_hr": 14.2,
        "warning_level": "YELLOW_WATCH"
    }
}

@mcp.tool()
async def get_radar_reflectivity(radar_id: str) -> dict:
    """Fetch Doppler radar Z-reflectivity and calculated precipitation density (mm/hr)."""
    data = IMD_RADAR_REGISTRY.get(radar_id)
    if not data:
        return {"error": f"IMD Radar station '{radar_id}' not found."}
    return data

@mcp.tool()
async def calculate_rain_rate(reflectivity_z: float) -> dict:
    """
    Calculate rainfall rate R (mm/hr) from radar reflectivity Z factor (dBZ)
    using Marshall-Palmer relationship for Indian monsoon: Z = 200 * R^1.6
    """
    if reflectivity_z <= 0:
        rate = 0.0
    else:
        # Convert dBZ to Z: Z = 10^(dBZ/10)
        z_factor = 10 ** (reflectivity_z / 10.0)
        rate = (z_factor / 200.0) ** (1.0 / 1.6)
        
    return {
        "reflectivity_dBZ": reflectivity_z,
        "rain_rate_mm_hr": round(rate, 2),
        "is_heavy": rate >= 45.0
    }

if __name__ == "__main__":
    mcp.run()
