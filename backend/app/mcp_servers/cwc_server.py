try:
    from fastmcp import FastMCP
except ImportError:
    class FastMCP:
        def __init__(self, name: str): self.name = name
        def tool(self):
            def decorator(func): return func
            return decorator
        def run(self): pass

mcp = FastMCP("CWC-Hydrology-Server")

# Active Station Registry (Mock / Production Sync)
CWC_STATION_DATABASE = {
    "CWC-KBL-03": {
        "station_name": "Kabini Reservoir Gauge",
        "river": "Kabini",
        "district": "Wayanad",
        "state": "Kerala",
        "latitude": 11.6854,
        "longitude": 76.1320,
        "current_level_meters": 839.24,
        "warning_limit_meters": 838.50,
        "danger_mark_meters": 840.00,
        "discharge_cusecs": 45000,
        "trend": "rising (+19.2 cm/hr)"
    },
    "CWC-YMN-01": {
        "station_name": "Old Railway Bridge Gauge",
        "river": "Yamuna",
        "district": "Central Delhi",
        "state": "Delhi",
        "latitude": 28.6664,
        "longitude": 77.2472,
        "current_level_meters": 204.80,
        "warning_limit_meters": 204.50,
        "danger_mark_meters": 205.33,
        "discharge_cusecs": 12000,
        "trend": "stable"
    },
    "CWC-BRA-05": {
        "station_name": "Nematighat Gauge",
        "river": "Brahmaputra",
        "district": "Jorhat",
        "state": "Assam",
        "latitude": 26.8621,
        "longitude": 94.2255,
        "current_level_meters": 85.04,
        "warning_limit_meters": 85.00,
        "danger_mark_meters": 85.80,
        "discharge_cusecs": 85000,
        "trend": "rising (+8.5 cm/hr)"
    }
}

@mcp.tool()
async def get_river_level(station_id: str) -> dict:
    """Fetch current water level, warning limit, danger mark, and discharge rate for a CWC station."""
    data = CWC_STATION_DATABASE.get(station_id)
    if not data:
        return {"error": f"CWC Station '{station_id}' not found in active telemetry registry."}
    return data

@mcp.tool()
async def check_danger_breach(station_id: str) -> dict:
    """Check if a CWC station has exceeded statutory danger mark and calculate breach margin."""
    data = await get_river_level(station_id)
    if "error" in data:
        return data
        
    current = data["current_level_meters"]
    warning = data["warning_limit_meters"]
    danger = data["danger_mark_meters"]
    
    status = "NORMAL"
    if current >= danger:
        status = "CRITICAL_DANGER"
    elif current >= warning:
        status = "WARNING_EXCEEDED"
        
    return {
        "station_id": station_id,
        "station_name": data["station_name"],
        "status": status,
        "current_level": current,
        "danger_mark": danger,
        "breach_margin_meters": round(current - danger, 2),
        "trend": data["trend"]
    }

if __name__ == "__main__":
    mcp.run()
