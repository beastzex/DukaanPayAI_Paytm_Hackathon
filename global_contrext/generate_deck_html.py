import os
import base64
import subprocess
import fitz  # PyMuPDF

print("Preparing assets for base64 encoding...")

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
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
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
    .interactive-toolbar {{
      display: none !important;
    }}
  }}

  .deck-wrapper {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 40px 0;
  }}

  @media print {{
    .deck-wrapper {{
      padding: 0;
      gap: 0;
    }}
  }}

  .slide {{
    width: 1440px;
    height: 810px;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 25px 60px rgba(0,0,0,0.5);
  }}

  @media print {{
    .slide {{
      box-shadow: none;
    }}
  }}

  /* Color Schemes */
  .slide.theme-light {{
    background: #ffffff;
    color: #231F20;
  }}

  .slide.theme-dark {{
    background: #231F20;
    color: #ffffff;
  }}

  /* Reusable Header */
  .slide-header {{
    position: absolute;
    top: 36px;
    left: 74px;
    right: 74px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
  }}

  .header-left {{
    display: flex;
    align-items: center;
    gap: 14px;
  }}

  .logo-sunburst {{
    width: 32px;
    height: 32px;
  }}

  .brand-text {{
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }}

  .theme-light .brand-text {{ color: #231F20; }}
  .theme-dark .brand-text {{ color: #ffffff; }}

  .header-right {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}

  .year-pill {{
    padding: 8px 22px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }}

  .theme-light .year-pill {{
    background: #231F20;
    color: #ffffff;
  }}

  .theme-dark .year-pill {{
    background: #000000;
    color: #ffffff;
  }}

  .arrow-btn {{
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #0077FC;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
  }}

  .arrow-btn svg {{
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }}

  /* Reusable Footer */
  .slide-footer {{
    position: absolute;
    bottom: 32px;
    left: 74px;
    right: 74px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    letter-spacing: 0.02em;
    z-index: 20;
  }}

  .theme-light .slide-footer {{
    color: #64748b;
    border-top: 1px solid rgba(0,0,0,0.06);
    padding-top: 12px;
  }}

  .theme-dark .slide-footer {{
    color: #94a3b8;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 12px;
  }}

  .footer-url {{
    font-weight: 400;
    opacity: 0.85;
  }}

  .footer-page {{
    font-weight: 400;
  }}

  .footer-page strong {{
    font-weight: 700;
    color: inherit;
  }}

  /* Universal Slide Typography - Carefully sized to prevent vertical collision */
  .display-title-dark {{
    font-size: 46px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: #ffffff;
    margin-bottom: 6px;
  }}

  .display-title-light {{
    font-size: 46px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: #231F20;
    margin-bottom: 6px;
  }}

  .slide-subhead-dark {{
    font-size: 16px;
    line-height: 1.4;
    color: #cbd5e1;
    font-weight: 400;
  }}

  .slide-subhead-light {{
    font-size: 16px;
    line-height: 1.4;
    color: #4b5563;
    font-weight: 400;
  }}

  /* =================================================================
     SLIDE 1: COVER
     ================================================================= */
  #slide-1 {{
    background-image: url('{b64_p1_clean}');
    background-size: 1440px 810px;
    background-repeat: no-repeat;
    background-position: center center;
  }}

  .s1-brand-text {{
    position: absolute;
    left: 122px;
    top: 45px;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #231F20;
    z-index: 15;
  }}

  .s1-year-text {{
    position: absolute;
    right: 154px;
    top: 48px;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    z-index: 15;
    letter-spacing: 0.03em;
  }}

  .s1-content {{
    position: absolute;
    top: 148px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s1-track-pill {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    border-radius: 999px;
    background: rgba(0, 119, 252, 0.1);
    border: 1px solid rgba(0, 119, 252, 0.3);
    color: #0077FC;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }}

  .s1-hero-title {{
    font-size: 78px;
    font-weight: 700;
    color: #231F20;
    letter-spacing: -0.04em;
    line-height: 1.04;
    margin-bottom: 16px;
  }}

  .s1-hero-title span {{
    color: #0077FC;
  }}

  .s1-hero-subtitle {{
    font-size: 24px;
    font-weight: 500;
    color: #4b5563;
    letter-spacing: -0.015em;
    line-height: 1.35;
    margin-bottom: 22px;
    max-width: 960px;
  }}

  .s1-value-prop {{
    display: inline-block;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 5px solid #0077FC;
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 24px;
  }}

  .s1-presenter-box {{
    margin-top: 4px;
  }}

  .s1-presenter-label {{
    font-size: 14.5px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 4px;
  }}

  .s1-presenter-name {{
    font-size: 26px;
    font-weight: 700;
    color: #231F20;
    letter-spacing: -0.01em;
  }}

  .s1-meta-row {{
    position: absolute;
    bottom: 40px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    z-index: 10;
  }}

  .meta-col .meta-label {{
    font-size: 13.5px;
    color: #64748b;
    margin-bottom: 4px;
  }}

  .meta-col .meta-val {{
    font-size: 17.5px;
    font-weight: 700;
    color: #231F20;
  }}

  /* =================================================================
     SLIDE 2: THE PROBLEM WE SOLVE
     ================================================================= */
  #slide-2 {{
    background: #231F20;
  }}

  .s2-layout {{
    position: absolute;
    top: 118px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 480px 1fr;
    gap: 46px;
    align-items: center;
    z-index: 10;
  }}

  .s2-photo-card {{
    width: 480px;
    height: 575px;
    border-radius: 36px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    position: relative;
    border: 1px solid rgba(255,255,255,0.1);
  }}

  .s2-photo-card img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }}

  .s2-photo-badge {{
    position: absolute;
    bottom: 22px;
    left: 22px;
    right: 22px;
    background: rgba(35, 31, 32, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 18px;
    padding: 15px 18px;
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.15);
  }}

  .s2-photo-badge strong {{
    display: block;
    font-size: 17px;
    color: #0077FC;
    margin-bottom: 3px;
  }}

  .s2-right-content {{
    display: flex;
    flex-direction: column;
  }}

  .s2-title {{
    font-size: 56px;
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: #ffffff;
    margin-bottom: 12px;
  }}

  .s2-desc {{
    font-size: 16px;
    line-height: 1.48;
    color: #cbd5e1;
    margin-bottom: 20px;
  }}

  .s2-questions-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }}

  .s2-q-card {{
    background: #2A2627;
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 4px solid #0077FC;
    border-radius: 16px;
    padding: 13px 16px;
  }}

  .s2-q-tag {{
    font-size: 12px;
    font-weight: 700;
    color: #0077FC;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }}

  .s2-q-text {{
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 1.35;
  }}

  /* =================================================================
     SLIDE 3: WHAT'S BROKEN TODAY
     ================================================================= */
  #slide-3 {{
    background: #ffffff;
  }}

  .s3-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s3-cards-row {{
    position: absolute;
    top: 235px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 28px;
    z-index: 10;
  }}

  .s3-card {{
    border-radius: 36px;
    padding: 38px 34px;
    height: 480px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }}

  .s3-card.blue {{
    background: #0077FC;
    color: #ffffff;
  }}

  .s3-card.dark {{
    background: #231F20;
    color: #ffffff;
  }}

  .s3-card.light {{
    background: #F4F4F4;
    color: #231F20;
  }}

  .s3-card-num {{
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 22px;
  }}

  .s3-card-title {{
    font-size: 25px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 14px;
  }}

  .s3-card-body {{
    font-size: 16px;
    line-height: 1.5;
    opacity: 0.94;
  }}

  /* =================================================================
     SLIDE 4: THE OPPORTUNITY & SCALE
     ================================================================= */
  #slide-4 {{
    background: #231F20;
  }}

  .s4-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 10;
  }}

  .s4-metrics-grid {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    z-index: 10;
  }}

  .s4-metric-card {{
    background: #2A2627;
    border-radius: 26px;
    padding: 28px 24px;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  .s4-metric-val {{
    font-size: 54px;
    font-weight: 700;
    color: #0077FC;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 12px;
  }}

  .s4-metric-val.alt {{
    color: #4BA0FF;
  }}

  .s4-metric-title {{
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6px;
  }}

  .s4-metric-desc {{
    font-size: 14px;
    line-height: 1.42;
    color: #cbd5e1;
  }}

  .s4-tam-row {{
    position: absolute;
    bottom: 75px;
    left: 74px;
    right: 74px;
    background: rgba(0, 119, 252, 0.12);
    border: 1px solid rgba(0, 119, 252, 0.3);
    border-radius: 20px;
    padding: 18px 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
    z-index: 10;
  }}

  .s4-tam-item strong {{
    display: block;
    color: #4BA0FF;
    font-size: 15.5px;
    margin-bottom: 3px;
  }}

  .s4-tam-item span {{
    font-size: 13.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }}

  /* =================================================================
     SLIDE 5: OUR SOLUTION - THE AUTONOMOUS LOOP
     ================================================================= */
  #slide-5 {{
    background: #ffffff;
  }}

  .s5-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s5-loop-container {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    z-index: 10;
  }}

  .s5-step-card {{
    background: #F4F4F4;
    border-radius: 26px;
    padding: 24px 18px;
    height: 480px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb;
    position: relative;
  }}

  .s5-step-card.active {{
    background: #0077FC;
    color: #ffffff;
    border: none;
    box-shadow: 0 15px 40px rgba(0, 119, 252, 0.3);
  }}

  .s5-step-num {{
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 12px;
    opacity: 0.85;
  }}

  .s5-step-name {{
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }}

  .s5-step-desc {{
    font-size: 13.5px;
    line-height: 1.48;
    opacity: 0.92;
    flex-grow: 1;
  }}

  .s5-step-tag {{
    font-size: 11px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0,0,0,0.06);
    display: inline-block;
    margin-top: 10px;
  }}

  .s5-step-card.active .s5-step-tag {{
    background: rgba(255,255,255,0.2);
    color: #ffffff;
  }}

  
  
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

