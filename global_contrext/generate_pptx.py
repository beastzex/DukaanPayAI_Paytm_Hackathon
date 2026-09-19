"""
Generate Paytm Merchant Growth Agent Pitch Deck (20 Slides)
Matches 'Untitled design (1).pdf' aesthetic:
- 16:9 Widescreen (13.333 x 7.5 inches)
- Modern typography: Plus Jakarta Sans / Arial / Helvetica
- Colors: #0077fb (Electric Blue), #002970 (Navy), #0b0e14 (Dark Slate), #f8fafd (Off White), #ffffff
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # 16:9 Widescreen Dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Color Palette
    COLOR_BLUE = RGBColor(0, 119, 251)       # #0077fb
    COLOR_NAVY = RGBColor(0, 41, 112)        # #002970
    COLOR_DARK_BG = RGBColor(11, 14, 20)     # #0b0e14
    COLOR_DARK_CARD = RGBColor(24, 32, 48)   # #182030
    COLOR_LIGHT_BG = RGBColor(248, 250, 253) # #f8fafd
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_BORDER = RGBColor(226, 232, 240)
    COLOR_TEXT_DARK = RGBColor(15, 23, 42)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)
    COLOR_GREEN = RGBColor(0, 196, 140)
    COLOR_AMBER = RGBColor(245, 158, 11)
    COLOR_RED = RGBColor(239, 68, 68)

    def add_header_footer(slide, page_num, dark=False):
        # Header Left: Product Logo & Dot
        dot = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.8), Inches(0.48), Inches(0.14), Inches(0.14))
        dot.fill.solid()
        dot.fill.fore_color.rgb = COLOR_BLUE
        dot.line.color.rgb = COLOR_BLUE

        tx_box = slide.shapes.add_textbox(Inches(1.05), Inches(0.38), Inches(4.5), Inches(0.4))
        tf = tx_box.text_frame
        tf.word_wrap = False
        p = tf.paragraphs[0]
        p.text = "Paytm Merchant Growth Agent"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE if dark else COLOR_TEXT_DARK

        # Header Right: Hackathon Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.2), Inches(0.38), Inches(3.3), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = RGBColor(30, 41, 59) if dark else RGBColor(232, 242, 255)
        badge.line.color.rgb = COLOR_BLUE
        badge.line.width = Pt(1)
        p_b = badge.text_frame.paragraphs[0]
        p_b.text = "PAYTM BUILD FOR INDIA • AI HACKATHON"
        p_b.font.size = Pt(9.5)
        p_b.font.bold = True
        p_b.font.color.rgb = RGBColor(56, 189, 248) if dark else COLOR_BLUE
        p_b.alignment = PP_ALIGN.CENTER

        # Footer Left: Page Number
        ft_tx = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(2.0), Inches(0.3))
        p_ft = ft_tx.text_frame.paragraphs[0]
        p_ft.text = f"PAGE {page_num:02d} / 20"
        p_ft.font.size = Pt(10)
        p_ft.font.bold = True
        p_ft.font.color.rgb = COLOR_BLUE

        # Footer Right: Tagline
        ft_rt = slide.shapes.add_textbox(Inches(6.5), Inches(6.9), Inches(6.0), Inches(0.3))
        p_rt = ft_rt.text_frame.paragraphs[0]
        p_rt.text = "The AI Teammate That Runs Alongside Every Merchant"
        p_rt.font.size = Pt(10)
        p_rt.font.color.rgb = RGBColor(148, 163, 184) if dark else COLOR_TEXT_MUTED
        p_rt.alignment = PP_ALIGN.RIGHT

    def set_slide_bg(slide, dark=False):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_DARK_BG if dark else COLOR_LIGHT_BG
        bg.line.fill.background() # No line

    def add_category_and_headline(slide, category, headline, dark=False, font_size=32):
        # Category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(8.0), Inches(0.35))
        p_c = cat_box.text_frame.paragraphs[0]
        p_c.text = f"●  {category.upper()}"
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = COLOR_BLUE

        # Headline
        hd_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.25), Inches(11.7), Inches(1.1))
        tf_h = hd_box.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = headline
        p_h.font.size = Pt(font_size)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_WHITE if dark else COLOR_TEXT_DARK

    # ==========================================
    # SLIDE 1: COVER
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1, dark=True)
    add_header_footer(s1, 1, dark=True)

    c_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(7.5), Inches(4.5))
    tf1 = c_box.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "MERCHANT GROWTH AI TRACK"
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(56, 189, 248)

    p2 = tf1.add_paragraph()
    p2.text = "Paytm Merchant\nGrowth Agent"
    p2.font.size = Pt(46)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE

    p3 = tf1.add_paragraph()
    p3.text = "The AI Teammate That Runs Alongside Every Merchant."
    p3.font.size = Pt(18)
    p3.font.color.rgb = RGBColor(148, 163, 184)
    p3.space_before = Pt(14)

    p4 = tf1.add_paragraph()
    p4.text = "🚀 Value Proposition: Transforming Paytm from a payment platform into a merchant growth platform."
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = RGBColor(96, 165, 250)
    p4.space_before = Pt(20)

    # Right Card: Visual Ecosystem
    c_hub = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.5), Inches(1.8), Inches(4.0), Inches(4.5))
    c_hub.fill.solid()
    c_hub.fill.fore_color.rgb = COLOR_DARK_CARD
    c_hub.line.color.rgb = COLOR_BLUE
    c_hub.line.width = Pt(1.5)
    tf_hub = c_hub.text_frame
    tf_hub.word_wrap = True
    p_h0 = tf_hub.paragraphs[0]
    p_h0.text = "🏪 THE MERCHANT GROWTH HUB"
    p_h0.font.size = Pt(14)
    p_h0.font.bold = True
    p_h0.font.color.rgb = COLOR_WHITE
    p_h0.alignment = PP_ALIGN.CENTER

    items = [
        ("WhatsApp Layer", "Natural daily interaction & voice check-ins"),
        ("Paytm QR & Soundbox", "Real-time payment signals & footfall curves"),
        ("Autonomous AI Agent", "Continuous observation, forecasting & execution")
    ]
    for title, desc in items:
        p_t = tf_hub.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = RGBColor(56, 189, 248)
        p_t.space_before = Pt(16)

        p_d = tf_hub.add_paragraph()
        p_d.text = f"  {desc}"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = RGBColor(203, 213, 225)

    # ==========================================
    # SLIDE 2: THE PROBLEM WE SOLVE
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header_footer(s2, 2)
    add_category_and_headline(s2, "The Core Merchant Dilemma", "Merchants Generate Data Every Day.\nBut They Don't Get Decisions.")

    pain_points = [
        ("SALES DROP", "Why did sales drop yesterday?", COLOR_BLUE),
        ("INVENTORY", "What inventory should I buy tomorrow?", COLOR_AMBER),
        ("STOCKOUTS", "Which products are running out?", COLOR_RED),
        ("CHURN", "Which customers stopped returning?", RGBColor(139, 92, 246)),
        ("DEMAND SURGE", "When will peak customer demand surge?", COLOR_GREEN),
        ("PROFIT GROWTH", "How do I grow my business profits?", COLOR_NAVY)
    ]
    for i, (tag, q, col) in enumerate(pain_points):
        row = i // 2
        col_idx = i % 2
        x = Inches(0.8 + col_idx * 4.0)
        y = Inches(2.6 + row * 1.25)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.8), Inches(1.1))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_WHITE
        card.line.color.rgb = col
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = tag
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = q
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_DARK

    # Insight Right Box
    ins_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.0), Inches(2.6), Inches(3.5), Inches(3.6))
    ins_box.fill.solid()
    ins_box.fill.fore_color.rgb = RGBColor(232, 242, 255)
    ins_box.line.color.rgb = COLOR_BLUE
    ins_box.line.width = Pt(1.5)
    tf_ins = ins_box.text_frame
    tf_ins.word_wrap = True
    p_in0 = tf_ins.paragraphs[0]
    p_in0.text = "💡 KEY INSIGHT"
    p_in0.font.size = Pt(14)
    p_in0.font.bold = True
    p_in0.font.color.rgb = COLOR_BLUE
    
    p_in1 = tf_ins.add_paragraph()
    p_in1.text = "India's merchants don't need more complex dashboards.\n\nThey need a proactive business teammate who works directly in WhatsApp."
    p_in1.font.size = Pt(14)
    p_in1.font.bold = True
    p_in1.font.color.rgb = COLOR_NAVY
    p_in1.space_before = Pt(20)

    # ==========================================
    # SLIDE 3: WHAT'S BROKEN TODAY
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header_footer(s3, 3)
    add_category_and_headline(s3, "Market Reality", "What's Broken in Today's Market")

    broken_cards = [
        ("01.", "No Business Intelligence", "UPI data exists in payment backends, but zero intelligent insights reach the merchant. Raw numbers remain completely unused.", "Status: Data generated, never synthesized.", COLOR_BLUE),
        ("02.", "No Inventory Visibility", "Merchants don't know what stock will run out tomorrow. They rely on guesswork until customers encounter empty shelves.", "Status: Chronic stockouts & lost margin.", COLOR_AMBER),
        ("03.", "No Actionable Recommendations", "Dashboards only display backward-looking charts. Data exists, insights don't, and real growth action never happens.", "Status: Inaction & stagnation.", COLOR_RED)
    ]
    for i, (num, title, desc, stat, col) in enumerate(broken_cards):
        x = Inches(0.8 + i * 4.0)
        c = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.4), Inches(3.7), Inches(4.0))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = COLOR_BORDER
        c.line.width = Pt(1)
        tf = c.text_frame
        tf.word_wrap = True
        
        p_n = tf.paragraphs[0]
        p_n.text = num
        p_n.font.size = Pt(40)
        p_n.font.bold = True
        p_n.font.color.rgb = col

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(17)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_DARK
        p_t.space_before = Pt(8)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(12.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(8)

        p_s = tf.add_paragraph()
        p_s.text = stat
        p_s.font.size = Pt(11)
        p_s.font.bold = True
        p_s.font.color.rgb = col
        p_s.space_before = Pt(20)

    # ==========================================
    # SLIDE 4: THE OPPORTUNITY
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header_footer(s4, 4)
    add_category_and_headline(s4, "Paytm Strategic Moat", "Paytm Already Sees Merchant Transactions.\nThe Missing Layer is AI.")

    opp_steps = [
        ("STEP 01", "Paytm QR & Soundbox", "Daily payment touchpoint at 30M+ merchant counters across India."),
        ("STEP 02", "UPI Payments Data", "Real-time stream of basket values, timestamps & buyer frequency."),
        ("STEP 03", "Merchant Behavior", "Unlocks seasonal cadence, peak velocity & customer habits."),
        ("AI LAYER", "Autonomous Decisions", "Proactive PO recommendations, smart promos & growth execution.")
    ]
    for i, (step, title, desc) in enumerate(opp_steps):
        x = Inches(0.8 + i * 3.0)
        is_ai = (i == 3)
        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.6), Inches(2.75), Inches(3.6))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_BLUE if is_ai else COLOR_WHITE
        c.line.color.rgb = COLOR_BLUE
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True

        p_s = tf.paragraphs[0]
        p_s.text = step
        p_s.font.size = Pt(11)
        p_s.font.bold = True
        p_s.font.color.rgb = RGBColor(186, 230, 253) if is_ai else COLOR_BLUE

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_WHITE if is_ai else COLOR_TEXT_DARK
        p_t.space_before = Pt(10)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = RGBColor(224, 242, 254) if is_ai else COLOR_TEXT_MUTED
        p_d.space_before = Pt(10)

    # ==========================================
    # SLIDE 5: OUR SOLUTION
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5, dark=True)
    add_header_footer(s5, 5, dark=True)
    add_category_and_headline(s5, "The Breakthrough", "Introducing Paytm Merchant Growth Agent\nObserve → Understand → Predict → Recommend → Execute", dark=True, font_size=28)

    left_sol = s5.shapes.add_textbox(Inches(0.8), Inches(2.5), Inches(6.5), Inches(4.0))
    tf_s = left_sol.text_frame
    tf_s.word_wrap = True
    p_s1 = tf_s.paragraphs[0]
    p_s1.text = "Not another chatbot with a prompt box.\nA true autonomous business teammate."
    p_s1.font.size = Pt(20)
    p_s1.font.bold = True
    p_s1.font.color.rgb = COLOR_WHITE

    bullets = [
        "Zero user training required — operates via WhatsApp & Voice",
        "Doesn't wait to be asked — proactively sends morning briefings",
        "Closed-loop execution — 1-click approvals for orders & promos"
    ]
    for b in bullets:
        p_b = tf_s.add_paragraph()
        p_b.text = f"✔  {b}"
        p_b.font.size = Pt(14)
        p_b.font.color.rgb = RGBColor(203, 213, 225)
        p_b.space_before = Pt(16)

    # Right: Capability Box
    c_cap = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.8), Inches(2.3), Inches(4.7), Inches(4.2))
    c_cap.fill.solid()
    c_cap.fill.fore_color.rgb = COLOR_DARK_CARD
    c_cap.line.color.rgb = COLOR_BLUE
    tf_c = c_cap.text_frame
    tf_c.word_wrap = True
    p_c0 = tf_c.paragraphs[0]
    p_c0.text = "🤖 6 AUTONOMOUS PILLARS"
    p_c0.font.size = Pt(14)
    p_c0.font.bold = True
    p_c0.font.color.rgb = RGBColor(56, 189, 248)

    pillars = [
        ("Sales Diagnostics", "Pinpoints exact drivers of daily dips or surges"),
        ("Inventory Reorder", "Calculates precise stock run-rates & generates POs"),
        ("Demand Forecast", "Estimates peak footfall 24-48h in advance"),
        ("Customer Retention", "Flags lapsed patrons & crafts WhatsApp offers"),
        ("Growth Opportunities", "Uncovers profitable product combos & cross-sells"),
        ("Automated Promos", "Executes hyperlocal cashback campaigns in 1 click")
    ]
    for name, desc in pillars:
        p_p = tf_c.add_paragraph()
        p_p.text = f"• {name}: {desc}"
        p_p.font.size = Pt(11.5)
        p_p.font.color.rgb = RGBColor(226, 232, 240)
        p_p.space_before = Pt(6)

    # ==========================================
    # SLIDE 6: HOW IT WORKS
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header_footer(s6, 6)
    add_category_and_headline(s6, "End-to-End Pipeline", "From Multimodal Inputs to Autonomous Growth Actions")

    tiers = [
        ("TIER 1: INGESTION", "Merchant Data Sources", ["Paytm UPI Transactions", "Ledger Photos (WhatsApp)", "Supplier Invoices (OCR)", "Shelf Snapshots (Vision)", "Weather, Festivals & IPL"], COLOR_BLUE),
        ("TIER 2: REASONING", "AI Intelligence Engine", ["Multimodal Perception (YOLO+OCR)", "Time-Series Demand Forecasts", "LangGraph Multi-Agent Core", "Merchant Health Scoring Engine", "Anomaly & Leakage Detectors"], COLOR_NAVY),
        ("TIER 3: OUTCOMES", "Growth Actions", ["Daily WhatsApp Briefing (8 AM)", "Auto Supplier Purchase Orders", "Targeted Cashback Promos", "Vernacular AI Voice Alerts", "Pre-approved Credit Scoring"], COLOR_GREEN)
    ]
    for i, (tier_tag, tier_title, items, col) in enumerate(tiers):
        x = Inches(0.8 + i * 4.0)
        c = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.4), Inches(3.7), Inches(4.0))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = tier_tag
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = tier_title
        p2.font.size = Pt(16)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_DARK
        p2.space_before = Pt(6)

        for it in items:
            p_it = tf.add_paragraph()
            p_it.text = f"✔ {it}"
            p_it.font.size = Pt(11.5)
            p_it.font.color.rgb = COLOR_TEXT_MUTED
            p_it.space_before = Pt(10)

    # ==========================================
    # SLIDE 7: THE AGENT ECOSYSTEM
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)
    add_header_footer(s7, 7)
    add_category_and_headline(s7, "Multi-Agent Swarm", "7 Specialized Autonomous Agents Working in Sync")

    agents = [
        ("01", "BI Agent", "Analyzes revenue trends, anomalies & margin shifts."),
        ("02", "Demand Forecast Agent", "Predicts future item demand based on weather & festivals."),
        ("03", "Footfall Agent", "Maps hourly customer arrival curves & peak hours."),
        ("04", "Inventory Agent", "Reconciles invoices + shelf photos to recommend POs."),
        ("05", "Retention Agent", "Detects lapsed patrons & triggers re-engagement offers."),
        ("06", "Growth Recommender", "Uncovers daily upsell, combo & margin opportunities."),
        ("07", "Campaign Executor", "Deploys merchant-approved cashback vouchers instantly.")
    ]
    for i, (num, name, duty) in enumerate(agents[:4]):
        x = Inches(0.8 + i * 2.95)
        c = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.4), Inches(2.75), Inches(1.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = COLOR_BLUE
        tf = c.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{num} • {name}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p2 = tf.add_paragraph()
        p2.text = duty
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(6)

    for i, (num, name, duty) in enumerate(agents[4:]):
        x = Inches(0.8 + i * 3.95)
        c = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.5), Inches(3.75), Inches(1.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = COLOR_GREEN if num == "07" else COLOR_BLUE
        tf = c.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{num} • {name}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_GREEN if num == "07" else COLOR_BLUE
        p2 = tf.add_paragraph()
        p2.text = duty
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(6)

    # ==========================================
    # SLIDE 8: INVENTORY INNOVATION
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)
    add_header_footer(s8, 8)
    add_category_and_headline(s8, "Core AI Innovation", "Inventory Tracking Without Barcodes or Manual Entry")

    left_box = s8.shapes.add_textbox(Inches(0.8), Inches(2.4), Inches(6.0), Inches(4.2))
    tf_l8 = left_box.text_frame
    tf_l8.word_wrap = True
    p8 = tf_l8.paragraphs[0]
    p8.text = "The 4-Way Inventory Intelligence Equation:"
    p8.font.size = Pt(16)
    p8.font.bold = True
    p8.font.color.rgb = COLOR_NAVY

    eq_steps = [
        "1. Supplier Invoice OCR → Captures incoming wholesale quantities & cost",
        "2. Shelf Photo AI (YOLO) → Detects facing depth & empty frontages",
        "3. Demand Forecasting → Projects consumption rate against local events",
        "4. Merchant Feedback Loop → 1-tap WhatsApp confirms estimate accuracy"
    ]
    for step in eq_steps:
        p_eq = tf_l8.add_paragraph()
        p_eq.text = step
        p_eq.font.size = Pt(13)
        p_eq.font.color.rgb = COLOR_TEXT_DARK
        p_eq.space_before = Pt(12)

    # Right Live Kirana Card
    r_k = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.2), Inches(2.4), Inches(5.3), Inches(4.0))
    r_k.fill.solid()
    r_k.fill.fore_color.rgb = COLOR_WHITE
    r_k.line.color.rgb = COLOR_BLUE
    r_k.line.width = Pt(2)
    tf_rk = r_k.text_frame
    tf_rk.word_wrap = True

    p_rk0 = tf_rk.paragraphs[0]
    p_rk0.text = "🍜 LIVE KIRANA SCENARIO"
    p_rk0.font.size = Pt(14)
    p_rk0.font.bold = True
    p_rk0.font.color.rgb = COLOR_BLUE

    p_rk1 = tf_rk.add_paragraph()
    p_rk1.text = "Item: Maggi 2-Minute Noodles (70g)\nEstimated Remaining: 26 packets (Critically Low)"
    p_rk1.font.size = Pt(14)
    p_rk1.font.bold = True
    p_rk1.font.color.rgb = COLOR_TEXT_DARK
    p_rk1.space_before = Pt(12)

    p_rk2 = tf_rk.add_paragraph()
    p_rk2.text = "AI Recommendation:\n'Order 2 cartons (48 pkts) from Gupta Wholesale by 11 AM to prevent tomorrow's weekend evening stockout.'"
    p_rk2.font.size = Pt(13)
    p_rk2.font.bold = True
    p_rk2.font.color.rgb = COLOR_NAVY
    p_rk2.space_before = Pt(14)

    p_rk3 = tf_rk.add_paragraph()
    p_rk3.text = "• Run-rate: 18 pkts/day  • Lead time: 24h  • Saved: ₹1,400 Lost Sales"
    p_rk3.font.size = Pt(11)
    p_rk3.font.color.rgb = COLOR_GREEN
    p_rk3.space_before = Pt(14)

    # ==========================================
    # SLIDE 9: WHATSAPP-FIRST EXPERIENCE
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)
    add_header_footer(s9, 9)
    add_category_and_headline(s9, "Frictionless UX", "Built For How Merchants Already Work")

    left_w = s9.shapes.add_textbox(Inches(0.8), Inches(2.4), Inches(6.0), Inches(4.0))
    tf_lw = left_w.text_frame
    tf_lw.word_wrap = True
    p_w1 = tf_lw.paragraphs[0]
    p_w1.text = "Merchants check WhatsApp 40+ times daily.\nWe deliver high-signal intelligence directly to their primary chat."
    p_w1.font.size = Pt(18)
    p_w1.font.color.rgb = COLOR_TEXT_DARK

    p_w2 = tf_lw.add_paragraph()
    p_w2.text = "🌅 8:00 AM Morning Briefing:\nYesterday's revenue, today's footfall forecast & urgent POs."
    p_w2.font.size = Pt(14)
    p_w2.font.bold = True
    p_w2.font.color.rgb = COLOR_BLUE
    p_w2.space_before = Pt(16)

    p_w3 = tf_lw.add_paragraph()
    p_w3.text = "⚡ 1-Click Interactive Approvals:\nTap 'Approve' to trigger orders or promos with zero app switching."
    p_w3.font.size = Pt(14)
    p_w3.font.bold = True
    p_w3.font.color.rgb = COLOR_GREEN
    p_w3.space_before = Pt(16)

    # Right Phone Mockup Card
    r_phone = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.5), Inches(2.2), Inches(5.0), Inches(4.5))
    r_phone.fill.solid()
    r_phone.fill.fore_color.rgb = RGBColor(239, 234, 226) # WhatsApp beige
    r_phone.line.color.rgb = RGBColor(7, 94, 84) # WhatsApp dark green
    r_phone.line.width = Pt(3)
    tf_ph = r_phone.text_frame
    tf_ph.word_wrap = True

    p_ph0 = tf_ph.paragraphs[0]
    p_ph0.text = "💬 Paytm Growth Agent (WhatsApp)"
    p_ph0.font.size = Pt(13)
    p_ph0.font.bold = True
    p_ph0.font.color.rgb = RGBColor(7, 94, 84)

    p_ph1 = tf_ph.add_paragraph()
    p_ph1.text = "Good Morning Ramesh Ji! 🌅\n\n• Yesterday Revenue: ₹17,500\n• Today Forecast: ₹19,200 (+10%)\n• Peak Hour: 6:00 PM – 8:00 PM\n\n⚠️ Inventory Alert: Maggi Stock Low (26 pkts remaining)\nAction: Order 3 cartons from Gupta Wholesale."
    p_ph1.font.size = Pt(12)
    p_ph1.font.color.rgb = RGBColor(17, 24, 39)
    p_ph1.space_before = Pt(8)

    p_ph2 = tf_ph.add_paragraph()
    p_ph2.text = "[ ✅ APPROVED: Purchase Order Dispatched via WhatsApp ]"
    p_ph2.font.size = Pt(11)
    p_ph2.font.bold = True
    p_ph2.font.color.rgb = RGBColor(21, 128, 61)
    p_ph2.space_before = Pt(12)

    # ==========================================
    # SLIDE 10: VOICE AI AGENT
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s10)
    add_header_footer(s10, 10)
    add_category_and_headline(s10, "Vernacular AI", "Speak. Don't Type. 100% Vernacular Voice Interaction.")

    v_left = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.4), Inches(5.8), Inches(4.0))
    v_left.fill.solid()
    v_left.fill.fore_color.rgb = COLOR_WHITE
    v_left.line.color.rgb = COLOR_BLUE
    v_left.line.width = Pt(1.5)
    tf_vl = v_left.text_frame
    tf_vl.word_wrap = True

    p_v0 = tf_vl.paragraphs[0]
    p_v0.text = "🎙️ LIVE VOICE DIALOGUE (< 400ms Latency)"
    p_v0.font.size = Pt(13)
    p_v0.font.bold = True
    p_v0.font.color.rgb = COLOR_BLUE

    p_v1 = tf_vl.add_paragraph()
    p_v1.text = "Merchant (Hindi Audio):\n\"आज दुकान के लिए क्या मंगवाना चाहिए?\"\n(\"What should I order for the shop today?\")"
    p_v1.font.size = Pt(13)
    p_v1.font.bold = True
    p_v1.font.color.rgb = COLOR_TEXT_DARK
    p_v1.space_before = Pt(12)

    p_v2 = tf_vl.add_paragraph()
    p_v2.text = "Paytm Growth Agent (Audio Reply):\n\"आज तापमान 42°C होने से कोल्ड ड्रिंक की मांग 20% बढ़ेगी। थम्स-अप और स्प्राइट के 2 क्रेट ज्यादा मंगवाना सही रहेगा।\"\n(\"Temp hitting 42°C will boost cold drink demand by 20%. Ordering 2 extra crates recommended.\")"
    p_v2.font.size = Pt(12.5)
    p_v2.font.bold = True
    p_v2.font.color.rgb = COLOR_NAVY
    p_v2.space_before = Pt(14)

    # Right: Languages
    v_right = s10.shapes.add_textbox(Inches(7.2), Inches(2.4), Inches(5.3), Inches(4.0))
    tf_vr = v_right.text_frame
    tf_vr.word_wrap = True
    p_vr0 = tf_vr.paragraphs[0]
    p_vr0.text = "Multilingual Coverage for India's Diversity:"
    p_vr0.font.size = Pt(18)
    p_vr0.font.bold = True
    p_vr0.font.color.rgb = COLOR_TEXT_DARK

    langs = [
        "🇮🇳 Hindi (हिन्दी) - Native dialect parsing",
        "🇮🇳 Tamil (தமிழ்) - South India retail terminology",
        "🇮🇳 Punjabi (ਪੰਜਾਬੀ) - Northern agricultural/mandi flows",
        "🇮🇳 Marathi (मराठी) - Maharashtra kirana support",
        "🇮🇳 Bengali (বাংলা) - Eastern FMCG trade vocabulary",
        "🇮🇳 Telugu & Kannada - Expanding regional coverage"
    ]
    for l in langs:
        p_l = tf_vr.add_paragraph()
        p_l.text = f"• {l}"
        p_l.font.size = Pt(13)
        p_l.font.color.rgb = COLOR_TEXT_MUTED
        p_l.space_before = Pt(8)

    # ==========================================
    # SLIDE 11: DEMAND FORECASTING ENGINE
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s11)
    add_header_footer(s11, 11)
    add_category_and_headline(s11, "Predictive AI", "Predict Tomorrow Before It Happens")

    f_box = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.0))
    f_box.fill.solid()
    f_box.fill.fore_color.rgb = COLOR_WHITE
    f_box.line.color.rgb = COLOR_BLUE
    tf_fb = f_box.text_frame
    tf_fb.word_wrap = True

    p_fb0 = tf_fb.paragraphs[0]
    p_fb0.text = "📥 MULTIVARIATE INPUT SIGNALS"
    p_fb0.font.size = Pt(14)
    p_fb0.font.bold = True
    p_fb0.font.color.rgb = COLOR_BLUE

    inputs = [
        "Historical UPI Sales: Seasonal hourly baselines",
        "Weather Forecasts: Temperature, rain & heatwaves",
        "Festival Calendars: Diwali, Eid, Holi demand spikes",
        "IPL & Cricket Matches: Evening beverage & snack surges",
        "Local Events & Traffic: Street closures & crowd flows"
    ]
    for inp in inputs:
        p_i = tf_fb.add_paragraph()
        p_i.text = f"✔ {inp}"
        p_i.font.size = Pt(12)
        p_i.font.color.rgb = COLOR_TEXT_DARK
        p_i.space_before = Pt(8)

    # Right: Forecast Output
    r_fb = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.4), Inches(5.7), Inches(4.0))
    r_fb.fill.solid()
    r_fb.fill.fore_color.rgb = RGBColor(240, 247, 255)
    r_fb.line.color.rgb = COLOR_BLUE
    tf_rf = r_fb.text_frame
    tf_rf.word_wrap = True

    p_rf0 = tf_rf.paragraphs[0]
    p_rf0.text = "🎯 ACCURATE ACTIONABLE PREDICTIONS"
    p_rf0.font.size = Pt(14)
    p_rf0.font.bold = True
    p_rf0.font.color.rgb = COLOR_NAVY

    preds = [
        ("Expected Revenue Curve", "₹19,200 estimated (+10% vs average weekday)"),
        ("Hourly Footfall Heatmap", "Peak rush: 6:00 PM – 8:30 PM (IPL match start)"),
        ("Item Replenishment List", "15 crates soft drinks + 25 chips cartons required"),
        ("Model Performance", "93.4% accuracy powered by LightGBM + Prophet")
    ]
    for t, d in preds:
        p_p1 = tf_rf.add_paragraph()
        p_p1.text = f"• {t}:"
        p_p1.font.size = Pt(13)
        p_p1.font.bold = True
        p_p1.font.color.rgb = COLOR_BLUE
        p_p1.space_before = Pt(10)

        p_p2 = tf_rf.add_paragraph()
        p_p2.text = f"  {d}"
        p_p2.font.size = Pt(12)
        p_p2.font.color.rgb = COLOR_TEXT_DARK

    # ==========================================
    # SLIDE 12: MERCHANT HEALTH SCORE
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s12)
    add_header_footer(s12, 12)
    add_category_and_headline(s12, "Proprietary Metric", "Merchant Health Score: CIBIL for Small Businesses")

    score_box = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.4), Inches(4.0), Inches(4.0))
    score_box.fill.solid()
    score_box.fill.fore_color.rgb = COLOR_WHITE
    score_box.line.color.rgb = COLOR_BLUE
    score_box.line.width = Pt(2)
    tf_sc = score_box.text_frame
    tf_sc.word_wrap = True
    p_sc0 = tf_sc.paragraphs[0]
    p_sc0.text = "HEALTH SCORE"
    p_sc0.font.size = Pt(14)
    p_sc0.font.bold = True
    p_sc0.font.color.rgb = COLOR_BLUE
    p_sc0.alignment = PP_ALIGN.CENTER

    p_sc1 = tf_sc.add_paragraph()
    p_sc1.text = "82"
    p_sc1.font.size = Pt(64)
    p_sc1.font.bold = True
    p_sc1.font.color.rgb = COLOR_BLUE
    p_sc1.alignment = PP_ALIGN.CENTER

    p_sc2 = tf_sc.add_paragraph()
    p_sc2.text = "OUT OF 100 • EXCELLENT"
    p_sc2.font.size = Pt(12)
    p_sc2.font.bold = True
    p_sc2.font.color.rgb = COLOR_GREEN
    p_sc2.alignment = PP_ALIGN.CENTER

    p_sc3 = tf_sc.add_paragraph()
    p_sc3.text = "Unlocks instant, pre-approved working capital loans with zero collateral."
    p_sc3.font.size = Pt(11)
    p_sc3.font.color.rgb = COLOR_TEXT_MUTED
    p_sc3.space_before = Pt(16)
    p_sc3.alignment = PP_ALIGN.CENTER

    # Right: 5 Pillars
    r_pil = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.2), Inches(2.4), Inches(7.3), Inches(4.0))
    r_pil.fill.solid()
    r_pil.fill.fore_color.rgb = COLOR_WHITE
    r_pil.line.color.rgb = COLOR_BORDER
    tf_rp = r_pil.text_frame
    tf_rp.word_wrap = True

    p_rp0 = tf_rp.paragraphs[0]
    p_rp0.text = "5 WEIGHTED SCORE PILLARS"
    p_rp0.font.size = Pt(14)
    p_rp0.font.bold = True
    p_rp0.font.color.rgb = COLOR_NAVY

    pillars_score = [
        ("Revenue Growth Trend", "88/100", "Consistent week-on-week expansion"),
        ("Inventory Health & Turn-rate", "76/100", "Low dead stock, minimal stockout days"),
        ("Customer Retention Rate", "84/100", "High proportion of returning UPI shoppers"),
        ("UPI Transaction Consistency", "90/100", "Predictable daily payment cadence"),
        ("Business Stability & Margin", "72/100", "Healthy buffer against supply shocks")
    ]
    for name, val, desc in pillars_score:
        p_p = tf_rp.add_paragraph()
        p_p.text = f"• {name} [{val}]: {desc}"
        p_p.font.size = Pt(12.5)
        p_p.font.color.rgb = COLOR_TEXT_DARK
        p_p.space_before = Pt(8)

    # ==========================================
    # SLIDE 13: LOST REVENUE DETECTOR
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s13)
    add_header_footer(s13, 13)
    add_category_and_headline(s13, "Revenue Leakage AI", "Identify Hidden Revenue Leakage Before It Compounds")

    cards_rev = [
        ("EXPECTED REVENUE", "₹18,000", "AI Friday Baseline", COLOR_BLUE),
        ("ACTUAL REVENUE", "₹12,000", "Settled UPI Amount", COLOR_AMBER),
        ("LOST OPPORTUNITY", "-₹6,000", "Detected Revenue Leakage", COLOR_RED)
    ]
    for i, (title, amt, sub, col) in enumerate(cards_rev):
        x = Inches(0.8 + i * 4.0)
        c = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.4), Inches(3.7), Inches(1.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = amt
        p2.font.size = Pt(28)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_DARK
        p3 = tf.add_paragraph()
        p3.text = sub
        p3.font.size = Pt(11)
        p3.font.color.rgb = COLOR_TEXT_MUTED

    # Bottom Diagnosis Box
    diag = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(11.7), Inches(1.9))
    diag.fill.solid()
    diag.fill.fore_color.rgb = RGBColor(254, 242, 242) # soft red tint
    diag.line.color.rgb = COLOR_RED
    tf_d = diag.text_frame
    tf_d.word_wrap = True
    p_d0 = tf_d.paragraphs[0]
    p_d0.text = "🔍 AI ROOT CAUSE DIAGNOSIS & RECOVERY ACTION"
    p_d0.font.size = Pt(13)
    p_d0.font.bold = True
    p_d0.font.color.rgb = COLOR_RED

    p_d1 = tf_d.add_paragraph()
    p_d1.text = "• 4:30 PM: Cold drinks and ice cream ran out of stock right as afternoon temperature reached 41°C. (Est. loss: ₹3,800)\n• 7:00 PM: UPI transaction drop correlated with sudden 30-min rain spell; zero delivery backup. (Est. loss: ₹2,200)\n✔ AI Recovery: Pre-orders inventory 12h prior to prevent recurring ₹6,000 weekly loss."
    p_d1.font.size = Pt(12)
    p_d1.font.color.rgb = COLOR_TEXT_DARK
    p_d1.space_before = Pt(6)

    # ==========================================
    # SLIDE 14: FROM RECOMMENDATION TO EXECUTION
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s14)
    add_header_footer(s14, 14)
    add_category_and_headline(s14, "Agentic AI", "True Agentic AI: The AI Does Not Just Advise. It Acts.")

    stages = [
        ("01", "Sales Drop Detected", "BI Agent detects 25% footfall dip during 3 PM lull.", COLOR_RED),
        ("02", "AI Drafts Campaign", "Crafts 5% cash-back promo on ₹200+ snacks basket.", COLOR_BLUE),
        ("03", "Merchant Approves", "1-tap WhatsApp prompt approval in under 5 seconds.", COLOR_BLUE),
        ("04", "Campaign Deployed", "Dispatched to nearby Paytm app users within 500m.", RGBColor(139, 92, 246)),
        ("05", "Revenue Surges", "+₹2,400 incremental sales achieved in 90 minutes.", COLOR_GREEN)
    ]
    for i, (num, title, desc, col) in enumerate(stages):
        x = Inches(0.8 + i * 2.4)
        c = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.6), Inches(2.2), Inches(3.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = f"STAGE {num}"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_DARK
        p2.space_before = Pt(8)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11.5)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_before = Pt(8)

    # ==========================================
    # SLIDE 15: TECHNICAL ARCHITECTURE
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s15, dark=True)
    add_header_footer(s15, 15, dark=True)
    add_category_and_headline(s15, "System Architecture", "Enterprise-Grade Multi-Agent Infrastructure", dark=True)

    arch_layers = [
        ("DATA SOURCES LAYER", "Paytm UPI Stream (Kafka)  |  DocAI Bill OCR  |  Shelf Vision  |  Weather & Event APIs"),
        ("DATA LAKEHOUSE", "PostgreSQL (Transactions)  |  MongoDB (Invoices)  |  Vector Store  |  Redis Session Cache"),
        ("⚡ LANGGRAPH AGENT CORE", "Deterministic StateGraph  |  7 Swarm Agents  |  State Checkpointing  |  Safety Guardrails"),
        ("LLM & PERCEPTION TIER", "DeepSeek / GPT-4o Mini  |  Qwen 2.5 (Vernacular)  |  LightGBM Forecast  |  YOLOv10 Vision"),
        ("DELIVERY INTERFACES", "WhatsApp Cloud API  |  Paytm Merchant App SDK  |  Vernacular AI Audio Calling")
    ]
    for i, (layer_name, components) in enumerate(arch_layers):
        y = Inches(2.2 + i * 0.9)
        is_core = ("LANGGRAPH" in layer_name)
        bar = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(0.75))
        bar.fill.solid()
        bar.fill.fore_color.rgb = COLOR_BLUE if is_core else COLOR_DARK_CARD
        bar.line.color.rgb = COLOR_BLUE
        tf = bar.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{layer_name}  ──  {components}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 16: TECH STACK
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s16)
    add_header_footer(s16, 16)
    add_category_and_headline(s16, "Engineering Specifications", "Built with Modern, Battle-Tested Frameworks")

    tech_categories = [
        ("BACKEND", "FastAPI & Node.js", "Asynchronous microservices & Celery queues"),
        ("DATABASES", "PostgreSQL & Mongo", "ACID transactions & flexible invoice storage"),
        ("AGENT CORE", "LangGraph", "Stateful deterministic multi-agent graphs"),
        ("LLM MODELS", "GPT-4o & Qwen 2.5", "High-speed reasoning & Indian vernacular"),
        ("VISION / OCR", "YOLOv10 & DocAI", "Zero-shot invoice extraction & shelf detection"),
        ("FORECASTING", "LightGBM & Prophet", "Gradient boosted multivariate time-series"),
        ("CHANNELS", "WhatsApp Cloud API", "Direct merchant engagement with 99.99% SLA"),
        ("CLOUD INFRA", "AWS ECS & Docker", "RBI-compliant secure localized deployment")
    ]
    for i, (cat, tech, desc) in enumerate(tech_categories):
        r = i // 4
        c = i % 4
        x = Inches(0.8 + c * 2.95)
        y = Inches(2.4 + r * 2.1)
        box = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.75), Inches(1.8))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_WHITE
        box.line.color.rgb = COLOR_BLUE if r == 0 else COLOR_GREEN
        tf = box.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = cat
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_BLUE if r == 0 else COLOR_GREEN

        p2 = tf.add_paragraph()
        p2.text = tech
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_DARK
        p2.space_before = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_before = Pt(4)

    # ==========================================
    # SLIDE 17: SCALABILITY
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s17)
    add_header_footer(s17, 17)
    add_category_and_headline(s17, "Massive Distribution", "Built to Scale to 10M+ Indian Merchants")

    scale_bar = s17.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.4), Inches(11.7), Inches(1.1))
    scale_bar.fill.solid()
    scale_bar.fill.fore_color.rgb = COLOR_WHITE
    scale_bar.line.color.rgb = COLOR_BLUE
    tf_sb = scale_bar.text_frame
    tf_sb.word_wrap = True
    p_sb = tf_sb.paragraphs[0]
    p_sb.text = "1 Pilot Store   →   1,000 Noida Cluster   →   100,000 Metro Launch   →   10,000,000+ Pan-India"
    p_sb.font.size = Pt(16)
    p_sb.font.bold = True
    p_sb.font.color.rgb = COLOR_BLUE
    p_sb.alignment = PP_ALIGN.CENTER

    scale_pillars = [
        ("No New App", "Lives inside WhatsApp and Paytm for Business already installed on 30M+ merchant devices."),
        ("No Hardware Costs", "Zero barcode scanners or POS terminals. Uses smartphone camera and existing Soundbox."),
        ("Zero Merchant Training", "Intuitive WhatsApp prompts and vernacular voice notes match natural human habits.")
    ]
    for i, (title, desc) in enumerate(scale_pillars):
        x = Inches(0.8 + i * 4.0)
        box = s17.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(3.8), Inches(3.7), Inches(2.6))
        box.fill.solid()
        box.fill.fore_color.rgb = COLOR_WHITE
        box.line.color.rgb = COLOR_BORDER
        tf = box.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_TEXT_DARK

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(8)

    # ==========================================
    # SLIDE 18: BUSINESS IMPACT
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s18)
    add_header_footer(s18, 18)
    add_category_and_headline(s18, "ROI & Ecosystem Moat", "Transformative ROI for Merchants & Strategic Moat for Paytm")

    # Left: Merchant
    m_box = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.0))
    m_box.fill.solid()
    m_box.fill.fore_color.rgb = COLOR_WHITE
    m_box.line.color.rgb = COLOR_GREEN
    m_box.line.width = Pt(2)
    tf_mb = m_box.text_frame
    tf_mb.word_wrap = True

    p_m0 = tf_mb.paragraphs[0]
    p_m0.text = "FOR MERCHANTS (THE PROMISE)"
    p_m0.font.size = Pt(14)
    p_m0.font.bold = True
    p_m0.font.color.rgb = COLOR_GREEN

    m_impacts = [
        ("+18% Revenue Growth", "From automated cross-sells & demand capture"),
        ("-45% Stock-Out Reduction", "Eliminating missed sales on fast-moving items"),
        ("+25% Customer Retention", "Smart automated loyalty & cashback triggers"),
        ("Peace of Mind", "Proactive inventory & daily financial clarity")
    ]
    for t, d in m_impacts:
        p1 = tf_mb.add_paragraph()
        p1.text = f"• {t}: {d}"
        p1.font.size = Pt(13)
        p1.font.color.rgb = COLOR_TEXT_DARK
        p1.space_before = Pt(10)

    # Right: Paytm
    p_box = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.4), Inches(5.7), Inches(4.0))
    p_box.fill.solid()
    p_box.fill.fore_color.rgb = COLOR_WHITE
    p_box.line.color.rgb = COLOR_BLUE
    p_box.line.width = Pt(2)
    tf_pb = p_box.text_frame
    tf_pb.word_wrap = True

    p_p0 = tf_pb.paragraphs[0]
    p_p0.text = "FOR PAYTM (THE MOAT)"
    p_p0.font.size = Pt(14)
    p_p0.font.bold = True
    p_p0.font.color.rgb = COLOR_BLUE

    p_impacts = [
        ("+35% Merchant App DAU", "Daily active engagement via daily morning brief"),
        ("3x QR & Soundbox Retention", "Immense switching cost against PhonePe/GPay"),
        ("New SaaS & Fintech Revenue", "AI subscriptions & loan origination fees"),
        ("Unmatched Data Flywheel", "India's deepest localized retail demand dataset")
    ]
    for t, d in p_impacts:
        p1 = tf_pb.add_paragraph()
        p1.text = f"• {t}: {d}"
        p1.font.size = Pt(13)
        p1.font.color.rgb = COLOR_TEXT_DARK
        p1.space_before = Pt(10)

    # ==========================================
    # SLIDE 19: FUTURE ROADMAP
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s19)
    add_header_footer(s19, 19)
    add_category_and_headline(s19, "Execution Roadmap", "5-Phase Evolution Plan")

    phases = [
        ("Phase 1 (MVP)", "Merchant Insights", "Daily settlement summaries & UPI trend reports via WhatsApp."),
        ("Phase 2", "Predictive Engine", "Footfall hourly forecast, weather alerts & festival readiness."),
        ("Phase 3", "Inventory AI", "Supplier invoice OCR + shelf image stock tracking & PO generator."),
        ("Phase 4", "Campaign Runner", "Automated hyperlocal Paytm app promos & cashback blasts."),
        ("Phase 5", "Autonomous Co-pilot", "Fully autonomous business co-pilot managing procurement & credit.")
    ]
    for i, (ph_name, ph_title, ph_desc) in enumerate(phases):
        x = Inches(0.8 + i * 2.4)
        c = s19.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.6), Inches(2.2), Inches(3.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = COLOR_GREEN if "5" in ph_name else COLOR_BLUE
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = ph_name
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_GREEN if "5" in ph_name else COLOR_BLUE

        p2 = tf.add_paragraph()
        p2.text = ph_title
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_TEXT_DARK
        p2.space_before = Pt(8)

        p3 = tf.add_paragraph()
        p3.text = ph_desc
        p3.font.size = Pt(11.5)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_before = Pt(8)

    # ==========================================
    # SLIDE 20: CLOSING
    # ==========================================
    s20 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s20, dark=True)
    add_header_footer(s20, 20, dark=True)

    c_box20 = s20.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.3), Inches(4.5))
    tf20 = c_box20.text_frame
    tf20.word_wrap = True

    p20_0 = tf20.paragraphs[0]
    p20_0.text = "FROM PAYMENTS TO GROWTH"
    p20_0.font.size = Pt(13)
    p20_0.font.bold = True
    p20_0.font.color.rgb = RGBColor(56, 189, 248)
    p20_0.alignment = PP_ALIGN.CENTER

    p20_1 = tf20.add_paragraph()
    p20_1.text = "Every Indian Merchant Deserves an\nAI Business Teammate."
    p20_1.font.size = Pt(40)
    p20_1.font.bold = True
    p20_1.font.color.rgb = COLOR_WHITE
    p20_1.space_before = Pt(14)
    p20_1.alignment = PP_ALIGN.CENTER

    p20_2 = tf20.add_paragraph()
    p20_2.text = "Paytm Merchant Growth Agent transforms payment data into everyday business growth."
    p20_2.font.size = Pt(18)
    p20_2.font.color.rgb = RGBColor(148, 163, 184)
    p20_2.space_before = Pt(16)
    p20_2.alignment = PP_ALIGN.CENTER

    p20_3 = tf20.add_paragraph()
    p20_3.text = "OBSERVE → UNDERSTAND → PREDICT → RECOMMEND → EXECUTE"
    p20_3.font.size = Pt(14)
    p20_3.font.bold = True
    p20_3.font.color.rgb = COLOR_WHITE
    p20_3.space_before = Pt(24)
    p20_3.alignment = PP_ALIGN.CENTER

    output_path = "Paytm_Merchant_Growth_Agent_Pitch_Deck.pptx"
    prs.save(output_path)
    print(f"Successfully generated {output_path} with 20 slides!")

if __name__ == "__main__":
    build_presentation()
