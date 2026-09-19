import fitz

doc = fitz.open('Untitled design (1).pdf')
for i in range(len(doc)):
    page = doc[i]
    print(f'=== PAGE {i+1} DRAWINGS ({len(page.get_drawings())}) ===')
    for d in page.get_drawings()[:8]:
        r = d.get('rect')
        fill = d.get('fill')
        stroke = d.get('color')
        w = d.get('width')
        print(f"  rect: ({r.x0:.1f}, {r.y0:.1f}, {r.x1:.1f}, {r.y1:.1f}), fill: {fill}, stroke: {stroke}, w: {w}")
