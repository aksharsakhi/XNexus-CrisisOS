# run.py — XNexus-CrisisOS Unified Launcher
import sys
import os
import uvicorn
import subprocess

def main():
    print("=" * 60)
    print("  🚀 XNexus-CrisisOS — Autonomous Disaster Command Center")
    print("  India's Multi-Agent AI Operating System for Disaster Mitigation")
    print("=" * 60)
    print("  • Starting FastAPI Gateway Server on http://localhost:8000")
    print("  • WebSocket Live Stream Endpoint: ws://localhost:8000/ws/live-stream")
    print("  • Presentation Deck: http://localhost:8080/ideation/index.html")
    print("  • GIS Command Center Portal: http://localhost:8000/frontend/index.html")
    print("=" * 60)

    # Serve static frontend directory via FastAPI
    from backend.app.main import app
    from fastapi.staticfiles import StaticFiles

    frontend_path = os.path.join(os.path.dirname(__file__), "frontend")
    ideation_path = os.path.join(os.path.dirname(__file__), "ideation")

    if os.path.exists(frontend_path):
        app.mount("/frontend", StaticFiles(directory=frontend_path, html=True), name="frontend")
    if os.path.exists(ideation_path):
        app.mount("/ideation", StaticFiles(directory=ideation_path, html=True), name="ideation")

    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False)

if __name__ == "__main__":
    main()
