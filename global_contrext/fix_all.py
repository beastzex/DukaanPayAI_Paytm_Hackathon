import re

with open("generate_deck_html.py", "r", encoding="utf-8") as f:
    code = f.read()

# Split CSS and HTML at </style>
parts = code.split("</style>")
css_part = parts[0]
html_part = parts[1]

# In css_part:
# 1. Slide 6 CSS block: fix single braces to double braces
# Let's define the clean Slide 6 CSS with double braces:
clean_s6_css = """
  /* =================================================================
     SLIDE 6: WHAT WE PROVIDE & REAL-WORLD USER FLOW
     ================================================================= */
  #slide-6 {{
    background: #231F20;
  }}

  .s-flow-header {{
    position: absolute;
    top: 95px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s-flow-content {{
    position: absolute;
    top: 200px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 440px 1fr;
    gap: 32px;
    z-index: 10;
  }}

  .s-flow-features-card {{
    background: #2A2627;
    border-radius: 28px;
    padding: 24px 22px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 515px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .s-flow-features-title {{
    font-size: 21px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }}

  .s-flow-features-list {{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }}

  .s-flow-feat-item {{
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13.5px;
    line-height: 1.4;
    color: #cbd5e1;
  }}

  .s-flow-feat-item strong {{
    color: #ffffff;
  }}

  .s-flow-feat-icon {{
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background: rgba(0, 119, 252, 0.2);
    color: #4BA0FF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
    margin-top: 1px;
  }}

  .s-flow-emergency-box {{
    background: rgba(0, 119, 252, 0.14);
    border: 1px solid rgba(0, 119, 252, 0.35);
    border-radius: 16px;
    padding: 13px 15px;
    font-size: 12.8px;
    color: #cbd5e1;
    line-height: 1.42;
  }}

  .s-flow-emergency-box strong {{
    color: #4BA0FF;
  }}

  .s-flow-timeline-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }}

  .s-flow-step-card {{
    background: #2A2627;
    border-radius: 20px;
    padding: 16px 18px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 152px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }}

  .s-flow-step-top {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 7px;
  }}

  .s-flow-time-pill {{
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.03em;
  }}

  .pill-blue {{ background: rgba(0, 119, 252, 0.2); color: #4BA0FF; border: 1px solid rgba(0, 119, 252, 0.4); }}
  .pill-amber {{ background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }}
  .pill-green {{ background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }}

  .s-flow-step-title {{
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }}

  .s-flow-step-body {{
    font-size: 12.8px;
    line-height: 1.42;
    color: #cbd5e1;
  }}

  .s-flow-step-body strong {{
    color: #ffffff;
  }}
"""

# Replace the existing Slide 6 CSS in css_part
s6_pattern = re.compile(r'/\* =+\s*SLIDE 6: WHAT WE PROVIDE & REAL-WORLD USER FLOW\s*=+ \*/[\s\S]*?(?=/\* =+\s*SLIDE 7: TECHNICAL ARCHITECTURE)', re.MULTILINE)
if s6_pattern.search(css_part):
    css_part = s6_pattern.sub(clean_s6_css + "\n", css_part)
    print("Replaced Slide 6 CSS with double braces")
else:
    print("WARNING: Could not find Slide 6 CSS block pattern!")

# Fix CSS slide IDs in css_part
# Slide 7 was Technical Architecture (originally slide 6), its CSS selector was accidentally changed to #slide-16
css_part = css_part.replace("#slide-16 {{\n    background: #191718;", "#slide-7 {{\n    background: #191718;")

# Let's check all slide selectors in css_part after slide 7:
# Currently:
# Multi-agent (Slide 8): #slide-7 {{ background: #ffffff;
# Ingestion (Slide 9): #slide-8 {{ background: #231F20;
# WhatsApp (Slide 10): #slide-9 {{ background: #ffffff;
# Voice (Slide 11): #slide-10 {{ background: #231F20;
# Predictive (Slide 12): #slide-11 {{ background: #ffffff;
# Health Score (Slide 13): #slide-12 {{ background: #231F20;
# Tech Stack (Slide 14): #slide-13 {{ background: #ffffff;
# Unit Econ (Slide 15): #slide-14 {{ background: #231F20;
# Roadmap (Slide 16): #slide-15 {{ background: #ffffff;

