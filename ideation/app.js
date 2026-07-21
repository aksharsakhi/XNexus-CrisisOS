// XNexus-CrisisOS Presentation Logic & PPTX Exporter - Cinematic Showcase

document.addEventListener("DOMContentLoaded", () => {
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const menuItems = document.querySelectorAll("#slide-menu-list .nav-item");
  const totalSlides = slides.length;

  const currentSlideNumLabel = document.getElementById("current-slide-num");
  const totalSlidesNumLabel = document.getElementById("total-slides-num");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const exportBtn = document.getElementById("export-btn");
  const fullscreenTarget = document.getElementById("fullscreen-target");

  const terminalBody = document.getElementById("agent-terminal-body");
  
  // Theme toggle elements
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  // Simulator elements
  const playSimBtn = document.getElementById("play-sim-btn");
  const closeSimBtn = document.getElementById("close-sim-btn");
  const startSimRunBtn = document.getElementById("start-sim-run-btn");
  const simModal = document.getElementById("sim-modal");
  const simLogsBody = document.getElementById("sim-logs-body");

  // Set total slide count label
  if (totalSlidesNumLabel) {
    totalSlidesNumLabel.textContent = totalSlides;
  }

  // ----------------------------------------------------
  // Theme Toggle Logic (Light / Dark Mode)
  // ----------------------------------------------------
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      
      // Update label
      if (themeText) {
        themeText.textContent = isLight ? "Light Mode" : "Dark Mode";
      }
      
      // Update SVG Icon
      if (themeIcon) {
        if (isLight) {
          // Sun Icon path
          themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          `;
        } else {
          // Moon Icon path
          themeIcon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          `;
        }
      }
    });
  }

  // ----------------------------------------------------
  // Dynamic Circular Gauges (Slide 9)
  // ----------------------------------------------------
  const svgs = document.querySelectorAll(".circular-gauge svg");
  svgs.forEach(svg => {
    if (!svg.querySelector("defs")) {
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.innerHTML = `
        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f2fe" />
          <stop offset="100%" stop-color="#4facfe" />
        </linearGradient>
      `;
      svg.insertBefore(defs, svg.firstChild);
    }
  });

  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Deactivate previous slide
    slides[currentSlideIndex].classList.remove("active-slide");
    menuItems[currentSlideIndex].classList.remove("active");

    // Activate next slide
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add("active-slide");
    menuItems[currentSlideIndex].classList.add("active");

    menuItems[currentSlideIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });

    if (currentSlideNumLabel) {
      currentSlideNumLabel.textContent = currentSlideIndex + 1;
    }

    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;

    // Trigger circular progress animations on Slide 9 (index 8)
    if (currentSlideIndex === 8) {
      animateCircularMetrics();
    } else {
      resetCircularMetrics();
    }
  }

  function animateCircularMetrics() {
    const gauges = document.querySelectorAll(".circular-gauge");
    gauges.forEach(gauge => {
      const fillCircle = gauge.querySelector(".gauge-fill");
      const textLabel = gauge.querySelector(".gauge-text");
      const targetPercent = parseInt(gauge.getAttribute("data-percent"), 10);
      
      const r = 40;
      const circumference = 2 * Math.PI * r; // ~251.2
      const offset = circumference - (circumference * targetPercent) / 100;
      
      fillCircle.style.strokeDashoffset = offset;
      
      let currentVal = 0;
      const duration = 1500; // ms
      const intervalTime = 30; // ms
      const step = targetPercent / (duration / intervalTime);
      
      const counterInterval = setInterval(() => {
        currentVal += step;
        if (currentVal >= targetPercent) {
          currentVal = targetPercent;
          clearInterval(counterInterval);
        }
        textLabel.textContent = (gauge.getAttribute("data-percent") === "75" ? "+" : "") + Math.round(currentVal) + "%";
      }, intervalTime);
      
      gauge.dataset.intervalId = counterInterval;
    });
  }

  function resetCircularMetrics() {
    const gauges = document.querySelectorAll(".circular-gauge");
    gauges.forEach(gauge => {
      if (gauge.dataset.intervalId) {
        clearInterval(parseInt(gauge.dataset.intervalId, 10));
      }
      const fillCircle = gauge.querySelector(".gauge-fill");
      const textLabel = gauge.querySelector(".gauge-text");
      fillCircle.style.strokeDashoffset = 251.2;
      textLabel.textContent = "0%";
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentSlideIndex + 1);
    });
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetIndex = parseInt(item.getAttribute("data-slide"), 10);
      showSlide(targetIndex);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Space") {
      e.preventDefault();
      showSlide(currentSlideIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      showSlide(currentSlideIndex - 1);
    } else if (e.key.toLowerCase() === "f") {
      toggleFullscreen();
    }
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      fullscreenTarget.requestFullscreen()
        .then(() => {
          document.body.classList.add("fullscreen-active");
        })
        .catch(err => {
          console.error("Error enabling fullscreen mode: ", err);
        });
    } else {
      document.exitFullscreen();
    }
  }

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove("fullscreen-active");
    } else {
      document.body.classList.add("fullscreen-active");
    }
  });

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullscreen);
  }

  // ----------------------------------------------------
  // Slide 4: Interactive Log stream
  // ----------------------------------------------------
  const agentLogs = {
    weather: [
      "<span class='t-success'>[INFO]</span> Ingesting IMD INSAT-3DR thermal water vapor scans...",
      "<span class='t-success'>[INFO]</span> Doppler weather radar grid connected: Kochi (Active), Mumbai (Active).",
      "<span class='t-warning'>[WARN]</span> Precipitation density limit exceeded in Kerala Western Ghats: 52.0mm/hr."
    ],
    flood: [
      "<span class='t-success'>[INFO]</span> Ingesting Central Water Commission gauge levels...",
      "<span class='t-success'>[INFO]</span> Station CWC-KBL-03 (Kabini Gauge) registers level: 839.2m (+18cm/hr trend).",
      "<span class='t-danger'>[ALERT]</span> Hydrograph prediction forecasts warning limit breach in 2.5 hours."
    ],
    risk: [
      "<span class='t-success'>[INFO]</span> Spatial intersection check: overlaying CWC flood height prediction onto Local Census block database...",
      "<span class='t-success'>[INFO]</span> Demographic impact score evaluated: 840 households in Sector C at high risk.",
      "<span class='t-warning'>[WARN]</span> Mudslide hazard index registers high probability for hilly slope sectors."
    ],
    resource: [
      "<span class='t-success'>[INFO]</span> Ingesting NDRF battalion location coordinate logs...",
      "<span class='t-success'>[INFO]</span> NDRF 4th Battalion: 8 rescue rafts and 32 rescue professionals marked AVAILABLE.",
      "<span class='t-success'>[INFO]</span> SDRF emergency squad standby status: OK."
    ],
    traffic: [
      "<span class='t-success'>[INFO]</span> Ingesting Mappls MapmyIndia road network traffic flow feeds...",
      "<span class='t-warning'>[WARN]</span> NH-76 segment marked BLOCKED due to mountain water runoffs.",
      "<span class='t-success'>[INFO]</span> Evacuation egress computed: Route 3 (East Bypass) clear of current flow vectors."
    ],
    medical: [
      "<span class='t-success'>[INFO]</span> Querying state-level 108 medical bed availability databases...",
      "<span class='t-success'>[INFO]</span> Kozhikode Medical College: 14 ICU units, 45 surgical beds AVAILABLE.",
      "<span class='t-warning'>[WARN]</span> Wayanad district hospital ER load exceeding threshold limit. Routing ambulances to Kozhikode."
    ],
    comms: [
      "<span class='t-success'>[INFO]</span> Connecting to NDMA Sachet Common Alerting Protocol (CAP) gateway...",
      "<span class='t-success'>[INFO]</span> Warning warning drafted in regional languages (Malayalam, Hindi, English).",
      "<span class='t-success'>[INFO]</span> Alert broadcast targets: Mobile cells enclosing Sector A and B."
    ],
    logistics: [
      "<span class='t-success'>[INFO]</span> Indexing Food Corporation of India (FCI) supply stock levels...",
      "<span class='t-success'>[INFO]</span> Relief materials packaged: 5000 dry food packets, 2500 clean water bottles.",
      "<span class='t-success'>[INFO]</span> Drone freight delivery queue: Standby."
    ],
    commander: [
      "<span class='t-success'>[INFO]</span> NDRF Commander Agent running multithreaded simulation scenarios...",
      "<span class='t-success'>[INFO]</span> 24 response paths evaluated using MapmyIndia road weights and CWC inundation polygons.",
      "<span class='t-danger'>[DECISION]</span> Selected Plan 12: evacuation via Route 3 and deployment of NDRF 4th Battalion. Casualties reduced by 72%."
    ]
  };

  window.selectAgent = function(card, agentType) {
    const cards = document.querySelectorAll(".agent-card");
    cards.forEach(c => c.classList.remove("selected-agent"));
    card.classList.add("selected-agent");

    if (terminalBody && agentLogs[agentType]) {
      terminalBody.innerHTML = "";
      let lines = [
        `<span class="c-prompt">XNexusOS:~$</span> python3 -m agents.${agentType}_agent --stream-telemetry`,
        ...agentLogs[agentType]
      ];

      lines.forEach((line, idx) => {
        setTimeout(() => {
          const p = document.createElement("p");
          p.className = "t-line";
          p.innerHTML = line;
          terminalBody.appendChild(p);
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }, idx * 220);
      });
    }
  };

  // ----------------------------------------------------
  // Cinematic Simulator Logic ("Intro Video")
  // ----------------------------------------------------
  if (playSimBtn) {
    playSimBtn.addEventListener("click", () => {
      if (simModal) simModal.style.display = "flex";
      resetSimulatorUI();
    });
  }

  if (closeSimBtn) {
    closeSimBtn.addEventListener("click", () => {
      if (simModal) simModal.style.display = "none";
    });
  }

  function resetSimulatorUI() {
    // Reset steps
    document.querySelectorAll(".step-dot").forEach((dot, idx) => {
      dot.className = idx === 0 ? "step-dot active" : "step-dot";
    });
    // Reset indicators
    document.getElementById("sim-telemetry-val").textContent = "STANDBY";
    document.getElementById("sim-telemetry-val").className = "sc-val font-accent";
    document.getElementById("sim-threat-val").textContent = "0%";
    document.getElementById("sim-threat-val").className = "sc-val";
    
    // Reset map markers
    document.getElementById("marker-v1").className = "map-marker v1 normal";
    document.getElementById("marker-v2").className = "map-marker v2 normal";
    
    // Hide route path
    const routeLine = document.getElementById("route-path-line");
    routeLine.style.strokeDashoffset = "300";
    
    // Reset logs
    simLogsBody.innerHTML = '<p class="t-line"><span class="c-prompt">XNexusOS:~$</span> click start above to play the concept demo...</p>';
    
    // Enable button
    startSimRunBtn.disabled = false;
    startSimRunBtn.textContent = "START AUTONOMOUS COGNITION DEMO";
  }

  if (startSimRunBtn) {
    startSimRunBtn.addEventListener("click", () => {
      startSimRunBtn.disabled = true;
      startSimRunBtn.textContent = "SIMULATOR RUNNING...";
      runSimulatorShowcase();
    });
  }

  function appendSimLog(htmlContent, delayMs) {
    return new Promise(resolve => {
      setTimeout(() => {
        const p = document.createElement("p");
        p.className = "t-line";
        p.innerHTML = htmlContent;
        simLogsBody.appendChild(p);
        simLogsBody.scrollTop = simLogsBody.scrollHeight;
        resolve();
      }, delayMs);
    });
  }

  async function runSimulatorShowcase() {
    simLogsBody.innerHTML = "";
    
    // --- Step 1: Telemetry Ingest ---
    document.getElementById("sim-dot-1").className = "step-dot active";
    document.getElementById("sim-telemetry-val").textContent = "INGESTING Feeds";
    document.getElementById("sim-telemetry-val").className = "sc-val font-accent t-warning";
    document.getElementById("sim-threat-val").textContent = "25%";
    document.getElementById("sim-threat-val").className = "sc-val t-warning";
    
    await appendSimLog("<span class='t-success'>[INFO]</span> Ingesting satellite bands from IMD INSAT-3DR...", 100);
    await appendSimLog("<span class='t-success'>[INFO]</span> Precipitation rate recorded: 55mm/hr in Kerala Sectors.", 500);
    await appendSimLog("<span class='t-warning'>[WARN]</span> Inundation warning triggered for Kabini basin river gauges.", 500);
    
    // Mark Step 1 complete
    document.getElementById("sim-dot-1").className = "step-dot completed";
    
    // --- Step 2: Risk Profiling ---
    document.getElementById("sim-dot-2").className = "step-dot active";
    document.getElementById("sim-telemetry-val").textContent = "THREAT CONFIRMED";
    document.getElementById("sim-telemetry-val").className = "sc-val font-accent t-danger";
    document.getElementById("sim-threat-val").textContent = "85%";
    document.getElementById("sim-threat-val").className = "sc-val t-danger";
    
    // Village A and B turn to Danger state (flashing red)
    document.getElementById("marker-v1").className = "map-marker v1 danger";
    document.getElementById("marker-v2").className = "map-marker v2 danger";
    
    await appendSimLog("<span class='t-success'>[INFO]</span> Risk Agent overlapping GIS hazard maps with demography...", 500);
    await appendSimLog("<span class='t-danger'>[ALERT]</span> Landslide hazard index: 88% soil saturation. Inundation depth +24cm/hr.", 500);
    await appendSimLog("<span class='t-danger'>[ALERT]</span> Villages A and B marked as HIGH RISKS (920 people affected).", 500);
    
    // Mark Step 2 complete
    document.getElementById("sim-dot-2").className = "step-dot completed";
    
    // --- Step 3: Plan Simulation ---
    document.getElementById("sim-dot-3").className = "step-dot active";
    document.getElementById("sim-telemetry-val").textContent = "OPTIMIZING ROUTE";
    document.getElementById("sim-telemetry-val").className = "sc-val font-accent t-warning";
    document.getElementById("sim-threat-val").textContent = "95%";
    
    await appendSimLog("<span class='t-success'>[INFO]</span> Ingesting route segments from MapmyIndia Mappls API...", 600);
    await appendSimLog("<span class='t-success'>[INFO]</span> NDRF Commander simulating 24 evacuation scenarios in parallel...", 600);
    
    // Draw the route on the map
    const routeLine = document.getElementById("route-path-line");
    routeLine.style.transition = "stroke-dashoffset 2s ease";
    routeLine.style.strokeDashoffset = "0";
    
    await appendSimLog("<span class='t-success'>[SUCCESS]</span> Optimal exit route computed via East Bypass (Clear of floods).", 1000);
    
    // Mark Step 3 complete
    document.getElementById("sim-dot-3").className = "step-dot completed";
    
    // --- Step 4: Autonomous Action ---
    document.getElementById("sim-dot-4").className = "step-dot active";
    document.getElementById("sim-telemetry-val").textContent = "DISPATCHING ORDERS";
    
    await appendSimLog("<span class='t-success'>[INFO]</span> Broadcasting evacuation commands via NDMA Sachet CAP cell-towers...", 600);
    await appendSimLog("<span class='t-success'>[INFO]</span> Notifying local 108 medical networks for ambulance routing.", 500);
    await appendSimLog("<span class='t-success'>[INFO]</span> Deploying NDRF 4th Battalion squads to coordinates.", 500);
    
    // Villages turn to Safe state (green)
    document.getElementById("marker-v1").className = "map-marker v1 safe";
    document.getElementById("marker-v2").className = "map-marker v2 safe";
    
    document.getElementById("sim-telemetry-val").textContent = "THREAT MITIGATED";
    document.getElementById("sim-telemetry-val").className = "sc-val font-accent t-success";
    document.getElementById("sim-threat-val").textContent = "12%";
    document.getElementById("sim-threat-val").className = "sc-val t-success";
    
    await appendSimLog("<span class='t-success'>[SUCCESS]</span> Evacuation completed. Casualty index reduced by 72%.", 800);
    
    // Mark Step 4 complete
    document.getElementById("sim-dot-4").className = "step-dot completed";
    
    // Enable button again
    startSimRunBtn.disabled = false;
    startSimRunBtn.textContent = "RUN SIMULATION AGAIN";
  }

  // ----------------------------------------------------
  // PowerPoint PPTX Exporter (XNexus-CrisisOS)
  // ----------------------------------------------------
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportPresentationToPPTX();
    });
  }

  function exportPresentationToPPTX() {
    if (typeof PptxGenJS === "undefined") {
      alert("PowerPoint generation library is still loading. Please try again in a moment.");
      return;
    }

    exportBtn.disabled = true;
    exportBtn.innerHTML = `
      <svg class="spinning-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      Generating...
    `;

    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      const darkBg = '0A0B0F';
      const textLight = 'E2E8F0';
      const textMuted = '94A3B8';
      const primaryCyan = '00F2FE';
      const accentRed = 'FF5E62';
      const accentGreen = '00E676';
      const cardBg = '10121A';

      pptx.defineSlideMaster({
        title: 'XNEXUS_MASTER',
        background: { color: darkBg },
        slideNumber: { x: '92%', y: '93%', fontSize: 9, color: textMuted }
      });

      function drawHeader(slide, title, category) {
        slide.addText(category, { x: 0.6, y: 0.3, w: 8.8, h: 0.3, fontSize: 10, color: primaryCyan, bold: true });
        slide.addText(title, { x: 0.6, y: 0.6, w: 8.8, h: 0.5, fontSize: 24, color: 'FFFFFF', bold: true });
        slide.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 8.8, h: 0.02, fill: { color: primaryCyan }, line: { width: 0 } });
      }

      // SLIDE 1: Title Slide (XNexus-CrisisOS)
      const slide1 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      slide1.addText("XNEXUS - CRISISOS FOR INDIA", { x: 1.0, y: 0.8, w: 8.0, h: 0.3, fontSize: 10, color: primaryCyan, bold: true, align: 'center' });
      slide1.addText("XNEXUS.OS", { x: 1.0, y: 1.2, w: 8.0, h: 1.1, fontSize: 60, bold: true, color: 'FFFFFF', align: 'center' });
      slide1.addText("Autonomous Disaster Command Center", { x: 1.0, y: 2.3, w: 8.0, h: 0.5, fontSize: 18, color: textMuted, align: 'center', bold: true });
      slide1.addShape(pptx.shapes.RECTANGLE, { x: 4.4, y: 2.9, w: 1.2, h: 0.03, fill: { color: primaryCyan }, line: { width: 0 } });
      slide1.addText("An intelligent multi-agent operating system that predicts, coordinates, and autonomously manages disaster response in real time across India's vulnerable regions. Interfaces directly with Central Water Commission gauges, IMD telemetry, and NDMA Sachet cell-broadcast grids.", { x: 1.5, y: 3.1, w: 7.0, h: 0.8, fontSize: 12, color: textLight, align: 'center' });
      slide1.addText("DATA PIPELINES\nIMD / CWC / GSI Feeds", { x: 1.0, y: 4.2, w: 2.4, h: 0.6, fontSize: 9, color: textLight, align: 'center' });
      slide1.addText("DEPLOYMENT CORE\nNDRF / SDRF Action Hub", { x: 3.8, y: 4.2, w: 2.4, h: 0.6, fontSize: 9, color: textLight, align: 'center' });
      slide1.addText("ALERTS MAPPED\nNDMA Sachet Protocol", { x: 6.6, y: 4.2, w: 2.4, h: 0.6, fontSize: 9, color: textLight, align: 'center' });

      // SLIDE 2: The Problem
      const slide2 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide2, "India's Critical Response Bottlenecks", "02 / PROBLEM SPACE");
      slide2.addText("India faces extreme climate threats: Himalayan landslides (Uttarakhand, Wayanad), seasonal monsoon floods (Assam, Bihar, Kerala), and cyclones. Government agencies have advanced telemetry systems, but they operate in absolute isolation.", { x: 0.6, y: 1.5, w: 4.2, h: 0.8, fontSize: 11, color: textLight });
      slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 2.5, w: 4.2, h: 1.2, fill: { color: '1A1215' }, line: { color: accentRed, width: 1 } });
      slide2.addText("THE OPERATIONAL FRICTION: Heavy rain alerts from IMD and river heights from CWC sit on separate dashboards. Triggering evacuations requires manual, phone-based coordination between weather bureaus, district magistrates, hospitals, and NDRF squads.", { x: 0.8, y: 2.6, w: 3.8, h: 1.0, fontSize: 10.5, color: accentRed, bold: true });
      slide2.addText("Delayed early action during extreme monsoons directly escalates casualties and delays relief dispatch.", { x: 0.6, y: 3.9, w: 4.2, h: 0.8, fontSize: 11, color: textMuted });

      const cardData = [
        { title: "🌧️ Monsoon Friction", desc: "Friction in linking IMD forecasts with CWC river heights delays early evacuation timelines." },
        { title: "🔌 Agency Data Silos", desc: "CWC gauges, GSI landslide indices, and NHAI highway feeds do not dynamically share telemetry." },
        { title: "☎️ Manual NDRF Logs", desc: "Human coordinators must query 108 emergency health databases and assign relief boats via voice call logs." },
        { title: "📢 Static Warning", desc: "Standard alert sirens fail to route fleeing populations to safe highways in local languages." }
      ];
      cardData.forEach((data, i) => {
        const xPos = 5.1 + (i % 2) * 2.2;
        const yPos = 1.5 + Math.floor(i / 2) * 1.8;
        slide2.addShape(pptx.shapes.RECTANGLE, { x: xPos, y: yPos, w: 2.0, h: 1.6, fill: { color: cardBg }, line: { color: '1f2430', width: 1 } });
        slide2.addText(data.title, { x: xPos + 0.1, y: yPos + 0.15, w: 1.8, h: 0.3, fontSize: 11, color: 'FFFFFF', bold: true });
        slide2.addText(data.desc, { x: xPos + 0.1, y: yPos + 0.45, w: 1.8, h: 1.1, fontSize: 9, color: textMuted });
      });

      // SLIDE 3: Proposed Solution
      const slide3 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide3, "Introducing XNexus-CrisisOS", "03 / SOLUTION");
      slide3.addShape(pptx.shapes.OVAL, { x: 1.9, y: 2.4, w: 1.2, h: 1.2, fill: { color: primaryCyan }, line: { width: 0 } });
      slide3.addText("XNEXUS.OS", { x: 1.8, y: 2.8, w: 1.4, h: 0.4, fontSize: 11, color: '000000', bold: true, align: 'center' });
      const orbitNodes = [
        { label: "IMD Doppler", x: 2.1, y: 1.5 },
        { label: "CWC Gauges", x: 3.4, y: 2.2 },
        { label: "GSI Landslides", x: 3.0, y: 3.6 },
        { label: "MapmyIndia", x: 0.8, y: 3.2 },
        { label: "108 Health", x: 0.9, y: 1.8 }
      ];
      orbitNodes.forEach(node => {
        slide3.addShape(pptx.shapes.RECTANGLE, { x: node.x, y: node.y, w: 1.1, h: 0.4, fill: { color: cardBg }, line: { color: primaryCyan, width: 1 } });
        slide3.addText(node.label, { x: node.x, y: node.y + 0.05, w: 1.1, h: 0.3, fontSize: 8.5, color: primaryCyan, bold: true, align: 'center' });
      });
      slide3.addText("Real-Telemetry Multi-Agent Command Mesh", { x: 5.0, y: 1.5, w: 4.4, h: 0.4, fontSize: 15, color: 'FFFFFF', bold: true });
      slide3.addText("XNexus-CrisisOS deploys a collaborative framework of specialized AI Agents interacting via custom Model Context Protocol (MCP) servers to ingest live Indian government databases.", { x: 5.0, y: 1.9, w: 4.4, h: 0.8, fontSize: 11, color: textLight });
      const solutionPoints = [
        { title: "IMD & CWC Hydrology", text: "Directly streams telemetry feeds to model landslide risks and map flood inundation limits in advance." },
        { title: "MapmyIndia Route Solving", text: "Evaluates route status and models evacuation flows to coordinate exit paths dynamically." },
        { title: "NDMA Sachet Cell Broadcast", text: "Automates regional language alerts directly to local mobile towers in threatened sectors." }
      ];
      solutionPoints.forEach((pt, idx) => {
        const yOffset = 2.8 + idx * 0.75;
        slide3.addShape(pptx.shapes.RECTANGLE, { x: 5.0, y: yOffset, w: 0.1, h: 0.1, fill: { color: primaryCyan }, line: { width: 0 } });
        slide3.addText(`${pt.title}: ${pt.text}`, { x: 5.2, y: yOffset - 0.05, w: 4.2, h: 0.7, fontSize: 10, color: textLight });
      });

      // SLIDE 4: Core Multi-Agents
      const slide4 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide4, "India-Focused Agentic Framework", "04 / MULTI-AGENT ARCHITECTURE");
      const agents = [
        { badge: "WEATHER", name: "Weather Intelligence", desc: "Monitors IMD Doppler radar arrays, INSAT-3D satellite grids, and cyclone tracks." },
        { badge: "PREDICT", name: "Flood & Landslide", desc: "Ingests CWC river gauge stations and GSI soil moisture logs." },
        { badge: "RISK", name: "Risk Assessment", desc: "Cross-references hazard polygons against India's Census maps and local housing indices." },
        { badge: "RESOURCE", name: "Resource Management", desc: "Tracks availability of NDRF battalions, state police squads, and rescue boats." },
        { badge: "TRAFFIC", name: "Traffic & Evacuation", desc: "Computes exit corridors dynamically by routing traffic away from CWC-flooded roads." },
        { badge: "MEDICAL", name: "Medical Coordination", desc: "Coordinates ambulance routes and queries ICU bed vacancies via state 108 databases." },
        { badge: "COMMS", name: "Communication", desc: "Drafts and broadcasts localized alerts via NDMA Sachet and WhatsApp." },
        { badge: "LOGISTICS", name: "Relief & Supply", desc: "Coordinates food, water, and medicine dispatch from Food Corporation of India (FCI) depots." },
        { badge: "NDRF COMMAND", name: "Decision Commander", desc: "Fuses intelligence from all agents, models scenarios, and generates NDRF deployment orders.", highlight: true }
      ];
      agents.forEach((agent, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const xPos = 0.6 + col * 2.95;
        const yPos = 1.45 + row * 1.25;
        slide4.addShape(pptx.shapes.RECTANGLE, { 
          x: xPos, y: yPos, w: 2.8, h: 1.15, 
          fill: { color: agent.highlight ? '132028' : cardBg }, 
          line: { color: agent.highlight ? primaryCyan : '1c202d', width: 1 } 
        });
        slide4.addText(agent.badge, { x: xPos + 0.1, y: yPos + 0.1, w: 2.0, h: 0.25, fontSize: 8, color: primaryCyan, bold: true });
        slide4.addText(agent.name, { x: xPos + 0.1, y: yPos + 0.35, w: 2.6, h: 0.3, fontSize: 10, color: 'FFFFFF', bold: true });
        slide4.addText(agent.desc, { x: xPos + 0.1, y: yPos + 0.62, w: 2.6, h: 0.48, fontSize: 8, color: textMuted });
      });

      // SLIDE 5: Key Features
      const slide5 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide5, "Real-Data Core Capabilities", "05 / CORE CAPABILITIES");
      const features = [
        { num: "01", title: "IMD Radar & Forecasts", desc: "Monitors heavy rainfall parameters directly using live IMD forecasts and doppler radar feeds to establish landslide triggers." },
        { num: "02", title: "CWC River Hydrography", desc: "Ingests real-time water levels from CWC telemetry stations to calculate flood heights and estimate local village inundation times." },
        { num: "03", title: "GSI Slope Saturation", desc: "Evaluates slope soil moisture maps from GSI (Geological Survey of India) databases to pinpoint landslide threat zones in hilly regions." },
        { num: "04", title: "MapmyIndia Evacuation", desc: "Interfaces with national road telemetry systems to calculate evacuation pathways around flooded highways." },
        { num: "05", title: "NDMA Sachet Cell Broadcasts", desc: "Triggers localized cell-broadcast SMS warnings in Hindi, English, and regional languages to mobile towers in threat corridors." },
        { num: "06", title: "State 108 Emergency Beds", desc: "Queries regional hospital ICU registries to optimize patient delivery routes and prevent trauma facility congestion." }
      ];
      features.forEach((feat, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const xPos = 0.6 + col * 2.95;
        const yPos = 1.5 + row * 1.8;
        slide5.addShape(pptx.shapes.RECTANGLE, { x: xPos, y: yPos, w: 2.8, h: 1.6, fill: { color: cardBg }, line: { color: '1f2430', width: 1 } });
        slide5.addText(feat.num, { x: xPos + 0.1, y: yPos + 0.15, w: 1.0, h: 0.3, fontSize: 14, color: primaryCyan, bold: true });
        slide5.addText(feat.title, { x: xPos + 0.1, y: yPos + 0.45, w: 2.6, h: 0.3, fontSize: 10.5, color: 'FFFFFF', bold: true });
        slide5.addText(feat.desc, { x: xPos + 0.1, y: yPos + 0.75, w: 2.6, h: 0.8, fontSize: 8.5, color: textMuted });
      });

      // SLIDE 6: USP
      const slide6 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide6, "Beyond Alerting: Real-Data Decisions", "06 / THE 'WOW' USP");
      slide6.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.1, h: 3.5, fill: { color: '1C1214' }, line: { color: accentRed, width: 1 } });
      slide6.addText("⚠️ TRADITIONAL MONITORING ALERT", { x: 0.8, y: 1.7, w: 3.7, h: 0.3, fontSize: 9.5, color: accentRed, bold: true });
      slide6.addText("🚨 Alert: 'IMD Alert: Heavy rain predicted in Wayanad, Kerala. Red alert issued.'", { x: 0.8, y: 2.2, w: 3.7, h: 1.2, fontSize: 13.5, color: 'FFFFFF', bold: true });
      slide6.addText("Requires human operators to manually audit hospital databases, cross-reference mountain highway status, check SDRF rosters, and coordinate resources manually over multiple departments and phone lines.", { x: 0.8, y: 3.5, w: 3.7, h: 1.3, fontSize: 10.5, color: textMuted });

      slide6.addText("VS", { x: 4.75, y: 3.0, w: 0.5, h: 0.5, fontSize: 16, color: textMuted, bold: true, align: 'center' });

      slide6.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.5, w: 4.1, h: 3.5, fill: { color: '0b0c10' }, line: { color: primaryCyan, width: 2 } });
      slide6.addText("XNEXUS.OS // DECISION COMMANDER", { x: 5.5, y: 1.7, w: 3.7, h: 0.3, fontSize: 10, color: primaryCyan, bold: true });
      slide6.addText("🤖 'I simulated 24 response plans...'", { x: 5.5, y: 2.1, w: 3.7, h: 0.3, fontSize: 12.5, color: 'FFFFFF', bold: true });
      slide6.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 2.45, w: 3.7, h: 1.4, fill: { color: '000000' }, line: { color: '00323c', width: 1 } });
      slide6.addText("XNexusOS:~$ python3 -m orchestrator --evaluate-incident\n\n\"Based on CWC river rise at Kabini river (+18cm/hr), INSAT soil saturation index (88%), and MapmyIndia road network telemetry, I simulated 24 response plans. Evacuating Villages A & B in 35 mins via Route 3 and deploying NDRF 4th Battalion with 8 rescue boats reduces projected casualties by 72%.\"", { x: 5.6, y: 2.5, w: 3.5, h: 1.3, fontSize: 9, color: 'FFFFFF', fontFace: 'Courier New' });
      slide6.addText("24\nScenarios Run", { x: 5.5, y: 3.95, w: 1.1, h: 0.5, fontSize: 9, color: accentGreen, bold: true, align: 'center' });
      slide6.addText("-72%\nCasualties", { x: 6.8, y: 3.95, w: 1.1, h: 0.5, fontSize: 9, color: accentGreen, bold: true, align: 'center' });
      slide6.addText("35 min\nWindow", { x: 8.1, y: 3.95, w: 1.1, h: 0.5, fontSize: 9, color: accentGreen, bold: true, align: 'center' });

      // SLIDE 7: Stack & MCP
      const slide7 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide7, "MCP Integration Framework", "07 / ARCHITECTURE SYSTEM");
      slide7.addText("LLMs cannot access live state registries. XNexus-CrisisOS bypasses this by building custom Model Context Protocol (MCP) servers to securely bridge live Indian agency data.", { x: 0.6, y: 1.5, w: 4.2, h: 1.0, fontSize: 12, color: textLight });
      const techList = [
        { label: "Frontend UI", val: "React, Tailwind CSS, Leaflet.js Interactive Mapping" },
        { label: "Agent Backend", val: "LangGraph, FastAPI, Python" },
        { label: "Spatial DB", val: "PostgreSQL + PostGIS (Geospatial Indexing)" },
        { label: "MCP Servers", val: "Custom Python servers wrapping CWC, IMD, and MapmyIndia APIs" }
      ];
      techList.forEach((tech, idx) => {
        const yOffset = 2.7 + idx * 0.65;
        slide7.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: yOffset, w: 4.2, h: 0.5, fill: { color: cardBg }, line: { color: '1f2430', width: 1 } });
        slide7.addText(`${tech.label}: ${tech.val}`, { x: 0.75, y: yOffset + 0.1, w: 3.9, h: 0.3, fontSize: 9.5, color: textLight });
      });
      slide7.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: 1.7, w: 1.8, h: 3.0, fill: cardBg, line: { color: primaryCyan, width: 1 } });
      slide7.addText("MCP DATA SERVERS\n\n• CWC Gauge Feeds\n• IMD Doppler Radar\n• MapmyIndia API", { x: 5.3, y: 1.8, w: 1.6, h: 2.8, fontSize: 10, color: textLight, align: 'center' });
      slide7.addText("⟷", { x: 7.0, y: 3.0, w: 0.5, h: 0.4, fontSize: 20, color: primaryCyan, align: 'center' });
      slide7.addShape(pptx.shapes.RECTANGLE, { x: 7.6, y: 1.7, w: 1.8, h: 3.0, fill: cardBg, line: { color: primaryCyan, width: 1 } });
      slide7.addText("LANGGRAPH AGENTS\n\n• Weather Agent\n• Flood/Landslide\n• Resource Manager\n• Decision Agent", { x: 7.7, y: 1.8, w: 1.6, h: 2.8, fontSize: 10, color: textLight, align: 'center' });

      // SLIDE 8: Workflow
      const slide8 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide8, "Telemetry to Execution Workflow", "08 / SYSTEM FLOW");
      slide8.addShape(pptx.shapes.RECTANGLE, { x: 1.5, y: 2.1, w: 7.0, h: 0.03, fill: { color: '303445' }, line: { width: 0 } });
      const steps = [
        { num: "01", title: "Telemetry Ingest", desc: "IMD Doppler radar logs heavy precipitation index. CWC monitoring registers gauge spikes exceeding threshold parameters." },
        { num: "02", title: "Risk Profiling", desc: "Risk Agent runs GIS demographic overlaps to identify vulnerable villages. Medical Agent scans 108 hospital beds availability." },
        { num: "03", title: "Plan Simulation", desc: "NDRF Commander Agent models road closures. Ingests MapmyIndia road indices to calculate safe evacuation paths." },
        { num: "04", title: "Action Dispatch", desc: "XNexus-CrisisOS triggers regional warnings via Sachet, dispatches GPS routes to SDRF units, and assigns ambulance paths." }
      ];
      steps.forEach((step, idx) => {
        const xPos = 0.6 + idx * 2.25;
        slide8.addShape(pptx.shapes.OVAL, { x: xPos + 0.8, y: 1.8, w: 0.6, h: 0.6, fill: { color: darkBg }, line: { color: primaryCyan, width: 2 } });
        slide8.addText(step.num, { x: xPos + 0.8, y: 1.95, w: 0.6, h: 0.3, fontSize: 11, color: primaryCyan, bold: true, align: 'center' });
        slide8.addShape(pptx.shapes.RECTANGLE, { x: xPos, y: 2.6, w: 2.1, h: 2.2, fill: { color: cardBg }, line: { color: '1f2430', width: 1 } });
        slide8.addText(step.title, { x: xPos + 0.1, y: 2.7, w: 1.9, h: 0.3, fontSize: 10.5, color: 'FFFFFF', bold: true });
        slide8.addText(step.desc, { x: xPos + 0.1, y: 3.05, w: 1.9, h: 1.6, fontSize: 8.5, color: textMuted });
      });

      // SLIDE 9: Metrics
      const slide9 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide9, "Target Safety and Performance Metrics", "09 / PROJECTED IMPACT");
      slide9.addText("Saving Lives Through Accelerated Mobilization", { x: 0.6, y: 1.7, w: 4.2, h: 0.8, fontSize: 20, color: primaryCyan, bold: true });
      slide9.addText("Manual operations take hours to verify river data, coordinate relief depots, and broadcast alerts. XNexus-CrisisOS completes these operations in less than 5 minutes.", { x: 0.6, y: 2.6, w: 4.2, h: 1.0, fontSize: 12, color: textLight });
      slide9.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 3.8, w: 4.2, h: 1.0, fill: { color: '101B1A' }, line: { color: accentGreen, width: 1 } });
      slide9.addText("Connecting CWC inundation polygons directly with road graphs prevents traffic deadlocks along mountainous escape pathways.", { x: 0.75, y: 3.85, w: 3.9, h: 0.9, fontSize: 10.5, color: accentGreen });

      const progressBars = [
        { label: "Incident Warning Dispatch Time (90% faster)", pct: 90 },
        { label: "NDRF/SDRF Resource Utilization (+75% efficiency)", pct: 75 },
        { label: "Target Community Warning Delivery (85% regional)", pct: 85 }
      ];
      progressBars.forEach((bar, idx) => {
        const yOffset = 1.8 + idx * 1.1;
        slide9.addText(bar.label, { x: 5.2, y: yOffset, w: 4.0, h: 0.3, fontSize: 10.5, color: 'FFFFFF', bold: true });
        slide9.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: yOffset + 0.35, w: 4.0, h: 0.2, fill: { color: '202430' }, line: { width: 0 } });
        slide9.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: yOffset + 0.35, w: (4.0 * bar.pct) / 100, h: 0.2, fill: { color: primaryCyan }, line: { width: 0 } });
      });

      // SLIDE 10: Roadmap
      const slide10 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide10, "Development Blueprint & Phases", "10 / DEVELOPMENT ROADMAP");
      const phases = [
        { p: "PHASE 1 (WEEK 1-2)", title: "MCP Data Pipelines", desc: "Build custom Python MCP servers wrapping CWC river gauges API and IMD forecast feeds. Establish PostgreSQL + PostGIS database to index regional map data." },
        { p: "PHASE 2 (WEEK 3-4)", title: "Agent Logic & Routes", desc: "Deploy multi-agent collaboration core using LangGraph. Connect to MapmyIndia API for route optimization during heavy flash flood scenarios." },
        { p: "PHASE 3 (WEEK 5-6)", title: "Public Dispatch Core", desc: "Build integration tests for NDMA Sachet alert protocol. Set up ambulance triage APIs and connect live drone inspection logs." }
      ];
      phases.forEach((ph, idx) => {
        const xPos = 0.6 + idx * 3.0;
        slide10.addShape(pptx.shapes.RECTANGLE, { x: xPos, y: 1.6, w: 2.8, h: 2.1, fill: { color: cardBg }, line: { color: '1f2430', width: 1 } });
        slide10.addText(ph.p, { x: xPos + 0.15, y: 1.7, w: 2.5, h: 0.25, fontSize: 8.5, color: primaryCyan, bold: true });
        slide10.addText(ph.title, { x: xPos + 0.15, y: 1.95, w: 2.5, h: 0.3, fontSize: 12, color: 'FFFFFF', bold: true });
        slide10.addText(ph.desc, { x: xPos + 0.15, y: 2.3, w: 2.5, h: 1.3, fontSize: 9.5, color: textMuted });
      });
      slide10.addText("XNexus-CrisisOS — Intelligent Coordinator for Disaster Logistics in India", { x: 1.0, y: 4.1, w: 8.0, h: 0.4, fontSize: 13, color: 'FFFFFF', bold: true, align: 'center' });
      slide10.addText("Pitching at NitroStack 2026 Hackathon. Questions?", { x: 1.0, y: 4.45, w: 8.0, h: 0.3, fontSize: 10, color: textMuted, align: 'center' });

      // Save presentation
      pptx.writeFile({ fileName: 'XNexus_CrisisOS_Hackathon_Proposal.pptx' })
        .then(() => {
          resetExportButton();
        })
        .catch(err => {
          console.error("Error saving PowerPoint PPTX file: ", err);
          alert("Failed to export PPTX.");
          resetExportButton();
        });

    } catch (e) {
      console.error(e);
      alert("Error generating PowerPoint: " + e.message);
      resetExportButton();
    }
  }

  function resetExportButton() {
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        Export PPTX
      `;
    }
  }

  // ----------------------------------------------------
  // Dynamic Real-Time Oscillators & Telemetry Loops
  // ----------------------------------------------------
  
  // 1. Oscillating SVG Sparklines (Slide 4)
  function animateTelemetrySparklines() {
    const paths = document.querySelectorAll(".card-sparkline path");
    const now = Date.now();
    paths.forEach((path, idx) => {
      let d = "M0,10 ";
      const frequency = 0.08;
      const speed = 0.006;
      for (let x = 10; x <= 100; x += 10) {
        const y = 10 + Math.sin(x * frequency + now * speed + idx) * 6 + (Math.random() - 0.5) * 1.5;
        d += `L${x},${Math.max(2, Math.min(18, y))} `;
      }
      path.setAttribute("d", d);
    });
    requestAnimationFrame(animateTelemetrySparklines);
  }
  requestAnimationFrame(animateTelemetrySparklines);

  // 2. Fluctuating Telemetry Values (Slide 1 and Slide 5 detailed widgets)
  setInterval(() => {
    // Slide 1 Board Tickers
    const SaturationLabel = document.querySelector(".board-row:nth-child(2) .board-status");
    if (SaturationLabel) {
      const baseSat = 62;
      const variation = (Math.random() * 1.2 - 0.6).toFixed(1);
      SaturationLabel.textContent = `STANDBY / SOIL SATURATION ${(baseSat + parseFloat(variation)).toFixed(1)}%`;
    }

    const FloodLabel = document.querySelector(".board-row:nth-child(3) .board-status");
    if (FloodLabel) {
      const baseRise = 18;
      const variation = (Math.random() * 0.8 - 0.4).toFixed(1);
      FloodLabel.textContent = `ACTIVE EVACUATION / RIVER TENSION +${(baseRise + parseFloat(variation)).toFixed(1)}CM/HR`;
    }

    // Card 1: IMD Radar
    const radarAzimuth = document.getElementById("radar-azimuth");
    const radarPrecip = document.getElementById("radar-precip");
    if (radarAzimuth && radarPrecip) {
      radarAzimuth.textContent = `${(180 + Math.random() * 15).toFixed(1)}°`;
      radarPrecip.textContent = `${(50 + Math.random() * 15).toFixed(1)}mm/h`;
    }

    // Card 2: CWC River Gauge Hydrography
    const hydroHeightEl = document.getElementById("hydro-height");
    if (hydroHeightEl) {
      const baseHeight = 839.2;
      const variation = (Math.random() * 0.16 - 0.08).toFixed(2);
      hydroHeightEl.textContent = `${(baseHeight + parseFloat(variation)).toFixed(2)}m`;
    }

    // Card 3: GSI Soil Saturation dial progress & scale label
    const soilBarFill = document.querySelector(".soil-bar-fill");
    const soilPercentText = document.getElementById("soil-percent");
    if (soilBarFill && soilPercentText) {
      const basePct = 88;
      const variation = Math.round(Math.random() * 4 - 2);
      const newPct = basePct + variation;
      soilBarFill.style.width = `${newPct}%`;
      soilPercentText.textContent = `${newPct}%`;
    }

    // Card 6: Hospital Beds Triage matrix values
    const bedsH1 = document.getElementById("beds-h1");
    const bedsH3 = document.getElementById("beds-h3");
    if (bedsH1 && bedsH3) {
      const baseH1 = 14;
      const baseH3 = 8;
      bedsH1.textContent = baseH1 + Math.round(Math.random() * 2 - 1);
      bedsH3.textContent = baseH3 + Math.round(Math.random() * 2 - 1);
    }
  }, 2500);

  // 3. Tactical Warning Toasts System
  const toastAlerts = [
    { header: "IMD FEEDS", body: "Doppler radar arrays register high rainfall density (55.4mm/hr)", type: "warning" },
    { header: "CWC HYDROLOGY", body: "Kabini station gauge registers critical rise limit breach (+19.2cm/hr)", type: "danger" },
    { header: "NDRF DISPATCH", body: "4th emergency rescue battalion deployed to high-risk zones", type: "success" },
    { header: "TRAFFIC ROUTING", body: "MapmyIndia bypass evacuation Route 3 synchronized successfully", type: "info" },
    { header: "NDMA SACHET", body: "Multilingual cell-broadcast warnings sent to 840 local cell towers", type: "success" },
    { header: "108 STATE HEALTH", body: "Kozhikode hospital registry reports 14 active trauma beds ready", type: "info" }
  ];

  function showTacticalToast(header, body, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
      <div class="toast-header ${type}">[${header}]</div>
      <div class="toast-body">${body}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 50);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 4500);
  }

  setInterval(() => {
    const randomAlert = toastAlerts[Math.floor(Math.random() * toastAlerts.length)];
    showTacticalToast(randomAlert.header, randomAlert.body, randomAlert.type);
  }, 9000);

  setTimeout(() => {
    showTacticalToast("SYSTEM INITIALIZED", "XNexus-CrisisOS multi-agent dashboard operational in Wayanad, Kerala.", "info");
  }, 2000);

  // 4. Server Rack Blinking LED status loop (Slide 7)
  setInterval(() => {
    const leds = document.querySelectorAll(".shelf-status .led:not(.pulse-led)");
    leds.forEach(led => {
      if (Math.random() > 0.6) {
        led.classList.toggle("active");
      }
    });
  }, 1000);

  // 5. Slide 8: Dynamic Pipeline Step Autocycler
  let currentPipelineStep = 1;
  const pipelineLogs = {
    1: [
      "<div class='status-stream-row'><span class='lbl'>[STREAM]</span><span class='val'>Ingesting station KBL-03 gauges... 839.24m</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[STREAM]</span><span class='val'>Scraping IMD precipitation array... 52.4mm/hr</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[ALERT]</span><span class='val text-danger'>River heights exceed danger parameters!</span></div>"
    ],
    2: [
      "<div class='status-stream-row'><span class='lbl'>[ANALYSIS]</span><span class='val'>Geospatial indexing Census Sector B demographic polygons...</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[ANALYSIS]</span><span class='val'>Identified 840 households in hazard path.</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[INFO]</span><span class='val'>Wayanad hospital resources active. 14 bed availability reported.</span></div>"
    ],
    3: [
      "<div class='status-stream-row'><span class='lbl'>[ROUTE]</span><span class='val'>Checking NH-76 segment status... BLOCKED (Landslide at KM 12)</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[ROUTE]</span><span class='val'>Invoking MapmyIndia routing engine for alternate detour...</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[ROUTE]</span><span class='val text-success'>Bypass calculated: Route 3 via East corridor. Detours verified.</span></div>"
    ],
    4: [
      "<div class='status-stream-row'><span class='lbl'>[SACHET]</span><span class='val'>Drafting multilingual cell warnings (Hindi, English, Malayalam)...</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[SACHET]</span><span class='val'>Transmitting cell warnings to Sector B towers. Broadcast complete.</span></div>",
      "<div class='status-stream-row'><span class='lbl'>[DISPATCH]</span><span class='val text-success'>SDRF fleets detoured via Route 3 coordinates. Operation online.</span></div>"
    ]
  };

  function cyclePipelineStep() {
    const nodes = document.querySelectorAll(".pipeline-node");
    if (nodes.length === 0) return;
    
    nodes.forEach(node => node.classList.remove("active"));
    const activeNode = document.querySelector(`.pipeline-node[data-step='${currentPipelineStep}']`);
    if (activeNode) activeNode.classList.add("active");
    
    const panelTitle = document.getElementById("workflow-panel-title");
    const panelBody = document.getElementById("workflow-panel-body");
    if (panelTitle && panelBody) {
      panelTitle.textContent = `PIPELINE MONITOR: STEP ${currentPipelineStep} // ` + 
        (currentPipelineStep === 1 ? "TELEMETRY" : 
         currentPipelineStep === 2 ? "RISK PROFILING" : 
         currentPipelineStep === 3 ? "PLAN SIMULATION" : "ACTION DISPATCH");
          
      panelBody.innerHTML = pipelineLogs[currentPipelineStep].join("");
    }
    
    currentPipelineStep = currentPipelineStep < 4 ? currentPipelineStep + 1 : 1;
  }
  
  // Cycle steps every 3.5 seconds
  setInterval(cyclePipelineStep, 3500);
  cyclePipelineStep();

  // Allow clicking workflow nodes manually to inspect them
  document.querySelectorAll(".pipeline-node").forEach(node => {
    node.addEventListener("click", () => {
      const stepNum = parseInt(node.getAttribute("data-step"));
      currentPipelineStep = stepNum;
      cyclePipelineStep();
    });
  });
});
