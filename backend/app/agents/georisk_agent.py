from backend.app.agents.state import DisasterState
from backend.app.mcp_servers.gsi_server import compute_combined_hazard_score
from backend.app.services.llm_service import gemini_llm

async def run_georisk_agent(state: DisasterState) -> dict:
    rain_rate = state.get("precipitation_rate_mm_hr", 55.4)
    gsi_calc = await compute_combined_hazard_score("GSI-SEC-WYD", rain_rate)
    
    score = gsi_calc["combined_hazard_score"]
    fs = gsi_calc.get("factor_of_safety_FS", 0.733)
    
    # Real Gemini LLM reasoning synthesis
    llm_reasoning = await gemini_llm.reason_georisk(fs, score, 38.5)
    log = f"[GeoRisk] {llm_reasoning}"
    
    return {
        "landslide_risk_score": score,
        "soil_shear_saturation_pct": 88.0,
        "slope_angle_deg": 38.5,
        "telemetry_logs": state["telemetry_logs"] + [log]
    }
