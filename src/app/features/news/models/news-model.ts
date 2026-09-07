import { NewsGalleryModel } from "@features/news-gallery/models/news-gallery-model";

export interface SaveNewsModel {
  title: string;
  subtitle: string;
  body: string;
}

export interface NewsModel extends SaveNewsModel {
  id_news: number;
  created_at: string;
  updated_at: string;
  images: NewsGalleryModel[];
}
