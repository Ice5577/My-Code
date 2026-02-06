from PIL import Image, ImageDraw
import os

# Create assets directory if not exists
os.makedirs('assets', exist_ok=True)

# Balloon colors from the game
balloon_colors = [
    '#9B9FF5', '#FF7F6F', '#FFC75F', '#FFB4A3', '#B794F4', '#FF7FB8', '#C81E64',
    '#E8FF6F', '#FF6F42', '#7FEB7F', '#C77FEB', '#FF4285', '#FF70B8', '#6B7280',
    '#C85F72', '#5FEBB8', '#7F94FF', '#5FC4FF', '#FFCE94', '#FFB8E8', '#FFEB5F',
    '#B8B8FF', '#94C8FF', '#8F5FD4', '#5FE0EB', '#94EBB8', '#FF70D4', '#7FFF5F'
]

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_balloon(color_hex, filename):
    # Image size
    width, height = 120, 140
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Convert hex to RGB
    color = hex_to_rgb(color_hex)
    
    # Draw balloon body (ellipse)
    draw.ellipse([15, 0, 105, 110], fill=color)
    
    # Draw darker shading on bottom
    darker_color = tuple(int(c * 0.8) for c in color)
    draw.ellipse([20, 70, 100, 110], fill=darker_color)
    
    # Draw highlight (lighter area on top-left)
    lighter_color = tuple(min(255, int(c * 1.3)) for c in color)
    for i in range(3):
        alpha = int(255 * (1 - i/3))
        draw.ellipse([30 - i*3, 20 - i*3, 55 - i*3, 50 - i*3], 
                    fill=(*lighter_color, alpha))
    
    # Draw knot at bottom
    draw.ellipse([54, 105, 66, 116], fill=darker_color)
    
    # Draw string
    for i in range(116, 135, 2):
        x_offset = int(3 * ((i - 116) / 20))
        draw.line([(60 + x_offset, i), (60 + x_offset, i + 2)], fill=(255, 255, 255, 200), width=2)
    
    # Save
    img.save(filename, 'PNG')
    print(f"Created: {filename}")

# Generate all balloon images
for idx, color in enumerate(balloon_colors):
    filename = f'assets/balloon_{idx+1}.png'
    create_balloon(color, filename)

# Create golden balloon
create_balloon('#FFD700', 'assets/balloon_golden.png')

print(f"\nTotal balloons created: {len(balloon_colors) + 1}")
print("All balloon assets generated successfully!")
