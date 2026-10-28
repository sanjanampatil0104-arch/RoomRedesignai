import logging
from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status
from pydantic import BaseModel

from backend.core.config import settings
from backend.data.style_definitions import (
    DESIGN_STYLES,
    ROOM_TYPES,
    COLOR_PALETTES,
    SAMPLE_ROOMS,
    STYLES_MAP
)
from backend.services.prompt_builder import PromptBuilder
from backend.services.image_utils import validate_image_file
from backend.services.ai_pipeline import AIPipeline

logger = logging.getLogger(__name__)

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    project: str
    version: str
    active_model: str
    has_hf_key: bool
    default_provider: str

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        active_model=settings.HUGGINGFACE_MODEL_ID,
        has_hf_key=bool(settings.HUGGINGFACE_API_KEY.strip()),
        default_provider=settings.DEFAULT_PROVIDER
    )

@router.get("/styles")
async def get_styles():
    """Returns all 10 interior design styles with rich metadata."""
    return {"styles": DESIGN_STYLES}

@router.get("/room-types")
async def get_room_types():
    """Returns supported room types."""
    return {"room_types": ROOM_TYPES}

@router.get("/color-palettes")
async def get_color_palettes():
    """Returns preset color palettes."""
    return {"color_palettes": COLOR_PALETTES}

@router.get("/sample-rooms")
async def get_sample_rooms():
    """Returns high quality built-in sample room images for fast demo testing."""
    return {"sample_rooms": SAMPLE_ROOMS}

@router.post("/redesign")
async def redesign_room(
    image: UploadFile = File(..., description="The room photograph to redesign"),
    room_type: str = Form("living-room"),
    style: str = Form("modern-minimalist"),
    color_palette: str = Form("warm-neutral"),
    custom_colors: Optional[str] = Form(None),
    lighting: str = Form("natural"),
    furniture: str = Form("functional"),
    room_mood: str = Form("calm"),
    budget: str = Form("mid-range"),
    sustainability: bool = Form(False),
    preserve_layout: bool = Form(True),
    custom_prompt: Optional[str] = Form(None),
    seed: Optional[int] = Form(None),
    api_key_override: Optional[str] = Form(None)
):
    """
    Main generative AI endpoint: accepts room image and preferences,
    builds professional architectural prompt, and produces a redesigned room photograph.
    """
    try:
        # Read file contents
        content = await image.read()
        file_size = len(content)

        # Validate file
        is_valid, error_msg = validate_image_file(image.filename, file_size)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # Build prompt using architectural prompt builder
        prompt = PromptBuilder.build_prompt(
            room_type=room_type,
            style_id=style,
            color_palette_id=color_palette,
            custom_colors=custom_colors,
            lighting=lighting,
            furniture=furniture,
            room_mood=room_mood,
            budget=budget,
            sustainability=sustainability,
            preserve_layout=preserve_layout,
            custom_prompt=custom_prompt
        )
        negative_prompt = PromptBuilder.build_negative_prompt()

        # Run AI Pipeline
        result = AIPipeline.generate_redesign(
            image_bytes=content,
            prompt=prompt,
            negative_prompt=negative_prompt,
            style_id=style,
            room_type=room_type,
            color_palette_id=color_palette,
            lighting=lighting,
            preserve_layout=preserve_layout,
            seed=seed,
            custom_colors=custom_colors,
            api_key_override=api_key_override
        )

        # Attach request metadata to output
        result["metadata"] = {
            "room_type": room_type,
            "style_id": style,
            "style_name": STYLES_MAP.get(style, {}).get("name", style),
            "color_palette": color_palette,
            "lighting": lighting,
            "furniture": furniture,
            "room_mood": room_mood,
            "budget": budget,
            "sustainability": sustainability,
            "preserve_layout": preserve_layout,
            "custom_prompt": custom_prompt,
            "original_filename": image.filename,
            "original_filesize_kb": round(file_size / 1024, 1)
        }

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error processing redesign request")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate redesign: {str(e)}"
        )
