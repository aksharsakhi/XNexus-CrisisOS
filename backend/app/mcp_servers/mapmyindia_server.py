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

from backend.app.services.routing_engine import routing_engine

@mcp.tool()
async def get_emergency_bypasses(region: str) -> dict:
    """Fetch MapmyIndia emergency detour routes using Dijkstra pathfinding around blocked road segments."""
    route_calc = routing_engine.compute_shortest_open_path(start_node="A", end_node="F")
    return {
        "region": region,
        "algorithm": route_calc["algorithm"],
        "blocked_roads": route_calc["blocked_roads_bypassed"],
        "recommended_detours": [route_calc["path_names"][1] if len(route_calc["path_names"]) > 1 else "Route 3 East Bypass Corridor"],
        "path_nodes": route_calc["path_names"],
        "optimal_distance_km": route_calc["optimal_distance_km"],
        "estimated_eta_minutes": route_calc["estimated_eta_minutes"]
    }

if __name__ == "__main__":
    mcp.run()
