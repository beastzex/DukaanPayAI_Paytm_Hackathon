import os
import base64
import subprocess
import fitz

def get_base64_image(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = f.read()
            ext = os.path.splitext(path)[1].lower().replace('.', '')
            if ext == 'jpg': ext = 'jpeg'
            return f"data:image/{ext};base64,{base64.b64encode(data).decode('utf-8')}"
    return ""

print("Encoding images...")
img_arch = get_base64_image("architecture_diagram.png")
img_p1 = get_base64_image("ref_extracted_images/p1_img0.png")
img_p2 = get_base64_image("ref_extracted_images/p2_img0.jpeg")
img_p5 = get_base64_image("ref_extracted_images/p5_img0.png")
img_p7_0 = get_base64_image("ref_extracted_images/p7_img0.jpeg")
img_p7_1 = get_base64_image("ref_extracted_images/p7_img1.jpeg")
img_p7_2 = get_base64_image("ref_extracted_images/p7_img2.jpeg")
img_p11 = get_base64_image("ref_extracted_images/p11_img0.jpeg")
print("All images encoded successfully.")
