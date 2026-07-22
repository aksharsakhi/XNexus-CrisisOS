try:
    from fastmcp import FastMCP
except ImportError:
    class FastMCP:
        def __init__(self, name: str): self.name = name
        def tool(self):
            def decorator(func): return func
            return decorator
        def run(self): pass

mcp = FastMCP("MapmyIndia-Routing-Server")

MOCK_ROUTES_DATABASE = {
    "Wayanad": {
        "blocked_segments": [
            {"road": "NH-76 (Kalpetta-Chooralmala Pass)", "reason": "Landslide Debris Flow", "status": "BLOCKED"}
        ],
        "available_bypasses": [
            {"route_name": "Route 3 (National Highway East Elevated Bypass)", "eta_minutes": 22, "status": "OPEN_CLEAR"},
            {"route_name": "Route 5 (State Highway 12 Elevated Corridor)", "eta_minutes": 28, "status": "OPEN_CLEAR"}
        ]
    }
}

@mcp.tool()
async def get_emergency_bypasses(region: str) -> dict:
    """Fetch MapmyIndia emergency detour routes around blocked NHAI highways and landslide zones."""
    data = MOCK_ROUTES_DATABASE.get(region, {
        "blocked_segments": [],
        "available_bypasses": [
            {"route_name": "Primary Evacuation Corridor 1", "eta_minutes": 15, "status": "OPEN_CLEAR"}
        ]
    })
    return {
        "region": region,
        "blocked_roads": data["blocked_segments"],
        "recommended_detours": [b["route_name"] for b in data["available_bypasses"]],
        "detour_details": data["available_bypasses"]
    }

if __name__ == "__main__":
    mcp.run()
