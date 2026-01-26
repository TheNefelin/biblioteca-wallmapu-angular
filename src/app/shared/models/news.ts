import { NewsGallery } from "./news-gallery";

export interface News {
  id: number,
  title: string,
  subtitle: string,
  body: string,
  date: string,
  images: NewsGallery[],
}
