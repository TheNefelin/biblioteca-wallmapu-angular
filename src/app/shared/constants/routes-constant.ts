export const ROUTES_CONSTANTS = {
  FORBIDDEN: '/forbidden',
  HOME: {
    ROOT: '/',
    NEWS: {
      ROOT: '/news',
      DETAIL: (id: number) => `/news/${id}`,
    },
    RESERVATION: {
      ROOT: (bookId: number, editionId: number) => `reservation/book/${bookId}/edition/${editionId}`
    }
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
        FORM: (userId: string) => `/user/profile/form/${userId}`,
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
      EDITORIAL: {
        ROOT: '/admin/editorial'
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
        FORM: (userId: string) => `/admin/users/form/${userId}`,
      },
      PROFILE: {
        ROOT: '/admin/profile',
        FORM: (userId: string) => `/admin/profile/form/${userId}`,
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