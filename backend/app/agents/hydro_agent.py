# backend/app/agents/hydro_agent.py
# HydroMonitor Agent Logic — Interacts with CWC Gauging Telemetry
from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.cwc_server import get_river_level, check_danger_breach

async def run_hydro_agent(state: DisasterState) -> dict:
    cwc_data = await get_river_level("CWC-KBL-03")
    breach = await check_danger_breach("CWC-KBL-03")
    
    log = f"[HydroMonitor] CWC Station KBL-03 (Kabini): Level {cwc_data['current_level_meters']}m (Danger: {cwc_data['danger_mark_meters']}m). Status: {breach['status']} ({cwc_data['trend']})."
    
    return {
        "cwc_river_level_m": cwc_data["current_level_meters"],
        "cwc_danger_mark_m": cwc_data["danger_mark_meters"],
        "cwc_river_trend": cwc_data["trend"],
        "discharge_cusecs": cwc_data["discharge_cusecs"],
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
