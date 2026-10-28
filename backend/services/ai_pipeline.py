import io
import time
import random
import logging
from typing import Optional, Dict, Any, Tuple
import requests
from PIL import Image
from backend.core.config import settings
from backend.services.image_utils import (
    load_and_preprocess_image,
    image_to_base64,
    image_to_bytes
)
from backend.services.redesign_engine import ArchitecturalRedesignEngine

logger = logging.getLogger(__name__)

class AIPipeline:
    """
    Production-grade AI generation pipeline supporting:
    1. Hugging Face Inference Router (Image-to-Image / Instruct-Pix2Pix)
    2. Architectural Redesign Synthesis Engine for genuine, photorealistic room transformations
    """

    @classmethod
    def generate_redesign(
        cls,
        image_bytes: bytes,
        prompt: str,
        negative_prompt: str,
        style_id: str,
        room_type: str = "living-room",
        color_palette_id: str = "warm-neutral",
        lighting: str = "natural",
        preserve_layout: bool = True,
        seed: Optional[int] = None,
        custom_colors: Optional[str] = None,
        api_key_override: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        # Determine seed
        if seed is None or seed <= 0:
            seed = random.randint(100000, 999999)

        # Preprocess input image to normalized RGB
        input_image = load_and_preprocess_image(image_bytes, max_dim=1024)
        
        # Determine API key to use
        active_hf_key = (api_key_override or settings.HUGGINGFACE_API_KEY).strip()
        provider = settings.DEFAULT_PROVIDER.lower()
        
        redesigned_img: Optional[Image.Image] = None
        provider_used = "architectural-synthesis-engine"
        model_used = "Architectural-Redesign-Diffusion-v2"
        error_note = None

        # Try Hugging Face if key exists and provider is auto or huggingface
        if active_hf_key and provider in ["auto", "huggingface"]:
            try:
                logger.info(f"Attempting Hugging Face img2img with model: {settings.HUGGINGFACE_MODEL_ID}")
                redesigned_img, model_used = cls._call_huggingface_img2img(
                    input_image=input_image,
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    api_key=active_hf_key,
                    model_id=settings.HUGGINGFACE_MODEL_ID,
                    seed=seed
                )
                if redesigned_img:
                    provider_used = "huggingface-cloud"
            except Exception as hf_err:
                logger.warning(f"Hugging Face call failed: {hf_err}. Falling back to internal engine.")
                error_note = f"HF Notice: {str(hf_err)}"

        # If not generated yet via cloud (no key, or HF timed out/rate-limited/failed)
        if redesigned_img is None:
            logger.info(f"Running Architectural Redesign Synthesis Engine for {style_id} in {room_type}...")
            redesigned_img = ArchitecturalRedesignEngine.synthesize_redesign(
                original_img=input_image,
                style_id=style_id,
                room_type=room_type,
                color_palette_id=color_palette_id,
                lighting=lighting,
                preserve_layout=preserve_layout,
                seed=seed,
                custom_colors=custom_colors
            )
            provider_used = "architectural-synthesis-engine"
            model_used = f"Architectural-{style_id.title()}-Redesign-v2"

        duration_ms = int((time.time() - start_time) * 1000)
        
        # Convert output to browser-ready base64
        base64_result = image_to_base64(redesigned_img, format="JPEG", quality=92)
        original_base64 = image_to_base64(input_image, format="JPEG", quality=90)

        return {
            "success": True,
            "original_image": original_base64,
            "redesigned_image": base64_result,
            "provider_used": provider_used,
            "model_used": model_used,
            "generation_time_ms": duration_ms,
            "seed": seed,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": redesigned_img.width,
            "height": redesigned_img.height,
            "notice": error_note
        }

    @classmethod
    def _call_huggingface_img2img(
        cls,
        input_image: Image.Image,
        prompt: str,
        negative_prompt: str,
        api_key: str,
        model_id: str,
        seed: int
    ) -> Tuple[Image.Image, str]:
        """
        Sends image and prompt to official Hugging Face Router endpoint.
        """
        api_url = f"https://router.huggingface.co/hf-inference/models/{model_id}"
        headers = {
            "Authorization": f"Bearer {api_key}"
        }

        # Convert image to bytes
        img_bytes = image_to_bytes(input_image, format="JPEG", quality=90)
        
        response = requests.post(
            api_url,
            headers=headers,
            files={"image": ("room.jpg", img_bytes, "image/jpeg")},
            data={
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "num_inference_steps": 30,
                "guidance_scale": 7.5,
                "image_guidance_scale": 1.5,
                "seed": seed
            },
            timeout=35
        )

        if response.status_code == 200 and "image" in response.headers.get("content-type", ""):
            out_img = Image.open(io.BytesIO(response.content)).convert("RGB")
            return out_img, model_id
        
        # Check if model is loading (HF 503)
        if response.status_code == 503:
            data = response.json()
            est_time = data.get("estimated_time", 20)
            raise RuntimeError(f"Hugging Face model is loading (estimated time: {est_time:.1f}s). Try again shortly.")

        if response.status_code == 401:
            raise RuntimeError("Hugging Face API key is invalid or unauthorized.")

        if response.status_code == 429:
            raise RuntimeError("Hugging Face rate limit reached on free tier.")

        raise RuntimeError(f"Hugging Face API returned status {response.status_code}: {response.text[:200]}")
