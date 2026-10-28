import type { RedesignRequestData, RedesignResponse, DesignStyle, SampleRoom } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function redesignRoom(data: RedesignRequestData): Promise<RedesignResponse> {
  const formData = new FormData();
  formData.append('image', data.imageFile);
  formData.append('room_type', data.roomType);
  formData.append('style', data.style);
  formData.append('color_palette', data.colorPalette);
  
  if (data.customColors) {
    formData.append('custom_colors', data.customColors);
  }
  
  formData.append('lighting', data.lighting);
  formData.append('furniture', data.furniture);
  formData.append('room_mood', data.roomMood);
  formData.append('budget', data.budget);
  formData.append('sustainability', String(data.sustainability));
  formData.append('preserve_layout', String(data.preserveLayout));
  
  if (data.customPrompt) {
    formData.append('custom_prompt', data.customPrompt);
  }

  if (data.seed !== undefined && data.seed !== null) {
    formData.append('seed', String(data.seed));
  }

  if (data.apiKeyOverride) {
    formData.append('api_key_override', data.apiKeyOverride);
  }

  const response = await fetch(`${API_BASE_URL}/api/redesign`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = 'Failed to redesign room';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export async function fetchStyles(): Promise<DesignStyle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/styles`);
    if (!res.ok) throw new Error('Failed to fetch styles');
    const data = await res.json();
    return data.styles;
  } catch (err) {
    console.warn('Using local styles fallback:', err);
    return [];
  }
}

export async function fetchSampleRooms(): Promise<SampleRoom[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sample-rooms`);
    if (!res.ok) throw new Error('Failed to fetch sample rooms');
    const data = await res.json();
    return data.sample_rooms;
  } catch (err) {
    console.warn('Using local sample rooms fallback:', err);
    return [];
  }
}

export async function fetchHealth(): Promise<{
  status: string;
  project: string;
  active_model: string;
  has_hf_key: boolean;
  default_provider: string;
}> {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

/**
 * Converts a sample room URL to a real File object for seamless 1-click testing
 */
export async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}
