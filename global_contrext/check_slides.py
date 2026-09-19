import re

with open('generate_deck_html.py', 'r', encoding='utf-8') as f:
    text = f.read()

slides = re.findall(r'(<!-- =+\s*(SLIDE \d+:[^>\n]+)\s*=+ -->[\s\S]*?<section class="slide[^"]*" id="([^"]+)">[\s\S]*?(?:<span class="footer-page"><strong>Page</strong>\s*([0-9]+)</span>|(?=</section>)))', text)

print(f"Found {len(slides)} slides by regex:")
for i, s in enumerate(slides, 1):
    comment_title = s[1].strip()
    sec_id = s[2].strip()
    page_num = s[3].strip() if s[3] else "None (Cover)"
    print(f"{i:2d} | {sec_id:10s} | Page {page_num:5s} | {comment_title}")

