export interface ImageItem {
  id?: number;       // si viene del backend
  alt: string;
  file?: File;       // solo si es nueva
  preview: string;   // siempre existe (URL o createObjectURL)
  existing: boolean; // true = backend | false = nueva
}