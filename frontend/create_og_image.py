import os
from PIL import Image

# Select high-res resort photo
photo_path = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/public/images/hero-suite.jpg"
if not os.path.exists(photo_path):
    photo_path = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/public/images/hero.jpg"

img = Image.open(photo_path).convert("RGB")
w, h = img.size

# Target 1200x630 (1.91:1 ratio for WhatsApp / OpenGraph)
target_w, target_h = 1200, 630
target_ratio = target_w / target_h
current_ratio = w / h

if current_ratio > target_ratio:
    # Image is wider: crop sides
    new_w = int(h * target_ratio)
    left = (w - new_w) // 2
    crop_box = (left, 0, left + new_w, h)
else:
    # Image is taller: crop top/bottom
    new_h = int(w / target_ratio)
    top = (h - new_h) // 2
    crop_box = (0, top, w, top + new_h)

cropped = img.crop(crop_box)
resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

public_dir = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/public"
app_dir = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/app"

og_public_path = os.path.join(public_dir, "og-image.jpg")
og_app_path = os.path.join(app_dir, "opengraph-image.jpg")

# Save as optimized JPEG (quality=85 stays under WhatsApp 300KB limit for instant link preview cards)
resized.save(og_public_path, format="JPEG", quality=88, optimize=True)
resized.save(og_app_path, format="JPEG", quality=88, optimize=True)

size_kb = os.path.getsize(og_public_path) / 1024
print(f"Open Graph image successfully created at {og_public_path} ({target_w}x{target_h}, {size_kb:.1f} KB)")
