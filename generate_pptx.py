# generate_pptx.py — Generator for XNexus_CrisisOS_Presentation.pptx
import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # Set 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    COLOR_BG = RGBColor(3, 5, 9)          # #030509 Dark Background
    COLOR_CARD = RGBColor(15, 20, 32)      # Dark Card surface
    COLOR_CYAN = RGBColor(0, 240, 255)     # #00f0ff Cyan Accent
    COLOR_PURPLE = RGBColor(123, 97, 255)  # #7b61ff Purple Accent
    COLOR_RED = RGBColor(255, 77, 106)     # #ff4d6a Red Alert
    COLOR_GREEN = RGBColor(0, 230, 118)    # #00e676 Green Success
    COLOR_TEXT = RGBColor(232, 237, 245)   # Light Body Text
    COLOR_DIM = RGBColor(107, 122, 153)    # Muted Subtext
    COLOR_WHITE = RGBColor(255, 255, 255)  # Pure White

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, badge_text, title_text, sub_text=None):
        # Badge
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = txBox.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = badge_text.upper()
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN

        # Title
        txBox2 = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
        tf2 = txBox2.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = title_text
        p2.font.name = "Arial"
        p2.font.size = Pt(26)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_WHITE

        # Optional Subtext
        if sub_text:
            txBox3 = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.5))
            tf3 = txBox3.text_frame
            tf3.word_wrap = True
            p3 = tf3.paragraphs[0]
            p3.text = sub_text
            p3.font.name = "Arial"
            p3.font.size = Pt(13)
            p3.font.color.rgb = COLOR_DIM

    # ==========================================
    # SLIDE 1: HERO
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    add_bg(slide1)

    # Title Card Shape
    shape = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1))
    shape.fill.solid()
    shape.fill.fore_color.rgb = COLOR_CARD
    shape.line.color.rgb = COLOR_CYAN

    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.5)
    tf.margin_right = Inches(0.5)

    p0 = tf.paragraphs[0]
    p0.text = "XNEXUS — CRISISOS FOR INDIA"
    p0.font.name = "Arial"
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_CYAN
    p0.alignment = PP_ALIGN.CENTER

    p1 = tf.add_paragraph()
    p1.text = "XNEXUS.OS"
    p1.font.name = "Arial"
    p1.font.size = Pt(56)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.alignment = PP_ALIGN.CENTER

    p2 = tf.add_paragraph()
    p2.text = "AUTONOMOUS DISASTER COMMAND CENTER"
    p2.font.name = "Arial"
    p2.font.size = Pt(16)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_PURPLE
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf.add_paragraph()
    p3.text = "\nAn intelligent multi-agent operating system that predicts, coordinates, and autonomously manages disaster response in real time across India's most vulnerable regions."
    p3.font.name = "Arial"
    p3.font.size = Pt(14)
    p3.font.color.rgb = COLOR_TEXT
    p3.alignment = PP_ALIGN.CENTER

    p4 = tf.add_paragraph()
    p4.text = "\nTELEMETRY INTEGRATED: IMD Doppler Radar · CWC River Gauges · GSI Landslide Indices · MapmyIndia · NDMA Sachet · 108 Emergency Health"
    p4.font.name = "Arial"
    p4.font.size = Pt(11)
    p4.font.bold = True
    p4.font.color.rgb = COLOR_CYAN
    p4.alignment = PP_ALIGN.CENTER

    # ==========================================
    # SLIDE 2: THE PROBLEM STATEMENT
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg(slide2)
    add_header(slide2, "02 / THE PROBLEM", "People Are Dying Because Agencies Can't Coordinate", "India has world-class sensor networks (IMD, CWC, GSI), but they operate in absolute data silos. Manual phone chains create fatal delays.")

    # Stat 1
    s1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(3.6), Inches(1.8))
    s1.fill.solid()
    s1.fill.fore_color.rgb = COLOR_CARD
    s1.line.color.rgb = COLOR_RED
    tf1 = s1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "2,000+ Deaths / Yr"
    p.font.size = Pt(22); p.font.bold = True; p.font.color.rgb = COLOR_RED
    p2 = tf1.add_paragraph()
    p2.text = "Annual mortality from floods alone in India (NDMA 2023)."
    p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # Stat 2
    s2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(2.2), Inches(3.6), Inches(1.8))
    s2.fill.solid()
    s2.fill.fore_color.rgb = COLOR_CARD
    s2.line.color.rgb = COLOR_RED
    tf2 = s2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "$86 Billion Loss"
    p.font.size = Pt(22); p.font.bold = True; p.font.color.rgb = COLOR_RED
    p2 = tf2.add_paragraph()
    p2.text = "Cumulative economic damage from disasters (World Bank)."
    p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # Stat 3
    s3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(2.2), Inches(3.6), Inches(1.8))
    s3.fill.solid()
    s3.fill.fore_color.rgb = COLOR_CARD
    s3.line.color.rgb = COLOR_RED
    tf3 = s3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "75% Districts At Risk"
    p.font.size = Pt(22); p.font.bold = True; p.font.color.rgb = COLOR_RED
    p2 = tf3.add_paragraph()
    p2.text = "Three-fourths of Indian districts are disaster-prone."
    p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # Case Studies Card
    cs = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.6), Inches(2.6))
    cs.fill.solid()
    cs.fill.fore_color.rgb = COLOR_CARD
    cs.line.color.rgb = COLOR_PURPLE
    tfc = cs.text_frame
    tfc.word_wrap = True
    p = tfc.paragraphs[0]
    p.text = "REAL HISTORICAL CASE STUDIES & COORDINATION FAILURES"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_PURPLE

    p_c1 = tfc.add_paragraph()
    p_c1.text = "• Wayanad Landslides (July 2024 - 400+ Dead): Landslides struck at 2:00 AM. CWC upstream telemetry, GSI soil moisture, and IMD rain alerts were never cross-analyzed in real time."
    p_c1.font.size = Pt(11); p_c1.font.color.rgb = COLOR_TEXT

    p_c2 = tfc.add_paragraph()
    p_c2.text = "• Kerala Floods (August 2018 - 483 Dead): 35 major dams opened simultaneously without synchronized downstream evacuation modeling. Rescue fleets arrived 6+ hours late."
    p_c2.font.size = Pt(11); p_c2.font.color.rgb = COLOR_TEXT

    p_c3 = tfc.add_paragraph()
    p_c3.text = "• Traditional 100-Minute Warning Friction: IMD Alert (45 min) → DM Office (35 min) → NDRF Dispatch (22 min) = 100+ minutes total delay."
    p_c3.font.size = Pt(11); p_c3.font.bold = True; p_c3.font.color.rgb = COLOR_RED

    # ==========================================
    # SLIDE 3: PROPOSED SOLUTION
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg(slide3)
    add_header(slide3, "03 / PROPOSED SOLUTION", "What We're Building: XNexus-CrisisOS", "Replacing the manual 100-minute phone-call chain with an autonomous multi-agent AI operating system.")

    # Left: Today
    b1 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.7))
    b1.fill.solid(); b1.fill.fore_color.rgb = COLOR_CARD; b1.line.color.rgb = COLOR_RED
    tf = b1.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "TODAY: MANUAL PHONE CHAIN (100+ MIN)"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_RED
    steps_today = [
        "1. IMD Doppler detects heavy rainfall (T + 0m)",
        "2. Fax/Email alert sent to District Magistrate (T + 45m)",
        "3. DM office calls CWC officials for river levels (T + 80m)",
        "4. NDRF dispatched via manual phone call (T + 95m)",
        "5. Standard sirens blown (no route guidance given)",
        "\nRESULT: 100+ minutes delay. Less than 10 min warning for families."
    ]
    for st in steps_today:
        p_s = tf.add_paragraph()
        p_s.text = st
        p_s.font.size = Pt(11); p_s.font.color.rgb = COLOR_TEXT

    # Right: XNexus
    b2 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.2), Inches(5.6), Inches(4.7))
    b2.fill.solid(); b2.fill.fore_color.rgb = COLOR_CARD; b2.line.color.rgb = COLOR_GREEN
    tf = b2.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "WITH XNEXUS: AUTONOMOUS MESH (< 5 MIN)"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_GREEN
    steps_xnexus = [
        "1. IMD, CWC, GSI feeds ingested concurrently via MCP (T + 0s)",
        "2. WeatherIntel & HydroMonitor agents reason jointly (T + 15s)",
        "3. RouteOptimizer maps detours around blocked NHAI roads (T + 30s)",
        "4. MedResponse triages 108 ICU hospital bed availability (T + 45s)",
        "5. NDMA Sachet cell broadcast sent to local towers (T + 60s)",
        "\nRESULT: Under 5 minutes total response. Automatic life-saving routing."
    ]
    for st in steps_xnexus:
        p_s = tf.add_paragraph()
        p_s.text = st
        p_s.font.size = Pt(11); p_s.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 4: THE 9 AI AGENTS
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg(slide4)
    add_header(slide4, "04 / MULTI-AGENT ARCHITECTURE", "India-Focused 9-Agentic Framework", "Nine specialized AI agents collaborating in real time using Indian government telemetry.")

    agents = [
        ("🛰️ WeatherIntel", "IMD Doppler Radar & INSAT-3D", "Tracks cloud reflectivity & rain rate"),
        ("🌊 HydroMonitor", "CWC River Gauges", "Monitors river heights & danger marks"),
        ("⛰️ GeoRisk", "GSI Landslide Indices", "Calculates soil shear & slope hazard"),
        ("🗺️ RouteOptimizer", "MapmyIndia (Mappls) API", "Computes detours around blocked roads"),
        ("📱 AlertBroadcast", "NDMA Sachet Gateway", "Formats & dispatches multilingual CAP alerts"),
        ("🏥 MedResponse", "108 Health API", "Triages hospital ICU beds & ambulances"),
        ("👥 PopDensity", "Census Spatial Polygons", "Estimates households in hazard zone"),
        ("🏗️ InfraWatch", "NHAI & Rail Sensors", "Monitors bridge integrity & railway tracks"),
        ("🎖️ Commander Core", "Orchestrator Core", "Synthesizes data & executes binding orders")
    ]

    for idx, (name, src, desc) in enumerate(agents):
        row = idx // 3
        col = idx % 3
        x = Inches(0.8 + col * 3.9)
        y = Inches(2.2 + row * 1.6)

        box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.7), Inches(1.4))
        box.fill.solid(); box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CYAN if idx < 8 else COLOR_RED
        tf = box.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = name
        p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_WHITE
        p2 = tf.add_paragraph()
        p2.text = f"Feed: {src}\n{desc}"
        p2.font.size = Pt(9.5); p2.font.color.rgb = COLOR_DIM

    # ==========================================
    # SLIDE 5: CORE CAPABILITIES & DATA FEEDS
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_bg(slide5)
    add_header(slide5, "05 / CORE CAPABILITIES", "Real Indian Telemetry Data Feeds", "Direct integration with statutory Indian emergency data providers.")

    caps = [
        ("01. IMD Doppler Weather Radar", "Real-time reflectivity (Z factor) and cloud azimuth density mapping.", COLOR_CYAN),
        ("02. CWC River Gauge Network", "Scrapes station water levels, discharge cusecs, and statutory danger marks.", COLOR_CYAN),
        ("03. GSI Landslide Susceptibility", "Evaluates soil saturation, shear strength, and hill slope stability.", COLOR_PURPLE),
        ("04. MapmyIndia Detour Engine", "Autonomous pathfinding rerouting rescue fleets away from NHAI landslides.", COLOR_PURPLE),
        ("05. NDMA Sachet Cell Broadcast", "Multilingual cell-tower SMS warnings forced to phones in hazard polygons.", COLOR_RED),
        ("06. 108 Emergency Health Triage", "Real-time ICU/trauma bed availability matrix and ambulance dispatch.", COLOR_GREEN)
    ]

    for idx, (title, desc, color) in enumerate(caps):
        row = idx // 3
        col = idx % 3
        x = Inches(0.8 + col * 3.9)
        y = Inches(2.2 + row * 2.4)

        box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.7), Inches(2.1))
        box.fill.solid(); box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = color
        tf = box.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = f"\n{desc}"
        p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 6: THE "WOW" USP
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_bg(slide6)
    add_header(slide6, "06 / THE 'WOW' USP", "Beyond Alerting: Real-Data Autonomous Decisions", "Why XNexus-CrisisOS stands out from legacy dashboard software.")

    usps = [
        ("01. Multi-Agency Data Fusion", "Agents from IMD, CWC, NDRF, MapmyIndia, and 108-Health share a semantic memory space."),
        ("02. CWC-to-Road Graph Intelligence", "Flood inundation shapes directly overlay NHAI road graphs, auto-computing detours."),
        ("03. Multilingual Cell Broadcast", "NDMA Sachet protocol pushes Hindi, English, and local alerts directly to cell towers."),
        ("04. Tested on Real Wayanad Data", "Modeled against Kabini reservoir discharge records and 2024 Wayanad flood maps."),
        ("05. 100% India-Native Infrastructure", "Zero dependency on foreign mapping or cloud tools. Built on Indian APIs."),
        ("06. Zero-Latency Hospital Triage", "Queries 108 health API to route casualties only to hospitals with verified ICU beds.")
    ]

    for idx, (title, desc) in enumerate(usps):
        row = idx // 3
        col = idx % 3
        x = Inches(0.8 + col * 3.9)
        y = Inches(2.2 + row * 2.4)

        box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.7), Inches(2.1))
        box.fill.solid(); box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CYAN if idx == 1 else COLOR_PURPLE
        tf = box.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = COLOR_WHITE
        p2 = tf.add_paragraph()
        p2.text = f"\n{desc}"
        p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 7: MCP INTEGRATION FRAMEWORK
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_bg(slide7)
    add_header(slide7, "07 / ARCHITECTURE", "Model Context Protocol (MCP) Integration Mesh", "Open standard connecting LLM agents to government APIs via JSON-RPC.")

    b_mcp = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(11.6), Inches(4.7))
    b_mcp.fill.solid(); b_mcp.fill.fore_color.rgb = COLOR_CARD; b_mcp.line.color.rgb = COLOR_PURPLE
    tf = b_mcp.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "MCP SERVER RACK ARCHITECTURE"
    p.font.size = Pt(16); p.font.bold = True; p.font.color.rgb = COLOR_PURPLE

    mcp_items = [
        "• MCP-IMD-WEATHER  --> Scrapes INSAT-3D infrared cloud temperature and Doppler Z-reflectivity.",
        "• MCP-CWC-HYDRO    --> Parses Central Water Commission river gauge station water levels & discharge rates.",
        "• MCP-GSI-GEO      --> Evaluates GSI landslide hazard zonation GIS layers & soil moisture indices.",
        "• MCP-MAPMYINDIA   --> Connects to MapmyIndia routing engine to compute emergency bypass routes.",
        "• MCP-NDMA-SACHET  --> Formats OASIS CAP v1.2 XML cell broadcast payloads for target mobile towers.",
        "• MCP-108-HEALTH   --> Queries state 108 emergency health databases for live ICU bed availability."
    ]
    for mi in mcp_items:
        p_m = tf.add_paragraph()
        p_m.text = mi
        p_m.font.size = Pt(12); p_m.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 8: END-TO-END DEVELOPMENT PROCESS
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_bg(slide8)
    add_header(slide8, "08 / DEVELOPMENT LIFECYCLE", "End-to-End Technical Development Process", "The complete 5-step engineering pipeline from raw data scrapers to cell dispatch.")

    dev_steps = [
        ("STEP 01: Telemetry Data Scrapers", "Ingests IMD Doppler radar reflectivity, CWC water levels, and GSI soil layers into JSON feeds every 15 min.", COLOR_CYAN),
        ("STEP 02: FastMCP Tool Servers", "Wraps government endpoints into standardized Model Context Protocol (MCP) JSON-RPC tool servers.", COLOR_PURPLE),
        ("STEP 03: LangGraph State Engine", "Constructs an event-driven DisasterState graph coordinating Weather, Hydro, GeoRisk, and Commander agents.", COLOR_CYAN),
        ("STEP 04: PostGIS Spatial GIS Engine", "Intersects flood shapes with Census block demographics and computes bypass detours via MapmyIndia.", COLOR_PURPLE),
        ("STEP 05: Dispatch & UI Synchronization", "Dispatches CAP XML alerts to NDMA Sachet cell towers, triages 108 hospital beds, and syncs UI via WebSockets.", COLOR_GREEN)
    ]

    for idx, (title, desc, color) in enumerate(dev_steps):
        y = Inches(2.2 + idx * 0.95)
        box = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.6), Inches(0.85))
        box.fill.solid(); box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = color
        tf = box.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5); p2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 9: CODE & API SPECIFICATIONS
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_bg(slide9)
    add_header(slide9, "09 / CODE SPECS", "Production Engineering Code & API Schemas", "Key backend script components powering XNexus-CrisisOS.")

    c1 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.7))
    c1.fill.solid(); c1.fill.fore_color.rgb = COLOR_CARD; c1.line.color.rgb = COLOR_CYAN
    tf = c1.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. PYTHON FastMCP SERVER (mcp_cwc_server.py)"
    p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_CYAN
    p_code1 = tf.add_paragraph()
    p_code1.text = """from fastmcp import FastMCP

mcp = FastMCP("CWC-Hydrology-Server")

@mcp.tool()
async def get_river_level(station_id: str) -> dict:
    return CWC_DB.get(station_id)

@mcp.tool()
async def check_danger_breach(station_id: str) -> dict:
    data = await get_river_level(station_id)
    current, danger = data["current"], data["danger"]
    return {
        "status": "CRITICAL" if current >= danger else "NORMAL",
        "breach_meters": current - danger
    }"""
    p_code1.font.name = "Courier New"; p_code1.font.size = Pt(9.5); p_code1.font.color.rgb = COLOR_TEXT

    c2 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.2), Inches(5.6), Inches(4.7))
    c2.fill.solid(); c2.fill.fore_color.rgb = COLOR_CARD; c2.line.color.rgb = COLOR_PURPLE
    tf = c2.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "2. LANGGRAPH ORCHESTRATOR (agent_orchestrator.py)"
    p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_PURPLE
    p_code2 = tf.add_paragraph()
    p_code2.text = """class DisasterState(TypedDict):
    incident_active: bool
    rainfall_rate_mm_hr: float
    landslide_risk_score: float
    recommended_action: str
    evacuation_routes: List[str]

def commander_agent(state: DisasterState):
    if state["landslide_risk_score"] > 0.75:
        return {
            "recommended_action": "EVACUATE Sector B-4",
            "evacuation_routes": ["Route 3 East Bypass"],
            "incident_active": True
        }

workflow = StateGraph(DisasterState)
workflow.add_node("Weather", weather_agent)
workflow.add_node("Commander", commander_agent)
workflow.add_edge("Weather", "Commander")
app = workflow.compile()"""
    p_code2.font.name = "Courier New"; p_code2.font.size = Pt(9.5); p_code2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 10: SYSTEM PIPELINE FLOW
    # ==========================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_bg(slide10)
    add_header(slide10, "10 / SYSTEM FLOW", "Telemetry to Execution Pipeline", "4-stage continuous disaster monitoring and dispatch lifecycle.")

    pipe_stages = [
        ("01. INGEST", "Telemetry Streams", "Scrapes IMD doppler radar & CWC gauges every 15 min."),
        ("02. PROFILE", "Risk Assessment", "Computes landslide susceptibility & inundation zones."),
        ("03. SIMULATE", "Plan Generation", "Calculates evacuation routes via MapmyIndia API."),
        ("04. EXECUTE", "Action Dispatch", "Dispatches NDMA Sachet cell warnings & 108 ICU beds.")
    ]

    for idx, (step, label, desc) in enumerate(pipe_stages):
        x = Inches(0.8 + idx * 2.95)
        box = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.5), Inches(2.7), Inches(3.8))
        box.fill.solid(); box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = COLOR_CYAN if idx < 3 else COLOR_RED
        tf = box.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = step
        p.font.size = Pt(16); p.font.bold = True; p.font.color.rgb = COLOR_CYAN if idx < 3 else COLOR_RED
        p2 = tf.add_paragraph()
        p2.text = f"\n{label}\n\n{desc}"
        p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 11: PROJECTED IMPACT
    # ==========================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_bg(slide11)
    add_header(slide11, "11 / PROJECTED IMPACT", "Target Safety & Performance Metrics", "Empirical performance targets for XNexus-CrisisOS deployment.")

    i1 = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(3.6), Inches(2.2))
    i1.fill.solid(); i1.fill.fore_color.rgb = COLOR_CARD; i1.line.color.rgb = COLOR_CYAN
    tf = i1.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "< 5 min"; p.font.size = Pt(32); p.font.bold = True; p.font.color.rgb = COLOR_CYAN
    p2 = tf.add_paragraph(); p2.text = "RESPONSE TIME\nFrom gauge trigger to cell broadcast."; p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    i2 = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(2.2), Inches(3.6), Inches(2.2))
    i2.fill.solid(); i2.fill.fore_color.rgb = COLOR_CARD; i2.line.color.rgb = COLOR_PURPLE
    tf = i2.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "840+"; p.font.size = Pt(32); p.font.bold = True; p.font.color.rgb = COLOR_PURPLE
    p2 = tf.add_paragraph(); p2.text = "HOUSEHOLDS COVERED\nPer targeted warning polygon."; p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    i3 = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(2.2), Inches(3.6), Inches(2.2))
    i3.fill.solid(); i3.fill.fore_color.rgb = COLOR_CARD; i3.line.color.rgb = COLOR_GREEN
    tf = i3.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "9"; p.font.size = Pt(32); p.font.bold = True; p.font.color.rgb = COLOR_GREEN
    p2 = tf.add_paragraph(); p2.text = "AI AGENTS ACTIVE\nCollaborating in shared memory."; p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # Bottom summary box
    ib = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(11.6), Inches(2.0))
    ib.fill.solid(); ib.fill.fore_color.rgb = COLOR_CARD; ib.line.color.rgb = COLOR_CYAN
    tf = ib.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "OPERATIONAL PERFORMANCE TARGETS"
    p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = COLOR_CYAN
    p2 = tf.add_paragraph()
    p2.text = "• 90% Warning Speedup: Cuts traditional 100-minute manual delay down to under 5 minutes.\n• 75% Resource Efficiency: Eliminates duplicate NDRF dispatches & optimizes ambulance routes.\n• 85% Evacuation Compliance: Localized multilingual cell broadcasts increase compliance rates."
    p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # ==========================================
    # SLIDE 12: ROADMAP & VISION
    # ==========================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_bg(slide12)
    add_header(slide12, "12 / DEVELOPMENT ROADMAP", "Development Blueprint & Expansion Phases", "Scaling XNexus-CrisisOS across India's disaster management framework.")

    phases = [
        ("PHASE 1 — NOW (MVP)", "Hackathon Prototype", "Core 9-agent architecture, FastMCP servers, Wayanad flood scenario proof-of-concept.", COLOR_CYAN),
        ("PHASE 2 — Q3 2026", "State-Level Pilots", "Deploy across Kerala SDMA & Uttarakhand SDMA. Live 108 health API & NDMA Sachet connections.", COLOR_PURPLE),
        ("PHASE 3 — 2027", "National Scale", "Full NDMA integration covering all 36 States & UTs with cyclone, earthquake & industrial alert modules.", COLOR_GREEN)
    ]

    for idx, (phase, title, desc, color) in enumerate(phases):
        x = Inches(0.8 + idx * 3.9)
        box = slide12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.2), Inches(3.7), Inches(3.6))
        box.fill.solid(); box.fill.fore_color.rgb = COLOR_CARD
        box.line.color.rgb = color
        tf = box.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = phase
        p.font.size = Pt(11); p.font.bold = True; p.font.color.rgb = color
        p2 = tf.add_paragraph(); p2.text = f"\n{title}\n\n{desc}"
        p2.font.size = Pt(11); p2.font.color.rgb = COLOR_TEXT

    # Footer
    tx_f = slide12.shapes.add_textbox(Inches(0.8), Inches(6.1), Inches(11.6), Inches(0.8))
    tf_f = tx_f.text_frame; tf_f.word_wrap = True
    p = tf_f.paragraphs[0]; p.text = "BUILT FOR INDIA. BY INDIA."
    p.font.size = Pt(16); p.font.bold = True; p.font.color.rgb = COLOR_CYAN; p.alignment = PP_ALIGN.CENTER
    p2 = tf_f.add_paragraph(); p2.text = "Every API, telemetry stream, and mapping service is 100% Indian emergency infrastructure."
    p2.font.size = Pt(11); p2.font.color.rgb = COLOR_DIM; p2.alignment = PP_ALIGN.CENTER

    # Save outputs
    out1 = "/Users/aksharsakhi/Documents/Files/VScode/APPS/XNexus-CrisisOS/ideation/XNexus_CrisisOS_Presentation.pptx"
    out2 = "/Users/aksharsakhi/Documents/Files/VScode/APPS/XNexus-CrisisOS/XNexus_CrisisOS_Presentation.pptx"
    prs.save(out1)
    prs.save(out2)
    print(f"Saved PPTX to {out1} and {out2}")

if __name__ == "__main__":
    build_presentation()
