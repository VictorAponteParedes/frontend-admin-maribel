import { httpClient } from '@/lib/httpClient';

export interface UploadedFileResponse {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText: string | null;
}

export const filesService = {
  uploadFile: async (file: File, altText?: string): Promise<UploadedFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }

    const response = await httpClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  resolveImageUrl: (url?: string | null): string => {
    if (!url || !url.trim()) return '';
    const trimmed = url.trim();

    if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
      return trimmed;
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      if (trimmed.includes(':3000/files/stream/')) {
        return trimmed.replace(':3000/files/stream/', ':3000/api/v1/files/stream/');
      }
      return trimmed;
    }

    const backendBase = (
      import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
    ).replace(/\/api\/v1\/?$/, '');

    if (trimmed.startsWith('/files/stream/')) {
      return `${backendBase}/api/v1${trimmed}`;
    }

    if (trimmed.startsWith('/api/v1/files/stream/')) {
      return `${backendBase}${trimmed}`;
    }

    if (trimmed.startsWith('/')) {
      return `${backendBase}${trimmed}`;
    }

    return trimmed;
  },
};

export const resolveImageUrl = filesService.resolveImageUrl;
