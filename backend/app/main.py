# backend/app/main.py — FastAPI Gateway Server & WebSocket Live Telemetry Stream
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.config import settings
from backend.app.agents.graph import agent_runner

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="India's Multi-Agent AI Operating System for Autonomous Disaster Response"
)

# Enable CORS for local and staging access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.get("/api/health")
async def health_check():
    return {
        "status": "OPERATIONAL",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": "DEVELOPMENT_PREVIEW"
    }

@app.get("/api/telemetry")
async def get_active_telemetry():
    """Fetch current live telemetry state across Indian sectors."""
    return {
        "sectors": [
            {
                "region": "Wayanad, Kerala",
                "hazard_type": "FLOOD_LANDSLIDE",
                "status": "CRITICAL_EVACUATION",
                "river_level_m": 839.24,
                "danger_mark_m": 840.00,
                "rain_rate_mm_hr": 55.4,
                "landslide_risk": 0.88,
                "active_agents": 9
            },
            {
                "region": "Uttarakhand (Chamoli)",
                "hazard_type": "SLOPE_STABILITY",
                "status": "MONITORING_HIGH_RISK",
                "rain_rate_mm_hr": 32.1,
                "landslide_risk": 0.65,
                "active_agents": 9
            },
            {
                "region": "Assam (Brahmaputra)",
                "hazard_type": "RIVER_INUNDATION",
                "status": "NORMAL_MONITORING",
                "rain_rate_mm_hr": 12.0,
                "landslide_risk": 0.15,
                "active_agents": 9
            }
        ]
    }

@app.post("/api/trigger-incident")
async def trigger_disaster_incident(scenario: str = "Wayanad"):
    """Trigger an autonomous multi-agent disaster response cycle."""
    state = await agent_runner.execute_pipeline(initial_location=scenario)
    
    # Broadcast to WebSocket subscribers
    await manager.broadcast({
        "event": "INCIDENT_TRIGGERED",
        "scenario": scenario,
        "state": state
    })
    
    return {
        "status": "EXECUTION_COMPLETE",
        "scenario": scenario,
        "elapsed_seconds": state["execution_completed_in_seconds"],
        "recommended_action": state["recommended_action"],
        "logs": state["telemetry_logs"]
    }

@app.websocket("/ws/live-stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial status packet
        await websocket.send_json({
            "event": "CONNECTED",
            "message": "Connected to XNexus-CrisisOS Live Telemetry Stream"
        })
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming commands
            await websocket.send_json({
                "event": "ACK",
                "received": data
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
