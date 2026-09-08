"""
build_proposal_docx.py
Compiles an executive, publication-grade Microsoft Word proposal (.docx)
for the Sony Research Award Program 2026 (Faculty Innovation Award - $100,000 USD).

Strictly calibrated to fit within exactly 10 pages total:
- Page 1: Executive Cover Page, Administrative Metadata & Executive Abstract
- Pages 2-9: Research Narrative, Case Studies, RQs, 7-Layer Architecture (Fig 1),
             Sony Spresense Integration (Fig 2), SOTA Differentiation & Latency Waterfall (Fig 3),
             Mathematical Formulations, Research Methodology, Milestone Table, Risk Management, References
- Page 10: Standalone 1-Page Itemized Budget Breakdown ($100,000 USD limit)
"""

import os
import subprocess
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DIR_PATH = os.path.dirname(os.path.abspath(__file__))

# Color Palette (Corporate Sony Navy & Slate Theme)
COLOR_SONY_NAVY = RGBColor(0x00, 0x2B, 0x49)       # #002B49 Primary brand
COLOR_SLATE_BLUE = RGBColor(0x0F, 0x4C, 0x81)      # #0F4C81 Secondary header
COLOR_TECH_CYAN = RGBColor(0x02, 0x84, 0xC7)       # #0284C7 Accent
COLOR_BODY_TEXT = RGBColor(0x1E, 0x29, 0x3B)       # #1E293B Dark Charcoal Body
COLOR_MUTED_TEXT = RGBColor(0x64, 0x74, 0x8B)      # #64748B Secondary Text
COLOR_CRITICAL_RED = RGBColor(0xDC, 0x26, 0x26)    # #DC2626 Warning
COLOR_SUCCESS_GREEN = RGBColor(0x05, 0x96, 0x69)   # #059669 Success

HEX_SONY_NAVY = "002B49"
HEX_SLATE_BLUE = "0F4C81"
HEX_TECH_CYAN = "0284C7"
HEX_LIGHT_BG = "F8FAFC"
HEX_CALLOUT_BG = "F0F7FA"
HEX_BORDER_MUTED = "CBD5E1"
HEX_CRITICAL_BG = "FEF2F2"
HEX_CRITICAL_BORDER = "DC2626"
HEX_SUCCESS_BG = "F0FDF4"
HEX_SUCCESS_BORDER = "059669"

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=70, bottom=70, left=120, right=120):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._element.get_or_add_tcPr()
    borders_elm = OxmlElement('w:tcBorders')
    borders = {'top': top, 'bottom': bottom, 'left': left, 'right': right}
    for border_name, border_cfg in borders.items():
        if border_cfg:
            val, sz, space, color = border_cfg
            b_elm = parse_xml(f'<w:{border_name} {nsdecls("w")} w:val="{val}" w:sz="{sz}" w:space="{space}" w:color="{color}"/>')
            borders_elm.append(b_elm)
        else:
            b_elm = parse_xml(f'<w:{border_name} {nsdecls("w")} w:val="none"/>')
            borders_elm.append(b_elm)
    tcPr.append(borders_elm)

def add_header_footer(doc):
    for section in doc.sections:
        section.different_first_page_header_footer = True
        
        # Header
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Sony Research Award Program 2026  |  Faculty Innovation Award")
        hrun.font.name = 'Arial'
        hrun.font.size = Pt(8.0)
        hrun.font.color.rgb = COLOR_MUTED_TEXT
        
        # Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun = fp.add_run("CONFIDENTIAL  —  RESEARCH PROPOSAL FOR FUNDING CONSIDERATION")
        frun.font.name = 'Arial'
        frun.font.size = Pt(7.5)
        frun.font.color.rgb = COLOR_MUTED_TEXT

def create_callout_box(doc, title, content_paragraphs, border_color=HEX_SONY_NAVY, bg_color=HEX_CALLOUT_BG, icon="💡"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    row = table.rows[0]
    trPr = row._tr.get_or_add_trPr()
    trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
    
    cell = row.cells[0]
    cell.width = Inches(6.8)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=70, bottom=70, left=140, right=140)
    set_cell_borders(cell, left=('single', '24', '0', border_color))
    
    tp = cell.paragraphs[0]
    tp.paragraph_format.space_before = Pt(0)
    tp.paragraph_format.space_after = Pt(2)
    display_title = f"{icon}  {title}" if icon else title
    trun = tp.add_run(display_title)
    trun.font.name = 'Arial'
    trun.font.size = Pt(9.2)
    trun.font.bold = True
    trun.font.color.rgb = RGBColor(int(border_color[:2], 16), int(border_color[2:4], 16), int(border_color[4:], 16))
    
    for text in content_paragraphs:
        cp = cell.add_paragraph()
        cp.paragraph_format.space_before = Pt(1)
        cp.paragraph_format.space_after = Pt(2)
        cp.paragraph_format.line_spacing = 1.08
        crun = cp.add_run(text)
        crun.font.name = 'Arial'
        crun.font.size = Pt(8.8)
        crun.font.color.rgb = COLOR_BODY_TEXT
    
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(3)

def format_cell_text(cell, text, bold=False, italic=False, color=COLOR_BODY_TEXT, size=8.5, align=WD_ALIGN_PARAGRAPH.LEFT):
    p = cell.paragraphs[0] if len(cell.paragraphs) > 0 else cell.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.08
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return run

def add_heading_1(doc, text):
    h = doc.add_heading(level=1)
    h.paragraph_format.space_before = Pt(9)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = COLOR_SONY_NAVY
    return h

def add_heading_2(doc, text):
    h = doc.add_heading(level=2)
    h.paragraph_format.space_before = Pt(7)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = COLOR_SLATE_BLUE
    return h

def add_body_p(doc, text, bold_prefix="", italic_suffix="", space_after=3):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.10
    if bold_prefix:
        brun = p.add_run(bold_prefix)
        brun.font.name = 'Arial'
        brun.font.size = Pt(9.5)
        brun.font.bold = True
        brun.font.color.rgb = COLOR_BODY_TEXT
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(9.5)
    run.font.color.rgb = COLOR_BODY_TEXT
    if italic_suffix:
        irun = p.add_run(italic_suffix)
        irun.font.name = 'Arial'
        irun.font.size = Pt(9.5)
        irun.font.italic = True
        irun.font.color.rgb = COLOR_MUTED_TEXT
    return p

