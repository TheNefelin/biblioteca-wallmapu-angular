# Biblioteca Wallmapu Angular 21

### Dependencies
- [DaisyUI](https://daisyui.com/)

### Structure
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── error-handler.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── admin.guard.ts
│   │   │   └── user.guard.ts
│   │   └── interceptors/
│   │       └── auth.interceptor.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── modal/
│   │   │   └── spinner/
│   │   ├── pipes/
│   │   │   └── currency.pipe.ts
│   │   └── directives/
│   │       └── highlight.directive.ts
│   │
│   ├── layouts/
│   │   ├── public/
│   │   │   ├── public.layout.ts
│   │   │   ├── public.layout.html
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── footer/
│   │   │   │   └── sidebar-public/
│   │   │   └── public.routes.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.layout.ts
│   │   │   ├── admin.layout.html
│   │   │   ├── components/
│   │   │   │   ├── navbar-admin/
│   │   │   │   ├── sidebar-admin/
│   │   │   │   └── breadcrumb/
│   │   │   └── admin.routes.ts
│   │   │
│   │   └── user/
│   │       ├── user.layout.ts
│   │       ├── user.layout.html
│   │       ├── components/
│   │       │   ├── navbar-user/
│   │       │   ├── sidebar-user/
│   │       │   └── profile-card/
│   │       └── user.routes.ts
│   │
│   ├── features/
│   │   ├── public/
│   │   │   ├── library/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── library-home/
│   │   │   │   │   ├── book-list/
│   │   │   │   │   ├── book-detail/
│   │   │   │   │   └── search-results/
│   │   │   │   ├── components/
│   │   │   │   │   ├── book-card/
│   │   │   │   │   ├── book-filter/
│   │   │   │   │   └── book-search-bar/
│   │   │   │   ├── services/
│   │   │   │   │   └── book.service.ts       ← Extiende CrudService
│   │   │   │   ├── models/
│   │   │   │   │   └── book.model.ts
│   │   │   │   └── library.routes.ts
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── pages/
│   │   │   │   │   └── home/
│   │   │   │   ├── components/
│   │   │   │   │   ├── hero-banner/
│   │   │   │   │   └── featured-books/
│   │   │   │   └── home.routes.ts
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── components/
│   │   │   │   │   ├── hero-banner/
│   │   │   │   │   └── featured-books/
│   │   │   │   ├── components/
│   │   │   │   ├── components/
│   │   │   │   └── home.routes.ts
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── pages/
│   │   │       │   ├── login/
│   │   │       │   ├── register/
│   │   │       │   └── forgot-password/
│   │   │       ├── services/
│   │   │       │   └── auth-public.service.ts ← Extiende CrudService
│   │   │       ├── models/
│   │   │       │   └── auth.model.ts
│   │   │       └── auth.routes.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── books-management/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── books-list/
│   │   │   │   │   ├── book-create/
│   │   │   │   │   ├── book-edit/
│   │   │   │   │   └── book-detail-admin/
│   │   │   │   ├── components/
│   │   │   │   │   ├── book-form/
│   │   │   │   │   └── books-table/
│   │   │   │   ├── services/
│   │   │   │   │   └── book-admin.service.ts ← Extiende CrudService
│   │   │   │   ├── models/
│   │   │   │   │   └── book-admin.model.ts
│   │   │   │   └── books-management.routes.ts
│   │   │   │
│   │   │   ├── users-management/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── users-list/
│   │   │   │   │   ├── user-create/
│   │   │   │   │   ├── user-edit/
│   │   │   │   │   └── user-detail/
│   │   │   │   ├── components/
│   │   │   │   │   ├── user-form/
│   │   │   │   │   └── users-table/
│   │   │   │   ├── services/
│   │   │   │   │   └── user-admin.service.ts ← Extiende CrudService
│   │   │   │   ├── models/
│   │   │   │   │   └── user-admin.model.ts
│   │   │   │   └── users-management.routes.ts
│   │   │   │
│   │   │   ├── dashboard-admin/
│   │   │   │   ├── pages/
│   │   │   │   │   └── admin-dashboard/
│   │   │   │   ├── components/
│   │   │   │   │   ├── stats-card/
│   │   │   │   │   ├── sales-chart/
│   │   │   │   │   └── recent-activities/
│   │   │   │   ├── services/
│   │   │   │   │   └── dashboard-admin.service.ts
│   │   │   │   └── dashboard-admin.routes.ts
│   │   │   │
│   │   │   └── admin.routes.ts
│   │   │
│   │   └── user/
│   │       ├── profile/
│   │       │   ├── pages/
│   │       │   │   ├── profile-view/
│   │       │   │   └── profile-edit/
│   │       │   ├── components/
│   │       │   │   ├── profile-card/
│   │       │   │   └── edit-profile-form/
│   │       │   ├── services/
│   │       │   │   └── profile.service.ts     ← Extiende CrudService
│   │       │   ├── models/
│   │       │   │   └── profile.model.ts
│   │       │   └── profile.routes.ts
│   │       │
│   │       ├── my-library/
│   │       │   ├── pages/
│   │       │   │   ├── my-books/
│   │       │   │   ├── my-favorites/
│   │       │   │   ├── my-readings/
│   │       │   │   └── borrowed-books/
│   │       │   ├── components/
│   │       │   │   ├── book-card-user/
│   │       │   │   └── reading-progress/
│   │       │   ├── services/
│   │       │   │   └── user-library.service.ts ← Extiende CrudService
│   │       │   ├── models/
│   │       │   │   └── user-library.model.ts
│   │       │   └── my-library.routes.ts
│   │       │
│   │       ├── dashboard-user/
│   │       │   ├── pages/
│   │       │   │   └── user-dashboard/
│   │       │   ├── components/
│   │       │   │   ├── reading-stats/
│   │       │   │   ├── recommendations/
│   │       │   │   └── recent-activity/
│   │       │   ├── services/
│   │       │   │   └── dashboard-user.service.ts
│   │       │   └── dashboard-user.routes.ts
│   │       │
│   │       └── user.routes.ts
│   │
│   ├── app.routes.ts
│   ├── app.component.ts
│   └── app.config.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
└── main.ts
```

## Interceptors
- /core/interceptors/auth-interceptor.ts
```ts
const token = localStorage.getItem('jwt_token');
const protectedRoutes = ['/user', '/admin'];
const isProtected = protectedRoutes.some(route => req.url.includes(route));

if (token && isProtected) {
  req = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
}  
```
- app.config.ts
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor
    ]))
  ]
};
```

## Routes
- tsconfig.app.json
```ts
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@layouts/*": ["app/layouts/*"],
      ...
    }
  }
}
```
- app.routes.ts
```ts
import { Routes } from '@angular/router';
import { PublicLayout } from '@layouts/public-layout/public-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: []
  }
];
```

## Images CSR
- /public/images
- component ts
```ts
import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {

}
```
- component html
```html
<img ngSrc="images/logo.webp" alt="Logo" height="40" width="40">
```


## Components
- Shortcut
```bash
ng g s core/helpers/api-response-service --skip-tests
ng generate interceptor core/interceptors/auth --skip-tests

ng g c layouts/public-layout --skip-tests --style=none
ng g c layouts/user-layout --skip-tests --style=none
ng g c layouts/admin-layout --skip-tests --style=none

ng g c shared/components/navbar-component --skip-tests --style=none
ng g c shared/components/footer-component --skip-tests --style=none

ng g c features/public/home/pages/home-page --skip-tests --style=none
ng g c features/public/home/components/banner-component --skip-tests --style=none
ng g c features/public/home/components/news-component --skip-tests --style=none

```

## To keep your Fork updated
- Add: .github/workflows/sync-fork.yml
```yaml
name: Sync Fork with Upstream

on:
  schedule:
    # Ejecuta cada 6 horas
    - cron: '0 */6 * * *'
  
  # Permite disparo manual desde GitHub UI
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout fork
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Sync with upstream
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
          # Agregar el repositorio original como upstream
          git remote add upstream https://github.com/TU_USUARIO_ORIGINAL/TU_REPO_ORIGINAL.git
          
          # Obtener los cambios del original
          git fetch upstream main
          
          # Sobrescribir el fork con los cambios del original
          git checkout main
          git reset --hard upstream/main
          
          # Hacer push al fork
          git push origin main --force
```

---
---
---
---

# BibliotecaWallmapu

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

- Commands
```bash
ng generate component component-name //components
ng generate service service-name //services
ng generate guard guard-name //guards
ng generate interceptor interceptor-name //interceptors
ng generate pipe pipe-name //pipes
ng generate directive directive-name //directives
ng generate class class-name //clases/modelos
ng generate resolver resolver-name //resolvers
ng generate interface interface-name //interfaces
ng generate enum enum-name //enums
```
- Options
```bash
ng generate component component-name --skip-tests //sin archivo de test
ng generate component component-name --skip-css //sin stylesheet
ng generate component component-name --inline-template --inline-style //inline
ng generate component component-name --standalone //standalone component
ng generate component component-name --dry-run //vista previa sin crear
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
