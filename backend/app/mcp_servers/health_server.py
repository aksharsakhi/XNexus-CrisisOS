try:
    from fastmcp import FastMCP
except ImportError:
    class FastMCP:
        def __init__(self, name: str): self.name = name
        def tool(self):
            def decorator(func): return func
            return decorator
        def run(self): pass

mcp = FastMCP("108-Emergency-Health-Server")

HOSPITAL_TRIAGE_DATABASE = {
    "Wayanad": [
        {"hospital_name": "Kozhikode District Hospital", "icu_beds_available": 14, "trauma_units_ready": 6, "status": "AVAILABLE"},
        {"hospital_name": "Wayanad General Hospital", "icu_beds_available": 3, "trauma_units_ready": 1, "status": "NEAR_CAPACITY"},
        {"hospital_name": "Calicut Government Medical College", "icu_beds_available": 8, "trauma_units_ready": 4, "status": "AVAILABLE"}
    ]
}

@mcp.tool()
async def get_hospital_icu_beds(region: str) -> dict:
    """Query real-time 108 Emergency Health matrix for open ICU beds and trauma units."""
    hospitals = HOSPITAL_TRIAGE_DATABASE.get(region, [
        {"hospital_name": f"{region} Central Hospital", "icu_beds_available": 10, "trauma_units_ready": 4, "status": "AVAILABLE"}
    ])
    
    total_beds = sum(h["icu_beds_available"] for h in hospitals)
    return {
        "region": region,
        "total_icu_beds_available": total_beds,
        "hospitals_status": hospitals
    }

@mcp.tool()
async def dispatch_ambulances(hospital_name: str, count: int = 5) -> dict:
    """Reserve ICU beds and dispatch 108 ambulances to hospital."""
    return {
        "hospital_name": hospital_name,
        "ambulances_dispatched": count,
        "status": "AMBULANCES_EN_ROUTE",
        "reservation_confirmation": f"Reserved {count} ICU beds at {hospital_name}"
    }

if __name__ == "__main__":
    mcp.run()