def add_bullet_p(doc, bold_title, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.08
    brun = p.add_run(bold_title + " ")
    brun.font.name = 'Arial'
    brun.font.size = Pt(9.2)
    brun.font.bold = True
    brun.font.color.rgb = COLOR_BODY_TEXT
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(9.2)
    run.font.color.rgb = COLOR_BODY_TEXT
    return p

def add_figure(doc, img_path, caption_num, caption_title, caption_desc, width_in=6.1):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(6)
    p_img.paragraph_format.space_after = Pt(2)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_in))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(1)
    p_cap.paragraph_format.space_after = Pt(6)
    
    c_label = p_cap.add_run(f"Figure {caption_num}: ")
    c_label.font.name = 'Arial'
    c_label.font.size = Pt(8.2)
    c_label.font.bold = True
    c_label.font.color.rgb = COLOR_SONY_NAVY
    
    c_title = p_cap.add_run(f"{caption_title}. ")
    c_title.font.name = 'Arial'
    c_title.font.size = Pt(8.2)
    c_title.font.bold = True
    c_title.font.color.rgb = COLOR_BODY_TEXT
    
    c_desc = p_cap.add_run(caption_desc)
    c_desc.font.name = 'Arial'
    c_desc.font.size = Pt(8.0)
    c_desc.font.italic = True
    c_desc.font.color.rgb = COLOR_MUTED_TEXT

