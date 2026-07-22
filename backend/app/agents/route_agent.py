# backend/app/agents/route_agent.py
# RouteOptimizer Agent Logic — Interacts with MapmyIndia (Mappls) Detour Engine
from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.mapmyindia_server import get_emergency_bypasses

async def run_route_agent(state: DisasterState) -> dict:
    region = state.get("location", "Wayanad")
    m_data = await get_emergency_bypasses("Wayanad")
    
    blocked = [b["road"] for b in m_data["blocked_roads"]]
    detours = m_data["recommended_detours"]
    
    log = f"[RouteOptimizer] MapmyIndia Routing: NH-76 blocked due to landslide debris. Emergency Detours calculated: {', '.join(detours)}."
    
    return {
        "blocked_highways": blocked,
        "evacuation_bypasses": detours,
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
