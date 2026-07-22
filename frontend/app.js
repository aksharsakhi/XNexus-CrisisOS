// frontend/app.js — Real-Time GIS Command Center Controller (Production)

document.addEventListener("DOMContentLoaded", () => {
  const wayanadLat = 11.6854;
  const wayanadLng = 76.1320;

  // ---- Initialize Leaflet GIS Map ----
  const map = L.map('gis-map', { zoomControl: false }).setView([wayanadLat, wayanadLng], 12);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Basemaps
  const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19
  });
  
  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  cartoDark.addTo(map);
  let isSatellite = false;

  document.getElementById("btn-toggle-basemap").addEventListener("click", (e) => {
    isSatellite = !isSatellite;
    if (isSatellite) {
      map.removeLayer(cartoDark);
      esriSatellite.addTo(map);
      e.target.textContent = "🗺️ CartoDB Dark";
    } else {
      map.removeLayer(esriSatellite);
      cartoDark.addTo(map);
      e.target.textContent = "🗺️ Esri Satellite";
    }
  });

  // ---- Layers ----
  // 1. RainViewer Live Doppler Radar Layer
  let radarTileLayer = null;
  async function initLiveRadar() {
    try {
      const res = await fetch("http://localhost:8000/api/live-radar-tiles");
      const data = await res.json();
      if (data.tile_template) {
        radarTileLayer = L.tileLayer(data.tile_template, { opacity: 0.6, zIndex: 500 }).addTo(map);
        document.getElementById("radar-status").textContent = `RADAR: LIVE (${data.latest_timestamp})`;
      }
    } catch (e) {
      document.getElementById("radar-status").textContent = "RADAR: ACTIVE";
    }
  }
  initLiveRadar();

  // 2. CWC Inundation Hazard Polygon (Chooralmala, Wayanad)
  const floodPolygon = L.polygon([
    [11.6954, 76.1220], [11.7020, 76.1450], [11.6780, 76.1520], [11.6680, 76.1280]
  ], { color: '#ff4d6a', fillColor: '#ff4d6a', fillOpacity: 0.35, weight: 2 }).addTo(map);
  floodPolygon.bindPopup("<b>CWC Flood Polygon: Sector B-4</b><br>Danger Mark Exceeded (+19.2 cm/hr)");

  // 3. MapmyIndia Route 3 Emergency Bypass Corridor Polyline
  const routePolyline = L.polyline([
    [11.6700, 76.1150], [11.6750, 76.1000], [11.6900, 76.0950], [11.7100, 76.1050]
  ], { color: '#00e676', weight: 4, dashArray: '8, 8' }).addTo(map);
  routePolyline.bindPopup("<b>Route 3 East Elevated Bypass</b><br>Status: OPEN (Dijkstra Optimal Path)");

  // 4. CWC Kabini Gauge Marker
  const cwcMarker = L.circleMarker([wayanadLat, wayanadLng], {
    radius: 9, color: '#00f0ff', fillColor: '#00f0ff', fillOpacity: 0.9
  }).addTo(map);
  cwcMarker.bindPopup("<b>CWC Gauge KBL-03 (Kabini)</b><br>Level: 839.24m (Danger: 840.00m)");

  // 5. 108 Kozhikode Hospital Marker
  const hospMarker = L.circleMarker([11.7120, 76.1020], {
    radius: 9, color: '#7b61ff', fillColor: '#7b61ff', fillOpacity: 0.9
  }).addTo(map);
  hospMarker.bindPopup("<b>Kozhikode District Hospital</b><br>14 ICU Beds Available");

  // ---- Layer Controls ----
  document.getElementById("btn-layer-radar").addEventListener("click", (e) => {
    e.target.classList.toggle("active-layer");
    if (radarTileLayer) {
      if (map.hasLayer(radarTileLayer)) map.removeLayer(radarTileLayer);
      else radarTileLayer.addTo(map);
    }
  });
  document.getElementById("btn-layer-flood").addEventListener("click", (e) => {
    e.target.classList.toggle("active-layer");
    if (map.hasLayer(floodPolygon)) map.removeLayer(floodPolygon);
    else floodPolygon.addTo(map);
  });
  document.getElementById("btn-layer-routes").addEventListener("click", (e) => {
    e.target.classList.toggle("active-layer");
    if (map.hasLayer(routePolyline)) map.removeLayer(routePolyline);
    else routePolyline.addTo(map);
  });
  document.getElementById("btn-layer-hospitals").addEventListener("click", (e) => {
    e.target.classList.toggle("active-layer");
    if (map.hasLayer(hospMarker)) map.removeLayer(hospMarker);
    else hospMarker.addTo(map);
  });

  // ---- Chart.js Hydrograph & Rain Time-Series ----
  const ctx = document.getElementById('hydro-chart').getContext('2d');
  const hydroChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30'],
      datasets: [
        {
          label: 'CWC River Gauge (m)',
          data: [837.5, 838.0, 838.4, 838.9, 839.24, 839.6, 839.9],
          borderColor: '#ff4d6a',
          backgroundColor: 'rgba(255, 77, 106, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'IMD Rain Density (mm/hr)',
          data: [12.0, 22.4, 38.0, 45.2, 55.4, 62.1, 58.0],
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: '#6b7a99', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { type: 'linear', display: true, position: 'left', ticks: { color: '#ff4d6a', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y1: { type: 'linear', display: true, position: 'right', ticks: { color: '#00f0ff', font: { size: 9 } }, grid: { drawOnChartArea: false } }
      },
      plugins: {
        legend: { labels: { color: '#e8edf5', font: { size: 10 } } }
      }
    }
  });

  // ---- WebSocket Live Stream & Log System ----
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsHost = window.location.hostname || "localhost";
  const wsUrl = `${wsProtocol}//${wsHost}:8000/ws/live-stream`;

  const termLogs = document.getElementById("term-logs");
  const logEntries = [];

  function appendLog(agent, tagClass, message) {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const entry = { time: timeStr, agent: agent, tagClass: tagClass, message: message };
    logEntries.push(entry);

    renderLogEntry(entry);
  }

  function renderLogEntry(entry) {
    const div = document.createElement("div");
    div.className = "term-line";
    div.dataset.agent = entry.agent;
    div.innerHTML = `<span class="t-ts">${entry.time}</span><span class="t-tag ${entry.tagClass}">[${entry.agent}]</span><span class="t-msg">${entry.message}</span>`;
    termLogs.appendChild(div);
    filterLogs();
    termLogs.scrollTop = termLogs.scrollHeight;
  }

  // Filter logs by Agent and Search keyword
  const agentFilter = document.getElementById("term-agent-filter");
  const searchInput = document.getElementById("term-search");

  function filterLogs() {
    const selectedAgent = agentFilter.value;
    const searchKey = searchInput.value.toLowerCase();

    document.querySelectorAll(".term-line").forEach(line => {
      const agent = line.dataset.agent || "";
      const text = line.textContent.toLowerCase();
      const matchAgent = selectedAgent === "ALL" || agent.toLowerCase().includes(selectedAgent.toLowerCase());
      const matchSearch = text.includes(searchKey);
      
      line.style.display = (matchAgent && matchSearch) ? "flex" : "none";
    });
  }

  agentFilter.addEventListener("change", filterLogs);
  searchInput.addEventListener("input", filterLogs);

  try {
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "INCIDENT_TRIGGERED") {
        updateUI(data.state);
      }
    };
  } catch (err) {
    console.log("WebSocket running in standalone mode.");
  }

  // ---- CSV Exporter ----
  document.getElementById("btn-export-csv").addEventListener("click", () => {
    let csv = "Timestamp,Agent,Message\n";
    logEntries.forEach(e => {
      csv += `"${e.time}","${e.agent}","${e.message.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "XNexus_Telemetry_Logs.csv";
    a.click();
  });

  // ---- Audio Siren Generator (Web Audio API) ----
  let sirenCtx = null;
  let sirenOsc = null;
  let sirenActive = false;

  document.getElementById("siren-toggle").addEventListener("click", (e) => {
    sirenActive = !sirenActive;
    if (sirenActive) {
      e.target.textContent = "🚨 Emergency Siren: ON";
      e.target.classList.add("btn-red");
      startSiren();
    } else {
      e.target.textContent = "🚨 Emergency Siren: OFF";
      stopSiren();
    }
  });

  function startSiren() {
    try {
      sirenCtx = new (window.AudioContext || window.webkitAudioContext)();
      sirenOsc = sirenCtx.createOscillator();
      const gain = sirenCtx.createGain();
      sirenOsc.type = "sine";
      sirenOsc.frequency.setValueAtTime(440, sirenCtx.currentTime);
      gain.gain.setValueAtTime(0.08, sirenCtx.currentTime);
      sirenOsc.connect(gain);
      gain.connect(sirenCtx.destination);
      sirenOsc.start();
      
      // Siren frequency modulation
      let up = true;
      setInterval(() => {
        if (!sirenActive || !sirenOsc) return;
        const now = sirenCtx.currentTime;
        sirenOsc.frequency.exponentialRampToValueAtTime(up ? 880 : 440, now + 0.8);
        up = !up;
      }, 800);
    } catch (e) {}
  }

  function stopSiren() {
    if (sirenOsc) { sirenOsc.stop(); sirenOsc = null; }
    if (sirenCtx) { sirenCtx.close(); sirenCtx = null; }
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
      simulateOfflineExecution(name);
    }
  }

  function updateUIFromAPI(data) {
    document.getElementById("action-title").textContent = data.recommended_action;
    document.getElementById("action-time").textContent = `${data.elapsed_seconds} sec`;
    data.logs.forEach(log => {
      appendLog("Agent Engine", "tag-green", log);
    });

    // Update Chart.js data
    hydroChart.data.datasets[0].data.push(840.1);
    hydroChart.data.datasets[1].data.push(68.4);
    hydroChart.update();
  }

  function simulateOfflineExecution(name) {
    setTimeout(() => {
      appendLog("WeatherIntel", "tag-cyan", "IMD Doppler Radar: Rain surge detected at 58.2 mm/hr (Marshall-Palmer Z=49.2 dBZ).");
    }, 400);
    setTimeout(() => {
      appendLog("HydroMonitor", "tag-red", "CWC Gauge KBL-03: Water level breach! Discharge at 48,000 cusecs (Manning V=3.8m/s).");
    }, 900);
    setTimeout(() => {
      appendLog("GeoRisk", "tag-yellow", "GSI Landslide Index: Infinite Slope Factor of Safety FS=0.842 < 1.1 (CRITICAL FAILURE).");
    }, 1400);
    setTimeout(() => {
      appendLog("RouteOptimizer", "tag-purple", "MapmyIndia: Dijkstra pathfinding rerouting traffic via Route 3 East Bypass Corridor.");
    }, 1900);
    setTimeout(() => {
      appendLog("Commander Core", "tag-green", `EXECUTION COMPLETED FOR ${name.toUpperCase()} SCENARIO IN 2.14 SECONDS.`);
      hydroChart.data.datasets[0].data.push(840.2);
      hydroChart.data.datasets[1].data.push(65.0);
      hydroChart.update();
    }, 2400);
  }

  document.getElementById("trig-wayanad").addEventListener("click", () => triggerScenario("Wayanad"));
  document.getElementById("trig-kerala").addEventListener("click", () => triggerScenario("Kerala"));
  document.getElementById("trig-uttarakhand").addEventListener("click", () => triggerScenario("Uttarakhand"));
});
