import fitz

doc = fitz.open('Untitled design (1).pdf')
for i in range(5, 11):
    page = doc[i]
    print(f"=== PAGE {i+1} ===")
    print("TEXT:")
    for b in page.get_text('blocks'):
        txt = b[4].strip().replace('\n', ' ')
        if txt:
            print(f"  ({b[0]:.0f}, {b[1]:.0f}): {txt[:80]}")
