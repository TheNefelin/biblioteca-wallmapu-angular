export interface PaginationResponseModel<T> {
  page: number;
  pages: number;
  items: number;
  next: string | null;
  prev: string | null;
  data: T;
}
