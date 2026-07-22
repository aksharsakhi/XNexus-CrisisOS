# 🛰️ XNexus-CrisisOS — Autonomous Disaster Command Center

> **India's First Multi-Agent AI Operating System for Autonomous Disaster Response & Mitigation**

---

## 📌 Executive Summary

Disasters in India (floods, landslides, cyclones) claim thousands of lives and cause billions in economic damage annually. While agencies like **IMD** (Weather), **CWC** (Hydrology), **GSI** (Geology), **NHAI** (Highways), and **NDMA** (Alerts) maintain sophisticated sensor networks, they operate in **complete data silos**. 

During critical events (such as the 2024 Wayanad Landslides or 2018 Kerala Floods), emergency warnings rely on **manual, phone-based coordination** across district magistrates, rescue squads, and hospitals. This manual friction introduces **100+ minutes of delay**, leaving vulnerable populations with under 10 minutes of actionable warning.

**XNexus-CrisisOS** replaces this fragmented warning chain with an **autonomous, multi-agent intelligence mesh**. By ingesting real-time Indian government telemetry via the **Model Context Protocol (MCP)**, XNexus-CrisisOS correlates multi-agency risk, computes detour routes, dispatches medical resources, and triggers cell-tower evacuation broadcasts — **cutting total emergency response time from 100+ minutes to under 5 minutes.**

---

## 📊 The Crisis in Numbers (India)

| Metric | Figure | Primary Source |
| :--- | :--- | :--- |
| **Annual Flood Mortality** | **2,000+ deaths/yr** | NDMA Annual Report (2023) |
| **Cumulative Economic Loss** | **$86 Billion** (2000–2023) | World Bank Disaster Risk Index (2024) |
| **Vulnerable Districts** | **75% of Indian Districts** | National Disaster Management Authority |
| **Traditional Warning Delay** | **100+ minutes** | Manual Multi-Agency Phone Chain |
| **XNexus Target Response** | **< 5 minutes** | Autonomous Multi-Agent Coordination |

---

## ⚡ Key Features & Capabilities

- **🚀 Interactive Executive Pitch Deck**: Full-viewport, cinematic pitch deck built with Sora typography, glassmorphic UI, live particle canvas, interactive telemetry terminals, and dynamic stat counters.
- **🤖 9 Specialized AI Agents**:
  1. **🛰️ WeatherIntel Agent**: Ingests IMD Doppler Radar reflectivity ($Z$ factor) and INSAT-3D satellite imagery.
  2. **🌊 HydroMonitor Agent**: Scrapes CWC gauging stations (e.g. Kabini Reservoir) for water level & discharge rate.
  3. **⛰️ GeoRisk Agent**: Evaluates GSI landslide susceptibility indices and soil shear saturation.
  4. **🗺️ RouteOptimizer Agent**: Connects to MapmyIndia (Mappls) API to calculate evacuation detours around blocked NHAI roads.
  5. **📱 AlertBroadcast Agent**: Formats NDMA Sachet Common Alerting Protocol (CAP) cell broadcasts in Hindi, English, and local languages.
  6. **🏥 MedResponse Agent**: Connects to 108 Emergency Health APIs to monitor live ICU/trauma bed matrix & ambulance dispatch.
  7. **👥 PopDensity Agent**: Overlays Census spatial demographic polygons onto hazard zones to estimate exposed population.
  8. **🏗️ InfraWatch Agent**: Monitors NHAI bridge sensors and rail crossing stability.
  9. **🎖️ Commander Agent**: Central orchestrator synthesizing agent inputs and driving consensus decisions.
- **🔗 Model Context Protocol (MCP) Mesh**: Standardized JSON-RPC integration layer connecting LLM agents directly to Indian government datasets.
- **⚡ Live Interactive Terminal & Telemetry**: Dynamic live telemetry simulation, animated sparklines, 3D card tilt effects, and real-time toast alerts.
- **🌗 Dark / Light Mode Support**: Seamless adaptive design tokens tuned for high-contrast command center viewing.

