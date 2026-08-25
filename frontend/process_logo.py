import os
from PIL import Image

source_path = "/Users/minekshikaushani/.gemini/antigravity-ide/brain/ed2749ef-4960-4e45-aab7-78101564f512/media__1787644017024.jpg"
public_images_dir = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/public/images"
public_dir = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/public"
app_dir = "/Users/minekshikaushani/Desktop/ArrowBeach/frontend/app"

os.makedirs(public_images_dir, exist_ok=True)
os.makedirs(public_dir, exist_ok=True)
os.makedirs(app_dir, exist_ok=True)

# 1. Open original high-res logo
logo_img = Image.open(source_path).convert("RGB")

# Save full logo image in public/images/logo.png and logo.jpg
logo_img.save(os.path.join(public_images_dir, "logo.png"))
logo_img.save(os.path.join(public_images_dir, "logo.jpg"))

# 2. Make square cropped icon version centered on the golden emblem
w, h = logo_img.size
crop_size = min(w, h)
left = (w - crop_size) // 2
top = 0
right = left + crop_size
bottom = top + crop_size

cropped_emblem = logo_img.crop((left, top, right, bottom))
cropped_emblem.save(os.path.join(public_images_dir, "logo-icon.png"))

# 3. Export PNGs of various required sizes
sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
    "icon.png": 512,
}

for name, size in sizes.items():
    resized = logo_img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(os.path.join(public_dir, name))
    if name in ["icon.png", "apple-touch-icon.png", "favicon-32x32.png", "favicon-48x48.png"]:
        resized.save(os.path.join(app_dir, name))

# Save ICO format for search engines & browser compatibility
ico_48 = logo_img.resize((48, 48), Image.Resampling.LANCZOS)
ico_48.save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)
ico_48.save(
    os.path.join(app_dir, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)

print("Logo processed and favicons created successfully!")
