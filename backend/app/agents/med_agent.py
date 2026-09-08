# backend/app/agents/med_agent.py
# MedResponse Agent Logic — Interacts with 108 Emergency Health ICU Matrix
from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.health_server import get_hospital_icu_beds, dispatch_ambulances

async def run_med_agent(state: DisasterState) -> dict:
    h_data = await get_hospital_icu_beds("Wayanad")
    primary = h_data["hospitals_status"][0]["hospital_name"]
    beds = h_data["total_icu_beds_available"]
    
    await dispatch_ambulances(primary, 5)
    log = f"[MedResponse] 108 Emergency Health API: {beds} total ICU beds available across sector. Primary Triage Hospital selected: {primary} (5 ambulances en route)."
    
    return {
        "icu_beds_available": beds,
        "primary_triage_hospital": primary,
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
