export const ROUTES_CONSTANTS = {
  FORBIDDEN: '/forbidden',
  HOME: {
    ROOT: '/',
    NEWS: {
      ROOT: '/news',
      DETAIL: (id: number) => `/news/${id}`,
    },
    BOOK: {
      DETAIL: (bookId: number) => `/book/${bookId}`,
      EDITION: (bookId: number, editionId: number) => `/book/${bookId}/edition/${editionId}`
    },
  },
  PROTECTED: {
    USER: {
      DASHBOARD: '/user',
      RESERVATION: {
        ROOT: '/user/reservation',
      },
      LOAN: {
        ROOT: '/user/loan',
      },
      PROFILE: {
        ROOT: '/user/profile',
        FORM: '/user/profile/form',
      },
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      NOTIFICATION: '/admin/notification',
      RESERVATION: {
        ROOT: '/admin/reservation',
      },
      LOAN: {
        ROOT: '/admin/loan',
      },
      AUTHOR: {
        ROOT: '/admin/author'
      },
      SUBJECT: {
        ROOT: '/admin/subject'
      },
      GENRE: {
        ROOT: '/admin/genre'
      },
      BOOK: {
        ROOT: '/admin/book/list',
        FORM: (bookId: number) => `/admin/book/form/${bookId}`,
      },
      EDITION: {
        FORM: (bookId: number, editionId: number) => `/admin/edition/form/${editionId}/book/${bookId}`,
      },
      COPY: {
        FORM: (bookId: number, editionId: number) => `/admin/copy/book/${bookId}/edition/${editionId}/copy/form`,
      },
      NEWS: {
        ROOT: '/admin/news',
        FORM: '/admin/news/form',
      },
      USERS: {
        ROOT: '/admin/users',
        FORM: '/admin/users/form',
      },
      PROFILE: {
        ROOT: '/admin/profile',
        FORM: '/admin/profile/form',
      },
      SETTINGS: {
        ROOT: '/admin/settings'
      },
    }
  },
  PAGES: [
    { URI: "/", NAME: "Inicio" },
    { URI: "/news", NAME: "Noticias" },
  ],
}