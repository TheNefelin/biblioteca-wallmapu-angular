export interface SaveNewsGalleryModel {
  file: File, 
  alt: string
}

export interface NewsGalleryModel {
  id_news_gallery: number
  alt: string
  url: string
  news_id: number
}

export interface Preview {
  id: number;
  alt: string;
  url: string;
  file: File | null;
}
