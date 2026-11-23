export type ToolId = 
  | 'passport-photo-resizer'
  | 'signature-resizer'
  | 'photo-compressor'
  | 'signature-compressor'
  | 'background-changer'
  | 'date-stamp-tool'
  | 'thumb-impression-resizer'
  | 'pdf-compressor'
  | 'image-to-jpg'
  | 'photo-cropper';

export interface ToolInfo {
  id: ToolId;
  title: string;
  tagline: string;
  shortDesc: string;
  category: 'photo' | 'signature' | 'document' | 'all';
  icon: string;
  route: string;
  badge?: string;
  popular?: boolean;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  progress?: number;
}
