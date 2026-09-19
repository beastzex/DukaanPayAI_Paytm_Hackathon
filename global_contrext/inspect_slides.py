import re

with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

matches = re.findall(r'<section class="slide[^"]*" id="slide-(\d+)"[^>]*data-title="([^"]+)"', text)
print(f"Total slides found: {len(matches)}")
for num, title in matches:
    print(f"Slide {num}: {title}")
