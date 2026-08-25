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

# Crop square around emblem for pristine favicon display
cropped_emblem = logo_img.crop((left, top, right, bottom))
cropped_emblem.save(os.path.join(public_images_dir, "logo-icon.png"))

# 3. Export PNGs for all standard favicon sizes (including Google's 48x48 and 96x96 specifications)
sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,   # Google Search Central recommended format
    "favicon-96x96.png": 96,   # Google Search Central recommended format
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
    "icon.png": 512,
}

for name, size in sizes.items():
    resized = cropped_emblem.resize((size, size), Image.Resampling.LANCZOS)
    # Save in public directory
    resized.save(os.path.join(public_dir, name))
    # Save in app directory for Next.js App Router static routing
    if name in ["icon.png", "apple-touch-icon.png", "favicon-32x32.png", "favicon-48x48.png", "favicon-96x96.png"]:
        resized.save(os.path.join(app_dir, name))

# 4. Generate multi-resolution ICO file (48x48 primary for Googlebot)
ico_48 = cropped_emblem.resize((48, 48), Image.Resampling.LANCZOS)
ico_48.save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
ico_48.save(
    os.path.join(app_dir, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)

# 5. Remove any old conflicting icon.svg files if present
for path in [os.path.join(public_dir, "icon.svg"), os.path.join(app_dir, "icon.svg")]:
    if os.path.exists(path):
        os.remove(path)

print("Logo favicons regenerated successfully with exact Google Search 48x48 and 96x96 specifications!")
