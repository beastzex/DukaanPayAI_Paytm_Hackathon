import os
import base64
import subprocess
import fitz  # PyMuPDF

print("Preparing assets for base64 encoding for 10-slide master deck...")

def get_base64_image(path):
    if not os.path.exists(path):
        print(f"Warning: {path} not found!")
        return ""
    ext = path.split('.')[-1].lower()
    mime = "image/png" if ext == "png" else "image/jpeg"
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode('utf-8')
    return f"data:{mime};base64,{data}"

b64_p1_clean = get_base64_image("ref_extracted_images/p1_clean_bg.png")
b64_kirana_hero = get_base64_image("kirana_merchant_hero.jpg")
b64_retail_future = get_base64_image("indian_retail_future.jpg")
b64_arch = get_base64_image("architecture_diagram.png")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1440, height=810, initial-scale=1.0">
<title>Paytm Merchant Growth Agent - Pitch Deck</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0d0f12;
    color: #231F20;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }}

  @page {{
    size: 1440px 810px;
    margin: 0;
  }}

  @media print {{
    html, body {{
      background: #ffffff;
      width: 1440px;
      height: 810px;
    }}
    .slide {{
      page-break-after: always;
      page-break-inside: avoid;
    }}
  }}

  .deck-wrapper {{
    width: 1440px;
    margin: 0 auto;
  }}

  .slide {{
    width: 1440px;
    height: 810px;
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
  }}

  /* Theme Styles */
  .theme-light {{
    background: #ffffff;
    color: #231F20;
  }}

  .theme-dark {{
    background: #231F20;
    color: #ffffff;
  }}

  /* Slide Header */
  .slide-header {{
    position: absolute;
    top: 40px;
    left: 74px;
    right: 74px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 20;
  }}

  .header-left {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}

  .logo-sunburst {{
    width: 32px;
    height: 32px;
  }}

  .brand-text {{
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }}

  .theme-light .brand-text {{ color: #231F20; }}
  .theme-dark .brand-text {{ color: #ffffff; }}

  .header-right {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}

  .year-pill {{
    padding: 6px 18px;
    border-radius: 999px;
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }}

  .theme-light .year-pill {{
    background: #231F20;
    color: #ffffff;
  }}

  .theme-dark .year-pill {{
    background: #000000;
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.12);
  }}

  .arrow-btn {{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0077FC;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }}

  .arrow-btn svg {{
    width: 15px;
    height: 15px;
    stroke-width: 2.4;
  }}

  /* Universal Slide Titles */
  .display-title-light {{
    font-size: 44px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.12;
    color: #231F20;
    margin-bottom: 6px;
  }}

  .display-title-dark {{
    font-size: 44px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.12;
    color: #ffffff;
    margin-bottom: 6px;
  }}

  .slide-subhead-light {{
    font-size: 15.5px;
    color: #555555;
    font-weight: 400;
    line-height: 1.4;
  }}

  .slide-subhead-dark {{
    font-size: 15.5px;
    color: #cbd5e1;
    font-weight: 400;
    line-height: 1.4;
  }}

  /* Universal Slide Footer */
  .slide-footer {{
    position: absolute;
    bottom: 32px;
    left: 74px;
    right: 74px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12.5px;
    padding-top: 14px;
    border-top: 1px solid rgba(0,0,0,0.08);
    z-index: 20;
  }}

  .theme-dark .slide-footer {{
    border-top: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8;
  }}

  .theme-light .slide-footer {{
    color: #64748b;
  }}

  .footer-page strong {{
    font-weight: 700;
  }}

  /* =================================================================
     SLIDE 1: COVER (LIGHT)
     ================================================================= */
  #slide-1 {{
    background-image: url('{b64_p1_clean}');
    background-size: cover;
    background-position: center;
  }}

  .s1-brand-text {{
    position: absolute;
    top: 50px;
    left: 122px;
    font-size: 26px;
    font-weight: 800;
    color: #231F20;
    letter-spacing: -0.02em;
    z-index: 20;
  }}

  .s1-year-text {{
    position: absolute;
    top: 52px;
    right: 120px;
    width: 104px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.04em;
    z-index: 20;
  }}

  .s1-content {{
    position: absolute;
    top: 124px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s1-badges-row {{
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }}

  .s1-track-pill {{
    display: inline-flex;
    align-items: center;
    background: #0077FC;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 7px 18px;
    border-radius: 999px;
    box-shadow: 0 4px 15px rgba(0, 119, 252, 0.3);
  }}

  .s1-project-pill {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    color: #475569;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 6px 16px;
    border-radius: 999px;
  }}

  .s1-project-pill strong {{
    color: #0077FC;
    font-weight: 800;
  }}

  .s1-hero-title {{
    font-size: 74px;
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.035em;
    color: #231F20;
    margin-bottom: 14px;
  }}

  .s1-tagline {{
    display: block;
    font-size: 38px;
    font-weight: 700;
    color: #0077FC;
    letter-spacing: -0.015em;
    margin-top: 6px;
  }}

  .s1-hero-sub {{
    font-size: 21px;
    line-height: 1.35;
    color: #4b5563;
    max-width: 900px;
    margin-bottom: 22px;
    font-weight: 500;
  }}

  .s1-banner-card {{
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0, 119, 252, 0.2);
    border-radius: 20px;
    padding: 16px 26px;
    max-width: 960px;
    font-size: 15.5px;
    line-height: 1.5;
    color: #1f2937;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
  }}

  .s1-banner-card strong {{
    color: #0077FC;
  }}

  .s1-meta-grid {{
    display: grid;
    grid-template-columns: 1.35fr 1.35fr 1.35fr 1.15fr;
    max-width: 1200px;
    gap: 20px;
  }}

  .s1-meta-item {{
    border-left: 3px solid #0077FC;
    padding-left: 12px;
  }}

  .s1-meta-label {{
    font-size: 11.5px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 3px;
    font-weight: 600;
  }}

  .s1-meta-val {{
    font-size: 14.5px;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
  }}

  /* =================================================================
     SLIDE 2: THE PROBLEM & THE KIRANA ECONOMY (DARK)
     ================================================================= */
  #slide-2 {{
    background: #231F20;
  }}

  .s2-grid {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 370px 430px 430px;
    gap: 25px;
    z-index: 10;
  }}

  .s2-card {{
    background: #2A2627;
    border-radius: 26px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 520px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }}

  .s2-merchant-photo {{
    height: 190px;
    width: 100%;
    object-fit: cover;
    object-position: center 20%;
  }}

  .s2-merchant-info {{
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }}

  .s2-merchant-name {{
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 3px;
  }}

  .s2-merchant-role {{
    font-size: 12.5px;
    color: #4BA0FF;
    margin-bottom: 12px;
  }}

  .s2-merchant-pains {{
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12.5px;
    color: #cbd5e1;
    line-height: 1.35;
  }}

  .s2-merchant-pains strong {{
    color: #f87171;
  }}

  .s2-failures-box {{
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }}

  .s2-box-title {{
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 14px;
    letter-spacing: -0.01em;
  }}

  .s2-fail-item {{
    margin-bottom: 14px;
  }}

  .s2-fail-num {{
    font-size: 12px;
    font-weight: 800;
    color: #4BA0FF;
    margin-bottom: 3px;
    letter-spacing: 0.05em;
  }}

  .s2-fail-h {{
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }}

  .s2-fail-d {{
    font-size: 12.8px;
    line-height: 1.4;
    color: #cbd5e1;
  }}

  .s2-market-box {{
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }}

  .s2-stats-row {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }}

  .s2-stat-pill {{
    background: rgba(0, 119, 252, 0.15);
    border: 1px solid rgba(0, 119, 252, 0.35);
    border-radius: 14px;
    padding: 10px 8px;
    text-align: center;
  }}

  .s2-stat-num {{
    font-size: 18px;
    font-weight: 800;
    color: #4BA0FF;
  }}

  .s2-stat-lbl {{
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
    line-height: 1.2;
  }}

  .s2-tam-stack {{
    display: flex;
    flex-direction: column;
    gap: 9px;
  }}

  .s2-tam-card {{
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 10px 14px;
  }}

  .s2-tam-top {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }}

  .s2-tam-badge {{
    font-size: 11px;
    font-weight: 800;
    color: #4BA0FF;
  }}

  .s2-tam-val {{
    font-size: 14.5px;
    font-weight: 800;
    color: #ffffff;
  }}

  .s2-tam-desc {{
    font-size: 11.5px;
    color: #94a3b8;
    line-height: 1.3;
  }}

  /* =================================================================
     SLIDE 3: 5-STAGE AUTONOMOUS GROWTH LOOP (LIGHT)
     ================================================================= */
  #slide-3 {{
    background: #ffffff;
  }}

  .s3-content {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s3-loop-row {{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 22px;
  }}

  .s3-step-card {{
    background: #F4F4F4;
    border-radius: 24px;
    padding: 24px 20px;
    border: 1px solid #e5e7eb;
    height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .s3-step-card.active {{
    background: #0077FC;
    color: #ffffff;
    border: none;
    box-shadow: 0 16px 35px rgba(0, 119, 252, 0.28);
  }}

  .s3-step-num {{
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 6px;
  }}

  .s3-step-card.active .s3-step-num {{
    color: #AED2FF;
  }}

  .s3-step-title {{
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }}

  .s3-step-card.active .s3-step-title {{
    color: #ffffff;
  }}

  .s3-step-desc {{
    font-size: 13.5px;
    line-height: 1.45;
    color: #4b5563;
  }}

  .s3-step-card.active .s3-step-desc {{
    color: #e0f2fe;
  }}

  .s3-step-tag {{
    font-size: 11px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 8px;
    background: rgba(0,0,0,0.06);
    display: inline-block;
    margin-top: 10px;
  }}

  .s3-step-card.active .s3-step-tag {{
    background: rgba(255,255,255,0.2);
    color: #ffffff;
  }}

  .s3-banner-bottom {{
    background: #231F20;
    color: #ffffff;
    border-radius: 20px;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .s3-banner-txt {{
    font-size: 14.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }}

  .s3-banner-txt strong {{
    color: #4BA0FF;
  }}

  /* =================================================================
     SLIDE 4: WHAT WE PROVIDE & KIRANA USER FLOW (DARK)
     ================================================================= */
  #slide-4 {{
    background: #231F20;
  }}

  .s4-content {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 430px 1fr;
    gap: 30px;
    z-index: 10;
  }}

  .s4-features-card {{
    background: #2A2627;
    border-radius: 26px;
    padding: 22px 20px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 520px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .s4-feat-title {{
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
  }}

  .s4-feat-list {{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }}

  .s4-feat-item {{
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    line-height: 1.38;
    color: #cbd5e1;
  }}

  .s4-feat-item strong {{
    color: #ffffff;
  }}

  .s4-feat-icon {{
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: rgba(0, 119, 252, 0.2);
    color: #4BA0FF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    margin-top: 1px;
  }}

  .s4-emergency-box {{
    background: rgba(0, 119, 252, 0.14);
    border: 1px solid rgba(0, 119, 252, 0.35);
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 12.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }}

  .s4-emergency-box strong {{
    color: #4BA0FF;
  }}

  .s4-timeline-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 13px;
  }}

  .s4-step-card {{
    background: #2A2627;
    border-radius: 18px;
    padding: 15px 16px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 154px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }}

  .s4-step-top {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }}

  .s4-time-pill {{
    padding: 4px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.02em;
  }}

  .s4-step-title {{
    font-size: 14.5px;
    font-weight: 700;
    color: #ffffff;
  }}

  .s4-step-body {{
    font-size: 12.5px;
    line-height: 1.4;
    color: #cbd5e1;
  }}

  .s4-step-body strong {{
    color: #ffffff;
  }}

  /* =================================================================
     SLIDE 5: END-TO-END SYSTEM ARCHITECTURE (DARK)
     ================================================================= */
  #slide-5 {{
    background: #191718;
  }}

  .s5-diagram-box {{
    position: absolute;
    top: 155px;
    left: 50%;
    transform: translateX(-50%);
    width: 1140px;
    height: 505px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 24px;
    padding: 6px;
    box-shadow: 0 20px 60px rgba(0, 119, 252, 0.28), 0 0 0 1px rgba(0, 119, 252, 0.35);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }}

  .s5-diagram-box img {{
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 18px;
  }}

  .s5-desc {{
    position: absolute;
    bottom: 68px;
    left: 100px;
    right: 100px;
    text-align: center;
    font-size: 14.5px;
    line-height: 1.4;
    color: #cbd5e1;
    z-index: 10;
  }}

  /* =================================================================
     SLIDE 6: MULTI-AGENT ECOSYSTEM & ENTERPRISE STACK (LIGHT)
     ================================================================= */
  #slide-6 {{
    background: #ffffff;
  }}

  .s6-content {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s6-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 20px;
  }}

  .s6-agent-card {{
    background: #F4F4F4;
    border-radius: 22px;
    padding: 20px 22px;
    border: 1px solid #e5e7eb;
    height: 205px;
    display: flex;
    flex-direction: column;
  }}

  .s6-agent-card.featured {{
    background: #231F20;
    color: #ffffff;
    border: 1px solid #333333;
  }}

  .s6-agent-card.featured .s6-agent-title {{
    color: #4BA0FF;
  }}

  .s6-agent-card.featured .s6-agent-desc {{
    color: #cbd5e1;
  }}

  .s6-agent-icon {{
    width: 28px;
    height: 28px;
    color: #0077FC;
    margin-bottom: 8px;
  }}

  .s6-agent-icon svg {{
    width: 100%;
    height: 100%;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
  }}

  .s6-agent-title {{
    font-size: 18px;
    font-weight: 700;
    color: #231F20;
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }}

  .s6-agent-desc {{
    font-size: 13.5px;
    line-height: 1.42;
    color: #555555;
  }}

  .s6-stack-strip {{
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .s6-stack-item {{
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }}

  .s6-stack-dot {{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0077FC;
  }}

  /* =================================================================
     SLIDE 7: MULTIMODAL PERCEPTION & INDIC VOICE AI (DARK)
     ================================================================= */
  #slide-7 {{
    background: #231F20;
  }}

  .s7-content {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    z-index: 10;
  }}

  .s7-card {{
    background: #2A2627;
    border-radius: 26px;
    padding: 26px 22px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 520px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .s7-card-top {{
    display: flex;
    flex-direction: column;
  }}

  .s7-card-icon {{
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #0077FC;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    margin-bottom: 16px;
  }}

  .s7-card-icon svg {{
    width: 24px;
    height: 24px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
  }}

  .s7-card-title {{
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }}

  .s7-card-desc {{
    font-size: 13.5px;
    line-height: 1.45;
    color: #cbd5e1;
    margin-bottom: 16px;
  }}

  .s7-card-detail {{
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    color: #93c5fd;
    line-height: 1.4;
  }}

  /* =================================================================
     SLIDE 8: WHATSAPP AS THE OS & PREDICTIVE LEAKAGE (LIGHT)
     ================================================================= */
  #slide-8 {{
    background: #ffffff;
  }}

  .s8-content {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 530px 1fr;
    gap: 30px;
    z-index: 10;
  }}

  .s8-chat-col {{
    display: flex;
    flex-direction: column;
    gap: 13px;
  }}

  .s8-chat-card {{
    background: #F4F4F4;
    border-radius: 18px;
    padding: 14px 18px;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }}

  .s8-chat-top {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .s8-chat-badge {{
    font-size: 11.5px;
    font-weight: 700;
    color: #0077FC;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }}

  .s8-chat-time {{
    font-size: 11px;
    color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
  }}

  .s8-chat-body {{
    font-size: 13px;
    line-height: 1.4;
    color: #1f2937;
  }}

  .s8-chat-btn {{
    align-self: flex-start;
    background: #0077FC;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    margin-top: 4px;
  }}

  .s8-pred-col {{
    display: flex;
    flex-direction: column;
    gap: 18px;
  }}

  .s8-box {{
    background: #F4F4F4;
    border-radius: 22px;
    padding: 22px;
    border: 1px solid #e5e7eb;
  }}

  .s8-box-title {{
    font-size: 18px;
    font-weight: 700;
    color: #231F20;
    margin-bottom: 12px;
  }}

  .s8-leak-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }}

  .s8-leak-card {{
    background: #ffffff;
    border-radius: 14px;
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
  }}

  .s8-leak-val {{
    font-size: 18px;
    font-weight: 800;
    color: #0077FC;
    margin-bottom: 2px;
  }}

  .s8-leak-lbl {{
    font-size: 11.5px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }}

  .s8-leak-desc {{
    font-size: 11px;
    color: #64748b;
    line-height: 1.3;
  }}

  /* =================================================================
     SLIDE 9: MERCHANT HEALTH SCORE & LENDING MOAT (DARK)
     ================================================================= */
  #slide-9 {{
    background: #231F20;
  }}

  .s9-content {{
    position: absolute;
    top: 195px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 410px 1fr;
    gap: 30px;
    z-index: 10;
  }}

  .s9-score-card {{
    background: #2A2627;
    border-radius: 26px;
    padding: 26px 24px;
    border: 1px solid rgba(255,255,255,0.08);
    height: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }}

  .s9-circle-gauge {{
    width: 170px;
    height: 170px;
    border-radius: 50%;
    border: 10px solid #0077FC;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 14px 0;
    box-shadow: 0 0 35px rgba(0, 119, 252, 0.35);
  }}

  .s9-gauge-num {{
    font-size: 48px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }}

  .s9-gauge-max {{
    font-size: 13px;
    color: #94a3b8;
  }}

  .s9-status-pill {{
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.4);
    padding: 5px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
  }}

  .s9-loan-box {{
    background: rgba(0, 119, 252, 0.15);
    border: 1px solid rgba(0, 119, 252, 0.35);
    border-radius: 16px;
    padding: 14px 18px;
    width: 100%;
    text-align: left;
    font-size: 12.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }}

  .s9-loan-box strong {{
    color: #4BA0FF;
  }}

  .s9-pillars-col {{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 520px;
  }}

  .s9-pillars-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }}

  .s9-pillar-card {{
    background: #2A2627;
    border-radius: 20px;
    padding: 20px 22px;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  .s9-pillar-pct {{
    font-size: 26px;
    font-weight: 800;
    color: #4BA0FF;
    margin-bottom: 4px;
  }}

  .s9-pillar-title {{
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6px;
  }}

  .s9-pillar-desc {{
    font-size: 12.8px;
    line-height: 1.4;
    color: #cbd5e1;
  }}

  .s9-moat-box {{
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    padding: 16px 20px;
    font-size: 13.5px;
    line-height: 1.45;
    color: #cbd5e1;
  }}

  .s9-moat-box strong {{
    color: #4BA0FF;
  }}

  /* =================================================================
     SLIDE 10: BUSINESS MODEL, ROADMAP & CLOSING VISION (LIGHT)
     ================================================================= */
  #slide-10 {{
    background: #ffffff;
  }}

  .s10-banner {{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 220px;
    background-image: url('{b64_retail_future}');
    background-size: cover;
    background-position: center 30%;
    z-index: 1;
  }}

  .s10-banner-overlay {{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 220px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(255,255,255,1) 100%);
    z-index: 2;
  }}

  .s10-content {{
    position: absolute;
    top: 230px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s10-hero-title {{
    font-size: 40px;
    font-weight: 700;
    color: #231F20;
    letter-spacing: -0.025em;
    line-height: 1.12;
    margin-bottom: 6px;
  }}

  .s10-hero-sub {{
    font-size: 15px;
    color: #4b5563;
    margin-bottom: 20px;
    max-width: 900px;
  }}

  .s10-main-grid {{
    display: grid;
    grid-template-columns: 460px 1fr;
    gap: 32px;
    margin-bottom: 20px;
  }}

  .s10-monetize-box {{
    background: #F4F4F4;
    border-radius: 20px;
    padding: 18px 20px;
    border: 1px solid #e5e7eb;
  }}

  .s10-box-h {{
    font-size: 15px;
    font-weight: 700;
    color: #231F20;
    margin-bottom: 12px;
  }}

  .s10-arches-row {{
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 145px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 14px;
  }}

  .s10-arch-col {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }}

  .s10-arch-bar {{
    width: 68px;
    border-radius: 999px 999px 0 0;
    background: #0077FC;
    box-shadow: 0 4px 12px rgba(0, 119, 252, 0.2);
  }}

  .s10-arch-bar.y1 {{
    height: 42px;
    background: #AED2FF;
  }}

  .s10-arch-bar.y2 {{
    height: 68px;
    background: #4BA0FF;
  }}

  .s10-arch-bar.y3 {{
    height: 94px;
    background: #0077FC;
  }}

  .s10-streams-list {{
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: #475569;
    line-height: 1.35;
  }}

  .s10-streams-list strong {{
    color: #0077FC;
  }}

  .s10-roadmap-box {{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .s10-phases-grid {{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }}

  .s10-phase-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 10px 12px;
  }}

  .s10-phase-card strong {{
    display: block;
    color: #0077FC;
    font-size: 11px;
    margin-bottom: 3px;
    letter-spacing: 0.02em;
  }}

  .s10-phase-card span {{
    font-size: 11.5px;
    color: #475569;
    line-height: 1.35;
  }}

  .s10-meta-row {{
    display: grid;
    grid-template-columns: 1.15fr 1.35fr 1fr;
    gap: 15px;
    padding-top: 14px;
    border-top: 1px solid #e2e8f0;
  }}

  .s10-meta-row .meta-label {{
    font-size: 12px;
    color: #64748b;
    margin-bottom: 2px;
  }}

  .s10-meta-row .meta-val {{
    font-size: 13.5px;
    font-weight: 700;
    color: #231F20;
    word-break: break-word;
  }}

</style>
</head>
<body>

<div class="deck-wrapper">

  <!-- ===============================================================
       SLIDE 1: COVER (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-1">
    <div class="s1-brand-text">Paytm</div>
    <div class="s1-year-text">2026</div>

    <div class="s1-content">
      <div class="s1-badges-row">
        <div class="s1-track-pill">
          🚀 PAYTM BUILD FOR INDIA AI HACKATHON • MERCHANT GROWTH AI TRACK 01
        </div>
        <div class="s1-project-pill">
          PROJECT: <strong>AI Business Partner for Merchants</strong>
        </div>
      </div>

      <h1 class="s1-hero-title">
        DukaanPayAI<br>
        <span class="s1-tagline">“Vyapaar ka Naya Vishwas”</span>
      </h1>

      <p class="s1-hero-sub">
        Autonomous AI Business multi-agentic system for 30 Million+ Indian Kiranas
      </p>

      <div class="s1-banner-card">
        Transforming passive Soundboxes into an autonomous intelligence system—anticipating stockouts, predicting customer churn, and orchestrating revenue growth entirely over <strong>WhatsApp</strong> and <strong>Indic Voice</strong> with zero new apps or manual data entry.
      </div>

      <div class="s1-meta-grid">
        <div class="s1-meta-item">
          <div class="s1-meta-label">Presented by</div>
          <div class="s1-meta-val">Team Sentinels (Akshat Arya & Mayank Yadav)</div>
        </div>
        <div class="s1-meta-item">
          <div class="s1-meta-label">Project Name</div>
          <div class="s1-meta-val">AI Business Partner for Merchants</div>
        </div>
        <div class="s1-meta-item">
          <div class="s1-meta-label">Idea / Product Name</div>
          <div class="s1-meta-val">DukaanPayAI</div>
        </div>
        <div class="s1-meta-item">
          <div class="s1-meta-label">Theme / Track Selection</div>
          <div class="s1-meta-val">Merchant Growth AI (Track 01)</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===============================================================
       SLIDE 2: THE PROBLEM & THE KIRANA ECONOMY (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-2">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-dark">The Problem & The Kirana Economy</h2>
      <p class="slide-subhead-dark">30 Million+ Kirana stores power India's retail, yet remain trapped in blind spots and passive payment traps.</p>
    </div>

    <div class="s2-grid">
      <!-- Left: Merchant Reality Profile -->
      <div class="s2-card">
        <img class="s2-merchant-photo" src="{b64_kirana_hero}" alt="Indian Kirana Store Owner">
        <div class="s2-merchant-info">
          <div>
            <div class="s2-merchant-name">Rajesh Gupta, Store Owner</div>
            <div class="s2-merchant-role">Gupta Kirana Store • Kanpur, UP</div>
          </div>
          <div class="s2-merchant-pains">
            <div>⚠️ <strong>₹4,200 lost weekly</strong> to avoidable evening stockouts on top 5 FMCG SKUs.</div>
            <div>⚠️ <strong>40% of regular buyers churn</strong> to quick-commerce dark stores without notice.</div>
            <div>⚠️ <strong>₹14-₹25/unit overcharges</strong> by distributors undetected on paper invoices.</div>
          </div>
          <div style="font-size: 11.5px; color: #94a3b8; font-style: italic; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            "14-hour days behind the counter with zero digital assistant or real-time guidance."
          </div>
        </div>
      </div>

      <!-- Middle: The 3 Core Market Failures -->
      <div class="s2-card">
        <div class="s2-failures-box">
          <div class="s2-box-title">The 3 Structural Failures</div>
          
          <div class="s2-fail-item">
            <div class="s2-fail-num">01 / PASSIVE TRAP</div>
            <div class="s2-fail-h">Soundbox Only Confirms Payments</div>
            <div class="s2-fail-d">Payment audio boxes confirm incoming transactions, but offer zero proactive intelligence, inventory alerts, or customer retention loops.</div>
          </div>

          <div class="s2-fail-item">
            <div class="s2-fail-num">02 / POS SOFTWARE FRICTION</div>
            <div class="s2-fail-h">92% Abandon Complex ERPs</div>
            <div class="s2-fail-d">Heavy desktop POS and mobile inventory apps demand manual barcode scanning and tedious data entry that merchants abandon within 14 days.</div>
          </div>

          <div class="s2-fail-item" style="margin-bottom: 0;">
            <div class="s2-fail-num">03 / NO ACTION ENGINE</div>
            <div class="s2-fail-h">Analytics Without Execution</div>
            <div class="s2-fail-d">SaaS dashboards display passive analytics charts. Overworked store owners need 1-tap autonomous execution directly where they communicate.</div>
          </div>
        </div>
      </div>

      <!-- Right: Massive Bharat Market Opportunity -->
      <div class="s2-card">
        <div class="s2-market-box">
          <div class="s2-box-title">The ₹250B+ Opportunity</div>

          <div class="s2-stats-row">
            <div class="s2-stat-pill">
              <div class="s2-stat-num">30M+</div>
              <div class="s2-stat-lbl">Kirana Stores</div>
            </div>
            <div class="s2-stat-pill">
              <div class="s2-stat-num">₹85B+</div>
              <div class="s2-stat-lbl">Daily UPI Vol</div>
            </div>
            <div class="s2-stat-pill">
              <div class="s2-stat-num">92%</div>
              <div class="s2-stat-lbl">Zero Tech</div>
            </div>
          </div>

          <div class="s2-tam-stack">
            <div class="s2-tam-card">
              <div class="s2-tam-top">
                <span class="s2-tam-badge">TAM (TOTAL MARKET)</span>
                <span class="s2-tam-val">₹250B+ ($3.0B)</span>
              </div>
              <div class="s2-tam-desc">30M+ Indian MSMEs seeking digitized growth, smart inventory, and autonomous sales assistance.</div>
            </div>

            <div class="s2-tam-card">
              <div class="s2-tam-top">
                <span class="s2-tam-badge">SAM (SERVICABLE)</span>
                <span class="s2-tam-val">₹85B ($1.0B)</span>
              </div>
              <div class="s2-tam-desc">10.8M active Paytm Soundbox and QR merchants with high-frequency daily transaction streams.</div>
            </div>

            <div class="s2-tam-card">
              <div class="s2-tam-top">
                <span class="s2-tam-badge">SOM (TARGET Y3)</span>
                <span class="s2-tam-val">₹32B ($380M)</span>
              </div>
              <div class="s2-tam-desc">4.2M high-velocity tier 1-3 Kiranas, grocery, and pharmacy retailers onboarded within 36 months.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 02</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 3: 5-STAGE AUTONOMOUS GROWTH LOOP (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-3">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-light">The Autonomous Merchant Growth Loop</h2>
      <p class="slide-subhead-light">Paytm evolves from a passive payment processor into an autonomous AI business partner that drives revenue.</p>
    </div>

    <div class="s3-content">
      <div class="s3-loop-row">
        <!-- 01 Observe -->
        <div class="s3-step-card">
          <div>
            <div class="s3-step-num">STAGE 01</div>
            <div class="s3-step-title">Observe</div>
            <div class="s3-step-desc">
              Ingests live UPI telemetry, Soundbox payments, WhatsApp photos of supplier bills, handwritten diary entries, and voice notes.
            </div>
          </div>
          <div>
            <span class="s3-step-tag">Zero Manual Typing</span>
          </div>
        </div>

        <!-- 02 Understand -->
        <div class="s3-step-card">
          <div>
            <div class="s3-step-num">STAGE 02</div>
            <div class="s3-step-title">Understand</div>
            <div class="s3-step-desc">
              Computes daily revenue velocity, customer visit intervals, basket sizing, profit margins, and updates the Dynamic Merchant Health Score.
            </div>
          </div>
          <div>
            <span class="s3-step-tag">Merchant Profiling</span>
          </div>
        </div>

        <!-- 03 Predict (Featured Blue) -->
        <div class="s3-step-card active">
          <div>
            <div class="s3-step-num">STAGE 03 • CORE AI</div>
            <div class="s3-step-title">Predict</div>
            <div class="s3-step-desc">
              Correlates local weather, festivals, paydays, and cricket matches with Prophet & XGBoost to forecast rushes and stockout run-out dates.
            </div>
          </div>
          <div>
            <span class="s3-step-tag">Predictive Engine</span>
          </div>
        </div>

        <!-- 04 Recommend -->
        <div class="s3-step-card">
          <div>
            <div class="s3-step-num">STAGE 04</div>
            <div class="s3-step-title">Recommend</div>
            <div class="s3-step-desc">
              Synthesizes high-ROI recommendations: personalized win-back offers for churned regulars, wholesaler price benchmarks, and pre-peak prep.
            </div>
          </div>
          <div>
            <span class="s3-step-tag">Action Formulation</span>
          </div>
        </div>

        <!-- 05 Execute -->
        <div class="s3-step-card">
          <div>
            <div class="s3-step-num">STAGE 05</div>
            <div class="s3-step-title">Execute</div>
            <div class="s3-step-desc">
              Dispatches 1-tap WhatsApp loyalty campaigns, alerts distributors, triggers Indic voice briefings, and activates pre-approved credit lines.
            </div>
          </div>
          <div>
            <span class="s3-step-tag">1-Tap Autonomous Action</span>
          </div>
        </div>
      </div>

      <!-- Bottom Zero Fatigue Banner -->
      <div class="s3-banner-bottom">
        <div class="s3-banner-txt">
          🚀 <strong>Zero App Fatigue Philosophy:</strong> The merchant never installs a new app or navigates confusing web dashboards. Every notification, alert, and 1-tap approval happens natively inside <strong>WhatsApp</strong> and through <strong>Indic AI Voice Calls</strong>.
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #4BA0FF; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; margin-left: 20px;">
          100% Native Adoption
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 03</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 4: WHAT WE PROVIDE & KIRANA USER FLOW (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-4">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-dark">What We Provide & Kirana User Flow</h2>
      <p class="slide-subhead-dark">A Day in the Life: How the Paytm Growth Agent Partners with Store Owners from 06:30 AM to 10:30 PM</p>
    </div>

    <div class="s4-content">
      <!-- Left Column: Core Features Provided -->
      <div class="s4-features-card">
        <div>
          <div style="font-size: 11.5px; font-weight: 700; color: #0077FC; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Feature Ecosystem</div>
          <div class="s4-feat-title">Core Capabilities Provided</div>
          <div class="s4-feat-list">
            <div class="s4-feat-item">
              <div class="s4-feat-icon">✓</div>
              <div><strong>Proactive WhatsApp Intelligence:</strong> Automated daily morning & evening briefings delivered into existing habits—zero new apps.</div>
            </div>
            <div class="s4-feat-item">
              <div class="s4-feat-icon">✓</div>
              <div><strong>Real-Time UPI Telemetry:</strong> Live stream monitoring payment velocity, customer purchase frequency, and sudden volume anomalies.</div>
            </div>
            <div class="s4-feat-item">
              <div class="s4-feat-icon">✓</div>
              <div><strong>Pre-Rush Footfall Warning:</strong> Anticipates peak rush hours 2 hours in advance to prep fast-moving items and avoid stockouts.</div>
            </div>
            <div class="s4-feat-item">
              <div class="s4-feat-icon">✓</div>
              <div><strong>Automated Retention Campaigns:</strong> AI identifies churn risks and sends 1-tap WhatsApp cashback offers driving repeat visits.</div>
            </div>
            <div class="s4-feat-item">
              <div class="s4-feat-icon">✓</div>
              <div><strong>Multimodal Shelf & Bill OCR:</strong> Snaps of shelves or supplier invoices automatically update stock and draft best-rate wholesaler POs.</div>
            </div>
          </div>
        </div>

        <!-- Emergency Support Box -->
        <div class="s4-emergency-box">
          🚨 <strong>Emergency & Business Safety Net:</strong> In unexpected sales crashes, supplier disputes, or working capital crunches, the AI activates emergency protocol—instant pre-approved Paytm credit line + alternative wholesaler dispatch.
        </div>
      </div>

      <!-- Right Column: 6-Step Chronological User Flow -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <div style="font-size: 11.5px; font-weight: 700; color: #4BA0FF; text-transform: uppercase; letter-spacing: 0.05em;">Real-World Scenario</div>
          <div style="font-size: 13px; color: #94a3b8;">A Day with Rameshji (Gupta Kirana Store)</div>
        </div>

        <div class="s4-timeline-grid">
          <!-- Step 1: 06:30 AM -->
          <div class="s4-step-card">
            <div class="s4-step-top">
              <span class="s4-time-pill" style="background: rgba(0, 119, 252, 0.2); color: #4BA0FF; border: 1px solid rgba(0, 119, 252, 0.4);">06:30 AM</span>
              <span class="s4-step-title">Wakeup Briefing</span>
            </div>
            <div class="s4-step-body">
              Rameshji checks WhatsApp: <strong>₹18,450 sales yesterday</strong> (+18%). 42°C heatwave alert predicts <strong>+35% cold drink spike</strong>; advises stocking ice & 3 crates of cola before opening.
            </div>
          </div>

          <!-- Step 2: 11:00 AM -->
          <div class="s4-step-card">
            <div class="s4-step-top">
              <span class="s4-time-pill" style="background: rgba(0, 119, 252, 0.2); color: #4BA0FF; border: 1px solid rgba(0, 119, 252, 0.4);">11:00 AM</span>
              <span class="s4-step-title">Real-Time Telemetry</span>
            </div>
            <div class="s4-step-body">
              AI tracks 85+ live Paytm QR payments. Ingests payment velocity silently; flags an anomalous ₹14 wholesaler overcharge on cooking oil benchmarked across 5 local stores.
            </div>
          </div>

          <!-- Step 3: 04:30 PM -->
          <div class="s4-step-card">
            <div class="s4-step-top">
              <span class="s4-time-pill" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);">04:30 PM</span>
              <span class="s4-step-title">Pre-Peak Rush Alert</span>
            </div>
            <div class="s4-step-body">
              Proactive alert 2.5 hours before 7 PM rush: <em>“Evening milk & bread stock low. Tuesday footfall surges in 150 mins—restock front counter now to prevent ₹2,800 stockout loss.”</em>
            </div>
          </div>

          <!-- Step 4: 06:00 PM -->
          <div class="s4-step-card">
            <div class="s4-step-top">
              <span class="s4-time-pill" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);">06:00 PM</span>
              <span class="s4-step-title">1-Tap Retention Offer</span>
            </div>
            <div class="s4-step-body">
              AI detects 18 weekly regulars slipping away (12 days absent). Generates personalized 5% cashback message. Rameshji reviews on WhatsApp and taps <strong>“Approve & Send”</strong> in 1 second.
            </div>
          </div>

          <!-- Step 5: 08:30 PM -->
          <div class="s4-step-card">
            <div class="s4-step-top">
              <span class="s4-time-pill" style="background: rgba(0, 119, 252, 0.2); color: #4BA0FF; border: 1px solid rgba(0, 119, 252, 0.4);">08:30 PM</span>
              <span class="s4-step-title">Shelf OCR & Reorder</span>
            </div>
            <div class="s4-step-body">
              Rameshji snaps a photo of empty Atta shelves. Vision OCR extracts deficit (40 kg), benchmarks cheapest distributor (₹38/kg), and prepares purchase order for 1-tap reorder.
            </div>
          </div>

          <!-- Step 6: 10:30 PM -->
          <div class="s4-step-card">
            <div class="s4-step-top">
              <span class="s4-time-pill" style="background: rgba(0, 119, 252, 0.2); color: #4BA0FF; border: 1px solid rgba(0, 119, 252, 0.4);">10:30 PM</span>
              <span class="s4-step-title">Night Closing & Safety</span>
            </div>
            <div class="s4-step-body">
              Day closing P&L: ₹24,200 revenue. Weekly Growth Health Score rises to 88/100. Emergency credit safety net active with instant ₹2,50,000 Paytm business loan ready on tap.
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 04</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 5: END-TO-END SYSTEM ARCHITECTURE (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-5">
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

    <div style="position: absolute; top: 75px; left: 74px; right: 74px; text-align: center; z-index: 10;">
      <h2 style="font-size: 42px; font-weight: 700; letter-spacing: -0.025em; color: #ffffff; margin-bottom: 4px;">End-to-End System Architecture</h2>
      <p style="font-size: 15px; color: #4BA0FF; font-weight: 500;">LangGraph Multi-Agent Orchestration & Edge Micro-Services Architecture</p>
    </div>

    <!-- Prominent System Architecture Container -->
    <div class="s5-diagram-box">
      <img src="{b64_arch}" alt="Paytm Merchant Growth Agent - Architecture Diagram">
    </div>

    <div class="s5-desc">
      Enterprise multi-agent pipeline: Ingests Paytm UPI telemetry, WhatsApp multimodal OCR, predictive XGBoost/Prophet models, and LangGraph LLM supervisor into proactive loops across WhatsApp, Merchant App, and AI Voice Calls.
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 05</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 6: MULTI-AGENT ECOSYSTEM & ENTERPRISE STACK (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-6">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-light">Multi-Agent Intelligence & Enterprise Stack</h2>
      <p class="slide-subhead-light">Specialized autonomous agents coordinated by LangGraph, built on resilient Bharat-scale cloud infrastructure.</p>
    </div>

    <div class="s6-content">
      <div class="s6-grid">
        <!-- Agent 1: BI -->
        <div class="s6-agent-card">
          <div class="s6-agent-icon"><svg viewBox="0 0 24 24"><path d="M3 3v18h18M7 14l4-4 4 4 5-6"/></svg></div>
          <div class="s6-agent-title">Business Intelligence Agent</div>
          <div class="s6-agent-desc">Monitors revenue velocity, flags payment volume dips, computes gross margins, and identifies high-value customer spending trends.</div>
        </div>

        <!-- Agent 2: Inventory -->
        <div class="s6-agent-card">
          <div class="s6-agent-icon"><svg viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          <div class="s6-agent-title">Inventory & Supplier Agent</div>
          <div class="s6-agent-desc">Predicts stockouts 3-5 days ahead via Prophet time-series models, audits supplier invoices with OCR, and benchmarks regional prices.</div>
        </div>

        <!-- Agent 3: Voice AI -->
        <div class="s6-agent-card">
          <div class="s6-agent-icon"><svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg></div>
          <div class="s6-agent-title">Voice & Telephony Agent</div>
          <div class="s6-agent-desc">Conducts low-latency interactive phone calls in Hindi, Marathi, Tamil, Bengali, and Hinglish via Bhashini & Twilio edge connectors.</div>
        </div>

        <!-- Agent 4: Retention -->
        <div class="s6-agent-card">
          <div class="s6-agent-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div class="s6-agent-title">Customer Retention Agent</div>
          <div class="s6-agent-desc">Tracks buyer purchase intervals, identifies churn risks before they leave, and crafts targeted WhatsApp cashback loyalty incentives.</div>
        </div>

        <!-- Agent 5: Campaign -->
        <div class="s6-agent-card">
          <div class="s6-agent-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
          <div class="s6-agent-title">Campaign Execution Agent</div>
          <div class="s6-agent-desc">Auto-generates high-converting WhatsApp cashback templates and executes marketing blasts immediately upon 1-tap merchant approval.</div>
        </div>

        <!-- Agent 6: LangGraph Supervisor -->
        <div class="s6-agent-card featured">
          <div class="s6-agent-icon" style="color: #4BA0FF;"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          <div class="s6-agent-title">LangGraph Orchestrator</div>
          <div class="s6-agent-desc">Supervisor agent managing state memory, context routing, tool calling, validation checks, and human-in-the-loop safety verification.</div>
        </div>
      </div>

      <!-- Enterprise Infrastructure Strip -->
      <div class="s6-stack-strip">
        <div class="s6-stack-item"><div class="s6-stack-dot"></div> Sub-500ms Edge Latency</div>
        <div class="s6-stack-item"><div class="s6-stack-dot"></div> Kafka & Redis (50k+ TPS)</div>
        <div class="s6-stack-item"><div class="s6-stack-dot"></div> PostgreSQL + pgvector Embeddings</div>
        <div class="s6-stack-item"><div class="s6-stack-dot"></div> Llama-3-Vision & YOLOv11 OCR</div>
        <div class="s6-stack-item"><div class="s6-stack-dot"></div> RBI Sovereign Cloud Compliance</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 06</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 7: MULTIMODAL PERCEPTION & INDIC VOICE AI (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-7">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-dark">Multimodal Perception & Indic Voice AI</h2>
      <p class="slide-subhead-dark">Zero-friction data capture: Voice notes, handwritten diaries, shelf photos, and natural Indic phone conversations.</p>
    </div>

    <div class="s7-content">
      <!-- Card 1: Wholesaler Bills -->
      <div class="s7-card">
        <div class="s7-card-top">
          <div class="s7-card-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
          <div class="s7-card-title">Paper Supplier Bills</div>
          <div class="s7-card-desc">Vision OCR parses blurry carbon-copy wholesaler receipts and printed bills snapped on WhatsApp in under 3 seconds.</div>
        </div>
        <div class="s7-card-detail">
          Extracted: Fortune Oil (15L)<br>
          Rate: ₹142/L vs City Avg ₹128/L<br>
          <span style="color: #f87171;">⚠️ Alert: ₹14/L Overcharge Flagged</span>
        </div>
      </div>

      <!-- Card 2: Handwritten Khaata -->
      <div class="s7-card">
        <div class="s7-card-top">
          <div class="s7-card-icon"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
          <div class="s7-card-title">Handwritten 'Khaata'</div>
          <div class="s7-card-desc">Interprets cursive handwritten customer credit ledgers in Hindi, Gujarati, and local scripts with spatial layout parsing.</div>
        </div>
        <div class="s7-card-detail">
          Parsed: Sharma Ji Udhaar<br>
          Amount: ₹1,850 (Due: 18 days)<br>
          <span style="color: #34d399;">Action: Gentle WhatsApp reminder drafted</span>
        </div>
      </div>

      <!-- Card 3: Shelf Vision -->
      <div class="s7-card">
        <div class="s7-card-top">
          <div class="s7-card-icon"><svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
          <div class="s7-card-title">Shelf Vision Scans</div>
          <div class="s7-card-desc">Merchant snaps a quick photo of store shelves or refrigerators. AI detects empty spaces and estimates stockout dates.</div>
        </div>
        <div class="s7-card-detail">
          Object Detection: Atta Shelf<br>
          Stock Level: 8kg remaining<br>
          <span style="color: #fbbf24;">⚡ Forecast: Stockout in 28 hrs</span>
        </div>
      </div>

      <!-- Card 4: Voice AI Calls -->
      <div class="s7-card">
        <div class="s7-card-top">
          <div class="s7-card-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
          <div class="s7-card-title">10+ Indic AI Voice Calls</div>
          <div class="s7-card-desc">Interactive telephony in Hindi, Marathi, Tamil, Telugu, and Hinglish for audio briefings and voice-to-action confirmations.</div>
        </div>
        <div class="s7-card-detail">
          Audio Call: "Namaste Rameshji, kal sham ka rush 30% badhega. Kya hum 3 peti cola reorder karein?"<br>
          <span style="color: #38bdf8;">Merchant: "Haan, kar do." (Done)</span>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 07</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 8: WHATSAPP AS THE OS & PREDICTIVE LEAKAGE (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-8">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-light">WhatsApp as the Merchant OS & Predictive Engine</h2>
      <p class="slide-subhead-light">Where intelligence turns into revenue: 1-tap conversational execution coupled with multi-signal demand forecasting.</p>
    </div>

    <div class="s8-content">
      <!-- Left Column: WhatsApp Execution Mockups -->
      <div class="s8-chat-col">
        <div style="font-size: 12px; font-weight: 700; color: #0077FC; text-transform: uppercase; letter-spacing: 0.05em;">Conversational Action Interface</div>

        <!-- Chat 1 -->
        <div class="s8-chat-card">
          <div class="s8-chat-top">
            <span class="s8-chat-badge">01 • Morning Briefing</span>
            <span class="s8-chat-time">07:30 AM</span>
          </div>
          <div class="s8-chat-body">
            "Good morning Rameshji! Yesterday's revenue was <strong>₹18,450 (+18%)</strong>. Heatwave alert today: cold beverage demand will surge <strong>+35%</strong>. Restock 3 crates of cola before 11 AM."
          </div>
        </div>

        <!-- Chat 2 -->
        <div class="s8-chat-card">
          <div class="s8-chat-top">
            <span class="s8-chat-badge">02 • Stockout Alert</span>
            <span class="s8-chat-time">02:15 PM</span>
          </div>
          <div class="s8-chat-body">
            "⚠️ <strong>Stockout Warning:</strong> Basmati Rice runs out in 36 hours. Best distributor rate benchmarked at <strong>₹38/kg</strong>. Tap to place purchase order."
          </div>
          <div class="s8-chat-btn">Approve Reorder (1 Tap)</div>
        </div>

        <!-- Chat 3 -->
        <div class="s8-chat-card">
          <div class="s8-chat-top">
            <span class="s8-chat-badge">03 • Win-Back Offer</span>
            <span class="s8-chat-time">05:45 PM</span>
          </div>
          <div class="s8-chat-body">
            "18 regular customers haven't visited in 12 days. Send them a personalized <strong>5% cashback offer</strong> on purchases over ₹200 to win them back?"
          </div>
          <div class="s8-chat-btn">Approve & Send (1 Tap)</div>
        </div>
      </div>

      <!-- Right Column: Predictive Engine & Lost Revenue Leakage -->
      <div class="s8-pred-col">
        <!-- Top Box: Multi-Signal Engine -->
        <div class="s8-box">
          <div class="s8-box-title">Multi-Signal Demand Predictor</div>
          <div style="font-size: 13.5px; color: #4b5563; line-height: 1.45; margin-bottom: 12px;">
            Prophet & XGBoost models synthesize 5 live external data signals into continuous 7-day hourly demand forecasts:
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12.5px; color: #1e293b;">
            <div>☀️ <strong>Weather:</strong> Heatwaves (+35% drinks), Monsoon (+50% tea/biscuits)</div>
            <div>🎉 <strong>Festivals:</strong> Diwali (+60% dry fruits/sweets), Holi (+40% snacks)</div>
            <div>🏏 <strong>Live Events:</strong> IPL cricket matches (+45% chips/cold drinks)</div>
            <div>💰 <strong>Payday Cycles:</strong> 1st–7th of month (+28% high-margin staples)</div>
          </div>
        </div>

        <!-- Bottom Box: Lost Revenue Leakage Detector -->
        <div class="s8-box">
          <div class="s8-box-title">Lost Revenue Leakage Detector (₹12,450/mo Recovered)</div>
          <div class="s8-leak-grid">
            <div class="s8-leak-card">
              <div class="s8-leak-val">₹4,200</div>
              <div class="s8-leak-lbl">Stockout Recovery</div>
              <div class="s8-leak-desc">Preventing lost sales on high-turnover milk, bread, and beverage surges.</div>
            </div>
            <div class="s8-leak-card">
              <div class="s8-leak-val">₹6,800</div>
              <div class="s8-leak-lbl">Churn Recovery</div>
              <div class="s8-leak-desc">Winning back lapsed regulars with automated 1-tap WhatsApp cashback.</div>
            </div>
            <div class="s8-leak-card">
              <div class="s8-leak-val">₹1,450</div>
              <div class="s8-leak-lbl">Supplier Price Audit</div>
              <div class="s8-leak-desc">Benchmarking distributor bills to block invisible wholesale overcharges.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 08</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 9: MERCHANT HEALTH SCORE & LENDING MOAT (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-9">
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

    <div style="position: absolute; top: 95px; left: 74px; right: 74px; z-index: 10;">
      <h2 class="display-title-dark">Merchant Health Score & Paytm Lending Moat</h2>
      <p class="slide-subhead-dark">Transforming payment telemetry into proprietary credit underwriting and collateral-free merchant financing.</p>
    </div>

    <div class="s9-content">
      <!-- Left Column: The Health Score Gauge -->
      <div class="s9-score-card">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #4BA0FF; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Dynamic Credit Underwriting</div>
          <div style="font-size: 22px; font-weight: 700; color: #ffffff;">Merchant Health Score</div>
        </div>

        <div class="s9-circle-gauge">
          <span class="s9-gauge-num">88</span>
          <span class="s9-gauge-max">OUT OF 100</span>
        </div>

        <div>
          <span class="s9-status-pill">STATUS: EXCELLENT TIER</span>
        </div>

        <div class="s9-loan-box">
          <div style="font-size: 11px; font-weight: 700; color: #4BA0FF; text-transform: uppercase; margin-bottom: 3px;">Pre-Approved Credit Line</div>
          <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 4px;">₹2,50,000</div>
          <div>Repayment: ₹350/day via daily UPI settlement escrow. 100% paperless disbursement in 90 seconds.</div>
        </div>
      </div>

      <!-- Right Column: 4 Weighted Pillars & Lending Moat -->
      <div class="s9-pillars-col">
        <div class="s9-pillars-grid">
          <div class="s9-pillar-card">
            <div class="s9-pillar-pct">35%</div>
            <div class="s9-pillar-title">Payment Velocity & Stability</div>
            <div class="s9-pillar-desc">Evaluates 30-day rolling UPI volume, ticket size dispersion, daily cashflow predictability, and peak hour velocity.</div>
          </div>

          <div class="s9-pillar-card">
            <div class="s9-pillar-pct">25%</div>
            <div class="s9-pillar-title">Inventory Turnover & Health</div>
            <div class="s9-pillar-desc">Monitors stockout recurrence, replenishment consistency, multimodal invoice audits, and shelf availability ratios.</div>
          </div>

          <div class="s9-pillar-card">
            <div class="s9-pillar-pct">20%</div>
            <div class="s9-pillar-title">Customer Retention & Loyalty</div>
            <div class="s9-pillar-desc">Tracks repeat customer ratios, churn recovery speed via 1-tap WhatsApp campaigns, and Customer Lifetime Value (CLV).</div>
          </div>

          <div class="s9-pillar-card">
            <div class="s9-pillar-pct">20%</div>
            <div class="s9-pillar-title">Supplier Settlement Discipline</div>
            <div class="s9-pillar-desc">Analyzes invoice payment clearance promptness, dispute frequency, and wholesaler price audit verification integrity.</div>
          </div>
        </div>

        <!-- The Paytm Lending Moat -->
        <div class="s9-moat-box">
          🛡️ <strong>Paytm's Unfair Lending Moat:</strong> Traditional banks reject Kiranas due to lack of balance sheets. Paytm possesses live ground-truth cashflow telemetry and multimodal inventory health. This enables pre-underwritten credit lines with <strong>40% lower default rates</strong> and automated escrow collection on daily settlements with zero CAC.
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 09</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 10: BUSINESS MODEL, ROADMAP & CLOSING VISION (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-10">
    <div class="s10-banner"></div>
    <div class="s10-banner-overlay"></div>

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

    <div class="s10-content">
      <div style="display: inline-block; background: #0077FC; color: #ffffff; padding: 5px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px;">
        THE VISION AHEAD
      </div>

      <h2 class="s10-hero-title">The Future of Indian Retail: Autonomous Kiranas</h2>
      <p class="s10-hero-sub">Empowering 30 Million+ Indian merchants with enterprise AI—without requiring new hardware, apps, or behavioral changes.</p>

      <div class="s10-main-grid">
        <!-- Left: 3-Year Monetization & Growth Arches -->
        <div class="s10-monetize-box">
          <div class="s10-box-h">3-Year Monetization (ARR Growth)</div>
          
          <div class="s10-arches-row">
            <div class="s10-arch-col">
              <div style="font-size: 13px; font-weight: 800; color: #0077FC;">₹40 Cr</div>
              <div class="s10-arch-bar y1"></div>
              <div style="font-size: 11.5px; font-weight: 700; color: #64748b;">Year 1</div>
            </div>
            <div class="s10-arch-col">
              <div style="font-size: 13px; font-weight: 800; color: #0077FC;">₹120 Cr</div>
              <div class="s10-arch-bar y2"></div>
              <div style="font-size: 11.5px; font-weight: 700; color: #64748b;">Year 2</div>
            </div>
            <div class="s10-arch-col">
              <div style="font-size: 13px; font-weight: 800; color: #0077FC;">₹320 Cr</div>
              <div class="s10-arch-bar y3"></div>
              <div style="font-size: 11.5px; font-weight: 700; color: #64748b;">Year 3</div>
            </div>
          </div>

          <div class="s10-streams-list">
            <div>• <strong>SaaS Subscription:</strong> ₹299–₹999/mo tiered merchant intelligence tier.</div>
            <div>• <strong>Campaign Take-Rate:</strong> 1.5%–2% on incremental revenue driven via WhatsApp.</div>
            <div>• <strong>Lending Origination:</strong> 1.5%–2.5% origination fee on underwritten credit lines.</div>
          </div>
        </div>

        <!-- Right: 5-Phase Scaling Roadmap -->
        <div class="s10-roadmap-box">
          <div style="font-size: 16px; font-weight: 700; color: #231F20; margin-bottom: 10px;">18-Month Scaling Roadmap</div>

          <div class="s10-phases-grid">
            <div class="s10-phase-card">
              <strong>PHASE 1: MVP</strong>
              <span>UPI telemetry, daily briefings, anomaly alerts.</span>
            </div>
            <div class="s10-phase-card">
              <strong>PHASE 2: OCR</strong>
              <span>Paper bills, khaata diaries, shelf vision.</span>
            </div>
            <div class="s10-phase-card">
              <strong>PHASE 3: AGENTS</strong>
              <span>LangGraph multi-agent demand forecasting.</span>
            </div>
            <div class="s10-phase-card">
              <strong>PHASE 4: VOICE</strong>
              <span>1-tap campaigns & 10+ Indic voice calls.</span>
            </div>
            <div class="s10-phase-card">
              <strong>PHASE 5: SCALE</strong>
              <span>Bharat-wide rollout & lending credit lines.</span>
            </div>
          </div>

          <div class="s10-meta-row">
            <div class="meta-col">
              <div class="meta-label">Presented by</div>
              <div class="meta-val">Team Sentinels (Akshat Arya & Mayank Yadav)</div>
            </div>
            <div class="meta-col">
              <div class="meta-label">Hackathon Track</div>
              <div class="meta-val">Merchant Growth AI • Paytm Build for India</div>
            </div>
            <div class="meta-col">
              <div class="meta-label">Repository & Contact</div>
              <div class="meta-val">akshatarya2507@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer" style="border-top: none; bottom: 24px;">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 10</span>
    </footer>
  </section>

</div>

</body>
</html>
"""

# Write HTML
output_html = "deck_presentation.html"
with open(output_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated {output_html} successfully!")

# Compile to PDF
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
pdf_file = os.path.abspath("Paytm_Merchant_Growth_Agent_Pitch_Deck.pdf")
html_path = os.path.abspath(output_html)

print(f"Compiling {html_path} to {pdf_file} via headless Chrome...")
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_file}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome STDOUT:", res.stdout)
print("Chrome STDERR:", res.stderr)

if os.path.exists(pdf_file):
    print(f"PDF compiled successfully! Size: {os.path.getsize(pdf_file):,} bytes")
    doc = fitz.open(pdf_file)
    print(f"Verified total pages in compiled PDF: {len(doc)}")
    
    # Render preview PNGs for all 10 pages
    output_dir = "rendered_output_10"
    os.makedirs(output_dir, exist_ok=True)
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(dpi=150)
        out_img = os.path.join(output_dir, f"slide_{i}.png")
        pix.save(out_img)
        print(f"Rendered Slide {i} -> {out_img}")
else:
    print("Error: PDF compilation failed!")