---

## 🏗️ System Architecture

```
                                +-------------------------------------------+
                                |  XNexus-CrisisOS Presentation & Dashboard |
                                +---------------------+---------------------+
                                                      |
                                                      v
                                        +-------------+-------------+
                                        |    Commander Agent Core   |
                                        +-------------+-------------+
                                                      |
               +--------------------------------------+--------------------------------------+
               |                                      |                                      |
               v                                      v                                      v
    +----------+----------+                +----------+----------+                +----------+----------+
    |   WeatherIntel      |                |   HydroMonitor          |                |   RouteOptimizer        |
    | (IMD Doppler Radar) |                | (CWC River Gauges)      |                | (MapmyIndia API)    |
    +----------+----------+                +----------+----------+                +----------+----------+
               |                                      |                                      |
               +--------------------------------------+--------------------------------------+
                                                      | Model Context Protocol (MCP)
                                                      v
                                +---------------------+---------------------+
                                |      NDMA Sachet Cell Broadcast Mesh      |
                                |     108 Emergency Medical Bed Triage     |
                                +-------------------------------------------+
```

---

## 🛠️ Technology Stack

- **Presentation / Frontend**: HTML5, Modern Vanilla CSS (CSS Variables, Glassmorphism, CSS Grid Bento Layout), Vanilla JavaScript (ES6+), Google Fonts (**Sora**, **Inter**, **JetBrains Mono**).
- **Multi-Agent Orchestration**: AutoGen / LangGraph framework design.
- **LLM Intelligence**: Gemini 2.5 Pro / Flash.
- **Data Integration Mesh**: Model Context Protocol (MCP) SDKs (`fastmcp` Python).
- **APIs & Data Sources**: IMD Doppler/INSAT-3D, CWC Gauge Telemetry, GSI Landslide Zonation, MapmyIndia (Mappls) Routing, NDMA Sachet CAP XML, 108 Health API.

---

## 🚦 Quick Start & Local Preview

### Prerequisites
- Python 3.8+ (for local HTTP server) or any static web server.

### Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aksharsakhi/XNexus-CrisisOS.git
   cd XNexus-CrisisOS
   ```

2. **Start a Local Development Server**:
   ```bash
   python3 -m http.server 8080
   ```

3. **View the Presentation**:
   Open your browser and navigate to:
   ```
   http://localhost:8080/ideation/index.html
   ```

---

## 🎮 Presentation Controls

| Key / Control | Action |
| :--- | :--- |
| **Right Arrow ($\rightarrow$) / Down ($\downarrow$) / Space** | Advance to Next Slide |
| **Left Arrow ($\leftarrow$) / Up ($\uparrow$)** | Return to Previous Slide |
| **`F` / Fullscreen Button** | Toggle Fullscreen Mode |
| **Bottom Navigation Dots** | Jump to Specific Slide |
| **Theme Toggle (Top Right)** | Switch between Dark & Light Mode |
| **Export PPTX Button** | Export Slide System Summary |
| **Agent Cards (Slide 4)** | Click any Agent Card to inspect live terminal typing telemetry |
| **Pipeline Nodes (Slide 8)** | Click pipeline steps (Ingest, Profile, Simulate, Execute) to view terminal logs |

---

## 📅 Roadmap & Milestones

- [x] **Phase 1: Hackathon MVP & Pitch Deck** — Core 9-agent architecture, real-data pipeline specification, Wayanad flood proof-of-concept.
- [ ] **Phase 2: State-Level Pilot (Q3 2026)** — SDMA deployment in Kerala & Uttarakhand, live 108 hospital connection.
- [ ] **Phase 3: National Scale (2027)** — Full NDMA integration across all 36 States & UTs with cyclone, earthquake, and industrial alert modules.

---

## 📜 License & Acknowledgments

- **License**: MIT License.
- **Built For**: India's Disaster Resilience Framework (NDMA / SDMA).
