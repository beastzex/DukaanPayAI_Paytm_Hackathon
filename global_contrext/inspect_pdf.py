import fitz

doc = fitz.open('Untitled design (1).pdf')
for i in range(6):
    p = doc[i]
    print(f'=== PAGE {i+1} ===')
    d = p.get_text('dict')
    for b in d['blocks']:
        if b.get('type') == 0:
            for l in b['lines']:
                for s in l['spans']:
                    t = s['text'].strip()
                    if t:
                        font_name = s['font']
                        size = s['size']
                        color = hex(s['color'])
                        bbox = s['bbox']
                        print(f"  [{font_name}, {size:.1f}pt, {color}] ({bbox[0]:.0f},{bbox[1]:.0f}): {t}")
        elif b.get('type') == 1:
            print(f"  [IMAGE] bbox: {b['bbox']}")
