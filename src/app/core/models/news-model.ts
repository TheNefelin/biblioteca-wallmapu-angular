import { NewsGalleryModel } from "@core/models/news-gallery-model";

export interface NewsWithImagesModel {
  id_news: number,
  title: string,
  subtitle: string,
  body: string,
  created_at: string,
  updated_at: string,
  images: NewsGalleryModel[]
}

export interface NewsModel {
  id_news: number,
  title: string,
  subtitle: string,
  body: string,
  created_at: string,
  updated_at: string
}

export interface FormNewsModel {
  id_news: number,
  title: string,
  subtitle: string,
  body: string,
}
