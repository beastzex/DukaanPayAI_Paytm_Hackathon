import os
import subprocess
import fitz
from PIL import Image

print("Checking environment...")

# Check architecture diagram
if os.path.exists("architecture_diagram.png"):
    print("architecture_diagram.png is present.")
else:
    print("WARNING: architecture_diagram.png missing!")

# Check extracted assets
print("Extracted assets:", os.listdir("ref_extracted_images"))
