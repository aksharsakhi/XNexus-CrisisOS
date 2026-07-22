# backend/app/agents/graph.py
# LangGraph Disaster State Machine Compilation
import time
from backend.app.agents.state import DisasterState
from backend.app.agents.weather_agent import run_weather_agent
from backend.app.agents.hydro_agent import run_hydro_agent
from backend.app.agents.georisk_agent import run_georisk_agent
from backend.app.agents.route_agent import run_route_agent
from backend.app.agents.med_agent import run_med_agent
from backend.app.agents.alert_agent import run_alert_agent
from backend.app.agents.commander_agent import run_commander_agent

class MultiAgentMeshRunner:
    def __init__(self):
        pass

    async def execute_pipeline(self, initial_location: str = "Wayanad, Kerala") -> DisasterState:
        start_time = time.time()
        
        state: DisasterState = {
            "incident_active": False,
            "incident_name": "Monsoon Hydrological Disaster",
            "location": initial_location,
            "latitude": 11.6854,
            "longitude": 76.1320,
            "telemetry_logs": ["XNexus-CrisisOS Multi-Agent Mesh Initialized."],
            "precipitation_rate_mm_hr": 0.0,
            "radar_z_reflectivity": 0.0,
            "weather_warning_level": "STANDBY",
            "cwc_river_level_m": 0.0,
            "cwc_danger_mark_m": 0.0,
            "cwc_river_trend": "unknown",
            "discharge_cusecs": 0.0,
            "landslide_risk_score": 0.0,
            "soil_shear_saturation_pct": 0.0,
            "slope_angle_deg": 0.0,
            "blocked_highways": [],
            "evacuation_bypasses": [],
            "icu_beds_available": 0,
            "primary_triage_hospital": "",
            "exposed_households": 0,
            "exposed_population": 0,
            "recommended_action": "",
            "sachet_alert_status": "STANDBY",
            "execution_completed_in_seconds": 0.0
        }

        # Step 1: WeatherIntel Agent
        w_res = await run_weather_agent(state)
        state.update(w_res)
        
        # Step 2: HydroMonitor Agent
        h_res = await run_hydro_agent(state)
        state.update(h_res)
        
        # Step 3: GeoRisk Agent
        g_res = await run_georisk_agent(state)
        state.update(g_res)
        
        # Step 4: RouteOptimizer Agent
        r_res = await run_route_agent(state)
        state.update(r_res)
        
        # Step 5: MedResponse Agent
        m_res = await run_med_agent(state)
        state.update(m_res)
        
        # Step 6: Commander Core Agent
        c_res = await run_commander_agent(state)
        state.update(c_res)
        
        # Step 7: AlertBroadcast Agent
        a_res = await run_alert_agent(state)
        state.update(a_res)
        
        elapsed = round(time.time() - start_time, 2)
        state["execution_completed_in_seconds"] = elapsed
        state["telemetry_logs"].append(f"[System Execution Engine] MULTI-AGENT DISPATCH CYCLE COMPLETED IN {elapsed} SECONDS.")
        
        return state

agent_runner = MultiAgentMeshRunner()