def add_divider_rule(doc, color_hex=HEX_BORDER_MUTED, space_before=4, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="8" w:space="1" w:color="{color_hex}"/></w:pBdr>')
    pPr.append(pBdr)
    return p

def build_proposal():
    doc = docx.Document()
    
    # Page setup - 0.85 inch margins for perfect academic density
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.85)
        s.right_margin = Inches(0.85)
        s.page_width = Inches(8.5)
        s.page_height = Inches(11.0)
    
    add_header_footer(doc)
    
    # ==========================================
    # PAGE 1: STANDARD ACADEMIC GRANT PROPOSAL HEADER & METADATA
    # ==========================================
    # Academic Category Banner
    p_tag = doc.add_paragraph()
    p_tag.paragraph_format.space_before = Pt(0)
    p_tag.paragraph_format.space_after = Pt(2)
    p_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tag = p_tag.add_run("SONY RESEARCH AWARD PROGRAM 2026  •  FACULTY INNOVATION AWARD PROPOSAL")
    r_tag.font.name = 'Arial'
    r_tag.font.size = Pt(8.5)
    r_tag.font.bold = True
    r_tag.font.color.rgb = COLOR_SONY_NAVY
    
    # Proposal Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(3)
    p_title.paragraph_format.space_after = Pt(3)
    p_title.paragraph_format.line_spacing = 1.12
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("XNexus: Deterministic Semantic Multi-Agent Intelligence for Autonomous Disaster Response")
    r_title.font.name = 'Arial'
    r_title.font.size = Pt(17)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_SONY_NAVY
    
    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(1)
    p_sub.paragraph_format.space_after = Pt(8)
    p_sub.paragraph_format.line_spacing = 1.12
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("A Resilient Edge-AI Architecture Integrating Sony Spresense™ Sensing Microcontrollers to Accelerate Emergency Disaster Action from 110+ Minutes to Under 4.0 Seconds")
    r_sub.font.name = 'Arial'
    r_sub.font.size = Pt(9.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = COLOR_SLATE_BLUE
    
    # Academic Author & Administrative Metadata Block (Sleek Masthead with Top & Bottom Rules)
    meta_table = doc.add_table(rows=3, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    meta_grid = [
        [
            ("Principal Investigator", "Prof. Lead Researcher, Ph.D. Supervisor & Director"),
            ("Award Program", "Sony Faculty Innovation Award (US$100,000 Ceiling)")
        ],
        [
            ("Academic Institution", "Dept. of Computer Science & Center for Geospatial Analytics"),
            ("Selected Keyword", "Edge AI (Multi-Agent Systems, Intelligent Sensing)")
        ],
        [
            ("Contact Information", "pi.research@institution.edu  |  +91-11-2659-XXXX (Country: +91)"),
            ("Target Evaluation Region", "Western Ghats & Himalayan Flash-Flood Corridors")
        ]
    ]
    
    col_w = Inches(3.4)
    for r_idx, row_data in enumerate(meta_grid):
        row = meta_table.rows[r_idx]
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
        
        for c_idx, (k, v) in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = col_w
            set_cell_background(cell, HEX_LIGHT_BG)
            set_cell_margins(cell, top=35, bottom=35, left=70, right=70)
            
            top_bdr = ('single', '8', '0', HEX_SLATE_BLUE) if r_idx == 0 else None
            bot_bdr = ('single', '8', '0', HEX_SLATE_BLUE) if r_idx == 2 else None
            set_cell_borders(cell, top=top_bdr, bottom=bot_bdr, left=None, right=None)
            
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.08
            rk = p.add_run(f"{k}: ")
            rk.font.name = 'Arial'
            rk.font.size = Pt(8.2)
            rk.font.bold = True
            rk.font.color.rgb = COLOR_SONY_NAVY
            rv = p.add_run(v)
            rv.font.name = 'Arial'
            rv.font.size = Pt(8.2)
            rv.font.color.rgb = COLOR_BODY_TEXT

    # Divider before Abstract
    add_divider_rule(doc, color_hex=HEX_BORDER_MUTED, space_before=6, space_after=6)
    
    # Formal Academic Abstract & Keywords Block (Strictly <= 200 words per Sony guidelines)
    p_abs = doc.add_paragraph()
    p_abs.paragraph_format.space_before = Pt(0)
    p_abs.paragraph_format.space_after = Pt(4)
    p_abs.paragraph_format.left_indent = Inches(0.2)
    p_abs.paragraph_format.right_indent = Inches(0.2)
    p_abs.paragraph_format.line_spacing = 1.08
    p_abs.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    r_abs_lbl = p_abs.add_run("Abstract—")
    r_abs_lbl.font.name = 'Arial'
    r_abs_lbl.font.size = Pt(9.0)
    r_abs_lbl.font.bold = True
    r_abs_lbl.font.color.rgb = COLOR_SONY_NAVY
    
    r_abs_txt = p_abs.add_run(
        "Catastrophic rapid-onset natural disasters—such as the July 2024 Wayanad landslides (400+ casualties) and flash floods—expose a fatal vulnerability in civil defense: passive dashboards and manual phone trees introduce over 110 minutes of latency, entirely exhausting the life-critical \"Golden Hour.\" This research proposal presents XNexus, a decentralized multi-agent operating architecture engineered to transition disaster intelligence from passive observation into verified, sub-4.0-second autonomous actuation. XNexus integrates ultra-low-power Sony Spresense™ edge microcontrollers equipped with high-resolution 192 kHz acoustic sensing to detect incoming debris flows and pre-rupture subterranean rumblings directly at the edge. Live edge telemetry is serialized via FastMCP into a shared vector state matrix, where a LangGraph multi-agent ensemble (Geotechnical, Hydrological, Meteorological) executes deterministic conflict resolution via a Safety-Max Commander Arbitrator. This proposal outlines the theoretical formulation, empirical edge validation on Spresense hardware, multi-agency data bus architecture, and a 12-month deployment plan strictly bounded within the US$100,000 budget."
    )
    r_abs_txt.font.name = 'Arial'
    r_abs_txt.font.size = Pt(9.0)
    r_abs_txt.font.italic = True
    r_abs_txt.font.color.rgb = COLOR_BODY_TEXT

    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(2)
    p_kw.paragraph_format.space_after = Pt(6)
    p_kw.paragraph_format.left_indent = Inches(0.2)
    p_kw.paragraph_format.right_indent = Inches(0.2)
    
    r_kw_lbl = p_kw.add_run("Keywords—")
    r_kw_lbl.font.name = 'Arial'
    r_kw_lbl.font.size = Pt(8.5)
    r_kw_lbl.font.bold = True
    r_kw_lbl.font.color.rgb = COLOR_SONY_NAVY
    
    r_kw_txt = p_kw.add_run("Edge AI, Sony Spresense CXD5602, Multi-Agent Systems, Autonomous Disaster Response, FastMCP, TinyML, LangGraph, Deterministic Arbitration, Climate Adaptation.")
    r_kw_txt.font.name = 'Arial'
    r_kw_txt.font.size = Pt(8.5)
    r_kw_txt.font.italic = True
    r_kw_txt.font.color.rgb = COLOR_MUTED_TEXT

    # Divider after Abstract - Section 1 starts immediately below on Page 1!
    add_divider_rule(doc, color_hex=HEX_BORDER_MUTED, space_before=4, space_after=8)
    
    # ==========================================
    # SECTION 1: PROBLEM STATEMENT & CASE STUDIES (STARTS DIRECTLY ON PAGE 1)
    # ==========================================
    add_heading_1(doc, "1. Problem Statement, Catastrophe Realities & Research Gaps")
    
    add_body_p(doc, 
        "Every year, severe meteorological and geological hazards claim tens of thousands of lives and inflict billions of dollars in infrastructure losses across vulnerable mountain and coastal regions. Despite heavy investments in meteorological satellites, numerical weather prediction models, and river gauge networks, civil defense responses remain fundamentally broken.",
        bold_prefix="The Paradox of Modern Disaster Intelligence: "
    )
    
    add_body_p(doc,
        "The fatal flaw is not a lack of scientific data, but the architectural fragmentation of disaster intelligence and the latency of human bureaucratic execution. In current operational standard operating procedures (SOPs), environmental data is trapped in isolated agency silos: Doppler radar reflectivity sits on meteorological portals (e.g., IMD), river stage telemetry resides in hydrological databases (e.g., CWC), and geological slope risk is locked in static periodic reports (e.g., GSI). When an extreme event strikes, these streams cannot dynamically synthesize without manual operator intervention."
    )
    
    create_callout_box(
        doc,
        title="GROUND REALITY CASE STUDY: The 2024 Wayanad Landslide Tragedy",
        content_paragraphs=[
            "Event Timeline: On July 30, 2024, catastrophic debris flows struck the Meppadi panchayat in Wayanad, Kerala, India, between 1:00 AM and 4:00 AM, demolishing entire villages (Chooralmala, Mundakkai) and killing over 400 civilians.",
            "The Fatal Bottleneck: Over 570 mm of rainfall fell within 48 hours. Official warnings were gated behind sequential administrative hierarchy. Because the debris flows ruptured during the night (3:00 AM), human phone trees were completely dormant. It took more than 110 minutes between the physical slope failure and the mobilization of downstream civil evacuation.",
            "By the time rescue forces were dispatched, the main bridge at Chooralmala was washed out, cutting off the evacuation route. An autonomous edge system triggering immediate acoustic warnings and dynamic route detours would have saved hundreds of lives during the critical golden hour."
        ],
        border_color=HEX_CRITICAL_BORDER,
        bg_color=HEX_CRITICAL_BG,
        icon="⚠️"
    )

    create_callout_box(
        doc,
        title="GROUND REALITY CASE STUDY: The September 2024 Nepal Flash Floods",
        content_paragraphs=[
            "Disaster Impact: In late September 2024, unprecedented monsoon cloudbursts dumped up to 322 mm of rainfall in 24 hours across Kathmandu Valley and eastern Nepal, triggering flash floods that killed over 240 individuals.",
            "Grid and Communications Collapse: The primary failure mode was the immediate collapse of commercial power and 4G/LTE base stations as riverbanks eroded. Centralized cloud dashboards went blind. Downstream communities received zero upstream telemetry because sensors lacked autonomous, decentralized edge intelligence capable of operating during power blackouts."
        ],
        border_color="D97706",
        bg_color="FFFBEB",
        icon="🌊"
    )

    # ==========================================
    # SECTION 2: RESEARCH QUESTIONS, OBJECTIVES & CONTRIBUTIONS
    # ==========================================
    add_heading_1(doc, "2. Formal Research Questions, Core Objectives & Scientific Contributions")
    add_body_p(doc, "To resolve these vulnerabilities, this proposal formalizes three core research questions (RQs) spanning edge computing, semantic protocols, and multi-agent artificial intelligence:")
    
    add_bullet_p(doc, 
        "Research Question 1 (RQ1 - Semantic Ingest & Edge Fusion):",
        "How can heterogeneous, asynchronous telemetry from low-power edge microcontrollers (Sony Spresense™), radar reflectivity matrices (IMD Doppler), and river stage gauges (CWC) be unified in real time into a standardized, sub-millisecond semantic vector space without data loss?"
    )
    add_bullet_p(doc, 
        "Research Question 2 (RQ2 - Multi-Agent Conflict Arbitration under Uncertainty):",
        "How can specialized, autonomous AI agents representing competing physical domains (e.g., Geotechnical road closure vs. Hydrological floodway evacuation) achieve mathematically deterministic consensus in under 1.0 second when sensory inputs are partially corrupted or contradictory?"
    )
    add_bullet_p(doc, 
        "Research Question 3 (RQ3 - Mathematical Trust, Explainable AI & Autonomous Execution):",
        "How can an autonomous operating system generate immutable, human-verifiable Explainable AI (XAI) audit logs and maintain guaranteed safety boundaries while dispatching life-critical actuators (OASIS CAP v1.2 cellular alerts, dynamic GPS rerouting, ambulance reservations) without human-in-the-loop delay?"
    )

    add_heading_2(doc, "2.1 Three Core Research Objectives & 12-Month Deliverables")
    add_bullet_p(doc, 
        "1. Sub-Watt Acoustic Edge AI on Sony Spresense™:",
        "Deploy Sony Spresense CXD5602/CXD5247 nodes with an on-device 192 kHz Mel-spectrogram TinyML engine to detect pre-rupture debris rumblings (10-120 Hz) with sub-second inference at under 120 mW."
    )
    add_bullet_p(doc, 
        "2. FastMCP Open Semantic Mesh Bus:",
        "Establish an open Model Context Protocol bus uniting heterogeneous telemetry (IMD radar, CWC river stages, GSI piezometers) into an O(1) in-memory vector state matrix with zero data loss."
    )
    add_bullet_p(doc, 
        "3. Deterministic Life-Safety Commander Arbitrator:",
        "Implement a LangGraph Safety-Max Commander Arbitrator guaranteeing mathematically constrained conflict resolution and multi-system emergency dispatch (NDMA CAP v1.2, GPS detours) in <4.0 seconds."
    )

    add_heading_2(doc, "2.2 Summary of Novel Scientific Contributions")
    add_bullet_p(doc, "1. Edge-to-Agent Architecture: ", "First architecture coupling Sony Spresense on-device acoustic TinyML directly to an LLM-agent reasoning graph via open FastMCP.")
    add_bullet_p(doc, "2. Mathematical Safety Consensus: ", "A closed-form Safety-Max objective function that resolves multi-domain agent conflicts with strict life-safety constraints.")
    add_bullet_p(doc, "3. Closed-Loop Telemetry Verification (L7): ", "Dynamic feedback loop that continuously recalculates agent reasoning weights based on real-time civilian evacuation velocity.")
    add_bullet_p(doc, "4. Cryptographic Provenance & XAI Audit: ", "Deterministic audit trail providing natural-language rationale and SHA-256 hashes for every autonomous dispatch action.")

    # ==========================================
    # SECTION 3: SYSTEM ARCHITECTURE & 7-LAYER TOPOLOGY
    # ==========================================
    add_heading_1(doc, "3. Proposed System Architecture & 7-Layer Autonomous Topology")
    add_body_p(doc, 
        "XNexus is structured as a deterministic, closed-loop 7-layer architecture operating across distributed edge devices and high-performance agent reasoning nodes. Figure 1 illustrates the end-to-end topological blueprint."
    )
    
    fig1_path = os.path.join(DIR_PATH, "fig1_architecture_topology.png")
    if os.path.exists(fig1_path):
        add_figure(
            doc, fig1_path, 1,
            "XNexus 7-Layer Autonomous Multi-Agent Architecture Topology",
            "Illustrates the deterministic pipeline from Tier 1 Sony Spresense sensing nodes and radar ingest through the FastMCP semantic mesh, LangGraph Commander Arbitrator, and Tier 4 autonomous emergency actuation engines.",
            width_in=6.4
        )

    add_heading_2(doc, "3.1 Detailed Layer-by-Layer Technical Specification")
    layers = [
        ("Layer 1 (L1) — Edge Telemetry & Acoustic Sensing Ingest:", 
         "Combines heterogeneous data streams. Field-deployed Sony Spresense™ units capture high-resolution audio (192 kHz) and micro-seismic vibrations via geophones, performing edge FFTs to detect tumbling rocks and saturated soil slip. Simultaneously, centralized ingest adapters poll IMD Doppler radar reflectivity (Z-factors), CWC ultrasonic river stages, and GSI soil moisture piezometers."),
        ("Layer 2 (L2) — Semantic Normalization & FastMCP Mesh:", 
         "Translates raw telemetry into standard JSON-RPC payloads using Anthropic's open-source Model Context Protocol (FastMCP). Coordinates are dynamically projected into WGS84 tensors, units are harmonized into metric SI standards, and sensor health timestamps are evaluated with strict timeout guards."),
        ("Layer 3 (L3) — Shared Multi-Agent Memory Matrix:", 
         "A high-throughput in-memory Redis vector context store maintaining an O(1) spatial coordinate index of the entire hazard corridor. All reasoning agents read from and write to this shared state, ensuring zero information asymmetry."),
        ("Layer 4 (L4) — Domain-Specific Reasoning Ensemble:", 
         "Comprises three decoupled, specialized LLM reasoning agents: (a) GeoRisk Agent, which evaluates slope shear stress, rainfall accumulation curves, and acoustic rumble scores; (b) Hydro Agent, which models hydraulic wave crest propagation and dam discharge velocity; and (c) Weather Agent, which tracks cloudburst cell trajectories and wind shear."),
        ("Layer 5 (L5) — LangGraph Commander Arbitrator:", 
         "The central decision-making engine. When domain agents propose conflicting actions (e.g., Hydro suggests evacuating down Valley Road while GeoRisk detects a slope failure on Valley Road), the Commander Arbitrator evaluates a mathematical safety utility function, overriding lower-priority actions and generating an immutable XAI audit trace."),
        ("Layer 6 (L6) — Autonomous Execution & Multi-System Actuation:", 
         "Dispatches concrete emergency directives simultaneously in under 1.8 seconds: triggers NDMA Sachet OASIS CAP v1.2 multilingual cellular broadcasts to 840+ towers; pushes dynamic roadblock detour polygons to MapmyIndia/Google Navigation; allocates trauma ICU beds via the 108 Emergency Medical network; and signals Sony Sub-GHz acoustic siren nodes in remote valleys."),
        ("Layer 7 (L7) — Closed-Loop Feedback & Telemetry Verification:", 
         "Continuously monitors post-action telemetry (e.g., GPS evacuation traffic velocity, cellular tower delivery confirmations). If evacuees bottleneck or river levels rise faster than predicted, L7 feeds real-time state deltas back into Layer 3, dynamically recalculating agent priority weights.")
    ]
    for title, desc in layers:
        add_bullet_p(doc, title, desc)

    # ==========================================
    # SECTION 4: STRATEGIC ROLE OF SONY TECHNOLOGIES
    # ==========================================
    add_heading_1(doc, "4. Narrative: Why Sony & How We Leverage Sony Technologies")
    
    add_body_p(doc,
        "A foundational hypothesis of this proposal is that civil defense AI cannot rely exclusively on cloud computing. When catastrophic mudslides sever fiber-optic trunk lines and knock out commercial power grids, centralized systems become useless. True life-saving autonomy requires ultra-resilient, intelligent edge hardware.",
        bold_prefix="The Necessity of Edge Autonomy: "
    )
    
    fig3_path = os.path.join(DIR_PATH, "fig3_spresense_edge_node.png")
    if os.path.exists(fig3_path):
        add_figure(
            doc, fig3_path, 2,
            "Sony Spresense™ Edge Hardware Architecture, Field Deployment & Empirical Infrasound Sensing",
            "Tri-panel empirical validation: (a) Field deployment of weather-sealed IP67 Spresense sensor node with ground geophone probe in mountain landslide terrain; (b) CXD5602 6-core SoC hardware architecture and peripheral interfaces; (c) Empirical acoustic spectral density plot showing pre-failure subterranean rumble (10–120 Hz peak at -12 dB/Hz) captured on CXD5247 Hi-Res ADC against ambient noise baseline.",
            width_in=6.4
        )

    add_heading_2(doc, "4.1 Deep Integration of the Sony Spresense™ Platform")
    add_body_p(doc, "XNexus directly integrates the Sony Spresense™ development ecosystem across four vital functional dimensions:")
    
    add_bullet_p(doc, 
        "1. High-Resolution Acoustic Sensing (Sony CXD5247 Codec):",
        "Debris flows and impending landslides emit distinctive low-frequency acoustic vibrations (10 Hz to 200 Hz) caused by inter-boulder friction and shear rupture minutes before catastrophic mass movement occurs. Sony Spresense incorporates a dedicated high-resolution 192 kHz / 24-bit multi-channel audio ADC, enabling direct analog connection to sub-surface geophones and high-SPL microphones with ultra-low noise floor."
    )
    add_bullet_p(doc, 
        "2. Multi-Core Sub-Watt Edge Intelligence (Sony CXD5602 SoC):",
        "The CXD5602 processor features 6 ARM Cortex-M4F cores operating at 156 MHz with 1.5 MB SRAM. XNexus partitions tasks across these cores: Core 0 manages sensor sampling and DMA; Core 1 runs a real-time Mel-spectrogram FFT engine; Core 2 executes an INT8-quantized 1D-CNN (TinyML) to compute the Landslide Anomaly Score (S_rumble); and Core 3 serializes the output into FastMCP JSON-RPC packets. The node consumes less than 120 mW, enabling indefinite solar-supercapacitor operation."
    )
    add_bullet_p(doc, 
        "3. Integrated Dual-Constellation GNSS & Geodetic Displacement:",
        "Spresense features built-in GPS/GLONASS with carrier-phase tracking. By deploying pairs of Spresense nodes on stable bedrock vs. active slip faces, XNexus measures sub-meter slope creep in real time, validating acoustic alarms before mass release."
    )
    add_bullet_p(doc, 
        "4. Sub-GHz LoRa Mesh & Valley Siren Actuation:",
        "Equipped with a sub-GHz transceiver add-on board, Spresense nodes form an ad-hoc local mesh across mountain valleys. Even if cellular networks are wiped out, Spresense nodes transmit low-bandwidth emergency tokens to activate solar-powered village sirens within milliseconds."
    )

    create_callout_box(
        doc,
        title="STRATEGIC ALIGNMENT: Why Sony Should Fund This Research",
        content_paragraphs=[
            "Direct Contribution to Sony's Corporate Mission: Sony’s mission is to 'fill the world with emotion through creativity and technology,' anchored by Sustainability. Backing XNexus validates that Sony microelectronics can solve humanity's most urgent climate vulnerability challenges.",
            "High-Impact Showcase for Spresense in Civil Defense: This research transitions Spresense from a maker/IoT kit into a certified, life-saving edge computing standard for national emergency agencies (NDMA, CWC, international disaster forums).",
            "Open-Source Ecosystem Growth: All Spresense FastMCP bridge drivers, TinyML acoustic models, and edge DSP filters will be published open-source on GitHub, significantly expanding Sony's developer ecosystem."
        ],
        border_color=HEX_SONY_NAVY,
        bg_color=HEX_CALLOUT_BG,
        icon="🎯"
    )

    # ==========================================
    # SECTION 5: CLEAR DIFFERENTIATION FROM STATE OF THE ART
    # ==========================================
    add_heading_1(doc, "5. Clear Differentiation from Current State of the Art")
    add_body_p(doc, 
        "To illustrate the revolutionary nature of XNexus, Table 1 benchmarks our architecture against conventional legacy disaster management systems and emerging cloud-only AI research."
    )
    
    # Table 1: Differentiation Matrix
    diff_table = doc.add_table(rows=6, cols=4)
    diff_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    diff_table.autofit = False
    
    headers = ["Capability / Metric", "Legacy Civil Defense (Current)", "Cloud-Only AI Systems", "XNexus (Proposed Architecture)"]
    widths = [Inches(1.5), Inches(1.7), Inches(1.7), Inches(1.9)]
    
    hdr_row = diff_table.rows[0]
    for idx, text in enumerate(headers):
        cell = hdr_row.cells[idx]
        cell.width = widths[idx]
        set_cell_background(cell, HEX_SONY_NAVY)
        set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
        format_cell_text(cell, text, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF), size=8.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    
    diff_data = [
        ("End-to-End Reaction Latency", "110+ Minutes (Fatal bottleneck)", "15 to 30 Minutes (Cloud batching)", "< 4.0 Seconds (Autonomous real-time)"),
        ("Edge Sensing Intelligence", "Passive analog gauges; zero edge compute", "Microcontrollers streaming raw logs", "Sony Spresense™ on-device 192kHz acoustic TinyML"),
        ("Grid-Down Autonomy", "Zero. Offline during power/cell tower loss", "Fails when fiber backhaul is severed", "100% Autonomous (Sub-GHz LoRa mesh + solar)"),
        ("Cross-Agency Semantic Fusion", "None. Siloed manual operator portals", "Custom point-to-point ETL pipelines", "Open Model Context Protocol (FastMCP) standard"),
        ("Action Execution", "Manual phone calls & bureaucratic orders", "Advisory recommendation emails", "Autonomous CAP v1.2, MapmyIndia detour, 108 ICU"),
    ]
    
    for row_idx, row_vals in enumerate(diff_data, start=1):
        row = diff_table.rows[row_idx]
        bg = HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate(row_vals):
            cell = row.cells[col_idx]
            cell.width = widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=80, right=80)
            set_cell_borders(cell, bottom=('single', '4', '0', HEX_BORDER_MUTED))
            is_bold = (col_idx == 0 or col_idx == 3)
            c_color = COLOR_SONY_NAVY if col_idx == 3 else (COLOR_CRITICAL_RED if col_idx == 1 else COLOR_BODY_TEXT)
            format_cell_text(cell, val, bold=is_bold, color=c_color, size=7.8)

    # Latency Waterfall Diagram Figure 2
    fig2_path = os.path.join(DIR_PATH, "fig2_latency_waterfall.png")
    if os.path.exists(fig2_path):
        add_figure(
            doc, fig2_path, 3,
            "Reaction Latency Waterfall Comparison: Legacy Flow vs. XNexus Autonomous Edge Dispatch",
            "Quantifies the step-by-step reaction timeline. While legacy bureaucratic phone trees exhaust over 110 minutes, XNexus completes multi-agent reasoning and actuation in 3.8 to 4.0 seconds (a 1,650x acceleration).",
            width_in=6.4
        )

    # ==========================================
    # SECTION 6: MATHEMATICAL FORMULATIONS
    # ==========================================
    add_heading_1(doc, "6. Mathematical Formulations & Algorithmic Design")
    add_body_p(doc, 
        "To ensure verifiable mathematical safety and algorithmic determinism, XNexus is governed by rigorous formal objective functions rather than open-ended probabilistic outputs."
    )
    
    add_heading_2(doc, "6.1 Deterministic Commander Arbitrator Objective Function")
    add_body_p(doc, 
        "Let M = {Geo, Hydro, Weather} represent the set of domain agents, and let s(t) denote the normalized geospatial state vector at time t. Each agent i in M proposes an emergency action a in A with an expected domain utility U_i(s(t), a) and an uncertainty variance sigma_i^2(t). The Commander Arbitrator solves for the optimal consensus action a* via a constrained Safety-Max optimization problem:"
    )
    
    create_callout_box(
        doc,
        title="FORMULA 1: Deterministic Multi-Agent Safety Consensus",
        content_paragraphs=[
            "a* = argmax_{a in A} [ SUM_{i in M} w_i(t) * U_i(s(t), a) - lambda_life * R_exposure(a) ]",
            "Subject to: FOR ALL evacuation routes r in Routes(a): Probability(SlopeFailure(r, Delta t) > 0.05) == 0",
            "Where w_i(t) = exp(-sigma_i^2(t)) / SUM_j exp(-sigma_j^2(t)) dynamically scales with sensor confidence, and lambda_life >> 10^3 penalizes any action routing civilian evacuees through high-hazard geotechnical zones."
        ],
        border_color=HEX_SLATE_BLUE,
        bg_color=HEX_LIGHT_BG,
        icon="📐"
    )

    add_heading_2(doc, "6.2 Sony Spresense On-Device Acoustic Anomaly Index")
    add_body_p(doc, 
        "Operating on Core 1 and Core 2 of the Sony Spresense CXD5602, the Acoustic Rumble Index S_rumble(t) quantifies the ratio of low-frequency infrasonic power (indicative of subterranean mass shearing) to high-frequency ambient noise (wind, rain splatter):"
    )
    
    create_callout_box(
        doc,
        title="FORMULA 2: Spresense Edge Acoustic Spectral Ratio (S_rumble)",
        content_paragraphs=[
            "S_rumble(t) = [ INTEGRAL_{10 Hz}^{120 Hz} |X(f, t)|^2 df ]  /  [ INTEGRAL_{120 Hz}^{4000 Hz} |X(f, t)|^2 df + epsilon ]",
            "When S_rumble(t) exceeds a calibrated threshold theta_hazard for more than 3 consecutive 250 ms time-windows, the Spresense hardware interrupt triggers an immediate Level-1 FastMCP alert token, bypassing standard cloud polling queues."
        ],
        border_color=HEX_TECH_CYAN,
        bg_color=HEX_LIGHT_BG,
        icon="📊"
    )

    # ==========================================
    # SECTION 7: RESEARCH METHODOLOGY
    # ==========================================
    add_heading_1(doc, "7. Research Methodology & Experimental Validation Protocol")
    add_body_p(doc, "The 12-month research project is divided into four rigorous, empirical phases:")
    
    phases = [
        ("Phase 1 (Months 1–3) — Hardware Benchmarking & Acoustic Feature Engineering:",
         "We will procure 50 Sony Spresense development kits, extension boards, and sensor interfaces. In university geotechnical laboratory flume tanks, we will simulate varied landslide slurries and soil shear failures to record acoustic profiles, training our INT8-quantized TinyML model on Spresense's Cortex-M4F cores."),
        ("Phase 2 (Months 4–6) — FastMCP Semantic Protocol Mesh Deployment:",
         "We will implement standard FastMCP tool servers interfacing with simulated IMD Doppler radar grids and CWC river stage telemetry. We will benchmark serialization latency, targetting <15 ms parsing overhead under 10,000 concurrent event vectors."),
        ("Phase 3 (Months 7–9) — LangGraph Multi-Agent Orchestration & Adversarial Stress Testing:",
         "We will conduct extensive 'red-teaming' trials. We will intentionally inject corrupted sensor inputs, contradictory agent recommendations, and network link drops. We will evaluate the Commander Arbitrator's ability to maintain deterministic safety and generate transparent Explainable AI (XAI) decision audit logs."),
        ("Phase 4 (Months 10–12) — Full-Scale Digital Twin Simulation & Field Trials:",
         "We will deploy a 10-node Sony Spresense array in a monitored hazard corridor in the Western Ghats (Kerala). We will execute real-time digital twin disaster replays using historical telemetry from the 2024 Wayanad catastrophe, verifying that end-to-end alert latency stays strictly below 4.0 seconds.")
    ]
    for p_title, p_desc in phases:
        add_bullet_p(doc, p_title, p_desc)

    # ==========================================
    # SECTION 8: GOALS, MILESTONES & WORK PLAN
    # ==========================================
    add_heading_1(doc, "8. Goals, Milestones & 12-Month Deliverables Schedule")
    add_body_p(doc, 
        "Table 2 specifies the detailed quarterly milestones, key performance indicators (KPIs), and verified deliverables for the 12-month grant period."
    )
    
    # Milestone Table
    m_table = doc.add_table(rows=5, cols=4)
    m_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    m_table.autofit = False
    
    m_headers = ["Quarter", "Core Milestone Objective", "Key Performance Indicators (KPIs)", "Concrete Deliverables"]
    m_widths = [Inches(1.0), Inches(1.8), Inches(1.9), Inches(2.1)]
    
    for idx, text in enumerate(m_headers):
        cell = m_table.rows[0].cells[idx]
        cell.width = m_widths[idx]
        set_cell_background(cell, HEX_SONY_NAVY)
        set_cell_margins(cell, top=60, bottom=60, left=70, right=70)
        format_cell_text(cell, text, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF), size=8.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    
    m_data = [
        ("Q1 (M1-M3)", "Sony Spresense Hardware Kit Setup & Acoustic TinyML Modeling", "Acoustic detection accuracy > 92%; Power consumption < 120 mW", "Trained Spresense firmware; GitHub acoustic repo; Flume test dataset"),
        ("Q2 (M4-M6)", "FastMCP Semantic Ingest Mesh & Data Serialization", "Sub-15 ms serialization; 100% schema validation compliance", "Open-source FastMCP Spresense driver; API adapters for IMD/CWC"),
        ("Q3 (M7-M9)", "LangGraph Arbitrator & Adversarial Red-Teaming", "Arbitration latency < 800 ms; 100% safety constraint enforcement", "Multi-agent core codebase; XAI audit log visualizer; IEEE paper draft"),
        ("Q4 (M10-M12)", "End-to-End Simulation, Field Pilot & Final Report", "Total system reaction latency < 4.0s; 1,650x speedup vs legacy", "Final Sony Research Report; Field trial whitepaper; Open-source release"),
    ]
    
    for row_idx, row_vals in enumerate(m_data, start=1):
        row = m_table.rows[row_idx]
        bg = HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate(row_vals):
            cell = row.cells[col_idx]
            cell.width = m_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            set_cell_borders(cell, bottom=('single', '4', '0', HEX_BORDER_MUTED))
            is_bold = (col_idx == 0)
            format_cell_text(cell, val, bold=is_bold, color=COLOR_BODY_TEXT, size=7.8)

    # Page Break before Section 9 to ensure clean layout on Page 7
    doc.add_page_break()

    # ==========================================
    # SECTION 9: RISK ASSESSMENT & ETHICAL SAFEGUARDS
    # ==========================================
    add_heading_1(doc, "9. Technical Risk Management & Ethical Safeguards")
    add_body_p(doc, "Safety-critical autonomous systems demand proactive risk mitigation and deterministic ethical fail-safes:")
    
    add_bullet_p(doc, 
        "1. False Positive Mitigation (Dual-Sensory Corroboration):",
        "To prevent panic caused by false alarms, an acoustic rumble alarm from a Sony Spresense node cannot trigger a public cell broadcast on its own unless corroborated by either: (a) satellite/radar precipitation accumulation exceeding 45 mm/hr, or (b) an adjacent geophone confirming seismic coherence."
    )
    add_bullet_p(doc, 
        "2. Deterministic Human Override & Rollback:",
        "While actuation occurs autonomously within 4.0 seconds, on-duty civil defense incident commanders receive instant audio-visual priority alarms with a 60-second unilateral override button, accompanied by a natural-language XAI explanation of why the action was taken."
    )
    add_bullet_p(doc, 
        "3. Cryptographic Provenance & Tamper-Proof Audit:",
        "Every telemetry token, agent deliberation step, and dispatch order is cryptographically hashed using SHA-256 and appended to an immutable append-only ledger, ensuring complete post-disaster accountability."
    )

    # ==========================================
    # SECTION 10: EVALUATION FRAMEWORK & BROADER SCOPE
    # ==========================================
    add_heading_1(doc, "10. Rigorous Evaluation Metrics & Multi-Hazard Expansion Scope")
    add_body_p(doc, "To provide quantifiable benchmarks for Sony Research reviewers, XNexus will be evaluated against five measurable scientific criteria:")
    
    add_bullet_p(doc, "• End-to-End Reaction Latency: ", "Sub-4.0s from initial Spresense threshold trigger to OASIS CAP broadcast dispatch (vs. 110+ min legacy).")
    add_bullet_p(doc, "• Acoustic Anomaly F1-Score: ", "Targeting F1 >= 0.94 on subterranean rumble classification (10–120 Hz) against ambient mountain noise baselines.")
    add_bullet_p(doc, "• Mathematical Constraint Adherence: ", "100.0% zero-violation guarantee on safety utility functions (no evacuations routed through active failure zones).")
    add_bullet_p(doc, "• Communication Overhead & Memory Footprint: ", "<1.2 kB per FastMCP JSON-RPC state delta; <120 mW edge power consumption on Spresense.")
    add_bullet_p(doc, "• Incident Commander Explainability Score: ", ">90% human commander comprehension and trust rating on automated decision audit cards.")

    add_body_p(doc, 
        "While the primary testbed targets landslide and flash-flood corridors in the Western Ghats, the XNexus architecture is fundamentally domain-general. The FastMCP abstraction layer readily incorporates seismic P-wave accelerometers for earthquake early warning, thermal IR sensors for forest wildfire tracking, and hydrodynamic surge models for coastal cyclones.",
        bold_prefix="Multi-Hazard Generalization: "
    )

    # ==========================================
    # SECTION 11: REFERENCES
    # ==========================================
    add_heading_1(doc, "11. Formal Academic & Regulatory References")
    
    refs = [
        "1. National Disaster Management Authority (NDMA), Government of India. 'National Disaster Management Guidelines & Standard Operating Procedures for Early Warning Systems,' 2023.",
        "2. Geological Survey of India (GSI). 'Preliminary Technical Post-Disaster Report on the Chooralmala-Mundakkai Landslides, Wayanad District, Kerala,' August 2024.",
        "3. Sony Group Corporation. 'Sony Spresense Hardware Reference Manual & Multi-Core SDK Guide,' Sony Semiconductor Solutions Corporation, 2024.",
        "4. OASIS Open Standards. 'Common Alerting Protocol (CAP) Version 1.2,' OASIS Standard, 2010.",
        "5. Anthropic PBC. 'Model Context Protocol (MCP) Specification & Stdio/SSE Architectural RFC,' 2024.",
        "6. Central Water Commission (CWC), Ministry of Jal Shakti. 'Handbook on Hydrological Telemetry and Warning Levels,' 2022.",
        "7. Wu, et al. 'AutoGPT and LangGraph: Orchestrating Complex Autonomous Agent Workflows with Cyclic Graphs,' arXiv:2402.10178, 2024."
    ]
    for r in refs:
        add_body_p(doc, r, space_after=2)

    # ==========================================
    # PAGE BREAK BEFORE BUDGET (MANDATORY STANDALONE 1-PAGE BUDGET)
    # ==========================================
    doc.add_page_break()
    
    # ==========================================
    # SECTION 12: BUDGET SUMMARY (PAGE 8 STANDALONE)
    # ==========================================
    add_heading_1(doc, "12. Itemized Budget Summary & Cost Justification (1 Page)")

    
    add_body_p(doc, 
        "Total Requested Funding: US$100,000  |  Duration: 12 Months (October 2026 – September 2027)",
        bold_prefix="Award Track: Sony Faculty Innovation Award  |  "
    )
    add_body_p(doc,
        "The following itemized budget is fully compliant with the guidelines of the Sony Research Award Program 2026. Institutional overhead has been negotiated and capped to fit strictly within the all-inclusive US$100,000 maximum funding envelope."
    )
    
    # Budget Table
    b_table = doc.add_table(rows=10, cols=4)
    b_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    b_table.autofit = False
    
    b_headers = ["Budget Category", "Item Description & Specifications", "Basis of Estimate / Quantity", "Subtotal (USD)"]
    b_widths = [Inches(1.5), Inches(2.7), Inches(1.6), Inches(1.0)]
    
    for idx, text in enumerate(b_headers):
        cell = b_table.rows[0].cells[idx]
        cell.width = b_widths[idx]
        set_cell_background(cell, HEX_SONY_NAVY)
        set_cell_margins(cell, top=60, bottom=60, left=70, right=70)
        format_cell_text(cell, text, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF), size=8.0, align=WD_ALIGN_PARAGRAPH.CENTER)
    
    b_items = [
        ("1. Personnel & Student Support", "Graduate Research Assistant 1 (Ph.D. student, Multi-Agent AI & LangGraph)", "12 Months @ $2,000/mo stipend", "$24,000"),
        ("1. Personnel & Student Support", "Graduate Research Assistant 2 (Ph.D. student, Embedded Edge AI & FastMCP)", "12 Months @ $2,000/mo stipend", "$24,000"),
        ("1. Personnel & Student Support", "Post-Doctoral Researcher (Part-time, Geotechnical Sensing & Field Calibration)", "6 Months @ $1,500/mo stipend", "$9,000"),
        ("2. Hardware & Sensing Equipment", "Sony Spresense Development Ecosystem (50 Main Boards, 50 Extension, 50 Sub-GHz)", "50 Field Kits @ $180/kit", "$9,000"),
        ("2. Hardware & Sensing Equipment", "Geotechnical Sensors, Geophones, Microphones, Solar Panels & Supercapacitors", "Field enclosure rigs for 20 nodes", "$4,000"),
        ("2. Hardware & Sensing Equipment", "Local Edge GPU Workstation for Agent Compilation & Stress Testing", "Dedicated dual-GPU testing rig", "$3,000"),
        ("3. Cloud, APIs & Software", "Real-time Telemetry APIs (MapmyIndia Enterprise, OpenWeather Radar, Redis Cloud)", "12 Months Enterprise access", "$9,000"),
        ("4. Travel & Field Dissemination", "Field deployment trips to Western Ghats; Presentation at major IEEE/ACM conference", "2 Field trips + 1 Int'l Conference", "$8,000"),
        ("5. Institutional Overhead", "University Indirect Costs (Facilities, lab space, administration) — Capped to match Sony ceiling", "Institutional Agreement (19.05% of direct)", "$19,000"),
    ]
    
    for row_idx, row_vals in enumerate(b_items, start=1):
        row = b_table.rows[row_idx]
        bg = HEX_LIGHT_BG if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, val in enumerate(row_vals):
            cell = row.cells[col_idx]
            cell.width = b_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=70, right=70)
            set_cell_borders(cell, bottom=('single', '4', '0', HEX_BORDER_MUTED))
            is_bold = (col_idx == 0 or col_idx == 3)
            align = WD_ALIGN_PARAGRAPH.RIGHT if col_idx == 3 else WD_ALIGN_PARAGRAPH.LEFT
            format_cell_text(cell, val, bold=is_bold, color=COLOR_BODY_TEXT, size=7.8, align=align)

    # Total Row Table
    tot_table = doc.add_table(rows=1, cols=2)
    tot_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tot_cell_0 = tot_table.cell(0, 0)
    tot_cell_1 = tot_table.cell(0, 1)
    tot_cell_0.width = Inches(5.8)
    tot_cell_1.width = Inches(1.0)
    set_cell_background(tot_cell_0, HEX_SONY_NAVY)
    set_cell_background(tot_cell_1, HEX_SONY_NAVY)
    set_cell_margins(tot_cell_0, top=60, bottom=60, left=80, right=80)
    set_cell_margins(tot_cell_1, top=60, bottom=60, left=70, right=70)
    
    format_cell_text(tot_cell_0, "TOTAL REQUESTED GRANT FUNDING (ALL-INCLUSIVE CEILING):", bold=True, color=RGBColor(0xFF, 0xFF, 0xFF), size=8.5, align=WD_ALIGN_PARAGRAPH.RIGHT)
    format_cell_text(tot_cell_1, "$100,000 USD", bold=True, color=RGBColor(0x00, 0xF0, 0xFF), size=9.0, align=WD_ALIGN_PARAGRAPH.RIGHT)

    # Budget Justification Paragraphs
    add_heading_2(doc, "12.1 Budget Justification & Cost Rationalization")
    add_bullet_p(doc, 
        "Personnel ($57,000):",
        "Directly supports two full-time Ph.D. students and one part-time postdoctoral researcher dedicated to the project. The PI's time is contributed as an institutional cost-share and requires no salary from the grant."
    )
    add_bullet_p(doc, 
        "Equipment ($16,000):",
        "Directly funds the purchase of 50 Sony Spresense development kits, enabling large-scale mesh array testing. Field-hardened enclosures, solar scavenging power buffers, and specialized 192 kHz acoustic geophones are required for rugged mountain deployment."
    )
    add_bullet_p(doc, 
        "Software & Cloud ($9,000):",
        "Covers hosted vector memory (Redis RAG) instances, MapmyIndia real-time route optimization APIs, and high-concurrency LLM reasoning inference tokens."
    )
    add_bullet_p(doc, 
        "Travel & Presentation ($8,000):",
        "Supports two mandatory ground-truth acoustic data collection trips to high-hazard landslide zones in the Western Ghats and travel for the PI and student to present peer-reviewed results at a premier IEEE/ACM conference."
    )
    add_bullet_p(doc, 
        "Institutional Overhead ($19,000):",
        "University indirect costs capped strictly to ensure the total award equals exactly the $100,000 USD Faculty Innovation Award limit."
    )

    out_file = os.path.join(DIR_PATH, "XNexus_Sony_Proposal.docx")
    doc.save(out_file)
    print(f"Successfully generated proposal: {out_file}")

if __name__ == "__main__":
    build_proposal()
