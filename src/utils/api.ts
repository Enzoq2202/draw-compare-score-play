
const API_BASE_URL = 'https://viscomp-back-production.up.railway.app';

export interface ProcessImageResponse {
  filename: string;
  text: string;
  cosine_similarity: number;
}

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export const processImage = async (
  imageBlob: Blob,
  category: string
): Promise<ProcessImageResponse> => {
  const formData = new FormData();
  formData.append('file', imageBlob, 'drawing.png');
  formData.append('text', category);

  const response = await fetch(`${API_BASE_URL}/process-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};
