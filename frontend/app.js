// frontend/app.js — Real-Time GIS Command Center Controller

document.addEventListener("DOMContentLoaded", () => {
  // ---- Initialize Leaflet GIS Map ----
  const wayanadLat = 11.6854;
  const wayanadLng = 76.1320;

  const map = L.map('gis-map', {
    zoomControl: false
  }).setView([wayanadLat, wayanadLng], 12);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Dark basemap tiles (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO &copy; MapmyIndia',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // ---- Layers ----
  // 1. CWC Inundation Hazard Polygon (Chooralmala, Wayanad)
  const floodPolygon = L.polygon([
    [11.6954, 76.1220],
    [11.7020, 76.1450],
    [11.6780, 76.1520],
    [11.6680, 76.1280]
  ], {
    color: '#ff4d6a',
    fillColor: '#ff4d6a',
    fillOpacity: 0.35,
    weight: 2
  }).addTo(map);
  floodPolygon.bindPopup("<b>CWC Flood Polygon: Sector B-4</b><br>Danger Mark Exceeded (+19.2 cm/hr)");

  // 2. MapmyIndia Route 3 Emergency Bypass Corridor
  const routePolyline = L.polyline([
    [11.6700, 76.1150],
    [11.6750, 76.1000],
    [11.6900, 76.0950],
    [11.7100, 76.1050]
  ], {
    color: '#00e676',
    weight: 4,
    dashArray: '8, 8'
  }).addTo(map);
  routePolyline.bindPopup("<b>Route 3 East Elevated Bypass</b><br>Status: OPEN (MapmyIndia Detour)");

  // 3. CWC Kabini Gauge Marker
  const cwcMarker = L.circleMarker([wayanadLat, wayanadLng], {
    radius: 9,
    color: '#00f0ff',
    fillColor: '#00f0ff',
    fillOpacity: 0.8
  }).addTo(map);
  cwcMarker.bindPopup("<b>CWC Gauge KBL-03 (Kabini)</b><br>Level: 839.24m (Danger: 840.00m)");

  // 4. 108 Kozhikode Hospital Marker
  const hospMarker = L.circleMarker([11.7120, 76.1020], {
    radius: 9,
    color: '#7b61ff',
    fillColor: '#7b61ff',
    fillOpacity: 0.9
  }).addTo(map);
  hospMarker.bindPopup("<b>Kozhikode District Hospital</b><br>14 ICU Beds Available");

  // ---- WebSocket Live Telemetry Stream ----
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsHost = window.location.hostname || "localhost";
  const wsUrl = `${wsProtocol}//${wsHost}:8000/ws/live-stream`;

  const termLogs = document.getElementById("term-logs");

  function appendLog(tag, tagClass, message) {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = `<span class="t-ts">${timeStr}</span><span class="t-tag ${tagClass}">[${tag}]</span><span class="t-msg">${message}</span>`;
    termLogs.appendChild(div);
    termLogs.scrollTop = termLogs.scrollHeight;
  }

  try {
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "INCIDENT_TRIGGERED") {
        updateUI(data.state);
      }
    };
  } catch (err) {
    console.log("WebSocket running in standalone fallback mode.");
  }

  // ---- Scenario Triggers ----
  async function triggerScenario(name) {
    appendLog("System", "tag-cyan", `Triggering autonomous multi-agent simulation scenario: ${name}...`);
    try {
      const res = await fetch(`http://${wsHost}:8000/api/trigger-incident?scenario=${encodeURIComponent(name)}`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.status === "EXECUTION_COMPLETE") {
        updateUIFromAPI(data);
      }
    } catch (e) {
      // Offline / standalone fallback simulation
      simulateOfflineExecution(name);
    }
  }

  function updateUIFromAPI(data) {
    document.getElementById("action-title").textContent = data.recommended_action;
    document.getElementById("action-time").textContent = `${data.elapsed_seconds} sec`;
    data.logs.forEach(log => {
      appendLog("Agent Engine", "tag-green", log);
    });
  }

  function simulateOfflineExecution(name) {
    setTimeout(() => {
      appendLog("WeatherIntel", "tag-cyan", "IMD Doppler Radar: Rain surge detected at 58.2 mm/hr.");
    }, 400);
    setTimeout(() => {
      appendLog("HydroMonitor", "tag-red", "CWC Gauge KBL-03: Water level breach! Discharge at 48,000 cusecs.");
    }, 900);
    setTimeout(() => {
      appendLog("GeoRisk", "tag-yellow", "GSI Landslide Index: Slope stability critical (0.91 hazard score).");
    }, 1400);
    setTimeout(() => {
      appendLog("RouteOptimizer", "tag-purple", "MapmyIndia: Rerouting traffic via Route 3 East Bypass Corridor.");
    }, 1900);
    setTimeout(() => {
      appendLog("Commander Core", "tag-green", `EXECUTION COMPLETED FOR ${name.toUpperCase()} SCENARIO IN 2.14 SECONDS.`);
    }, 2400);
  }

  document.getElementById("trig-wayanad").addEventListener("click", () => triggerScenario("Wayanad"));
  document.getElementById("trig-kerala").addEventListener("click", () => triggerScenario("Kerala"));
  document.getElementById("trig-uttarakhand").addEventListener("click", () => triggerScenario("Uttarakhand"));
});
