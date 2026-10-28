from typing import Optional
from backend.data.style_definitions import STYLES_MAP

class PromptBuilder:
    """
    Constructs high-aesthetic, professional architectural prompts
    specifically tailored for image-to-image diffusion models.
    """

    LIGHTING_DESCRIPTIONS = {
        "natural": "abundant natural sun daylight pouring through windows with soft shadows",
        "warm": "warm ambient interior lighting, warm 2700K recessed ceiling LEDs and soft floor lamps",
        "cool": "crisp modern 4000K neutral daylight lighting with clean luminescent glow",
        "dramatic": "cinematic dramatic evening lighting, accent spotlights highlighting textures and architectural depth"
    }

    FURNITURE_DESCRIPTIONS = {
        "minimal": "curated minimalist furniture pieces, uncluttered surfaces, sleek low-profile silhouettes",
        "functional": "ergonomic, highly functional furniture with smart concealed organization",
        "premium": "bespoke handcrafted luxury designer furniture, premium tailored upholstery, refined joinery",
        "space-saving": "intelligent space-saving multi-functional modular furniture designed for optimized flow"
    }

    MOOD_DESCRIPTIONS = {
        "calm": "tranquil, calm, zen sanctuary atmosphere promoting mindfulness and peaceful relaxation",
        "cozy": "intimate, warm, cozy hygge ambiance inviting comfort and quiet contemplation",
        "professional": "polished, executive, distraction-free atmosphere with disciplined aesthetic balance",
        "luxurious": "glamorous, opulent, high-society atmosphere evoking a five-star boutique hotel suite"
    }

    BUDGET_DESCRIPTIONS = {
        "budget-friendly": "clean tasteful contemporary finishes, smart accessible materials, DIY elegance",
        "mid-range": "high-quality engineered hardwoods, premium paint finishes, designer retail appointments",
        "premium-luxury": "museum-grade artisanal craftsmanship, rare natural stone slabs, custom millwork, luxury couture finishes"
    }

    @classmethod
    def build_prompt(
        cls,
        room_type: str,
        style_id: str,
        color_palette_id: str,
        custom_colors: Optional[str] = None,
        lighting: str = "natural",
        furniture: str = "functional",
        room_mood: str = "calm",
        budget: str = "mid-range",
        sustainability: bool = False,
        preserve_layout: bool = True,
        custom_prompt: Optional[str] = None
    ) -> str:
        # Retrieve style info
        style = STYLES_MAP.get(style_id)
        style_name = style["name"] if style else style_id.replace("-", " ").title()
        style_keywords = style["prompt_keywords"] if style else "modern contemporary interior"
        style_materials = ", ".join(style["materials"]) if style else "fine wood, metal, architectural fabric"
        
        # Clean room type
        room_name = room_type.replace("-", " ").title()

        # Lighting phrase
        lighting_phrase = cls.LIGHTING_DESCRIPTIONS.get(
            lighting.lower(), 
            "balanced natural architectural lighting"
        )

        # Furniture phrase
        furniture_phrase = cls.FURNITURE_DESCRIPTIONS.get(
            furniture.lower(), 
            "refined interior furniture"
        )

        # Mood phrase
        mood_phrase = cls.MOOD_DESCRIPTIONS.get(
            room_mood.lower(), 
            "sophisticated, serene ambiance"
        )

        # Palette phrase
        if color_palette_id == "custom" and custom_colors:
            palette_phrase = f"custom color palette featuring {custom_colors}"
        else:
            palette_phrase = f"{color_palette_id.replace('-', ' ')} color palette"

        # Eco-friendly note
        eco_phrase = "incorporating sustainable biophilic elements, live indoor botanicals, and circular organic materials, " if sustainability else ""

        # Layout preservation instruction
        layout_phrase = (
            "Maintain the original room camera perspective, structural walls, window placements, "
            "ceiling height, and spatial architecture as faithfully as possible while completely reimagining all furniture, "
            "wall colors, materials, textiles, and decorations."
            if preserve_layout else
            "Transform the room with enhanced proportions and renovated structural finishes."
        )

        # Custom user instruction
        custom_text_phrase = f" Special client requirements: {custom_prompt.strip()}." if custom_prompt and custom_prompt.strip() else ""

        # Assemble prompt
        prompt = (
            f"Professional architectural photograph of a redesigned {room_name} in {style_name} interior design style. "
            f"{style_keywords}. "
            f"Palette: {palette_phrase}. "
            f"Key materials: {style_materials}. "
            f"Lighting: {lighting_phrase}. "
            f"Furniture style: {furniture_phrase}. "
            f"Atmosphere: {mood_phrase}. "
            f"{eco_phrase}"
            f"{layout_phrase}"
            f"{custom_text_phrase} "
            f"Photorealistic 8k interior design photograph, Architectural Digest and Elle Decor feature, perfectly balanced exposure, crisp textures, natural ambient occlusion, realistic material reflections."
        )

        return prompt

    @classmethod
    def build_negative_prompt(cls) -> str:
        return (
            "blurry, out of focus, low resolution, noisy, artifacted, deformed architecture, distorted perspective, "
            "skewed walls, floating furniture, broken geometry, surreal, cartoon, 3d render plastic CGI, "
            "oversaturated neon, watermark, signature, ugly, cluttered junk, exterior outdoor shot, people, faces, animals"
        )
