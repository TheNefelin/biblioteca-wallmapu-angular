export interface PaginationModel<T> {
  count: number
  pages: number
  next: string
  prev: string
  result: T
}
