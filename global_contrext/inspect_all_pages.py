import fitz
from PIL import Image
import os

doc = fitz.open('Untitled design (1).pdf')

print(f"Total pages: {len(doc)}")
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    print(f"Page {i+1}: size=({page.rect.width}, {page.rect.height}), pixmap=({pix.width}, {pix.height})")
    # check text blocks
    blocks = page.get_text('blocks')
    print(f"  Total blocks: {len(blocks)}")
