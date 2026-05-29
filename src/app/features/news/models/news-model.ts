import { NewsGalleryModel } from "@features/news-gallery/models/news-gallery-model";

export interface CreateNewsModel {
  title: string;
  subtitle: string;
  body: string;
}

export interface UpdateNewsModel extends CreateNewsModel {
  id_news: number;
}

export interface NewsModel extends UpdateNewsModel {
  created_at: string,
  updated_at: string
}

export interface NewsDetailModel extends NewsModel {
  created_at: string,
  updated_at: string
  images: NewsGalleryModel[]
}
