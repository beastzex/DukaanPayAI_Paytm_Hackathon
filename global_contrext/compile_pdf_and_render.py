import os
import subprocess
import fitz

html_file = os.path.abspath("deck_presentation.html")
pdf_file = os.path.abspath("Paytm_Merchant_Growth_Agent_Pitch_Deck.pdf")
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"Compiling {html_file} to {pdf_file}...")

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_file}",
    f"file:///{html_file.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome STDOUT:", res.stdout)
print("Chrome STDERR:", res.stderr)

if not os.path.exists(pdf_file):
    print("Error: PDF file was not created!")
    exit(1)

print(f"Successfully compiled PDF! Size: {os.path.getsize(pdf_file):,} bytes")

# Inspect PDF with fitz
doc = fitz.open(pdf_file)
print(f"Total pages in compiled PDF: {len(doc)}")

output_dir = "rendered_output"
os.makedirs(output_dir, exist_ok=True)

# Render each page to 2x resolution PNG
for i, page in enumerate(doc, 1):
    pix = page.get_pixmap(dpi=150)
    out_path = os.path.join(output_dir, f"page_{i}.png")
    pix.save(out_path)
    print(f"Rendered Page {i} ({page.rect.width:.0f}x{page.rect.height:.0f}) -> {out_path}")

print("All pages rendered successfully!")
