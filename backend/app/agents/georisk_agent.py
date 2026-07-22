# backend/app/agents/georisk_agent.py
# GeoRisk Agent Logic — Interacts with GSI Soil Saturation & Slope Stability Telemetry
from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.gsi_server import compute_combined_hazard_score

async def run_georisk_agent(state: DisasterState) -> dict:
    rain_rate = state.get("precipitation_rate_mm_hr", 55.4)
    gsi_calc = await compute_combined_hazard_score("GSI-SEC-WYD", rain_rate)
    
    score = gsi_calc["combined_hazard_score"]
    log = f"[GeoRisk] GSI Slope Stability: Combined Landslide Hazard Index calculated at {score} (CRITICAL > 0.75)."
    
    return {
        "landslide_risk_score": score,
        "soil_shear_saturation_pct": 88.0,
        "slope_angle_deg": 38.5,
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
