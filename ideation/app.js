// ============================================================
//  XNEXUS-CRISISOS — CINEMATIC PITCH DECK ENGINE
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---- Slide Navigation ----
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("slide-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const currentNum = document.getElementById("current-num");
  const totalNum = document.getElementById("total-num");
  let currentIndex = 0;

  totalNum.textContent = slides.length;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "slide-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    if (index < 0 || index >= slides.length || index === currentIndex) return;
    slides[currentIndex].classList.remove("active");
    dotsContainer.children[currentIndex].classList.remove("active");
    currentIndex = index;
    slides[currentIndex].classList.add("active");
    dotsContainer.children[currentIndex].classList.add("active");
    currentNum.textContent = currentIndex + 1;

    // Trigger stat counters when entering slide 2 (problem)
    if (currentIndex === 1) animateStatCounters();
    // Trigger gauge animations when entering slide 11 (impact)
    if (currentIndex === 10) animateGauges();
    // Trigger counters when entering slide 11 (impact)
    if (currentIndex === 10) animateCounters();
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    }
    if (e.key === "f" || e.key === "F") {
      toggleFullscreen();
    }
  });

  // Fullscreen
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // ---- Theme Toggle ----
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeLabel.textContent = isLight ? "Light Mode" : "Dark Mode";
  });

  // ---- Animated Sparklines ----
  function animateSparklines() {
    const paths = document.querySelectorAll(".spark-path");
    const now = Date.now();
    paths.forEach((path, idx) => {
      let d = "M0,10 ";
      for (let x = 10; x <= 100; x += 10) {
        const y = 10 + Math.sin(x * 0.08 + now * 0.005 + idx * 2) * 6 + (Math.random() - 0.5) * 1.5;
        d += `L${x},${Math.max(2, Math.min(18, y))} `;
      }
      path.setAttribute("d", d);
    });
    requestAnimationFrame(animateSparklines);
  }
  requestAnimationFrame(animateSparklines);

  // ---- Fluctuating Telemetry Values ----
  setInterval(() => {
    const tele1 = document.getElementById("tele-1");
    const tele2 = document.getElementById("tele-2");
    if (tele1) {
      const sat = (62 + (Math.random() * 1.2 - 0.6)).toFixed(1);
      tele1.textContent = `STANDBY / SOIL SATURATION ${sat}%`;
    }
    if (tele2) {
      const rise = (18 + (Math.random() * 0.8 - 0.4)).toFixed(1);
      tele2.textContent = `ACTIVE EVACUATION / +${rise}CM/HR`;
    }

    // Radar readings
    const az = document.getElementById("r-azimuth");
    const pr = document.getElementById("r-precip");
    if (az) az.textContent = `${(180 + Math.random() * 15).toFixed(1)}°`;
    if (pr) pr.textContent = `${(50 + Math.random() * 15).toFixed(1)}mm/h`;

    // Hydro height
    const hh = document.getElementById("h-height");
    if (hh) hh.textContent = `${(839.2 + Math.random() * 0.16 - 0.08).toFixed(2)}m`;

    // Soil percentage
    const sp = document.getElementById("soil-pct");
    if (sp) {
      const pct = 88 + Math.round(Math.random() * 4 - 2);
      sp.textContent = `${pct}%`;
    }

    // Hospital beds
    const b1 = document.getElementById("beds-1");
    const b3 = document.getElementById("beds-3");
    if (b1) b1.textContent = `${14 + Math.round(Math.random() * 2 - 1)} ICU`;
    if (b3) b3.textContent = `${8 + Math.round(Math.random() * 2 - 1)} ICU`;
  }, 2500);

  // ---- Agent Card Click ----
  const agentCards = document.querySelectorAll(".agent-card");
  const terminalTitle = document.getElementById("terminal-title");
  const terminalBody = document.getElementById("terminal-body");

  const agentLogs = {
    weather: { title: "WeatherIntel", lines: [
      { tag: "tag-stream", label: "[STREAM]", msg: "Connecting to IMD Doppler Radar array..." },
      { tag: "tag-ok", label: "[OK]", msg: "Feed established. Tracking azimuth 182.4° — precip density 52.4mm/hr" },
      { tag: "tag-warn", label: "[WARN]", msg: "Rainfall intensity exceeds warning threshold in Sector B-4 (Wayanad)" },
      { tag: "tag-stream", label: "[STREAM]", msg: "Forwarding weather vector to HydroMonitor Agent for correlated analysis..." },
    ]},
    hydro: { title: "HydroMonitor", lines: [
      { tag: "tag-stream", label: "[STREAM]", msg: "Querying CWC gauging station KBL-03..." },
      { tag: "tag-ok", label: "[OK]", msg: "Current water level: 839.24m — danger mark: 838.50m" },
      { tag: "tag-warn", label: "[ALERT]", msg: "River height exceeds danger level by +0.74m! Flood pulse detected." },
      { tag: "tag-stream", label: "[STREAM]", msg: "Computing inundation polygon for downstream Sector B..." },
    ]},
    geo: { title: "GeoRisk", lines: [
      { tag: "tag-stream", label: "[STREAM]", msg: "Polling GSI soil moisture indices for Wayanad district..." },
      { tag: "tag-ok", label: "[OK]", msg: "Soil saturation index: 88% — landslide susceptibility: HIGH" },
      { tag: "tag-warn", label: "[WARN]", msg: "Critical shear threshold approaching in hillslope Sector C-2" },
    ]},
    route: { title: "RouteOptimizer", lines: [
      { tag: "tag-stream", label: "[STREAM]", msg: "Checking NH-76 segment status..." },
      { tag: "tag-warn", label: "[BLOCK]", msg: "NH-76 KM 12 — BLOCKED (Landslide debris)" },
      { tag: "tag-stream", label: "[ROUTE]", msg: "Invoking MapmyIndia routing engine for alternate detour..." },
      { tag: "tag-ok", label: "[OK]", msg: "Bypass calculated: Route 3 via East corridor. ETA: 42 min." },
    ]},
    alert: { title: "AlertBroadcast", lines: [
      { tag: "tag-stream", label: "[SACHET]", msg: "Drafting multilingual cell warnings (Hindi, English, Malayalam)..." },
      { tag: "tag-ok", label: "[OK]", msg: "Cell broadcast composed. Targeting 840 towers in Wayanad district." },
      { tag: "tag-ok", label: "[SENT]", msg: "Emergency alert broadcast complete. All towers acknowledged." },
    ]},
    medical: { title: "MedResponse", lines: [
      { tag: "tag-stream", label: "[QUERY]", msg: "Polling 108 state health API for Kozhikode district..." },
      { tag: "tag-ok", label: "[OK]", msg: "Kozhikode District Hospital: 14 ICU beds available, 6 ambulances ready" },
      { tag: "tag-stream", label: "[DISPATCH]", msg: "Routing 3 ambulances to evacuation point via Route 3..." },
    ]},
    population: { title: "PopDensity", lines: [
      { tag: "tag-stream", label: "[CENSUS]", msg: "Loading Census 2011 demographic polygons for Sector B..." },
      { tag: "tag-ok", label: "[OK]", msg: "840 households identified in hazard path. Population: ~3,200" },
    ]},
    infra: { title: "InfraWatch", lines: [
      { tag: "tag-stream", label: "[CHECK]", msg: "Polling NHAI bridge sensor network... (STANDBY)" },
      { tag: "tag-ok", label: "[OK]", msg: "No active bridge alerts. Railway crossings nominal." },
    ]},
    commander: { title: "Commander", lines: [
      { tag: "tag-warn", label: "[CMD]", msg: "ALERT: Multi-agent consensus reached. Activating emergency protocol." },
      { tag: "tag-stream", label: "[CMD]", msg: "Coordinating WeatherIntel + HydroMonitor + RouteOptimizer..." },
      { tag: "tag-ok", label: "[CMD]", msg: "Evacuation plan generated. NDRF notified. Cell broadcasts sent." },
      { tag: "tag-ok", label: "[CMD]", msg: "All agents synchronized. Operation WAYANAD-EVAC is LIVE." },
    ]},
  };

  agentCards.forEach(card => {
    card.addEventListener("click", () => {
      agentCards.forEach(c => c.classList.remove("active-agent"));
      card.classList.add("active-agent");
      const agent = card.dataset.agent;
      const data = agentLogs[agent];
      if (!data) return;
      terminalTitle.textContent = `AGENT TELEMETRY // ${data.title}`;
      terminalBody.innerHTML = data.lines.map((l, i) =>
        `<div class="term-line" style="animation: fadeSlideUp 0.3s var(--ease) ${i * 0.08}s both"><span class="t-tag ${l.tag}">${l.label}</span><span class="t-msg">${l.msg}</span></div>`
      ).join("");
    });
  });

  // ---- Pipeline Step Cycler (Slide 8) ----
  let pipeStep = 1;
  const pipeLogs = {
    1: { title: "STEP 01 — TELEMETRY INGEST", lines: [
      `<div class="term-line"><span class="t-tag tag-stream">[STREAM]</span><span class="t-msg">Ingesting station KBL-03 gauges... 839.24m</span></div>`,
      `<div class="term-line"><span class="t-tag tag-stream">[STREAM]</span><span class="t-msg">Scraping IMD precipitation array... 52.4mm/hr</span></div>`,
      `<div class="term-line"><span class="t-tag tag-warn">[ALERT]</span><span class="t-msg text-red">River heights exceed danger parameters!</span></div>`,
    ]},
    2: { title: "STEP 02 — RISK PROFILING", lines: [
      `<div class="term-line"><span class="t-tag tag-stream">[ANALYSIS]</span><span class="t-msg">Geospatial indexing Census Sector B polygons...</span></div>`,
      `<div class="term-line"><span class="t-tag tag-ok">[OK]</span><span class="t-msg">Identified 840 households in hazard path.</span></div>`,
      `<div class="term-line"><span class="t-tag tag-stream">[INFO]</span><span class="t-msg">Wayanad hospital resources active. 14 beds reported.</span></div>`,
    ]},
    3: { title: "STEP 03 — PLAN SIMULATION", lines: [
      `<div class="term-line"><span class="t-tag tag-stream">[ROUTE]</span><span class="t-msg">Checking NH-76 segment... BLOCKED (Landslide KM 12)</span></div>`,
      `<div class="term-line"><span class="t-tag tag-stream">[ROUTE]</span><span class="t-msg">Invoking MapmyIndia routing for alternate detour...</span></div>`,
      `<div class="term-line"><span class="t-tag tag-ok">[OK]</span><span class="t-msg text-green">Bypass calculated: Route 3 via East corridor.</span></div>`,
    ]},
    4: { title: "STEP 04 — ACTION DISPATCH", lines: [
      `<div class="term-line"><span class="t-tag tag-stream">[SACHET]</span><span class="t-msg">Drafting multilingual cell warnings...</span></div>`,
      `<div class="term-line"><span class="t-tag tag-ok">[SENT]</span><span class="t-msg">Cell warnings broadcast to 840 towers. Complete.</span></div>`,
      `<div class="term-line"><span class="t-tag tag-ok">[DISPATCH]</span><span class="t-msg text-green">SDRF fleets detoured via Route 3. Operation online.</span></div>`,
    ]},
  };

  function cyclePipeline() {
    const nodes = document.querySelectorAll(".pipe-node");
    if (nodes.length === 0) return;
    nodes.forEach(n => n.classList.remove("active"));
    const active = document.querySelector(`.pipe-node[data-step="${pipeStep}"]`);
    if (active) active.classList.add("active");
    const title = document.getElementById("pipe-term-title");
    const body = document.getElementById("pipe-term-body");
    if (title && body) {
      title.textContent = `PIPELINE // ${pipeLogs[pipeStep].title}`;
      body.innerHTML = pipeLogs[pipeStep].lines.join("");
    }
    pipeStep = pipeStep < 4 ? pipeStep + 1 : 1;
  }
  setInterval(cyclePipeline, 3500);
  cyclePipeline();

  document.querySelectorAll(".pipe-node").forEach(node => {
    node.addEventListener("click", () => {
      pipeStep = parseInt(node.dataset.step);
      cyclePipeline();
    });
  });

  // ---- Circular Gauge Animations (Slide 9) ----
  function animateGauges() {
    document.querySelectorAll(".gauge-fill-ring").forEach(ring => {
      const pct = parseFloat(ring.dataset.pct) || 0;
      const circumference = 2 * Math.PI * 50; // r=50
      const offset = circumference * (1 - pct / 100);
      // Need gradient def
      ring.style.stroke = "url(#gauge-gradient)";
      setTimeout(() => {
        ring.style.strokeDashoffset = offset;
      }, 100);
    });
  }

  // Inject gauge gradient SVG def
  const svgDef = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgDef.setAttribute("width", "0"); svgDef.setAttribute("height", "0");
  svgDef.style.position = "absolute";
  svgDef.innerHTML = `<defs><linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00f0ff"/><stop offset="100%" stop-color="#7b61ff"/></linearGradient></defs>`;
  document.body.appendChild(svgDef);

  // ---- Animated Counters (Slide 9) ----
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    document.querySelectorAll(".counter-num").forEach(el => {
      const target = parseFloat(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || "";
      const duration = 2000;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ---- Animate Stat Counters (Slide 2 - problem stats) ----
  let statsAnimated = false;
  function animateStatCounters() {
    if (statsAnimated) return;
    statsAnimated = true;
    document.querySelectorAll(".stat-num").forEach(el => {
      const target = parseFloat(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || "";
      const prefix = el.textContent.startsWith("$") ? "$" : "";
      const duration = 2200;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ---- Server Rack LED Blinker ----
  setInterval(() => {
    document.querySelectorAll(".led:not(.blink)").forEach(led => {
      if (Math.random() > 0.7) led.classList.toggle("on");
    });
  }, 1200);

  // ---- Toast Notifications ----
  const toasts = [
    { header: "IMD FEEDS", body: "Doppler radar registers high rainfall density (55.4mm/hr)", type: "warning" },
    { header: "CWC HYDROLOGY", body: "Kabini station gauge: critical rise limit breach (+19.2cm/hr)", type: "danger" },
    { header: "NDRF DISPATCH", body: "4th emergency rescue battalion deployed to high-risk zones", type: "success" },
    { header: "TRAFFIC ROUTING", body: "MapmyIndia bypass Route 3 synchronized successfully", type: "info" },
    { header: "NDMA SACHET", body: "Multilingual warnings sent to 840 local cell towers", type: "success" },
    { header: "108 HEALTH", body: "Kozhikode hospital: 14 active trauma beds ready", type: "info" },
  ];

  function showToast(header, body, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<div class="toast-header ${type}">[${header}]</div><div class="toast-body">${body}</div>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }

  setInterval(() => {
    const t = toasts[Math.floor(Math.random() * toasts.length)];
    showToast(t.header, t.body, t.type);
  }, 9000);

  setTimeout(() => {
    showToast("SYSTEM INITIALIZED", "XNexus-CrisisOS multi-agent dashboard operational.", "info");
  }, 2000);

  // ---- Scroll-Reveal IntersectionObserver ----
  // Reveals elements with .reveal, .reveal-left, .reveal-right, .reveal-scale
  // when they scroll into view within the active slide
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  // Observe all elements with reveal classes
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach(el => {
    revealObserver.observe(el);
  });

  // ---- Apply 3D tilt to glass cards ----
  document.querySelectorAll(".glass-card").forEach(card => {
    card.classList.add("tilt-card");
  });

  // ---- Terminal typing animation ----
  function typeTerminalLines(container, lines, callback) {
    container.innerHTML = "";
    let lineIndex = 0;
    function typeLine() {
      if (lineIndex >= lines.length) { if (callback) callback(); return; }
      const line = lines[lineIndex];
      const div = document.createElement("div");
      div.className = "term-line";
      div.innerHTML = `<span class="t-tag ${line.tag}">${line.label}</span><span class="t-msg typing-cursor"></span>`;
      container.appendChild(div);
      const msgEl = div.querySelector(".t-msg");
      let charIdx = 0;
      function typeChar() {
        if (charIdx < line.msg.length) {
          msgEl.textContent = line.msg.slice(0, charIdx + 1);
          charIdx++;
          setTimeout(typeChar, 12 + Math.random() * 8);
        } else {
          msgEl.classList.remove("typing-cursor");
          lineIndex++;
          setTimeout(typeLine, 200);
        }
      }
      typeChar();
    }
    typeLine();
  }

  // Override agent card click to use typing animation
  agentCards.forEach(card => {
    card.addEventListener("click", () => {
      agentCards.forEach(c => c.classList.remove("active-agent"));
      card.classList.add("active-agent");
      const agent = card.dataset.agent;
      const data = agentLogs[agent];
      if (!data) return;
      terminalTitle.textContent = `AGENT TELEMETRY // ${data.title}`;
      typeTerminalLines(terminalBody, data.lines);
    });
  });

  // ---- Interactive Code Tabs (Slide 9) ----
  const codeTabButtons = document.querySelectorAll(".code-tab");
  const codeTabTitle = document.getElementById("code-tab-title");
  const codeTabBody = document.getElementById("code-tab-body");

  const codeSnippets = {
    mcp: {
      title: "ideation/mcp_cwc_server.py (Python FastMCP SDK)",
      code: `<pre><code><span class="t-tag tag-stream"># mcp_cwc_server.py — CWC River Telemetry MCP Server</span>
<span class="t-tag tag-ok">from</span> fastmcp <span class="t-tag tag-ok">import</span> FastMCP

mcp = FastMCP(<span class="t-msg">"CWC-Hydrology-Server"</span>)

<span class="t-tag tag-warn">@mcp.tool()</span>
<span class="t-tag tag-ok">async def</span> get_river_level(station_id: <span class="t-msg">str</span>) -> <span class="t-msg">dict</span>:
    <span class="t-ts">"""Fetch current water level, warning limit & discharge rate for CWC river gauge."""</span>
    <span class="t-tag tag-ok">return</span> CWC_DATABASE.get(station_id, {<span class="t-msg">"error"</span>: <span class="t-msg">"Station not found"</span>})

<span class="t-tag tag-warn">@mcp.tool()</span>
<span class="t-tag tag-ok">async def</span> check_danger_breach(station_id: <span class="t-msg">str</span>) -> <span class="t-msg">dict</span>:
    <span class="t-ts">"""Calculate breach margin against statutory danger mark."""</span>
    data = <span class="t-tag tag-ok">await</span> get_river_level(station_id)
    current, danger = data[<span class="t-msg">"current_level"</span>], data[<span class="t-msg">"danger_mark"</span>]
    <span class="t-tag tag-ok">return</span> {<span class="t-msg">"status"</span>: <span class="t-msg">"CRITICAL"</span> <span class="t-tag tag-ok">if</span> current >= danger <span class="t-tag tag-ok">else</span> <span class="t-msg">"NORMAL"</span>, <span class="t-msg">"breach_m"</span>: current - danger}</code></pre>`
    },
    orchestrator: {
      title: "ideation/agent_orchestrator.py (LangGraph State Machine)",
      code: `<pre><code><span class="t-tag tag-stream"># agent_orchestrator.py — LangGraph State Graph Core</span>
<span class="t-tag tag-ok">class</span> <span class="t-msg">DisasterState</span>(TypedDict):
    incident_active: <span class="t-msg">bool</span>
    rainfall_rate_mm_hr: <span class="t-msg">float</span>
    landslide_risk_score: <span class="t-msg">float</span>
    recommended_action: <span class="t-msg">str</span>
    evacuation_routes: <span class="t-msg">List[str]</span>

<span class="t-tag tag-ok">def</span> commander_agent(state: DisasterState):
    <span class="t-tag tag-ok">if</span> state[<span class="t-msg">"landslide_risk_score"</span>] > <span class="t-msg">0.75</span>:
        <span class="t-tag tag-ok">return</span> {
            <span class="t-msg">"recommended_action"</span>: <span class="t-msg">"EVACUATE Sector B-4 (Wayanad)"</span>,
            <span class="t-msg">"evacuation_routes"</span>: [<span class="t-msg">"Route 3 East Bypass"</span>],
            <span class="t-msg">"incident_active"</span>: <span class="t-msg">True</span>
        }

workflow = StateGraph(DisasterState)
workflow.add_node(<span class="t-msg">"Weather"</span>, weather_agent)
workflow.add_node(<span class="t-msg">"Flood"</span>, flood_agent)
workflow.add_node(<span class="t-msg">"Commander"</span>, commander_agent)
workflow.add_edge(<span class="t-msg">"Weather"</span>, <span class="t-msg">"Flood"</span>)
workflow.add_edge(<span class="t-msg">"Flood"</span>, <span class="t-msg">"Commander"</span>)
app = workflow.compile()</code></pre>`
    },
    postgis: {
      title: "spatial_population_intersect.sql (PostgreSQL / PostGIS)",
      code: `<pre><code><span class="t-tag tag-stream">-- Intersect CWC flood inundation shapefile with Census block demographics</span>
<span class="t-tag tag-ok">SELECT</span> 
    census_block.block_id,
    census_block.district_name,
    COUNT(census_block.household_id) <span class="t-tag tag-ok">AS</span> total_exposed_households,
    SUM(census_block.population) <span class="t-tag tag-ok">AS</span> exposed_population
<span class="t-tag tag-ok">FROM</span> census_demographics_spatial <span class="t-tag tag-ok">AS</span> census_block
<span class="t-tag tag-ok">JOIN</span> cwc_flood_inundation_layer <span class="t-tag tag-ok">AS</span> flood_zone
  <span class="t-tag tag-ok">ON</span> ST_Intersects(census_block.geom, flood_zone.geom)
<span class="t-tag tag-ok">WHERE</span> flood_zone.station_code = <span class="t-msg">'CWC-KBL-03'</span>
<span class="t-tag tag-ok">GROUP BY</span> census_block.block_id, census_block.district_name;</code></pre>`
    },
    cap: {
      title: "sachet_cell_broadcast.xml (NDMA Sachet CAP v1.2 Protocol)",
      code: `<pre><code><span class="t-tag tag-stream">&lt;!-- NDMA Sachet OASIS CAP v1.2 Cell Broadcast --&gt;</span>
&lt;<span class="t-tag tag-ok">alert</span> xmlns="urn:oasis:names:tc:emergency:cap:1.2"&gt;
  &lt;<span class="t-tag tag-warn">identifier</span>&gt;NDMA-KRL-WAYANAD-20260722-001&lt;/<span class="t-tag tag-warn">identifier</span>&gt;
  &lt;<span class="t-tag tag-warn">info</span>&gt;
    &lt;<span class="t-tag tag-ok">language</span>&gt;ml-IN&lt;/<span class="t-tag tag-ok">language</span>&gt; <span class="t-ts">&lt;!-- Malayalam --&gt;</span>
    &lt;<span class="t-tag tag-ok">headline</span>&gt;വയനാട് മിന്നൽ പ്രളയ മുന്നറിയിപ്പ്&lt;/<span class="t-tag tag-ok">headline</span>&gt;
    &lt;<span class="t-tag tag-ok">description</span>&gt;ഉടൻ തന്നെ ഉയർന്ന പ്രദേശങ്ങളിലേക്ക് മാറുക. റൂട്ട് 3 സ്വീകരിക്കുക.&lt;/<span class="t-tag tag-ok">description</span>&gt;
    &lt;<span class="t-tag tag-ok">area</span>&gt;&lt;<span class="t-tag tag-warn">circle</span>&gt;11.6854,76.1320 5000&lt;/<span class="t-tag tag-warn">circle</span>&gt;&lt;/<span class="t-tag tag-ok">area</span>&gt;
  &lt;/<span class="t-tag tag-warn">info</span>&gt;
&lt;/<span class="t-tag tag-ok">alert</span>&gt;</code></pre>`
    }
  };

  codeTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      codeTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      const data = codeSnippets[tab];
      if (!data) return;
      codeTabTitle.textContent = data.title;
      codeTabBody.innerHTML = data.code;
    });
  });

  // ---- Re-trigger reveals when slide changes ----
  const originalGoToSlide = goToSlide;
  // Patch goToSlide is already defined, we just need to re-observe on each slide
  // The observer handles this automatically since all elements are observed at init

  // ---- Animate delay bar segments on slide 2 entrance ----
  document.querySelectorAll(".delay-segment").forEach(seg => {
    const w = seg.style.width;
    seg.style.width = "0";
    seg.classList.add("animate-fill");
    // Reset and re-trigger on slide activation
    const observer = new MutationObserver(() => {
      const parentSlide = seg.closest(".slide");
      if (parentSlide && parentSlide.classList.contains("active")) {
        seg.style.width = "0";
        requestAnimationFrame(() => {
          seg.style.width = w;
        });
      }
    });
    const parentSlide = seg.closest(".slide");
    if (parentSlide) observer.observe(parentSlide, { attributes: true, attributeFilter: ["class"] });
  });

});

// ============================================================
//  PARTICLE NETWORK CANVAS
// ============================================================
(function() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles;
  const COUNT = 70;
  const CONNECT_DIST = 150;
  const SPEED = 0.25;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.35 + 0.05
      });
    }
  }

  function isLight() { return document.body.classList.contains("light-mode"); }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const c = isLight() ? "0,120,255" : "0,240,255";

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${c},${(1 - d / CONNECT_DIST) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},${p.a})`;
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize(); init();
  requestAnimationFrame(frame);
})();
