export interface DesignStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  materials: string[];
  color_palette_recommendation: string[];
  prompt_keywords: string;
  preview_image: string;
}

export interface RoomType {
  id: string;
  name: string;
  icon: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[];
}

export interface SampleRoom {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
}

export interface RedesignRequestData {
  imageFile: File;
  roomType: string;
  style: string;
  colorPalette: string;
  customColors?: string;
  lighting: string;
  furniture: string;
  roomMood: string;
  budget: string;
  sustainability: boolean;
  preserveLayout: boolean;
  customPrompt?: string;
  seed?: number;
  apiKeyOverride?: string;
}

export interface RedesignResponse {
  success: boolean;
  original_image: string;
  redesigned_image: string;
  provider_used: string;
  model_used: string;
  generation_time_ms: number;
  seed: number;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  notice?: string;
  metadata: {
    room_type: string;
    style_id: string;
    style_name: string;
    color_palette: string;
    lighting: string;
    furniture: string;
    room_mood: string;
    budget: string;
    sustainability: boolean;
    preserve_layout: boolean;
    custom_prompt?: string;
    original_filename: string;
    original_filesize_kb: number;
  };
}

export interface AlternativeDesign {
  id: string;
  timestamp: string;
  seed: number;
  styleName: string;
  styleId: string;
  roomType: string;
  redesignedImage: string;
  originalImage: string;
  providerUsed: string;
  modelUsed: string;
  prompt: string;
  generationTimeMs: number;
}
