import re

with open("generate_deck_html.py", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add CSS for Slide 6 (Features & User Flow)
css_flow = """
  /* =================================================================
     SLIDE 6: WHAT WE PROVIDE & REAL-WORLD USER FLOW
     ================================================================= */
  #slide-6 {
    background: #231F20;
  }

  .s-flow-header {
    position: absolute;
    top: 95px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }

  .s-flow-content {
    position: absolute;
    top: 200px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 440px 1fr;
    gap: 32px;
    z-index: 10;
  }

  .s-flow-features-card {
    background: #2A2627;
    border-radius: 28px;
    padding: 24px 22px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 515px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .s-flow-features-title {
    font-size: 21px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }

  .s-flow-features-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .s-flow-feat-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13.5px;
    line-height: 1.4;
    color: #cbd5e1;
  }

  .s-flow-feat-item strong {
    color: #ffffff;
  }

  .s-flow-feat-icon {
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
  }

  .s-flow-emergency-box {
    background: rgba(0, 119, 252, 0.14);
    border: 1px solid rgba(0, 119, 252, 0.35);
    border-radius: 16px;
    padding: 13px 15px;
    font-size: 12.8px;
    color: #cbd5e1;
    line-height: 1.42;
  }

  .s-flow-emergency-box strong {
    color: #4BA0FF;
  }

  .s-flow-timeline-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .s-flow-step-card {
    background: #2A2627;
    border-radius: 20px;
    padding: 16px 18px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 152px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .s-flow-step-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 7px;
  }

  .s-flow-time-pill {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.03em;
  }

  .pill-blue { background: rgba(0, 119, 252, 0.2); color: #4BA0FF; border: 1px solid rgba(0, 119, 252, 0.4); }
  .pill-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
  .pill-green { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }

  .s-flow-step-title {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }

  .s-flow-step-body {
    font-size: 12.8px;
    line-height: 1.42;
    color: #cbd5e1;
  }

  .s-flow-step-body strong {
    color: #ffffff;
  }
"""

# Insert css_flow before /* ================================================================= SLIDE 6: TECHNICAL ARCHITECTURE
target_css_marker = "/* =================================================================\n     SLIDE 6: TECHNICAL ARCHITECTURE"
if target_css_marker not in content:
    # try single line search
    idx = content.find("SLIDE 6: TECHNICAL ARCHITECTURE")
    print("Found marker at:", idx)

content = content.replace("/* =================================================================\n     SLIDE 6: TECHNICAL ARCHITECTURE", css_flow + "\n  /* =================================================================\n     SLIDE 7: TECHNICAL ARCHITECTURE")

# Update Slide 6 in CSS to Slide 7
content = content.replace("#slide-6 {{", "#slide-7 {{")
content = content.replace("#slide-7 {{", "#slide-8 {{", 1)
content = content.replace("#slide-8 {{", "#slide-9 {{", 1)
content = content.replace("#slide-9 {{", "#slide-10 {{", 1)
content = content.replace("#slide-10 {{", "#slide-11 {{", 1)
content = content.replace("#slide-11 {{", "#slide-12 {{", 1)
content = content.replace("#slide-12 {{", "#slide-13 {{", 1)
content = content.replace("#slide-13 {{", "#slide-14 {{", 1)
content = content.replace("#slide-14 {{", "#slide-15 {{", 1)
content = content.replace("#slide-15 {{", "#slide-16 {{", 1)

# Slide 6 HTML
html_slide_6 = """
  <!-- ===============================================================
       SLIDE 6: WHAT WE PROVIDE & REAL-WORLD USER FLOW (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-6">
    <header class="slide-header">
      <div class="header-left">
        <svg class="logo-sunburst" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="4" fill="#0077FC"/>
          <path d="M16 2V6M16 26V30M2 16H6M26 16H30M6.1 6.1L8.9 8.9M23.1 23.1L25.9 25.9M6.1 25.9L8.9 23.1M23.1 8.9L25.9 6.1" stroke="#0077FC" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="brand-text">Paytm</span>
      </div>
      <div class="header-right">
        <span class="year-pill">2026</span>
        <div class="arrow-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
      </div>
    </header>

    <div class="s-flow-header">
      <h2 class="display-title-dark">What We Provide & Kirana User Flow</h2>
      <p class="slide-subhead-dark">A Day in the Life: How the Paytm Growth Agent Partners with Store Owners from 06:30 AM to 10:30 PM</p>
    </div>

    <div class="s-flow-content">
      <!-- Left Column: What We Provide -->
      <div class="s-flow-features-card">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #0077FC; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Feature Ecosystem</div>
          <div class="s-flow-features-title">Core Capabilities Provided</div>
          <div class="s-flow-features-list">
            <div class="s-flow-feat-item">
              <div class="s-flow-feat-icon">✓</div>
              <div><strong>Proactive WhatsApp Intelligence:</strong> Automated daily morning & evening briefings delivered into existing habits—zero new apps.</div>
            </div>
            <div class="s-flow-feat-item">
              <div class="s-flow-feat-icon">✓</div>
              <div><strong>Real-Time UPI Telemetry:</strong> Live stream monitoring payment velocity, customer purchase frequency, and sudden volume anomalies.</div>
            </div>
            <div class="s-flow-feat-item">
              <div class="s-flow-feat-icon">✓</div>
              <div><strong>Pre-Rush Footfall Warning:</strong> Anticipates peak rush hours 2 hours in advance to prep fast-moving items and avoid stockouts.</div>
            </div>
            <div class="s-flow-feat-item">
              <div class="s-flow-feat-icon">✓</div>
              <div><strong>Automated Retention Campaigns:</strong> AI identifies churn risks and sends 1-tap WhatsApp cashback offers driving repeat visits.</div>
            </div>
            <div class="s-flow-feat-item">
              <div class="s-flow-feat-icon">✓</div>
              <div><strong>Multimodal Shelf & Bill OCR:</strong> Snaps of shelves or supplier invoices automatically update stock and draft best-rate wholesaler POs.</div>
            </div>
          </div>
        </div>

        <!-- Emergency Support Box -->
        <div class="s-flow-emergency-box">
          🚨 <strong>Emergency & Business Safety Net:</strong> In unexpected sales crashes, supplier disputes, or working capital crunches, the AI activates emergency protocol—instant pre-approved Paytm credit line + alternative wholesaler dispatch.
        </div>
      </div>

      <!-- Right Column: 6-Step Chronological User Flow -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 700; color: #4BA0FF; text-transform: uppercase; letter-spacing: 0.05em;">Real-World Scenario</div>
          <div style="font-size: 13.5px; color: #94a3b8;">A Day with Rameshji (Gupta Kirana Store)</div>
        </div>

        <div class="s-flow-timeline-grid">
          <!-- Step 1: 06:30 AM -->
          <div class="s-flow-step-card">
            <div class="s-flow-step-top">
              <span class="s-flow-time-pill pill-blue">06:30 AM</span>
              <span class="s-flow-step-title">Wakeup Briefing</span>
            </div>
            <div class="s-flow-step-body">
              Rameshji checks WhatsApp: <strong>₹18,450 sales yesterday</strong> (+18%). 42°C heatwave alert predicts <strong>+35% cold drink spike</strong>; advises stocking ice & 3 crates of cola before store opening.
            </div>
          </div>

          <!-- Step 2: 11:00 AM -->
          <div class="s-flow-step-card">
            <div class="s-flow-step-top">
              <span class="s-flow-time-pill pill-blue">11:00 AM</span>
              <span class="s-flow-step-title">Real-Time Telemetry</span>
            </div>
            <div class="s-flow-step-body">
              AI tracks 85+ live Paytm QR payments. Ingests payment velocity silently; flags an anomalous ₹14 wholesaler overcharge on cooking oil benchmarked across 5 local stores.
            </div>
          </div>

          <!-- Step 3: 04:30 PM -->
          <div class="s-flow-step-card">
            <div class="s-flow-step-top">
              <span class="s-flow-time-pill pill-amber">04:30 PM</span>
              <span class="s-flow-step-title">Pre-Peak Rush Alert</span>
            </div>
            <div class="s-flow-step-body">
              Proactive alert 2.5 hours before 7 PM rush: <em>“Evening milk & bread stock low. Tuesday footfall surges in 150 mins—restock front counter now to prevent ₹2,800 stockout loss.”</em>
            </div>
          </div>

          <!-- Step 4: 06:00 PM -->
          <div class="s-flow-step-card">
            <div class="s-flow-step-top">
              <span class="s-flow-time-pill pill-green">06:00 PM</span>
              <span class="s-flow-step-title">1-Tap Retention Offer</span>
            </div>
            <div class="s-flow-step-body">
              AI detects 18 weekly regulars slipping away (12 days absent). Generates personalized 5% cashback message. Rameshji reviews on WhatsApp and taps <strong>“Approve & Send”</strong> in 1 second.
            </div>
          </div>

          <!-- Step 5: 08:30 PM -->
          <div class="s-flow-step-card">
            <div class="s-flow-step-top">
              <span class="s-flow-time-pill pill-blue">08:30 PM</span>
              <span class="s-flow-step-title">Shelf OCR & Reorder</span>
            </div>
            <div class="s-flow-step-body">
              Rameshji snaps a photo of empty Atta shelves. Vision OCR extracts deficit (40 kg), benchmarks cheapest distributor (₹38/kg), and prepares purchase order for 1-tap reorder.
            </div>
          </div>

          <!-- Step 6: 10:30 PM -->
          <div class="s-flow-step-card">
            <div class="s-flow-step-top">
              <span class="s-flow-time-pill pill-blue">10:30 PM</span>
              <span class="s-flow-step-title">Night Closing & Safety</span>
            </div>
            <div class="s-flow-step-body">
              Day closing P&L: ₹24,200 revenue. Weekly Growth Health Score rises to 88/100. Emergency credit safety net active with instant ₹2,50,000 Paytm business loan ready on tap.
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 06</span>
    </footer>
  </section>
"""

# Insert html_slide_6 before SLIDE 6: TECHNICAL ARCHITECTURE DIAGRAM
target_html_marker = "<!-- ===============================================================\n       SLIDE 6: TECHNICAL ARCHITECTURE DIAGRAM (DARK)"
content = content.replace(target_html_marker, html_slide_6 + "\n  <!-- ===============================================================\n       SLIDE 7: TECHNICAL ARCHITECTURE DIAGRAM (DARK)")

# Update section IDs and page numbers for slides 7 through 16
content = content.replace('<section class="slide theme-dark" id="slide-6">', '<section class="slide theme-dark" id="slide-7">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 06</span>', '<span class="footer-page"><strong>Page</strong> 07</span>', 1)

content = content.replace('<section class="slide theme-light" id="slide-7">', '<section class="slide theme-light" id="slide-8">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 07</span>', '<span class="footer-page"><strong>Page</strong> 08</span>', 1)

content = content.replace('<section class="slide theme-dark" id="slide-8">', '<section class="slide theme-dark" id="slide-9">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 08</span>', '<span class="footer-page"><strong>Page</strong> 09</span>', 1)

content = content.replace('<section class="slide theme-light" id="slide-9">', '<section class="slide theme-light" id="slide-10">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 09</span>', '<span class="footer-page"><strong>Page</strong> 10</span>', 1)

content = content.replace('<section class="slide theme-dark" id="slide-10">', '<section class="slide theme-dark" id="slide-11">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 10</span>', '<span class="footer-page"><strong>Page</strong> 11</span>', 1)

content = content.replace('<section class="slide theme-light" id="slide-11">', '<section class="slide theme-light" id="slide-12">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 11</span>', '<span class="footer-page"><strong>Page</strong> 12</span>', 1)

content = content.replace('<section class="slide theme-dark" id="slide-12">', '<section class="slide theme-dark" id="slide-13">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 12</span>', '<span class="footer-page"><strong>Page</strong> 13</span>', 1)

content = content.replace('<section class="slide theme-light" id="slide-13">', '<section class="slide theme-light" id="slide-14">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 13</span>', '<span class="footer-page"><strong>Page</strong> 14</span>', 1)

content = content.replace('<section class="slide theme-dark" id="slide-14">', '<section class="slide theme-dark" id="slide-15">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 14</span>', '<span class="footer-page"><strong>Page</strong> 15</span>', 1)

content = content.replace('<section class="slide theme-light" id="slide-15">', '<section class="slide theme-light" id="slide-16">', 1)
content = content.replace('<span class="footer-page"><strong>Page</strong> 15</span>', '<span class="footer-page"><strong>Page</strong> 16</span>', 1)

with open("generate_deck_html.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated generate_deck_html.py with 16 slides!")
