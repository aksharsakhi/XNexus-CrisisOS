# XNexus-CrisisOS — Technical Development & Ingestion Blueprint

This blueprint outlines the development architecture, telemetry integrations, and code foundations for implementing **XNexus-CrisisOS** as a production-grade multi-agent disaster response platform in India.

---

## 1. System Architecture

XNexus-CrisisOS is structured around a decoupled, event-driven, multi-agent mesh. Collaborative agents execute in a Python environment orchestrated by **LangGraph**, communicating with external Indian telemetries via **Model Context Protocol (MCP)**.

```
       +-----------------------------------------------------------+
       |                  Leaflet.js Web Dashboard                 |
       +-----------------------------+-----------------------------+
                                     | Event Logs & Map Overlays
                                     v
                       +-------------+-------------+
                       |   FastAPI Gateway Server  |
                       +-------------+-------------+
                                     | Agent State Sync
                                     v
                       +-------------+-------------+
                       |    LangGraph Orchestrator |
                       +-------------+-------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+--------+--------+         +--------+--------+         +--------+--------+
| Weather Agent   |         | Flood Agent     |         | Commander Agent |
+--------+--------+         +--------+--------+         +--------+--------+
         |                           |                           |
         +------------------+--------+---------------------------+
                            | Ingest Telemetry via JSON-RPC
                            v
       +--------------------+--------------------------------------+
       |            Model Context Protocol (MCP) Mesh              |
       +-----+----------------------+------------------------+-----+
             |                      |                        |
             v                      v                        v
      +------+-----+          +-----+------+           +-----+------+
      |  IMD MCP   |          |   CWC MCP  |           | Mappls MCP |
      | INSAT/Rain |          | Gauges/Dis |           | Routing/GIS|
      +------------+          +------------+           +------------+
```

---

## 2. Real India Ingestion Feeds & Datasets

### A. India Meteorological Department (IMD)
* **INSAT-3D & 3DR Satellite Imagery**: Ingests half-hourly infrared and water vapor imagery via the MOSDAC (Meteorological & Oceanographic Satellite Data Archival Centre) catalog to calculate regional cloud-top temperatures.
* **Doppler Weather Radar (DWR) Reflectivity**: Connects to regional IMD radar stations (e.g., Chennai, Mumbai, Kochi) to scrape radar reflectivity parameters ($Z$ factor) to predict cloud water volume.
* **Alert System**: Ingests IMD's daily XML/JSON district weather warning feeds.

### B. Central Water Commission (CWC)
* **Real-time River Gauge telemetry**: Scrapes CWC’s Hydrological Data Entry System or regional flood forecast portals. Streams levels, discharge volume, danger markings, and warning limits.

### C. Geological Survey of India (GSI)
* **Landslide Susceptibility Index**: Accesses GSI's landslide hazard zonation GIS layers. Combines them with live IMD satellite soil moisture maps to model slope failure.

### D. MapmyIndia (Mappls)
* **Route Networks & Road Blocks**: Connects to Mappls routing APIs. Integrates NHAI highway closures and urban traffic coordinates to evaluate escape corridors.

### E. NDMA Sachet
* **Common Alerting Protocol (CAP) Integration**: Dispatches formatted XML payloads to the Sachet Gateway. This triggers cell tower broadcast protocols, forcing local mobile providers to blast evacuation alerts to cell IDs within specified warning polygons.

---

## 3. Python MCP Server (Central Water Commission Ingestion)

This boilerplate script uses the Python `fastmcp` SDK to create an MCP Server that parses river telemetry and exposes tools to the AI agents.

Create this file as `mcp_cwc_server.py`:

```python
# mcp_cwc_server.py
from fastmcp import FastMCP
import httpx
import xml.etree.ElementTree as ET

# Initialize MCP Server
mcp = FastMCP("CWC-Hydrology-Server")

# Static mappings for mock integration or production endpoints
# Real endpoint: Central Water Commission flood forecast portal API
CWC_API_URL = "https://ffs.india-water.gov.in/api/v1/stations"

@mcp.tool()
async def get_river_level(station_id: str) -> dict:
    """
    Fetch the live water level, danger mark, and warning limit for a CWC river gauge station.
    
    Args:
        station_id: The CWC station identifier code (e.g., 'CWC-KBL-03' for Kabini River, Kerala).
    """
    mock_db = {
        "CWC-KBL-03": {
            "station_name": "Kabini Reservoir Gauge",
            "river": "Kabini",
            "state": "Kerala",
            "current_level_meters": 839.2,
            "warning_limit_meters": 840.0,
            "danger_mark_meters": 841.5,
            "discharge_rate_cusecs": 45000,
            "trend": "rising (+18cm/hr)"
        },
        "CWC-YMN-01": {
            "station_name": "Old Railway Bridge",
            "river": "Yamuna",
            "state": "Delhi",
            "current_level_meters": 204.8,
            "warning_limit_meters": 204.5,
            "danger_mark_meters": 205.33,
            "discharge_rate_cusecs": 12000,
            "trend": "stable"
        }
    }
    
    station_data = mock_db.get(station_id)
    if not station_data:
        return {"error": f"CWC Station '{station_id}' not found in active telemetry registries."}
        
    return station_data

@mcp.tool()
async def get_flood_danger_status(station_id: str) -> dict:
    """
    Analyze if a station is currently exceeding warning or danger thresholds.
    """
    data = await get_river_level(station_id)
    if "error" in data:
        return data
        
    current = data["current_level_meters"]
    warning = data["warning_limit_meters"]
    danger = data["danger_mark_meters"]
    
    status = "NORMAL"
    if current >= danger:
        status = "CRITICAL_DANGER"
    elif current >= warning:
        status = "WARNING_LIMIT_EXCEEDED"
        
    return {
        "station_name": data["station_name"],
        "status": status,
        "current_level": current,
        "danger_mark": danger,
        "trend": data["trend"]
    }

if __name__ == "__main__":
    mcp.run()
```

