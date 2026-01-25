export const ROUTES = {
  HOME: '/',
  LIBRARY: {
    BASE: '/library',
    BOOK: (id: number) => `/library/book/${id}`,
    BOOKS: '/library/books'
  },
  NEWS: {
    BASE: '/news',
    DETAIL: (id: number) => `/news/${id}`
  },
  PROTECTED: {
    USER: '/user',
    ADMIN: '/admin'
  },
  PAGES: [
    {
      URI: "/library",
      NAME: "Biblioteca"
    },
    {
      URI: "/news",
      NAME: "Noticias"
    },
    {
      URI: "/test",
      NAME: "Test"
    }   
  ],
} as const;