# We need to shift these selectors from slide 15 down to slide 7
css_part = css_part.replace("#slide-15 {{\n    background: #ffffff;", "#slide-16 {{\n    background: #ffffff;")
css_part = css_part.replace("#slide-14 {{\n    background: #231F20;", "#slide-15 {{\n    background: #231F20;")
css_part = css_part.replace("#slide-13 {{\n    background: #ffffff;", "#slide-14 {{\n    background: #ffffff;")
css_part = css_part.replace("#slide-12 {{\n    background: #231F20;", "#slide-13 {{\n    background: #231F20;")
css_part = css_part.replace("#slide-11 {{\n    background: #ffffff;", "#slide-12 {{\n    background: #ffffff;")
css_part = css_part.replace("#slide-10 {{\n    background: #231F20;", "#slide-11 {{\n    background: #231F20;")
css_part = css_part.replace("#slide-9 {{\n    background: #ffffff;", "#slide-10 {{\n    background: #ffffff;")
css_part = css_part.replace("#slide-8 {{\n    background: #231F20;", "#slide-9 {{\n    background: #231F20;")
css_part = css_part.replace("#slide-7 {{\n    background: #ffffff;", "#slide-8 {{\n    background: #ffffff;")

# Now in html_part:
# Find all <section class="slide ..."> blocks and reconstruct them cleanly
# The 16 slide sections in html_part are:
# 1: Cover (id="slide-1", no footer)
# 2: Problem (id="slide-2", Page 02)
# 3: Friction (id="slide-3", Page 03)
# 4: Opportunity (id="slide-4", Page 04)
# 5: Solution Loop (id="slide-5", Page 05)
# 6: What We Provide & User Flow (id="slide-6", Page 06)
# 7: Technical Architecture (id="slide-7", Page 07)
# 8: Multi-Agent Ecosystem (id="slide-8", Page 08)
# 9: Multimodal Ingestion (id="slide-9", Page 09)
# 10: WhatsApp OS & Retention (id="slide-10", Page 10)
# 11: Voice AI & Indic (id="slide-11", Page 11)
# 12: Predictive Demand (id="slide-12", Page 12)
# 13: Merchant Health Score (id="slide-13", Page 13)
# 14: Tech Stack (id="slide-14", Page 14)
# 15: Business Model (id="slide-15", Page 15)
# 16: Roadmap & Closing (id="slide-16", Page 16)

# Let's inspect how section tags are currently written in html_part
# Specifically, replace the section IDs and footers for slides 6-16:
# Currently in html_part:
# Slide 6 has id="slide-7" and Page 16
# Slide 7 (Tech Arch) has id="slide-6" and Page 06
# Slide 8 has id="slide-8" and Page 07
# Slide 9 has id="slide-9" and Page 08
# Slide 10 has id="slide-10" and Page 09
# Slide 11 has id="slide-11" and Page 10
# Slide 12 has id="slide-12" and Page 11
# Slide 13 has id="slide-13" and Page 12
# Slide 14 has id="slide-14" and Page 13
# Slide 15 has id="slide-15" and Page 14
# Slide 16 has id="slide-16" and Page 15

# Fix Slide 6 section ID and footer:
html_part = html_part.replace(
    '<!-- ===============================================================\n       SLIDE 6: WHAT WE PROVIDE & REAL-WORLD USER FLOW (DARK)\n       =============================================================== -->\n  <section class="slide theme-dark" id="slide-7">',
    '<!-- ===============================================================\n       SLIDE 6: WHAT WE PROVIDE & REAL-WORLD USER FLOW (DARK)\n       =============================================================== -->\n  <section class="slide theme-dark" id="slide-6">'
)
html_part = html_part.replace(
    '<span class="footer-url">paytm.com/business • Team Sentinels</span>\n      <span class="footer-page"><strong>Page</strong> 16</span>\n    </footer>\n  </section>\n\n  <!-- ===============================================================\n       SLIDE 7: TECHNICAL ARCHITECTURE DIAGRAM (DARK)',
    '<span class="footer-url">paytm.com/business • Team Sentinels</span>\n      <span class="footer-page"><strong>Page</strong> 06</span>\n    </footer>\n  </section>\n\n  <!-- ===============================================================\n       SLIDE 7: TECHNICAL ARCHITECTURE DIAGRAM (DARK)'
)