/* =================================================================
     SLIDE 7: TECHNICAL ARCHITECTURE
     ================================================================= */
  #slide-7 {{
    background: #191718;
  }}

  .s6-glow {{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    height: 520px;
    background: radial-gradient(circle, rgba(0, 119, 252, 0.22) 0%, rgba(25, 23, 24, 0) 70%);
    filter: blur(40px);
    pointer-events: none;
    z-index: 1;
  }}

  .s6-header {{
    position: absolute;
    top: 75px;
    left: 74px;
    right: 74px;
    text-align: center;
    z-index: 10;
  }}

  .s6-title {{
    font-size: 42px;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #ffffff;
    margin-bottom: 4px;
  }}

  .s6-sub {{
    font-size: 15px;
    color: #4BA0FF;
    font-weight: 500;
  }}

  .s6-diagram-box {{
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

  .s6-diagram-box img {{
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 18px;
  }}

  .s6-desc {{
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
     SLIDE 7: THE MULTI-AGENT ECOSYSTEM
     ================================================================= */
  #slide-8 {{
    background: #ffffff;
  }}

  .s7-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s7-grid {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    z-index: 10;
  }}

  .s7-agent-card {{
    background: #F4F4F4;
    border-radius: 26px;
    padding: 26px 24px;
    border: 1px solid #e5e7eb;
    height: 230px;
    display: flex;
    flex-direction: column;
  }}

  .s7-agent-card.featured {{
    background: #231F20;
    color: #ffffff;
    border: 1px solid #333333;
  }}

  .s7-agent-card.featured .s7-agent-title {{
    color: #4BA0FF;
  }}

  .s7-agent-card.featured .s7-agent-desc {{
    color: #cbd5e1;
  }}

  .s7-agent-icon {{
    width: 32px;
    height: 32px;
    color: #0077FC;
    margin-bottom: 10px;
  }}

  .s7-agent-icon svg {{
    width: 100%;
    height: 100%;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
  }}

  .s7-agent-title {{
    font-size: 19px;
    font-weight: 700;
    color: #231F20;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }}

  .s7-agent-desc {{
    font-size: 14px;
    line-height: 1.45;
    color: #555555;
  }}

  /* =================================================================
     SLIDE 8: ZERO-FRICTION MULTIMODAL INGESTION
     ================================================================= */
  #slide-9 {{
    background: #231F20;
  }}

  .s8-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s8-cards-row {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 26px;
    z-index: 10;
  }}

  .s8-ingest-card {{
    background: #2A2627;
    border-radius: 32px;
    padding: 34px 28px;
    height: 480px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  .s8-card-icon {{
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: #0077FC;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    margin-bottom: 20px;
  }}

  .s8-card-icon svg {{
    width: 26px;
    height: 26px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
  }}

  .s8-card-title {{
    font-size: 23px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
  }}

  .s8-card-desc {{
    font-size: 14.5px;
    line-height: 1.5;
    color: #cbd5e1;
    margin-bottom: 20px;
    flex-grow: 1;
  }}

  .s8-tech-pill {{
    background: rgba(0, 119, 252, 0.15);
    border: 1px solid rgba(0, 119, 252, 0.3);
    color: #4BA0FF;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }}

  /* =================================================================
     SLIDE 9: WHATSAPP AS THE OS
     ================================================================= */
  #slide-10 {{
    background: #ffffff;
  }}

  .s9-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s9-chat-grid {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
    z-index: 10;
  }}

  .s9-chat-card {{
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 28px;
    padding: 24px 20px;
    height: 480px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0,0,0,0.04);
  }}

  .s9-chat-header {{
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dcfce7;
    margin-bottom: 14px;
  }}

  .s9-wa-badge {{
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #25D366;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
  }}

  .s9-chat-type {{
    font-size: 15px;
    font-weight: 700;
    color: #166534;
  }}

  .s9-chat-time {{
    font-size: 12px;
    color: #15803d;
    margin-left: auto;
  }}

  .s9-bubble {{
    background: #ffffff;
    border-radius: 18px;
    border-top-left-radius: 4px;
    padding: 15px;
    font-size: 14px;
    line-height: 1.48;
    color: #1f2937;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    margin-bottom: 12px;
    flex-grow: 1;
  }}

  .s9-bubble strong {{
    color: #0f172a;
    display: block;
    margin-bottom: 6px;
    font-size: 14.5px;
  }}

  .s9-action-btn {{
    background: #0077FC;
    color: #ffffff;
    padding: 12px;
    border-radius: 14px;
    text-align: center;
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }}

  /* =================================================================
     SLIDE 10: VOICE AI & INDIC LANGUAGES
     ================================================================= */
  #slide-11 {{
    background: #231F20;
  }}

  .s10-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s10-grid {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 26px;
    z-index: 10;
  }}

  .s10-card {{
    background: #2A2627;
    border-radius: 32px;
    padding: 34px 28px;
    height: 480px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  .s10-card-badge {{
    width: 46px;
    height: 46px;
    border-radius: 15px;
    background: #0077FC;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 18px;
  }}

  .s10-card-title {{
    font-size: 23px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
  }}

  .s10-card-desc {{
    font-size: 14.5px;
    line-height: 1.5;
    color: #cbd5e1;
    margin-bottom: 18px;
    flex-grow: 1;
  }}

  .s10-vernacular-pill {{
    background: rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 13px;
    color: #4BA0FF;
    font-style: italic;
    border-left: 3px solid #0077FC;
  }}

  /* =================================================================
     SLIDE 11: PREDICTIVE DEMAND & LOST REVENUE
     ================================================================= */
  #slide-12 {{
    background: #ffffff;
  }}

  .s11-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s11-grid {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    z-index: 10;
  }}

  .s11-panel {{
    background: #F4F4F4;
    border-radius: 32px;
    padding: 34px 32px;
    height: 480px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb;
  }}

  .s11-panel.highlight {{
    background: #0077FC;
    color: #ffffff;
    border: none;
    box-shadow: 0 20px 45px rgba(0, 119, 252, 0.25);
  }}

  .s11-panel-title {{
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }}

  .s11-panel-sub {{
    font-size: 15px;
    line-height: 1.48;
    margin-bottom: 22px;
    opacity: 0.92;
  }}

  .s11-list {{
    display: flex;
    flex-direction: column;
    gap: 14px;
  }}

  .s11-list-item {{
    display: flex;
    align-items: flex-start;
    gap: 14px;
    font-size: 14.5px;
    line-height: 1.45;
  }}

  .s11-check {{
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
    margin-top: 2px;
  }}

  .s11-panel.highlight .s11-check {{
    background: rgba(255,255,255,0.25);
    color: #ffffff;
  }}

  /* =================================================================
     SLIDE 12: MERCHANT HEALTH SCORE & LENDING
     ================================================================= */
  #slide-13 {{
    background: #231F20;
  }}

  .s12-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s12-content {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 36px;
    align-items: center;
    z-index: 10;
  }}

  .s12-gauge-card {{
    background: #2A2627;
    border-radius: 32px;
    padding: 34px 26px;
    height: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  .s12-score-circle {{
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 12px solid #0077FC;
    border-top-color: #4BA0FF;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
  }}

  .s12-score-num {{
    font-size: 56px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }}

  .s12-score-label {{
    font-size: 13.5px;
    color: #4BA0FF;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-top: 4px;
  }}

  .s12-pillars-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }}

  .s12-pillar-card {{
    background: #2A2627;
    border-radius: 22px;
    padding: 20px 22px;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  .s12-pillar-weight {{
    font-size: 12.5px;
    font-weight: 700;
    color: #0077FC;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }}

  .s12-pillar-name {{
    font-size: 17px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }}

  .s12-pillar-desc {{
    font-size: 13px;
    color: #cbd5e1;
    line-height: 1.4;
  }}

  .s12-synergy-pill {{
    grid-column: span 2;
    background: rgba(0, 119, 252, 0.15);
    border: 1px solid rgba(0, 119, 252, 0.35);
    border-radius: 16px;
    padding: 14px 18px;
    color: #ffffff;
    font-size: 14px;
    line-height: 1.4;
  }}

  .s12-synergy-pill strong {{
    color: #4BA0FF;
  }}

  /* =================================================================
     SLIDE 13: ENTERPRISE TECH STACK & SCALABILITY
     ================================================================= */
  #slide-14 {{
    background: #ffffff;
  }}

  .s13-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s13-grid {{
    position: absolute;
    top: 225px;
    left: 74px;
    right: 74px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    z-index: 10;
  }}

  .s13-card {{
    background: #F4F4F4;
    border-radius: 26px;
    padding: 26px 22px;
    height: 230px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb;
  }}

  .s13-category {{
    font-size: 12.5px;
    font-weight: 700;
    color: #0077FC;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }}

  .s13-title {{
    font-size: 19px;
    font-weight: 700;
    color: #231F20;
    margin-bottom: 6px;
  }}

  .s13-desc {{
    font-size: 13.5px;
    line-height: 1.45;
    color: #555555;
    font-family: 'JetBrains Mono', monospace;
  }}

  /* =================================================================
     SLIDE 14: BUSINESS MODEL & UNIT ECONOMICS
     ================================================================= */
  #slide-15 {{
    background: #231F20;
  }}

  .s14-header {{
    position: absolute;
    top: 100px;
    left: 74px;
    right: 74px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 10;
  }}

  .s14-body {{
    position: absolute;
    top: 240px;
    left: 74px;
    right: 74px;
    display: flex;
    gap: 50px;
    align-items: center;
    z-index: 10;
  }}

  .s14-chart-box {{
    width: 560px;
    flex-shrink: 0;
  }}

  .s14-streams-box {{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }}

  .s14-stream-item {{
    display: flex;
    align-items: flex-start;
    gap: 18px;
  }}

  .s14-stream-icon {{
    width: 50px;
    height: 50px;
    border-radius: 15px;
    background: #0077FC;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    flex-shrink: 0;
  }}

  .s14-stream-icon.alt {{
    background: #AED2FF;
    color: #231F20;
  }}

  .s14-stream-icon svg {{
    width: 24px;
    height: 24px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
  }}

  .s14-stream-title {{
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
  }}

  .s14-stream-desc {{
    font-size: 14px;
    line-height: 1.45;
    color: #cbd5e1;
  }}

  /* =================================================================
     SLIDE 15: ROADMAP & CLOSING VISION
     ================================================================= */
  #slide-16 {{
    background: #ffffff;
  }}

  .s15-banner {{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 250px;
    background-image: url('{b64_retail_future}');
    background-size: cover;
    background-position: center 30%;
    z-index: 1;
    filter: saturate(1.05);
  }}

  .s15-banner-overlay {{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 250px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(255,255,255,1) 100%);
    z-index: 2;
  }}

  .s15-content {{
    position: absolute;
    top: 260px;
    left: 74px;
    right: 74px;
    z-index: 10;
  }}

  .s15-pill {{
    display: inline-block;
    background: #0077FC;
    color: #ffffff;
    padding: 6px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
  }}

  .s15-title {{
    font-size: 46px;
    font-weight: 700;
    color: #231F20;
    letter-spacing: -0.03em;
    line-height: 1.12;
    margin-bottom: 8px;
  }}

  .s15-subtitle {{
    font-size: 16.5px;
    color: #4b5563;
    font-weight: 500;
    margin-bottom: 20px;
    max-width: 900px;
    line-height: 1.4;
  }}

  .s15-roadmap-mini {{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }}

  .s15-phase-box {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 14px;
  }}

  .s15-phase-box strong {{
    display: block;
    color: #0077FC;
    font-size: 12px;
    margin-bottom: 3px;
    letter-spacing: 0.02em;
  }}

  .s15-phase-box span {{
    font-size: 12px;
    color: #475569;
    line-height: 1.35;
  }}

  .s15-meta-row {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
  }}

  .s15-meta-row .meta-label {{
    font-size: 13px;
    color: #64748b;
    margin-bottom: 4px;
  }}

  .s15-meta-row .meta-val {{
    font-size: 17.5px;
    font-weight: 700;
    color: #231F20;
  }}

  /* Arches Chart on Slide 14 */
  .arch-chart-wrap {{
    display: flex;
    align-items: flex-end;
    gap: 24px;
    height: 380px;
    position: relative;
    padding-left: 55px;
    border-bottom: 2px solid rgba(255,255,255,0.2);
  }}

  .chart-y-axis {{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
    color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
  }}

  .grid-lines {{
    position: absolute;
    left: 55px;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
  }}

  .grid-line {{
    width: 100%;
    border-bottom: 1px dashed rgba(255,255,255,0.1);
  }}

  .arch-col {{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
  }}

  .arch-bar {{
    width: 100%;
    border-radius: 999px 999px 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-shadow: 0 15px 35px rgba(0, 119, 252, 0.25);
  }}

  .arch-bar.c1 {{ height: 160px; }}
  .arch-bar.c2 {{ height: 260px; }}
  .arch-bar.c3 {{ height: 350px; }}

  .segment-light {{ background: #AED2FF; }}
  .segment-mid {{ background: #4BA0FF; }}
  .segment-blue {{ background: #0077FC; }}

  .arch-label {{
    margin-top: 14px;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
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
      <div class="s1-track-pill">
        🚀 PAYTM BUILD FOR INDIA AI HACKATHON • MERCHANT GROWTH AI TRACK
      </div>

      <h1 class="s1-hero-title">
        Paytm Merchant<br>
        <span>Growth Agent</span>
      </h1>

      <p class="s1-hero-subtitle">
        The Autonomous AI Business Teammate That Runs Alongside Every Kirana Store in India.
      </p>

      <div class="s1-value-prop">
        💡 <strong>Core Mission:</strong> Transforming Paytm from a passive payment soundbox into an active everyday business growth partner.
      </div>

      <div class="s1-presenter-box">
        <div class="s1-presenter-label">Presented by</div>
        <div class="s1-presenter-name">Team Sentinels (Akshat Arya and Mayank Yadav)</div>
      </div>
    </div>

    <div class="s1-meta-row">
      <div class="meta-col">
        <div class="meta-label">Date</div>
        <div class="meta-val">September 2026</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Track</div>
        <div class="meta-val">Merchant Growth AI Track</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Core Engine</div>
        <div class="meta-val">LangGraph Multi-Agent System</div>
      </div>
    </div>
  </section>

  <!-- ===============================================================
       SLIDE 2: THE PROBLEM WE SOLVE (DARK)
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

    <div class="s2-layout">
      <!-- Indian Merchant Hero Photo -->
      <div class="s2-photo-card">
        <img src="{b64_kirana_hero}" alt="Rajesh Gupta - Kirana Store Owner">
        <div class="s2-photo-badge">
          <strong>Rajesh Gupta • Gupta Kirana Store</strong>
          Generates 200+ UPI payments daily, but operates completely blind without analytics.
        </div>
      </div>

      <div class="s2-right-content">
        <h2 class="s2-title">The Problem<br>We Solve</h2>
        <p class="s2-desc">
          Indian merchants generate rich UPI data every single day through Paytm QR. Yet, they lack the tools to turn payment logs into business decisions. Kirana owners work 14–hour days struggling with 6 unanswered questions:
        </p>

        <div class="s2-questions-grid">
          <div class="s2-q-card">
            <div class="s2-q-tag">Inventory Stockout</div>
            <div class="s2-q-text">“Will I run out of milk and bread before tomorrow morning?”</div>
          </div>
          <div class="s2-q-card">
            <div class="s2-q-tag">Revenue Anomaly</div>
            <div class="s2-q-text">“Why did my UPI sales drop 30% this Tuesday?”</div>
          </div>
          <div class="s2-q-card">
            <div class="s2-q-tag">Customer Churn</div>
            <div class="s2-q-text">“Which regular customers haven't visited in 14 days?”</div>
          </div>
          <div class="s2-q-card">
            <div class="s2-q-tag">Demand Spike</div>
            <div class="s2-q-text">“Should I stock 50% more cold drinks this weekend?”</div>
          </div>
          <div class="s2-q-card">
            <div class="s2-q-tag">Supplier Pricing</div>
            <div class="s2-q-text">“Which wholesaler is overcharging me for cooking oil?”</div>
          </div>
          <div class="s2-q-card">
            <div class="s2-q-tag">Fintech Credit</div>
            <div class="s2-q-text">“Can I qualify for a ₹2,00,000 Paytm business loan?”</div>
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
       SLIDE 3: WHAT'S BROKEN TODAY (LIGHT)
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

    <div class="s3-header">
      <h2 class="display-title-light">What’s Broken in Today’s Market</h2>
      <p class="slide-subhead-light">Why existing retail solutions fail 95% of India's Kirana stores</p>
    </div>

    <div class="s3-cards-row">
      <div class="s3-card blue">
        <div class="s3-card-num">01.</div>
        <div class="s3-card-title">Passive Payment Traps</div>
        <div class="s3-card-body">
          Soundboxes and QRs only announce completed transactions. They capture zero product context, ignore customer churn, and leave merchants guessing why revenue fluctuates from day to day.
        </div>
      </div>

      <div class="s3-card dark">
        <div class="s3-card-num">02.</div>
        <div class="s3-card-title">Heavy ERP & POS Burden</div>
        <div class="s3-card-body">
          Traditional retail inventory and billing software demand tedious item barcode scanning and continuous manual ledger entry—creating an insurmountable adoption barrier for 95% of kiranas.
        </div>
      </div>

      <div class="s3-card light">
        <div class="s3-card-num">03.</div>
        <div class="s3-card-title">No Autonomous Action Loop</div>
        <div class="s3-card-body">
          Kirana owners have zero time to study complex analytics dashboards. Without an autonomous execution loop (instant WhatsApp offers, supplier reorders), business data remains completely unused.
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 03</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 4: THE OPPORTUNITY & SCALE (DARK)
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

    <div class="s4-header">
      <div>
        <h2 class="display-title-dark">India’s Kirana Economy by the Numbers</h2>
      </div>
      <div style="width: 440px; margin-top: 4px;">
        <p class="slide-subhead-dark">
          Paytm already owns the countertop payment surface. The missing strategic layer is an autonomous AI agent converting transactions into growth.
        </p>
      </div>
    </div>

    <div class="s4-metrics-grid">
      <div class="s4-metric-card">
        <div class="s4-metric-val">30M+</div>
        <div class="s4-metric-title">Active Merchants</div>
        <div class="s4-metric-desc">Digitally connected retailers using Paytm QR and Soundbox every single day.</div>
      </div>

      <div class="s4-metric-card">
        <div class="s4-metric-val alt">₹85B+</div>
        <div class="s4-metric-title">Daily UPI Volume</div>
        <div class="s4-metric-desc">Massive real-time transactional telemetry waiting to be transformed into intelligence.</div>
      </div>

      <div class="s4-metric-card">
        <div class="s4-metric-val">92%</div>
        <div class="s4-metric-title">Zero Inventory Tech</div>
        <div class="s4-metric-desc">Kiranas run on memory and paper notes, causing frequent stockouts and lost margins.</div>
      </div>

      <div class="s4-metric-card">
        <div class="s4-metric-val alt">40%</div>
        <div class="s4-metric-title">Silent Customer Churn</div>
        <div class="s4-metric-desc">Regular neighborhood shoppers drift to quick commerce without the merchant noticing.</div>
      </div>
    </div>

    <div class="s4-tam-row">
      <div class="s4-tam-item">
        <strong>Total Addressable Market (TAM): ₹250B+</strong>
        <span>Unserved working capital and inventory optimization gap across 63M+ Indian retail MSMEs.</span>
      </div>
      <div class="s4-tam-item">
        <strong>Serviceable Market (SAM): ₹85B</strong>
        <span>Annual high-frequency retail GMV flowing through active digital payment devices.</span>
      </div>
      <div class="s4-tam-item">
        <strong>Obtainable Market (SOM): ₹32B</strong>
        <span>Merchant credit origination, retention campaigns, and SaaS subscriptions across Paytm's 10M+ core.</span>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 04</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 5: OUR SOLUTION - THE AUTONOMOUS LOOP (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-5">
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

    <div class="s5-header">
      <h2 class="display-title-light">The 5-Stage Autonomous Growth Loop</h2>
      <p class="slide-subhead-light">A closed-loop AI system transforming passive UPI data into continuous merchant actions.</p>
    </div>

    <div class="s5-loop-container">
      <div class="s5-step-card">
        <div class="s5-step-num">01</div>
        <div class="s5-step-name">OBSERVE</div>
        <div class="s5-step-desc">Streams real-time Paytm QR transactions, local weather changes, cricket schedules, and upcoming regional festivals continuously.</div>
        <div class="s5-step-tag">UPI & External Telemetry</div>
      </div>

      <div class="s5-step-card">
        <div class="s5-step-num">02</div>
        <div class="s5-step-name">UNDERSTAND</div>
        <div class="s5-step-desc">Ingests handwritten notebook ledgers, paper supplier bills, and shelf photos via WhatsApp vision OCR with zero manual data entry.</div>
        <div class="s5-step-tag">Multimodal Perception</div>
      </div>

      <div class="s5-step-card active">
        <div class="s5-step-num">03</div>
        <div class="s5-step-name">PREDICT</div>
        <div class="s5-step-desc">Forecasts tomorrow's customer footfall, detects stockout timing, and calculates churning repeat customers before revenue is lost.</div>
        <div class="s5-step-tag">Predictive ML Models</div>
      </div>

      <div class="s5-step-card">
        <div class="s5-step-num">04</div>
        <div class="s5-step-name">RECOMMEND</div>
        <div class="s5-step-desc">Formulates high-ROI business recommendations in the merchant's local dialect (Hindi, Tamil, Hinglish) with clear projected revenue gains.</div>
        <div class="s5-step-tag">Vernacular Reasoning</div>
      </div>

      <div class="s5-step-card">
        <div class="s5-step-num">05</div>
        <div class="s5-step-name">EXECUTE</div>
        <div class="s5-step-desc">Dispatches hyper-targeted WhatsApp cashback campaigns and generates supplier reorder purchase orders upon 1-tap merchant approval.</div>
        <div class="s5-step-tag">1-Tap Action Execution</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 05</span>
    </footer>
  </section>

  
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

  <!-- ===============================================================
       SLIDE 7: TECHNICAL ARCHITECTURE DIAGRAM (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-7">
    <div class="s6-glow"></div>

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

    <div class="s6-header">
      <h2 class="s6-title">End-to-End System Architecture</h2>
      <p class="s6-sub">LangGraph Multi-Agent Orchestration & Edge Micro-Services Architecture</p>
    </div>

    <!-- Prominent System Architecture Container -->
    <div class="s6-diagram-box">
      <img src="{b64_arch}" alt="Paytm Merchant Growth Agent - Architecture Diagram">
    </div>

    <div class="s6-desc">
      Enterprise multi-agent pipeline: Ingests Paytm UPI telemetry, WhatsApp multimodal OCR, predictive XGBoost/Prophet models, and LangGraph LLM supervisor into proactive loops across WhatsApp, Merchant App, and AI Voice Calls.
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 07</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 8: THE MULTI-AGENT ECOSYSTEM (LIGHT)
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

    <div class="s7-header">
      <h2 class="display-title-light">Specialized Autonomous Agents</h2>
      <p class="slide-subhead-light">Each agent focuses on a single business lever, coordinated by LangGraph with strict guardrails.</p>
    </div>

    <div class="s7-grid">
      <div class="s7-agent-card">
        <div class="s7-agent-icon"><svg viewBox="0 0 24 24"><path d="M3 3v18h18M7 14l4-4 4 4 5-6"/></svg></div>
        <div class="s7-agent-title">Business Intelligence Agent</div>
        <div class="s7-agent-desc">Monitors revenue velocity, flags sudden payment dips, identifies top revenue hours, and computes daily profit margins.</div>
      </div>

      <div class="s7-agent-card">
        <div class="s7-agent-icon"><svg viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
        <div class="s7-agent-title">Inventory & Supplier Agent</div>
        <div class="s7-agent-desc">Predicts stockouts 3-5 days ahead via Prophet forecasting, parses supplier invoices with OCR, and benchmarks prices.</div>
      </div>

      <div class="s7-agent-card">
        <div class="s7-agent-icon"><svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg></div>
        <div class="s7-agent-title">Voice & Telephony Agent</div>
        <div class="s7-agent-desc">Conducts low-latency interactive voice briefings in Hindi, Marathi, Tamil, etc., via Bhashini & Twilio edge connectors.</div>
      </div>

      <div class="s7-agent-card">
        <div class="s7-agent-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div class="s7-agent-title">Customer Retention Agent</div>
        <div class="s7-agent-desc">Tracks buyer purchase intervals, identifies churn risks, and drafts hyper-targeted WhatsApp loyalty incentives.</div>
      </div>

      <div class="s7-agent-card">
        <div class="s7-agent-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
        <div class="s7-agent-title">Campaign Execution Agent</div>
        <div class="s7-agent-desc">Auto-generates high-converting WhatsApp cashback offers and executes campaigns immediately upon 1-tap merchant approval.</div>
      </div>

      <div class="s7-agent-card featured">
        <div class="s7-agent-icon" style="color: #4BA0FF;"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
        <div class="s7-agent-title">LangGraph Orchestrator</div>
        <div class="s7-agent-desc">Supervisor agent with state memory, context routing, tool calling, and human-in-the-loop safety verification.</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 08</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 9: ZERO-FRICTION MULTIMODAL INGESTION (DARK)
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

    <div class="s8-header">
      <h2 class="display-title-dark">Zero Manual Entry: WhatsApp as the Scanner</h2>
      <p class="slide-subhead-dark">Eliminating friction: 95% of merchants already know how to send photos and voice notes.</p>
    </div>

    <div class="s8-cards-row">
      <div class="s8-ingest-card">
        <div class="s8-card-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div>
        <div class="s8-card-title">Paper Wholesaler Bills</div>
        <div class="s8-card-desc">Shopkeepers simply snap a phone photo of supplier paper bills on WhatsApp. The Vision OCR pipeline automatically extracts line items, quantities, and cost prices into the feature store.</div>
        <div class="s8-tech-pill">OCR • Document AI • Table Parsing</div>
      </div>

      <div class="s8-ingest-card">
        <div class="s8-card-icon"><svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg></div>
        <div class="s8-card-title">Handwritten Daily Ledgers</div>
        <div class="s8-card-desc">Over 80% of Kiranas maintain physical 'Khaata' diaries for credit and daily expenses. Multimodal LLMs transcribe handwritten Indic text, updating customer balances automatically.</div>
        <div class="s8-tech-pill">Indic Handwriting OCR • Vision LLM</div>
      </div>

      <div class="s8-ingest-card">
        <div class="s8-card-icon"><svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <div class="s8-card-title">Shelf Photos & Voice Notes</div>
        <div class="s8-card-desc">Merchants snap grocery shelf photos to detect empty spaces, or simply speak a WhatsApp voice note: “<em>Stocked 50 kg Aashirvaad Atta at ₹38/kg</em>”. Stock updates in under 2 seconds.</div>
        <div class="s8-tech-pill">YOLOv11 • Whisper Speech-to-Text</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 09</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 10: WHATSAPP AS THE OS (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-10">
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

    <div class="s9-header">
      <h2 class="display-title-light">WhatsApp as the Merchant OS</h2>
      <p class="slide-subhead-light">Merchants check WhatsApp 40+ times a day. We deliver actionable intelligence directly into their habit.</p>
    </div>

    <div class="s9-chat-grid">
      <!-- 07:30 AM Briefing -->
      <div class="s9-chat-card">
        <div class="s9-chat-header">
          <div class="s9-wa-badge">P</div>
          <div class="s9-chat-type">Morning Briefing</div>
          <div class="s9-chat-time">07:30 AM</div>
        </div>
        <div class="s9-bubble">
          <strong>🌅 Shubh Prabhat, Rameshji!</strong>
          • Yesterday Sales: <strong>₹18,450</strong> (142 UPI payments, +18% vs last Tuesday)<br>
          • Peak Hour: 7:00 PM – 9:30 PM<br>
          • ⚠️ Weather Alert: 42°C heatwave today. Cold beverage demand predicted to spike +35%. Ensure 3 crates of Thums Up & Coke are chilled!
        </div>
        <div class="s9-action-btn">Acknowledged 👍</div>
      </div>

      <!-- 02:15 PM Stockout Alert -->
      <div class="s9-chat-card">
        <div class="s9-chat-header">
          <div class="s9-wa-badge">P</div>
          <div class="s9-chat-type">Predictive Stockout Alert</div>
          <div class="s9-chat-time">02:15 PM</div>
        </div>
        <div class="s9-bubble">
          <strong>🚨 Fast Stockout Warning</strong>
          Fortune Mustard Oil (1L) is down to <strong>3 bottles</strong>.<br><br>
          Based on your Tuesday velocity, you will run out by 6:30 PM tonight.<br><br>
          Wholesaler Agarwal Traders has 15-tin crates available at ₹1,820 (₹20 lower than last order).
        </div>
        <div class="s9-action-btn">Tap to Reorder from Wholesaler 🛒</div>
      </div>

      <!-- 05:45 PM Retention Campaign -->
      <div class="s9-chat-card">
        <div class="s9-chat-header">
          <div class="s9-wa-badge">P</div>
          <div class="s9-chat-type">1-Tap Retention Campaign</div>
          <div class="s9-chat-time">05:45 PM</div>
        </div>
        <div class="s9-bubble">
          <strong>🎯 Churn Prevention Campaign</strong>
          <strong>18 loyal customers</strong> who usually shop weekly haven't visited in over 12 days.<br><br>
          Generated WhatsApp offer: <em>"Special 5% discount on grocery basket above ₹500 valid till Thursday."</em>
        </div>
        <div class="s9-action-btn">1-Tap Approve & Send 🚀</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 10</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 11: VOICE AI & INDIC LANGUAGES (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-11">
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

    <div class="s10-header">
      <h2 class="display-title-dark">Voice AI in 10+ Indic Languages</h2>
      <p class="slide-subhead-dark">Over 70% of Bharat merchants prefer voice over typing. 100% hands-free vernacular intelligence.</p>
    </div>

    <div class="s10-grid">
      <div class="s10-card">
        <div class="s10-card-badge">🎙️</div>
        <div class="s10-card-title">Inbound Voice Enquiries</div>
        <div class="s10-card-desc">Shopkeepers ask business questions in natural conversational speech while attending customers. Supported in Hindi, Tamil, Telugu, Marathi, Bengali, and Hinglish.</div>
        <div class="s10-vernacular-pill">“Aaj dopahar tak kitna dhandha hua aur kal se kitna zyada hai?”</div>
      </div>

      <div class="s10-card">
        <div class="s10-card-badge">📞</div>
        <div class="s10-card-title">Proactive AI Voice Calls</div>
        <div class="s10-card-desc">For urgent revenue risks, the agent calls the merchant via Twilio/Paytm voice gateway with human-grade prosody to deliver brief, high-impact alerts.</div>
        <div class="s10-vernacular-pill">“Sharmaji, kal Eid hai. Sheer khurma ingredients ki maang 40% badhegi. Stock check kar lijiye.”</div>
      </div>

      <div class="s10-card">
        <div class="s10-card-badge">⚡</div>
        <div class="s10-card-title">Voice-to-Action Execution</div>
        <div class="s10-card-desc">Merchants approve campaigns and POs with a simple spoken word. Speech intent is extracted, verified, and executed instantly without touching the phone screen.</div>
        <div class="s10-vernacular-pill">“Haan, Agarwal wholesaler ko 2 peti ghee ka order bhej do.”</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 11</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 12: PREDICTIVE DEMAND & LOST REVENUE (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-12">
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

    <div class="s11-header">
      <h2 class="display-title-light">Predictive Demand & Revenue Leakage Detector</h2>
      <p class="slide-subhead-light">Anticipating surges before they happen and stopping preventable rupee losses.</p>
    </div>

    <div class="s11-grid">
      <!-- Predictive Engine -->
      <div class="s11-panel">
        <div class="s11-panel-title">Multi-Signal Predictive Engine</div>
        <div class="s11-panel-sub">Correlates macroeconomic, environmental, and hyper-local data streams to anticipate demand 48 hours in advance:</div>
        <div class="s11-list">
          <div class="s11-list-item">
            <div class="s11-check">✓</div>
            <div><strong>Weather Telemetry:</strong> Heatwaves drive cold drinks +35%; monsoons spike instant noodles and packaged tea by +45%.</div>
          </div>
          <div class="s11-list-item">
            <div class="s11-check">✓</div>
            <div><strong>Festival & Cultural Calendars:</strong> Automatically prepares stocking models for Diwali, Eid, Navratri fasting goods, and regional temple fairs.</div>
          </div>
          <div class="s11-list-item">
            <div class="s11-check">✓</div>
            <div><strong>Event & Match Schedules:</strong> IPL cricket matches trigger evening snack rushes; local salary credit dates (1st–5th) shift high-ticket purchases.</div>
          </div>
        </div>
      </div>

      <!-- Lost Revenue Opportunity Detector -->
      <div class="s11-panel highlight">
        <div class="s11-panel-title">Lost Revenue Opportunity Detector</div>
        <div class="s11-panel-sub">Quantifies exact rupee leakage from preventable retail inefficiencies:</div>
        <div class="s11-list">
          <div class="s11-list-item">
            <div class="s11-check">₹</div>
            <div><strong>Stockout Cost:</strong> “You lost ₹3,400 this week because Amul Butter was out of stock between 7 PM and 10 PM.”</div>
          </div>
          <div class="s11-list-item">
            <div class="s11-check">₹</div>
            <div><strong>Dormant Customer Value:</strong> “22 customers with ₹14,000 monthly spend are slipping away. Win them back with ₹450 total incentives.”</div>
          </div>
          <div class="s11-list-item">
            <div class="s11-check">₹</div>
            <div><strong>Wholesaler Overcharge:</strong> “Wholesaler B is charging ₹12 more per carton than market average across 5 nearby stores.”</div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 12</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 13: MERCHANT HEALTH SCORE & LENDING (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-13">
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

    <div class="s12-header">
      <h2 class="display-title-dark">Dynamic Merchant Health Score (0–100)</h2>
      <p class="slide-subhead-dark">Turning operational discipline into instant, underwritten Paytm merchant credit.</p>
    </div>

    <div class="s12-content">
      <!-- Gauge -->
      <div class="s12-gauge-card">
        <div class="s12-score-circle">
          <div class="s12-score-num">88</div>
          <div class="s12-score-label">EXCELLENT</div>
        </div>
        <div style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Gupta Kirana Store</div>
        <div style="font-size: 14px; color: #cbd5e1; line-height: 1.4;">
          Eligible for instant ₹2,50,000 Paytm Working Capital Loan at 1.1% monthly interest.
        </div>
      </div>

      <!-- 4 Pillars & Synergy -->
      <div class="s12-pillars-grid">
        <div class="s12-pillar-card">
          <div class="s12-pillar-weight">WEIGHT: 35%</div>
          <div class="s12-pillar-name">Revenue Velocity & Consistency</div>
          <div class="s12-pillar-desc">Measures daily UPI transaction volume, consistency of deposits, and month-over-month growth stability.</div>
        </div>

        <div class="s12-pillar-card">
          <div class="s12-pillar-weight">WEIGHT: 25%</div>
          <div class="s12-pillar-name">Inventory Turnover & Health</div>
          <div class="s12-pillar-desc">Evaluates bill upload frequency, inventory stockout frequency, and working capital rotation cycles.</div>
        </div>

        <div class="s12-pillar-card">
          <div class="s12-pillar-weight">WEIGHT: 20%</div>
          <div class="s12-pillar-name">Customer Retention Ratio</div>
          <div class="s12-pillar-desc">Tracks repeat buyer percentages, neighborhood customer loyalty, and responsiveness to retention offers.</div>
        </div>

        <div class="s12-pillar-card">
          <div class="s12-pillar-weight">WEIGHT: 20%</div>
          <div class="s12-pillar-name">Supplier Margin Discipline</div>
          <div class="s12-pillar-desc">Tracks purchase price benchmarking, timely distributor repayments, and wholesale discount capture.</div>
        </div>

        <div class="s12-synergy-pill">
          🚀 <strong>Strategic Moat for Paytm Lending:</strong> Proprietary operational data reduces underwriting risk by <strong>40%</strong> compared to traditional bureau scores, unlocking billions in safe merchant credit.
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 13</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 14: ENTERPRISE TECH STACK & SCALABILITY (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-14">
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

    <div class="s13-header">
      <h2 class="display-title-light">Enterprise Stack Built for Bharat Scale</h2>
      <p class="slide-subhead-light">Sub-2-second latency, bank-grade encryption, and sovereign data compliance for 30M+ merchants.</p>
    </div>

    <div class="s13-grid">
      <div class="s13-card">
        <div class="s13-category">AI Orchestration & LLMs</div>
        <div class="s13-title">LangGraph Multi-Agent</div>
        <div class="s13-desc">LangGraph state graphs + GPT-4o / Qwen-2.5-72B (local Indic LLM fallback) with strict guardrails and tool calling.</div>
      </div>

      <div class="s13-card">
        <div class="s13-category">Real-Time Data Streaming</div>
        <div class="s13-title">Kafka & Redis Cluster</div>
        <div class="s13-desc">Apache Kafka ingesting 100K+ UPI events/sec with sub-millisecond Redis cache for instant merchant session state.</div>
      </div>

      <div class="s13-card">
        <div class="s13-category">Perception & OCR</div>
        <div class="s13-title">Llama-3-Vision & OpenCV</div>
        <div class="s13-desc">Document layout parsing, table extraction, and YOLOv11 for grocery shelf object detection and stock count.</div>
      </div>

      <div class="s13-card">
        <div class="s13-category">Voice & Edge Gateways</div>
        <div class="s13-title">WhatsApp & Twilio Audio</div>
        <div class="s13-desc">Official WhatsApp Cloud API + Twilio/Paytm Voice Engine with Whisper STT & high-fidelity Indic TTS synthesis.</div>
      </div>

      <div class="s13-card">
        <div class="s13-category">Database & Vectors</div>
        <div class="s13-title">PostgreSQL & pgvector</div>
        <div class="s13-desc">Relational transaction store + vector embeddings for customer purchasing habits and semantic product search.</div>
      </div>

      <div class="s13-card">
        <div class="s13-category">Security & Compliance</div>
        <div class="s13-title">RBI Sovereign Cloud</div>
        <div class="s13-desc">End-to-end tenant data isolation, AES-256 encryption at rest/transit, 100% data localization inside Indian borders.</div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 14</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 15: BUSINESS MODEL & MONETIZATION (DARK)
       =============================================================== -->
  <section class="slide theme-dark" id="slide-15">
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

    <div class="s14-header">
      <div>
        <h2 class="display-title-dark">Business Model & Monetization</h2>
      </div>
      <div style="width: 440px; margin-top: 4px;">
        <p class="slide-subhead-dark">
          Low-friction freemium merchant onboarding scaling into high-margin SaaS subscriptions, performance campaign fees, and massive fintech loan origination.
        </p>
      </div>
    </div>

    <div class="s14-body">
      <!-- 3 Arches Chart -->
      <div class="s14-chart-box">
        <div class="arch-chart-wrap">
          <div class="chart-y-axis">
            <span>₹350 Cr</span>
            <span>₹250 Cr</span>
            <span>₹150 Cr</span>
            <span>₹50 Cr</span>
            <span>0</span>
          </div>
          <div class="grid-lines">
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
          </div>

          <!-- Arch Year 1 -->
          <div class="arch-col">
            <div class="arch-bar c1">
              <div class="segment-light" style="height: 45%;"></div>
              <div class="segment-mid" style="height: 30%;"></div>
              <div class="segment-blue" style="height: 25%;"></div>
            </div>
            <div class="arch-label">Year 1 (₹40 Cr)</div>
          </div>

          <!-- Arch Year 2 -->
          <div class="arch-col">
            <div class="arch-bar c2">
              <div class="segment-light" style="height: 40%;"></div>
              <div class="segment-mid" style="height: 35%;"></div>
              <div class="segment-blue" style="height: 25%;"></div>
            </div>
            <div class="arch-label">Year 2 (₹120 Cr)</div>
          </div>

          <!-- Arch Year 3 -->
          <div class="arch-col">
            <div class="arch-bar c3">
              <div class="segment-light" style="height: 35%;"></div>
              <div class="segment-mid" style="height: 35%;"></div>
              <div class="segment-blue" style="height: 30%;"></div>
            </div>
            <div class="arch-label">Year 3 (₹320 Cr)</div>
          </div>
        </div>
      </div>

      <!-- Streams -->
      <div class="s14-streams-box">
        <div class="s14-stream-item">
          <div class="s14-stream-icon" style="font-size: 20px; font-weight: 700;">$</div>
          <div>
            <div class="s14-stream-title">Tiered SaaS Subscriptions</div>
            <div class="s14-stream-desc">Free tier for daily revenue summaries. Pro tier at <strong>₹199–₹499/month</strong> unlocks automated voice calls, shelf vision OCR, and predictive inventory reordering.</div>
          </div>
        </div>

        <div class="s14-stream-item">
          <div class="s14-stream-icon"><svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></div>
          <div>
            <div class="s14-stream-title">Campaign Performance Take-Rate</div>
            <div class="s14-stream-desc">Micro-fee of <strong>1.5%</strong> or ₹10 flat commission per redeemed customer cashback offer executed autonomously via WhatsApp.</div>
          </div>
        </div>

        <div class="s14-stream-item">
          <div class="s14-stream-icon alt"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
          <div>
            <div class="s14-stream-title">Fintech Lending Origination</div>
            <div class="s14-stream-desc"><strong>1.5% origination synergy fee</strong> on pre-underwritten Paytm merchant working capital loans powered by the 88/100 Health Score.</div>
          </div>
        </div>
      </div>
    </div>

    <footer class="slide-footer">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 15</span>
    </footer>
  </section>

  <!-- ===============================================================
       SLIDE 16: ROADMAP & CLOSING VISION (LIGHT)
       =============================================================== -->
  <section class="slide theme-light" id="slide-16">
    <div class="s15-banner"></div>
    <div class="s15-banner-overlay"></div>

    <header class="slide-header" style="z-index: 25;">
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

    <div class="s15-content">
      <div class="s15-pill">THE VISION AHEAD</div>
      <h2 class="s15-title">The Future of Indian Retail: Autonomous Kiranas</h2>
      <p class="s15-subtitle">
        Empowering 30 Million+ Indian merchants with enterprise-grade artificial intelligence—without requiring new hardware, apps, or behavioral changes.
      </p>

      <!-- 5 Phase Roadmap -->
      <div class="s15-roadmap-mini">
        <div class="s15-phase-box">
          <strong>PHASE 1: MVP</strong>
          <span>UPI transaction processing, daily briefings, anomaly alerts.</span>
        </div>
        <div class="s15-phase-box">
          <strong>PHASE 2: OCR</strong>
          <span>Paper bill parsing, handwritten diary extraction, shelf vision.</span>
        </div>
        <div class="s15-phase-box">
          <strong>PHASE 3: AGENTS</strong>
          <span>LangGraph orchestration & predictive demand forecasting.</span>
        </div>
        <div class="s15-phase-box">
          <strong>PHASE 4: VOICE</strong>
          <span>1-tap WhatsApp campaigns & 10+ Indic AI voice calls.</span>
        </div>
        <div class="s15-phase-box">
          <strong>PHASE 5: SCALE</strong>
          <span>Bharat-wide rollout & algorithmic lending credit underwriting.</span>
        </div>
      </div>

      <div class="s15-meta-row">
        <div class="meta-col">
          <div class="meta-label">Presented by</div>
          <div class="meta-val">Team Sentinels (Akshat Arya and Mayank Yadav)</div>
        </div>
        <div class="meta-col">
          <div class="meta-label">Hackathon Track</div>
          <div class="meta-val">Merchant Growth AI • Paytm Build for India</div>
        </div>
        <div class="meta-col">
          <div class="meta-label">Repository & Contact</div>
          <div class="meta-val">sentinels.paytm@hackathon.ai</div>
        </div>
      </div>
    </div>

    <!-- Clean footer on Slide 15 -->
    <footer class="slide-footer" style="border-top: none; bottom: 24px;">
      <span class="footer-url">paytm.com/business • Team Sentinels</span>
      <span class="footer-page"><strong>Page</strong> 16</span>
    </footer>
  </section>

</div>

</body>
</html>
"""

with open("deck_presentation.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated polished 15-slide deck_presentation.html successfully.")
