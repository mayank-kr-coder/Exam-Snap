export type ExamCategory = 
  | 'ssc'
  | 'upsc'
  | 'railway'
  | 'banking'
  | 'state'
  | 'university'
  | 'defense'
  | 'custom';

export interface ExamDocumentSpec {
  id: string;
  name: string; // e.g. "Passport Photograph", "Signature"
  type: 'photo' | 'signature' | 'thumb' | 'certificate_pdf';
  requiredWidthPx?: number;
  requiredHeightPx?: number;
  widthCm?: number;
  heightCm?: number;
  dpi?: number;
  minKb: number;
  maxKb: number;
  allowedFormats: ('image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf')[];
  formatLabel: string; // "JPG / JPEG"
  backgroundColor?: 'white' | 'light' | 'any';
  backgroundDescription?: string; // "White or very light grey background"
  requireDateStamp?: boolean;
  requireNameStamp?: boolean;
  notes?: string;
}

export interface ExamPreset {
  id: string;
  name: string; // e.g. "SSC CGL / CHSL / MTS 2026"
  shortCode: string; // "SSC-CGL"
  category: ExamCategory;
  categoryLabel: string; // "SSC Exams"
  organization: string; // "Staff Selection Commission"
  status: 'verified' | 'sample_demo';
  sourceUrl: string; // Official notification link
  sourceName: string; // "SSC Official Notice 2026"
  lastVerifiedDate: string; // "2026-02-15"
  description: string;
  documents: {
    photo?: ExamDocumentSpec;
    signature?: ExamDocumentSpec;
    thumb?: ExamDocumentSpec;
    certificate?: ExamDocumentSpec;
  };
}
