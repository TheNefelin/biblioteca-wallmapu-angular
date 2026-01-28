import { ROUTES } from './routes';

export interface AdminNavigationItem {
  label: string;
  route: string;
  iconPaths: string[]; // Array de paths SVG (algunos iconos tienen múltiples paths)
  tooltip?: string;
}

export const ADMIN_NAVIGATION: AdminNavigationItem[] = [
  {
    label: 'Panel',
    route: ROUTES.PROTECTED.ADMIN.DASHBOARD,
    iconPaths: [
      'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
      'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
    ],
    tooltip: 'Panel'
  },
  {
    label: 'Libros',
    route: ROUTES.PROTECTED.ADMIN.BOOKS,
    iconPaths: [
      'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
    ],
    tooltip: 'Libros'
  },
  {
    label: 'Noticias',
    route: ROUTES.PROTECTED.ADMIN.NEWS,
    iconPaths: [
      'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z'
    ],
    tooltip: 'Noticias'
  },
  {
    label: 'Usuarios',
    route: ROUTES.PROTECTED.ADMIN.USERS,
    iconPaths: [
      'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
    ],
    tooltip: 'Usuarios'
  },
  {
    label: 'Perfil',
    route: ROUTES.PROTECTED.ADMIN.PROFILE,
    iconPaths: [
      'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
    ],
    tooltip: 'Perfil'
  },
  {
    label: 'Configuración',
    route: ROUTES.PROTECTED.ADMIN.SETTINGS,
    iconPaths: [
      'M20 7h-9',
      'M14 17H5',
      'M17 17a3 3 0 1 0 6 0a3 3 0 0 0-6 0z',
      'M7 7a3 3 0 1 1-6 0a3 3 0 0 1 6 0z'
    ],
    tooltip: 'Configuración'
  }
] as const;
