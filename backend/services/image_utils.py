import io
import base64
from typing import Tuple, Optional
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import numpy as np
from backend.core.config import settings

def validate_image_file(filename: str, file_size: int) -> Tuple[bool, Optional[str]]:
    """
    Validates file extension and size.
    """
    if not filename:
        return False, "No filename provided."
    
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        return False, f"Invalid format '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS).upper()}."
    
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        return False, f"File size ({file_size / (1024*1024):.1f}MB) exceeds the maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
    
    return True, None

def load_and_preprocess_image(image_bytes: bytes, max_dim: int = 1024) -> Image.Image:
    """
    Loads raw bytes into a PIL Image, converts to RGB, and scales down to max_dim
    while keeping aspect ratio and ensuring dimensions are multiples of 8.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = ImageOps.exif_transpose(img) # Correct EXIF orientation
        img = img.convert("RGB")
    except Exception as e:
        raise ValueError(f"Could not decode image: {str(e)}")

    w, h = img.size
    
    # Scale down if needed
    if max(w, h) > max_dim:
        scale = max_dim / float(max(w, h))
        w = int(w * scale)
        h = int(h * scale)

    # Ensure dimensions are multiples of 8 (crucial for diffusion latent space)
    w = (w // 8) * 8
    h = (h // 8) * 8
    w = max(w, 256)
    h = max(h, 256)

    img = img.resize((w, h), Image.Resampling.LANCZOS)
    return img

def image_to_base64(img: Image.Image, format: str = "JPEG", quality: int = 90) -> str:
    """Converts a PIL Image to a base64 data URI string."""
    buf = io.BytesIO()
    img.save(buf, format=format, quality=quality)
    encoded = base64.b64encode(buf.getvalue()).decode("utf-8")
    mime = "image/jpeg" if format.upper() == "JPEG" else f"image/{format.lower()}"
    return f"data:{mime};base64,{encoded}"

def image_to_bytes(img: Image.Image, format: str = "JPEG", quality: int = 90) -> bytes:
    """Converts a PIL Image to raw bytes."""
    buf = io.BytesIO()
    img.save(buf, format=format, quality=quality)
    return buf.getvalue()

def apply_algorithmic_interior_stylization(
    img: Image.Image, 
    style_id: str, 
    palette_id: str,
    lighting: str = "natural",
    preserve_layout: bool = True
) -> Image.Image:
    """
    Intelligent algorithmic fallback and aesthetic transformer.
    Applies real color harmonization, architectural edge preservation, 
    lighting curve modification, and style-specific atmospheric grading.
    Used when external API keys are not supplied or rate-limited.
    """
    arr = np.array(img, dtype=np.float32) / 255.0
    
    # Extract luminance
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    
    # Style-specific color matrix and tone adjustments
    if style_id == "scandinavian":
        # Scandinavian: Bright, airy Nordic daylight, warm blonde oak undertones, subtle desaturation
        # Boost highlights, tint mids to warm ivory (#F5EFE6)
        r_mult, g_mult, b_mult = 1.08, 1.04, 0.96
        contrast = 1.05
        brightness = 1.12
        blur_softness = 0.8
    elif style_id == "modern-minimalist":
        # High contrast, crisp architectural whites, deep charcoal
        r_mult, g_mult, b_mult = 1.01, 1.01, 1.03
        contrast = 1.22
        brightness = 1.06
        blur_softness = 0.5
    elif style_id == "luxury-contemporary":
        # Champagne gold, deep rich shadows, warm specular sheen
        r_mult, g_mult, b_mult = 1.15, 1.06, 0.88
        contrast = 1.25
        brightness = 1.04
        blur_softness = 1.0
    elif style_id == "industrial":
        # Desaturated greens/blues, emphasized terracotta brick and iron contrast
        r_mult, g_mult, b_mult = 1.10, 0.98, 0.90
        contrast = 1.30
        brightness = 0.98
        blur_softness = 0.3
    elif style_id == "bohemian":
        # Warm saturated terracotta, ochre, rich earthy warmth
        r_mult, g_mult, b_mult = 1.14, 1.02, 0.86
        contrast = 1.12
        brightness = 1.05
        blur_softness = 1.2
    elif style_id == "japandi":
        # Wabi-sabi muted clay, blonde hinoki wood, balanced tranquil light
        r_mult, g_mult, b_mult = 1.06, 1.03, 0.94
        contrast = 1.02
        brightness = 1.08
        blur_softness = 1.0
    elif style_id == "traditional-indian":
        # Deep royal teak, warm amber glow, rich jewel undertone
        r_mult, g_mult, b_mult = 1.18, 1.02, 0.85
        contrast = 1.20
        brightness = 1.02
        blur_softness = 0.9
    elif style_id == "eco-friendly":
        # Fresh sage green tint, crisp natural sunlight, leafy accents
        r_mult, g_mult, b_mult = 0.96, 1.12, 0.98
        contrast = 1.08
        brightness = 1.10
        blur_softness = 0.7
    elif style_id == "coastal":
        # Airy nautical cyan-blue highlights, sun-bleached driftwood, high key light
        r_mult, g_mult, b_mult = 0.95, 1.04, 1.15
        contrast = 1.04
        brightness = 1.14
        blur_softness = 0.6
    else:  # Modern Farmhouse or default
        # Warm rustic cream and deep wrought-iron accents
        r_mult, g_mult, b_mult = 1.08, 1.05, 0.95
        contrast = 1.15
        brightness = 1.08
        blur_softness = 0.8

    # Apply lighting profile
    if lighting == "warm":
        r_mult *= 1.08
        g_mult *= 1.02
        b_mult *= 0.88
    elif lighting == "cool":
        r_mult *= 0.94
        g_mult *= 1.00
        b_mult *= 1.12
    elif lighting == "dramatic":
        contrast *= 1.20

    # Color grading
    arr[:, :, 0] = np.clip(arr[:, :, 0] * r_mult, 0.0, 1.0)
    arr[:, :, 1] = np.clip(arr[:, :, 1] * g_mult, 0.0, 1.0)
    arr[:, :, 2] = np.clip(arr[:, :, 2] * b_mult, 0.0, 1.0)

    # Convert back to PIL for high-level image enhancement
    styled_img = Image.fromarray((arr * 255.0).astype(np.uint8))

    # Apply contrast & brightness
    styled_img = ImageEnhance.Contrast(styled_img).enhance(contrast)
    styled_img = ImageEnhance.Brightness(styled_img).enhance(brightness)
    
    # Soft diffusion bloom: blend subtle blurred version to simulate luxury photography lighting
    bloom = styled_img.filter(ImageFilter.GaussianBlur(radius=blur_softness * 3))
    styled_img = Image.blend(styled_img, bloom, 0.22)
    
    # Unsharp mask to keep structural edges (walls, window lines, furniture) razor sharp
    styled_img = styled_img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=3))

    return styled_img
