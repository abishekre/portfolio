# Cuts the city out of the lock-screen wallpaper, so the clock can sit behind the buildings.
# Sky = pixels joined to the top edge through tiny colour steps.
# Writes src/assets/lock/wallpaper.webp (full picture) and city.webp (buildings only, transparent sky).
# Usage: python scripts/capture/wallpaper_mask.py [tolerance=14]
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

tol = float(sys.argv[1]) if len(sys.argv) > 1 else 14
src = Image.open('src/assets/lock/wallpaper-raw.png').convert('RGB')
a = np.asarray(src).astype(np.float32)
h, w, _ = a.shape
lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)

# Grow the sky from the top edge, one pixel at a time, only across tiny colour steps: a sky gradient
# changes smoothly, while every building edge (even hazy ones) is a jump.
step = tol / 8
is_sky = np.zeros((h, w), dtype=bool)
q = deque()
for x in range(w):
    is_sky[0, x] = True
    q.append((0, x))
while q:
    y, x = q.popleft()
    c = a[y, x]
    for ny, nx in ((y + 1, x), (y, x + 1), (y, x - 1), (y - 1, x)):
        if 0 <= ny < h and 0 <= nx < w and not is_sky[ny, nx]:
            if np.abs(a[ny, nx] - c).max() <= step:
                is_sky[ny, nx] = True
                q.append((ny, nx))

alpha = Image.fromarray(np.where(is_sky, 0, 255).astype(np.uint8))
# Close pinholes, then a hair of feathering so edges aren't jagged.
alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))  # drop specks of dither in the sky
alpha = alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
city = src.copy()
city.putalpha(alpha)
src.save('src/assets/lock/wallpaper.webp', quality=84)
city.save('src/assets/lock/city.webp', quality=88)
alpha.save('src/assets/lock/mask-preview.png')
print('sky fraction', round(float(is_sky.mean()), 3))