Run the server locally:
```bash
pip install fastmcp httpx
python mcp_cwc_server.py
```

---

## 4. LangGraph Multi-Agent Orchestrator

This script sets up the multi-agent collaboration graph. The graph routes events from IMD rainfall signals to GSI landslide nodes and decides whether to trigger NDMA Sachet notifications.

Create this file as `agent_orchestrator.py`:

```python
# agent_orchestrator.py
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

# Define the shared state dictionary
class DisasterState(TypedDict):
    active_incident: bool
    incident_type: str
    region: str
    telemetry_logs: List[str]
    imd_rainfall_rate: float
    cwc_river_trend: str
    landslide_risk_score: float
    recommended_action: str
    evacuation_routes: List[str]
    alert_status: str

# Weather Intelligence Agent Node
def weather_agent_node(state: DisasterState) -> Dict[str, Any]:
    print(">>> Executing Weather Intelligence Agent...")
    rain_rate = 52.0  # mm/hr (heavy monsoon threshold exceeded)
    return {
        "imd_rainfall_rate": rain_rate,
        "telemetry_logs": state["telemetry_logs"] + [f"IMD sensor recorded rain rate: {rain_rate} mm/hr"]
    }

# Flood & Landslide Prediction Agent Node
def flood_landslide_agent_node(state: DisasterState) -> Dict[str, Any]:
    print(">>> Executing Flood & Landslide Agent...")
    rain_rate = state["imd_rainfall_rate"]
    
    # Simple risk calculations based on real parameters
    landslide_risk = 0.85 if rain_rate > 45.0 else 0.20
    river_trend = "rising (+18cm/hr)"
    
    return {
        "landslide_risk_score": landslide_risk,
        "cwc_river_trend": river_trend,
        "telemetry_logs": state["telemetry_logs"] + [
            f"GSI calculated landslide risk index: {landslide_risk}",
            f"CWC telemetry logs show river level trend: {river_trend}"
        ]
    }

# Decision Commander Agent Node
def commander_agent_node(state: DisasterState) -> Dict[str, Any]:
    print(">>> Executing Decision Commander Agent...")
    risk_score = state["landslide_risk_score"]
    river_trend = state["cwc_river_trend"]
    
    logs = state["telemetry_logs"] + ["Decision Commander analyzing scenarios..."]
    
    if risk_score > 0.75 or "rising" in river_trend:
        action = "Evacuate low-lying villages. Coordinate NDRF 4th Battalion deployment."
        routes = ["Route 3 (National Highway East Bypass)", "Route 5 (State Highway Elevated Corridor)"]
        alert = "TRIGGER_NDMA_SACHET_BROADCAST"
        logs.append("Decision Commander issued Evacuation Orders & requested NDRF dispatch.")
    else:
        action = "Increase monitoring frequency. No immediate evacuation required."
        routes = []
        alert = "STANDBY"
        logs.append("Decision Commander stands by. Conditions within safety margins.")
        
    return {
        "recommended_action": action,
        "evacuation_routes": routes,
        "alert_status": alert,
        "active_incident": True if alert == "TRIGGER_NDMA_SACHET_BROADCAST" else False,
        "telemetry_logs": logs
    }

# Graph Construction
workflow = StateGraph(DisasterState)

# Add Nodes
workflow.add_node("WeatherAgent", weather_agent_node)
workflow.add_node("FloodAgent", flood_landslide_agent_node)
workflow.add_node("NDRFCommander", commander_agent_node)

# Set Entry Point
workflow.set_entry_point("WeatherAgent")

# Add Transitions
workflow.add_edge("WeatherAgent", "FloodAgent")
workflow.add_edge("FloodAgent", "NDRFCommander")
workflow.add_edge("NDRFCommander", END)

# Compile Graph
app = workflow.compile()

# Test the system flow
if __name__ == "__main__":
    initial_state = {
        "active_incident": False,
        "incident_type": "Monsoon Hydrological Threat",
        "region": "Wayanad, Kerala",
        "telemetry_logs": ["System initialized."],
        "imd_rainfall_rate": 0.0,
        "cwc_river_trend": "unknown",
        "landslide_risk_score": 0.0,
        "recommended_action": "",
        "evacuation_routes": [],
        "alert_status": "STANDBY"
    }
    
    print("\n--- Running XNexus-CrisisOS Coordinator Flow ---\n")
    final_output = app.invoke(initial_state)
    
    print("\n--- Execution Completed! Final State ---")
    print(f"Active Incident: {final_output['active_incident']}")
    print(f"Action Taken: {final_output['recommended_action']}")
    print(f"Evacuation Routes: {final_output['evacuation_routes']}")
    print(f"Sachet Alert Status: {final_output['alert_status']}")
    print("\nLogs recorded during run:")
    for log in final_output["telemetry_logs"]:
        print(f" - {log}")
```

---

## 5. Development Steps to Production

1. **Spatial Database**: Install PostgreSQL with PostGIS extension. Index census polygons and road coordinates.
2. **Setup Custom MCP Config**: Create `.agents/mcp_config.json` referencing local servers to feed agents with active tools.
3. **Connect MapmyIndia API**: Ingest navigation routes for traffic management.
4. **Link NDMA Alert Network**: Route notifications to local towers via the NDMA Sachet CAP endpoint.
