# backend/app/agents/alert_agent.py
# AlertBroadcast Agent Logic — Interacts with NDMA Sachet CAP Cell Broadcast Gateway
from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.sachet_server import generate_cap_xml, dispatch_cell_broadcast

async def run_alert_agent(state: DisasterState) -> dict:
    lat = state.get("latitude", 11.6854)
    lng = state.get("longitude", 76.1320)
    
    # Generate Malayalam CAP XML broadcast payload
    cap = await generate_cap_xml(
        alert_id="NDMA-WAYANAD-20260722-001",
        headline="വയനാട് മിന്നൽ പ്രളയ മുന്നറിയിപ്പ്",
        description="ഉയർന്ന പ്രദേശങ്ങളിലേക്ക് മാറുക. റൂട്ട് 3 സ്വീകരിക്കുക.",
        language_code="ml-IN",
        latitude=lat,
        longitude=lng
    )
    
    disp = await dispatch_cell_broadcast(cap["alert_id"], 840)
    log = f"[AlertBroadcast] NDMA Sachet Gateway: CAP v1.2 XML payload generated. Multilingual broadcast dispatched to {disp['cell_towers_notified']} local towers in sector polygon."
    
    return {
        "sachet_alert_status": "BROADCAST_SUCCESS_840_TOWERS",
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
