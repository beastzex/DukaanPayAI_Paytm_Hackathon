import fitz, os
os.makedirs('ref_extracted_images', exist_ok=True)
doc = fitz.open('Untitled design (1).pdf')
for i, p in enumerate(doc):
    for j, img in enumerate(p.get_images()):
        xref = img[0]
        base = doc.extract_image(xref)
        ext = base['ext']
        out_path = f"ref_extracted_images/p{i+1}_img{j}.{ext}"
        with open(out_path, 'wb') as f:
            f.write(base['image'])
        print('Saved', out_path)
