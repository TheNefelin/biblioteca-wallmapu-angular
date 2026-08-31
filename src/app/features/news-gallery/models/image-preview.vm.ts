export interface ImagePreviewVM {
  id?: number; 
  alt: string;
  file?: File;
  preview: string;  // siempre existe (URL o createObjectURL)
  isNew: boolean;   // false = backend | true = nueva
}
