// XNexus-CrisisOS Presentation Logic & PPTX Exporter

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

  // Set total slide count label
  if (totalSlidesNumLabel) {
    totalSlidesNumLabel.textContent = totalSlides;
  }

  // Update slides visual active state
  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Deactivate previous slide
    slides[currentSlideIndex].classList.remove("active-slide");
    menuItems[currentSlideIndex].classList.remove("active");

    // Activate next slide
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add("active-slide");
    menuItems[currentSlideIndex].classList.add("active");

    // Scroll active sidebar menu item into view
    menuItems[currentSlideIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Update labels & navigation controls
    if (currentSlideNumLabel) {
      currentSlideNumLabel.textContent = currentSlideIndex + 1;
    }

    // Toggle button disabled state if limits reached
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
  }

  // Bind Navigation controls click events
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

  // Bind Sidebar menu item clicks
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetIndex = parseInt(item.getAttribute("data-slide"), 10);
      showSlide(targetIndex);
    });
  });

  // Keyboard navigation bindings
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

  // Fullscreen toggle logic
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

  // Fullscreen exit detection
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

  // Interactive Agent Click behavior (Slide 4)
  window.selectAgent = function(card) {
    // Remove selected state from all other agents
    const cards = document.querySelectorAll(".agent-card");
    cards.forEach(c => {
      if (c !== card) c.classList.remove("selected-agent");
    });
    // Toggle active state on current card
    card.classList.toggle("selected-agent");
  };

  // PowerPoint PPTX Exporter via PptxGenJS
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

    // Set export visual status
    exportBtn.disabled = true;
    exportBtn.innerHTML = `
      <svg class="spinning-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      Generating...
    `;

    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      // Define default slide styles & themes
      const darkBg = '0A0B0F';
      const textLight = 'E2E8F0';
      const textMuted = '94A3B8';
      const primaryCyan = '00F2FE';
      const secondaryBlue = '4FACFE';
      const accentRed = 'FF5E62';
      const accentGreen = '00E676';
      const cardBg = '10121A';

      // Slide Master defining shared elements
      pptx.defineSlideMaster({
        title: 'XNEXUS_MASTER',
        background: { color: darkBg },
        slideNumber: { x: '92%', y: '93%', fontSize: 9, color: textMuted }
      });

      // Helper function to draw headings consistently
      function drawHeader(slide, title, category) {
        // Category / nav badge
        slide.addText(category, { x: 0.6, y: 0.3, w: 8.8, h: 0.3, fontSize: 10, color: primaryCyan, bold: true });
        // Title
        slide.addText(title, { x: 0.6, y: 0.6, w: 8.8, h: 0.5, fontSize: 24, color: 'FFFFFF', bold: true });
        // Underline line
        slide.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 8.8, h: 0.02, fill: { color: primaryCyan }, line: { width: 0 } });
      }

      // ==========================================
      // SLIDE 1: Title Slide (XNexus-CrisisOS)
      // ==========================================
      const slide1 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      
      // Large neon badge
      slide1.addText("XNEXUS - CRISISOS FOR INDIA", { x: 1.0, y: 0.8, w: 8.0, h: 0.3, fontSize: 10, color: primaryCyan, bold: true, align: 'center' });
      // Main brand title
      slide1.addText("XNEXUS.OS", { x: 1.0, y: 1.2, w: 8.0, h: 1.1, fontSize: 60, bold: true, color: 'FFFFFF', align: 'center' });
      // Subtitle
      slide1.addText("Autonomous Disaster Command Center", { x: 1.0, y: 2.3, w: 8.0, h: 0.5, fontSize: 18, color: textMuted, align: 'center', bold: true });
      // Divider
      slide1.addShape(pptx.shapes.RECTANGLE, { x: 4.4, y: 2.9, w: 1.2, h: 0.03, fill: { color: primaryCyan }, line: { width: 0 } });
      // Description
      slide1.addText("An intelligent multi-agent operating system that predicts, coordinates, and autonomously manages disaster response in real time across India's vulnerable regions. Interfaces directly with Central Water Commission gauges, IMD telemetry, and NDMA Sachet cell-broadcast grids.", { x: 1.5, y: 3.1, w: 7.0, h: 0.8, fontSize: 12, color: textLight, align: 'center' });
      // Metadata Grid
      slide1.addText("DATA PIPELINES\nIMD / CWC / GSI Feeds", { x: 1.0, y: 4.2, w: 2.4, h: 0.6, fontSize: 9, color: textLight, align: 'center' });
      slide1.addText("DEPLOYMENT CORE\nNDRF / SDRF Action Hub", { x: 3.8, y: 4.2, w: 2.4, h: 0.6, fontSize: 9, color: textLight, align: 'center' });
      slide1.addText("ALERTS MAPPED\nNDMA Sachet Protocol", { x: 6.6, y: 4.2, w: 2.4, h: 0.6, fontSize: 9, color: textLight, align: 'center' });

      // ==========================================
      // SLIDE 2: The Problem (XNexus-CrisisOS)
      // ==========================================
      const slide2 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide2, "India's Critical Response Bottlenecks", "02 / PROBLEM SPACE");

      // Left Column Text
      slide2.addText("India faces extreme climate threats: Himalayan landslides (Uttarakhand, Wayanad), seasonal monsoon floods (Assam, Bihar, Kerala), and cyclones. Government agencies have advanced telemetry systems, but they operate in absolute isolation.", { x: 0.6, y: 1.5, w: 4.2, h: 0.8, fontSize: 11, color: textLight });
      // Red Callout Box
      slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 2.5, w: 4.2, h: 1.2, fill: { color: '1A1215' }, line: { color: accentRed, width: 1 } });
      slide2.addText("THE OPERATIONAL FRICTION: Heavy rain alerts from IMD and river heights from CWC sit on separate dashboards. Triggering evacuations requires manual, phone-based coordination between weather bureaus, district magistrates, hospitals, and NDRF squads.", { x: 0.8, y: 2.6, w: 3.8, h: 1.0, fontSize: 10.5, color: accentRed, bold: true });
      slide2.addText("Delayed early action during extreme monsoons directly escalates casualties and delays relief dispatch.", { x: 0.6, y: 3.9, w: 4.2, h: 0.8, fontSize: 11, color: textMuted });

      // Right Column 4 Cards
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

      // ==========================================
      // SLIDE 3: Proposed Solution (XNexus-CrisisOS)
      // ==========================================
      const slide3 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide3, "Introducing XNexus-CrisisOS", "03 / SOLUTION");

      // Left Visual Mockup
      slide3.addShape(pptx.shapes.OVAL, { x: 1.9, y: 2.4, w: 1.2, h: 1.2, fill: { color: primaryCyan }, line: { width: 0 } });
      slide3.addText("XNEXUS.OS", { x: 1.8, y: 2.8, w: 1.4, h: 0.4, fontSize: 11, color: '000000', bold: true, align: 'center' });
      // Peripheral Nodes
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

      // Right Column bullet details
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

      // ==========================================
      // SLIDE 4: Core Multi-Agents (XNexus-CrisisOS)
      // ==========================================
      const slide4 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide4, "India-Focused Agentic Framework", "04 / MULTI-AGENT ARCHITECTURE");

      // Grid of 9 Agents
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

        // Draw card background
        slide4.addShape(pptx.shapes.RECTANGLE, { 
          x: xPos, 
          y: yPos, 
          w: 2.8, 
          h: 1.15, 
          fill: { color: agent.highlight ? '132028' : cardBg }, 
          line: { color: agent.highlight ? primaryCyan : '1c202d', width: 1 } 
        });

        // Badge
        slide4.addText(agent.badge, { x: xPos + 0.1, y: yPos + 0.1, w: 2.0, h: 0.25, fontSize: 8, color: primaryCyan, bold: true });
        // Title
        slide4.addText(agent.name, { x: xPos + 0.1, y: yPos + 0.35, w: 2.6, h: 0.3, fontSize: 10, color: 'FFFFFF', bold: true });
        // Description
        slide4.addText(agent.desc, { x: xPos + 0.1, y: yPos + 0.62, w: 2.6, h: 0.48, fontSize: 8, color: textMuted });
      });

      // ==========================================
      // SLIDE 5: Key Features (XNexus-CrisisOS)
      // ==========================================
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

      // ==========================================
      // SLIDE 6: The USP "Wow" Feature (XNexus-CrisisOS)
      // ==========================================
      const slide6 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide6, "Beyond Alerting: Real-Data Decisions", "06 / THE 'WOW' USP");

      // Left Box: Traditional system
      slide6.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.1, h: 3.5, fill: { color: '1C1214' }, line: { color: accentRed, width: 1 } });
      slide6.addText("⚠️ TRADITIONAL MONITORING ALERT", { x: 0.8, y: 1.7, w: 3.7, h: 0.3, fontSize: 9.5, color: accentRed, bold: true });
      slide6.addText("🚨 Alert: 'IMD Alert: Heavy rain predicted in Wayanad, Kerala. Red alert issued.'", { x: 0.8, y: 2.2, w: 3.7, h: 1.2, fontSize: 13.5, color: 'FFFFFF', bold: true });
      slide6.addText("Requires human operators to manually audit hospital databases, cross-reference mountain highway status, check SDRF rosters, and coordinate resources manually over multiple departments and phone lines.", { x: 0.8, y: 3.5, w: 3.7, h: 1.3, fontSize: 10.5, color: textMuted });

      // VS divider
      slide6.addText("VS", { x: 4.75, y: 3.0, w: 0.5, h: 0.5, fontSize: 16, color: textMuted, bold: true, align: 'center' });

      // Right Box: XNexus.OS Terminal Style
      slide6.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.5, w: 4.1, h: 3.5, fill: { color: '0b0c10' }, line: { color: primaryCyan, width: 2 } });
      slide6.addText("XNEXUS.OS // DECISION COMMANDER", { x: 5.5, y: 1.7, w: 3.7, h: 0.3, fontSize: 10, color: primaryCyan, bold: true });
      slide6.addText("🤖 'I simulated 24 response plans...'", { x: 5.5, y: 2.1, w: 3.7, h: 0.3, fontSize: 12.5, color: 'FFFFFF', bold: true });
      
      // Commander text block
      slide6.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 2.45, w: 3.7, h: 1.4, fill: { color: '000000' }, line: { color: '00323c', width: 1 } });
      slide6.addText("XNexusOS:~$ python3 -m orchestrator --evaluate-incident\n\n\"Based on CWC river rise at Kabini river (+18cm/hr), INSAT soil saturation index (88%), and MapmyIndia road network telemetry, I simulated 24 response plans. Evacuating Villages A & B in 35 mins via Route 3 and deploying NDRF 4th Battalion with 8 rescue boats reduces projected casualties by 72%.\"", { x: 5.6, y: 2.5, w: 3.5, h: 1.3, fontSize: 9, color: 'FFFFFF', fontFace: 'Courier New' });

      // 3 Metrics at the bottom
      slide6.addText("24\nScenarios Run", { x: 5.5, y: 3.95, w: 1.1, h: 0.5, fontSize: 9, color: accentGreen, bold: true, align: 'center' });
      slide6.addText("-72%\nCasualties", { x: 6.8, y: 3.95, w: 1.1, h: 0.5, fontSize: 9, color: accentGreen, bold: true, align: 'center' });
      slide6.addText("35 min\nWindow", { x: 8.1, y: 3.95, w: 1.1, h: 0.5, fontSize: 9, color: accentGreen, bold: true, align: 'center' });

      // ==========================================
      // SLIDE 7: Tech Stack & MCP (XNexus-CrisisOS)
      // ==========================================
      const slide7 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide7, "MCP Integration Framework", "07 / ARCHITECTURE SYSTEM");

      // Left Column
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

      // Right Column diagram
      slide7.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: 1.7, w: 1.8, h: 3.0, fill: cardBg, line: { color: primaryCyan, width: 1 } });
      slide7.addText("MCP DATA SERVERS\n\n• CWC Gauge Feeds\n• IMD Doppler Radar\n• MapmyIndia API", { x: 5.3, y: 1.8, w: 1.6, h: 2.8, fontSize: 10, color: textLight, align: 'center' });

      slide7.addText("⟷", { x: 7.0, y: 3.0, w: 0.5, h: 0.4, fontSize: 20, color: primaryCyan, align: 'center' });

      slide7.addShape(pptx.shapes.RECTANGLE, { x: 7.6, y: 1.7, w: 1.8, h: 3.0, fill: cardBg, line: { color: primaryCyan, width: 1 } });
      slide7.addText("LANGGRAPH AGENTS\n\n• Weather Agent\n• Flood/Landslide\n• Resource Manager\n• Decision Agent", { x: 7.7, y: 1.8, w: 1.6, h: 2.8, fontSize: 10, color: textLight, align: 'center' });

      // ==========================================
      // SLIDE 8: Emergency Workflow (XNexus-CrisisOS)
      // ==========================================
      const slide8 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide8, "Telemetry to Execution Workflow", "08 / SYSTEM FLOW");

      // Draw horizontal line behind timeline nodes
      slide8.addShape(pptx.shapes.RECTANGLE, { x: 1.5, y: 2.1, w: 7.0, h: 0.03, fill: { color: '303445' }, line: { width: 0 } });

      const steps = [
        { num: "01", title: "Telemetry Ingest", desc: "IMD Doppler radar logs heavy precipitation index. CWC monitoring registers gauge spikes exceeding threshold parameters." },
        { num: "02", title: "Risk Profiling", desc: "Risk Agent runs GIS demographic overlaps to identify vulnerable villages. Medical Agent scans 108 hospital beds availability." },
        { num: "03", title: "Plan Simulation", desc: "NDRF Commander Agent models road closures. Ingests MapmyIndia road indices to calculate safe evacuation paths." },
        { num: "04", title: "Action Dispatch", desc: "XNexus-CrisisOS triggers regional warnings via Sachet, dispatches GPS routes to SDRF units, and assigns ambulance paths." }
      ];

      steps.forEach((step, idx) => {
        const xPos = 0.6 + idx * 2.25;
        // Step number circle
        slide8.addShape(pptx.shapes.OVAL, { x: xPos + 0.8, y: 1.8, w: 0.6, h: 0.6, fill: { color: darkBg }, line: { color: primaryCyan, width: 2 } });
        slide8.addText(step.num, { x: xPos + 0.8, y: 1.95, w: 0.6, h: 0.3, fontSize: 11, color: primaryCyan, bold: true, align: 'center' });

        // Content box
        slide8.addShape(pptx.shapes.RECTANGLE, { x: xPos, y: 2.6, w: 2.1, h: 2.2, fill: { color: cardBg }, line: { color: '1f2430', width: 1 } });
        slide8.addText(step.title, { x: xPos + 0.1, y: 2.7, w: 1.9, h: 0.3, fontSize: 10.5, color: 'FFFFFF', bold: true });
        slide8.addText(step.desc, { x: xPos + 0.1, y: 3.05, w: 1.9, h: 1.6, fontSize: 8.5, color: textMuted });
      });

      // ==========================================
      // SLIDE 9: Expected Improvements (XNexus-CrisisOS)
      // ==========================================
      const slide9 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide9, "Target Safety and Performance Metrics", "09 / PROJECTED IMPACT");

      // Left Column
      slide9.addText("Saving Lives Through Accelerated Mobilization", { x: 0.6, y: 1.7, w: 4.2, h: 0.8, fontSize: 20, color: primaryCyan, bold: true });
      slide9.addText("Manual operations take hours to verify river data, coordinate relief depots, and broadcast alerts. XNexus-CrisisOS completes these operations in less than 5 minutes.", { x: 0.6, y: 2.6, w: 4.2, h: 1.0, fontSize: 12, color: textLight });
      
      slide9.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 3.8, w: 4.2, h: 1.0, fill: { color: '101B1A' }, line: { color: accentGreen, width: 1 } });
      slide9.addText("Connecting CWC inundation polygons directly with road graphs prevents traffic deadlocks along mountainous escape pathways.", { x: 0.75, y: 3.85, w: 3.9, h: 0.9, fontSize: 10.5, color: accentGreen });

      // Right Column: Progress Bars
      const progressBars = [
        { label: "Incident Warning Dispatch Time (90% faster)", pct: 90 },
        { label: "NDRF/SDRF Resource Utilization (+75% efficiency)", pct: 75 },
        { label: "Target Community Warning Delivery (85% regional)", pct: 85 }
      ];

      progressBars.forEach((bar, idx) => {
        const yOffset = 1.8 + idx * 1.1;
        // Text label
        slide9.addText(bar.label, { x: 5.2, y: yOffset, w: 4.0, h: 0.3, fontSize: 10.5, color: 'FFFFFF', bold: true });
        // Progress bg
        slide9.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: yOffset + 0.35, w: 4.0, h: 0.2, fill: { color: '202430' }, line: { width: 0 } });
        // Progress fill
        slide9.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: yOffset + 0.35, w: (4.0 * bar.pct) / 100, h: 0.2, fill: { color: primaryCyan }, line: { width: 0 } });
      });

      // ==========================================
      // SLIDE 10: Roadmap (XNexus-CrisisOS)
      // ==========================================
      const slide10 = pptx.addSlide({ masterName: 'XNEXUS_MASTER' });
      drawHeader(slide10, "Development Blueprint & Phases", "10 / DEVELOPMENT ROADMAP");

      // 3 Phase Cards
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

      // Slide Footer
      slide10.addText("XNexus-CrisisOS — Intelligent Coordinator for Disaster Logistics in India", { x: 1.0, y: 4.1, w: 8.0, h: 0.4, fontSize: 13, color: 'FFFFFF', bold: true, align: 'center' });
      slide10.addText("Pitching at NitroStack 2026 Hackathon. Questions?", { x: 1.0, y: 4.45, w: 8.0, h: 0.3, fontSize: 10, color: textMuted, align: 'center' });

      // Save presentation and revert button state
      pptx.writeFile({ fileName: 'XNexus_CrisisOS_Hackathon_Proposal.pptx' })
        .then(() => {
          resetExportButton();
        })
        .catch(err => {
          console.error("Error saving PowerPoint PPTX file: ", err);
          alert("Failed to export PPTX. Please check browser file permissions.");
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
});
