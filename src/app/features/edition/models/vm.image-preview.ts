export type ImagePreviewVM = {
  file?: File;
  preview: string;  // siempre existe (URL o createObjectURL)
  isNew: boolean;   // false = backend | true = nueva
};
