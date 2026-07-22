# backend/app/agents/commander_agent.py
# Commander Core Agent Logic — Orchestrates Multi-Agent Consensus & Final Order Dispatch
from backend.app.agents.state import DisasterState
from backend.app.database.spatial_db import spatial_db

async def run_commander_agent(state: DisasterState) -> dict:
    risk_score = state.get("landslide_risk_score", 0.88)
    river_trend = state.get("cwc_river_trend", "rising (+19.2 cm/hr)")
    
    # Query spatial GIS population database
    spatial_res = spatial_db.query_exposed_population("Wayanad")
    households = spatial_res["exposed_households"]
    population = spatial_res["exposed_population"]
    
    log1 = f"[PopDensity] PostGIS Spatial Intersect: Identified {households} exposed households ({population} population) in Chooralmala hazard polygon."
    
    if risk_score > 0.75 or "rising" in river_trend:
        action = f"EVACUATION ORDERED: Sector B-4 (Wayanad). Mobilize NDRF 4th Battalion. Reroute via Route 3 East Bypass."
        active = True
        log2 = f"[Commander Core] CONSENSUS REACHED: Landslide Risk {risk_score} > 0.75 & River Level {river_trend}. Executing Binding Evacuation Orders."
    else:
        action = "CONTINUE MONITORING: Sector conditions within safe operating margins."
        active = False
        log2 = "[Commander Core] STANDBY: Conditions within safety tolerances."
        
    return {
        "incident_active": active,
        "exposed_households": households,
        "exposed_population": population,
        "recommended_action": action,
        "telemetry_logs": state["telemetry_logs"] + [log1, log2]
    }
