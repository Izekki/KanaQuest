from PIL import Image, ImageFilter
import collections
import sys

def remove_white_background(input_path, output_path, tolerance=12):
    print(f"Loading image from {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # Find all background pixels connected to the borders using BFS flood fill
    # Target color is near pure white (r > 240, g > 240, b > 240)
    visited = bytearray(width * height)
    queue = collections.deque()

    # Seed border pixels
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    def is_bg_color(r, g, b):
        return r >= 255 - tolerance and g >= 255 - tolerance and b >= 255 - tolerance

    bg_mask = Image.new("L", (width, height), 0)
    mask_pixels = bg_mask.load()

    while queue:
        x, y = queue.popleft()
        idx = y * width + x
        if visited[idx]:
            continue
        visited[idx] = 1

        r, g, b, a = pixels[x, y]
        if is_bg_color(r, g, b):
            mask_pixels[x, y] = 255 # Is background
            for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                if 0 <= nx < width and 0 <= ny < height:
                    nidx = ny * width + nx
                    if not visited[nidx]:
                        nr, ng, nb, _ = pixels[nx, ny]
                        if is_bg_color(nr, ng, nb):
                            queue.append((nx, ny))

    # Anti-alias the mask edges with a subtle 1px Gaussian blur
    feathered_mask = bg_mask.filter(ImageFilter.GaussianBlur(radius=0.75))
    f_pixels = feathered_mask.load()

    # Create transparent PNG
    out_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    out_pixels = out_img.load()

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            bg_val = f_pixels[x, y] # 255 = fully background, 0 = fully foreground
            if bg_val == 255:
                out_pixels[x, y] = (0, 0, 0, 0)
            elif bg_val == 0:
                out_pixels[x, y] = (r, g, b, 255)
            else:
                alpha = int(255 - bg_val)
                out_pixels[x, y] = (r, g, b, alpha)

    print(f"Saving transparent PNG to {output_path}...")
    out_img.save(output_path, "PNG", optimize=True)
    print("Background removal completed successfully!")

if __name__ == "__main__":
    src = "C:/Users/PC/.gemini/antigravity-ide/brain/89d22945-3661-4b3b-973d-372e1d568ded/mascot_white_bg_1790243252300.jpg"
    dst = "c:/Proyectos/KanaQuest/src/img/mascot_pink_slime_transparent.png"
    remove_white_background(src, dst)
    # Also save to kanaquest_mascot_cel_shaded.png
    dst2 = "c:/Proyectos/KanaQuest/src/img/kanaquest_mascot_cel_shaded.png"
    remove_white_background(src, dst2)