# Fix Slide 7 (Technical Architecture) section ID and footer:
html_part = html_part.replace(
    '<!-- ===============================================================\n       SLIDE 7: TECHNICAL ARCHITECTURE DIAGRAM (DARK)\n       =============================================================== -->\n  <section class="slide theme-dark" id="slide-6">',
    '<!-- ===============================================================\n       SLIDE 7: TECHNICAL ARCHITECTURE DIAGRAM (DARK)\n       =============================================================== -->\n  <section class="slide theme-dark" id="slide-7">'
)
html_part = html_part.replace(
    '<span class="footer-url">paytm.com/business • Team Sentinels</span>\n      <span class="footer-page"><strong>Page</strong> 06</span>\n    </footer>\n  </section>\n\n  <!-- ===============================================================\n       SLIDE 7: THE MULTI-AGENT ECOSYSTEM',
    '<span class="footer-url">paytm.com/business • Team Sentinels</span>\n      <span class="footer-page"><strong>Page</strong> 07</span>\n    </footer>\n  </section>\n\n  <!-- ===============================================================\n       SLIDE 8: THE MULTI-AGENT ECOSYSTEM'
)

# Update comment headers for slides 8-16 in html_part
slide_comment_updates = [
    ("SLIDE 7: THE MULTI-AGENT ECOSYSTEM", "SLIDE 8: THE MULTI-AGENT ECOSYSTEM"),
    ("SLIDE 8: ZERO-FRICTION MULTIMODAL INGESTION", "SLIDE 9: ZERO-FRICTION MULTIMODAL INGESTION"),
    ("SLIDE 9: WHATSAPP AS THE OS", "SLIDE 10: WHATSAPP AS THE OS"),
    ("SLIDE 10: VOICE AI & INDIC LANGUAGES", "SLIDE 11: VOICE AI & INDIC LANGUAGES"),
    ("SLIDE 11: PREDICTIVE DEMAND & LOST REVENUE", "SLIDE 12: PREDICTIVE DEMAND & LOST REVENUE"),
    ("SLIDE 12: MERCHANT HEALTH SCORE & LENDING", "SLIDE 13: MERCHANT HEALTH SCORE & LENDING"),
    ("SLIDE 13: ENTERPRISE TECH STACK & SCALABILITY", "SLIDE 14: ENTERPRISE TECH STACK & SCALABILITY"),
    ("SLIDE 14: BUSINESS MODEL & MONETIZATION", "SLIDE 15: BUSINESS MODEL & MONETIZATION"),
    ("SLIDE 15: ROADMAP & CLOSING VISION", "SLIDE 16: ROADMAP & CLOSING VISION"),
]
for old_com, new_com in slide_comment_updates:
    html_part = html_part.replace(old_com, new_com)

# Update footers for slides 8 through 16:
# Currently footers in those slides are Page 07, 08, 09, 10, 11, 12, 13, 14, 15
# They must become Page 08, 09, 10, 11, 12, 13, 14, 15, 16
# Replace in reverse order so no cascading overlap happens!
for p in range(15, 6, -1):
    old_f = f'<strong>Page</strong> {p:02d}</span>'
    new_f = f'<strong>Page</strong> {p+1:02d}</span>'
    html_part = html_part.replace(old_f, new_f, 1)

new_code = css_part + "</style>" + html_part

with open("generate_deck_html.py", "w", encoding="utf-8") as f:
    f.write(new_code)

print("generate_deck_html.py updated successfully!")
