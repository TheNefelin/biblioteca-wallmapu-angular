export interface AdminStatsModel {
  reservations: number;
  loans: number;
  books: number;
  users: number;
  news: number;  
}


export interface StatModel {
  users: number;
  news: number;
  regions: number;
  provinces: number;
  communes: number;
  authors: number;
  editorials: number;
  subjects: number;
  books: number;
}

export interface UserStatsModel {
  total_borrowed: number;
  active_loans: number;
  overdue_loans: number;
}
