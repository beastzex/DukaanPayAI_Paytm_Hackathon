import fitz

doc = fitz.open('Untitled design (1).pdf')
for i in range(len(doc)):
    p = doc[i]
    imgs = p.get_images()
    print(f"Page {i+1} has {len(imgs)} embedded images")
    for img_idx, img in enumerate(imgs):
        xref = img[0]
        base_image = doc.extract_image(xref)
        print(f"   img {img_idx}: format={base_image['ext']}, size={base_image['width']}x{base_image['height']}")
