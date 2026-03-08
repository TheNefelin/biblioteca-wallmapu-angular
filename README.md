# Biblioteca Wallmapu Angular 21

### Dependencies
- [DaisyUI](https://daisyui.com/)

### Structure
```
project
│
├─ public/
│   ├─ images/
│   └─ favicon.ico
│
├─ src/
│   ├─ app/
│   │   ├─ core/
│   │   │   ├─ guards/        <- sin implementar
│   │   │   ├─ helpers/
│   │   │   │   └─ api-response-service.ts
│   │   │   ├─ interceptors/
│   │   │   │   ├─ auth-interceptor.ts
│   │   │   │   └─ error-interceptor.ts
│   │   │   └─ services/
│   │   │       ├─ book-service.ts
│   │   │       └─ news-service.ts
│   │   │
│   │   ├─ features/
│   │   │   ├─ user/
│   │   │   │   ├─ models/
│   │   │   │   │   └─ user-model.ts
│   │   │   │   ├─ pages/
│   │   │   │   │   ├─ user-edit.page/
│   │   │   │   │   ├─ user-list.page/
│   │   │   │   │   └─ user-profile.page/
│   │   │   │   ├─ services/
│   │   │   │   │   └─ user-service.ts
│   │   │   │   └─ user.routes.ts
│   │   │   ├─ auth/
│   │   │   │   ├─ components/
│   │   │   │   │   └─ auth-button-component/
│   │   │   │   ├─ models/
│   │   │   │   │   ├─ api-auth-request.ts
│   │   │   │   │   ├─ api-auth-response.ts
│   │   │   │   │   ├─ user-google.ts
│   │   │   │   │   └─ user.ts
│   │   │   │   └─ services/
│   │   │   │       ├─ auth-google-service.ts
│   │   │   │       ├─ auth-service.ts
│   │   │   │       └─ auth-store.ts
│   │   │   ├─ admin/
│   │   │   │   ├─ book/
│   │   │   │   │   ├─ pages/
│   │   │   │   │   │   └─ book-page/
│   │   │   │   │   └─ home.routes.ts
│   │   │   │   ├─ dashboard/
│   │   │   │   │   ├─ pages/
│   │   │   │   │   │   └─ dashboard-page/
│   │   │   │   │   └─ dashboard.routes.ts
│   │   │   │   ├─ news/
│   │   │   │   │   ├─ models/
│   │   │   │   │   │   └─ image-item.ts
│   │   │   │   │   ├─ pages/
│   │   │   │   │   │   └─ news-page/
│   │   │   │   │   └─ news.routes.ts
│   │   │   │   └─ profile/
│   │   │   │       ├─ pages/
│   │   │   │       │   └─ profile-page/
│   │   │   │       └─ profile.routes.ts
│   │   │   ├─ auth/
│   │   │   │   ├─ components/
│   │   │   │   │   └─ auth-button-component/
│   │   │   │   ├─ models/
│   │   │   │   │   ├─ api-auth-request.ts
│   │   │   │   │   ├─ api-auth-response.ts
│   │   │   │   │   ├─ user-google.ts
│   │   │   │   │   └─ user.ts
│   │   │   │   └─ services/
│   │   │   │       └─ auth-service.ts
│   │   │   ├─ public/
│   │   │   │   ├─ about/     <- sin implementar
│   │   │   │   ├─ contact/   <- sin implementar
│   │   │   │   ├─ home/
│   │   │   │   │   ├─ components/
│   │   │   │   │   │   ├─ banner-component/
│   │   │   │   │   │   ├─ latest-news-component/
│   │   │   │   │   │   ├─ recommended-books-component/
│   │   │   │   │   │   └─ title-component/
│   │   │   │   │   ├─ pages/
│   │   │   │   │   │   └─ home-page/
│   │   │   │   │   └─ home.routes.ts
│   │   │   │   ├─ library/
│   │   │   │   │   ├─ components/
│   │   │   │   │   │   ├─ book-details-component/
│   │   │   │   │   │   └─ book-list-component/
│   │   │   │   │   ├─ pages/
│   │   │   │   │   │   ├─ book-details-page/
│   │   │   │   │   │   └─ books-page/
│   │   │   │   │   └─ library.routes.ts
│   │   │   │   └─ news/
│   │   │   │       ├─ components/
│   │   │   │       │   ├─ news-details-component/
│   │   │   │       │   └─ news-list-component/
│   │   │   │       ├─ pages/
│   │   │   │       │   ├─ news-details-page/
│   │   │   │       │   └─ news-page/
│   │   │   │       └─ news.routes.ts
│   │   │   └─ user/
│   │   │       ├─ models/
│   │   │       │   └─ user-model.ts
│   │   │       ├─ pages/
│   │   │       │   ├─ user-edit.page/
│   │   │       │   ├─ user-list.page/
│   │   │       │   └─ user-profile.page/
│   │   │       ├─ services/
│   │   │       │   └─ user-service.ts
│   │   │       └─ user.routes.ts
│   │   │
│   │   ├─ layouts/
│   │   │   ├─ admin-layout/  <- sin implementar
│   │   │   ├─ public-layout/
│   │   │   └─ user-layout/   <- sin implementar
│   │   │
│   │   ├─ shared/
│   │   │   ├─ components/
│   │   │   │   ├─ arrow-up-component/
│   │   │   │   ├─ book-card-component/
│   │   │   │   ├─ dashboard-component/
│   │   │   │   ├─ footer-component/
│   │   │   │   ├─ header-component/
│   │   │   │   ├─ loading-component/
│   │   │   │   ├─ newmessage-error-component/
│   │   │   │   ├─ message-success-component/
│   │   │   │   ├─ navbar-component/
│   │   │   │   ├─ news-card-component/
│   │   │   │   ├─ news-details-component/
│   │   │   │   ├─ news-gallery-component/
│   │   │   │   ├─ news-list-component/
│   │   │   │   ├─ news-skeleton-component/
│   │   │   │   ├─ pagination-component/
│   │   │   │   └─ section-header-component/
│   │   │   ├─ constants/
│   │   │   │   ├─ default-api-result.ts
│   │   │   │   ├─ navigation-admin.ts
│   │   │   │   ├─ navigation-user.ts
│   │   │   │   └─ routes.ts
│   │   │   ├─ models/
│   │   │   │   └─ NavigationItem.ts
│   │   │   └─ pages/
│   │   │       ├─ not-found-page/
│   │   │       └─ test-page/
│   │   │
│   │   ├─ app.config.ts
│   │   ├─ app.html
│   │   ├─ app.routes.ts
│   │   └─ app.ts
│   │
│   ├── environments/
│   │   └── environment.ts
│   │
│   ├─ index.html
│   ├─ main.ts
│   └─ styles.css
│
├─ LICENSE.txt
└─ README.md
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

## Recursos y Referencias
- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular HTTP Best Practices](https://angular.dev/guide/http)
- [RxJS Best Practices](https://rxjs.dev/guide/overview)

## Components
- Shortcut
```bash
# ---------------------------------------------------------------------------------
# CORE
ng g guard core/guards/auth --skip-tests

ng g interceptor core/interceptors/auth --skip-tests
ng g interceptor core/interceptors/error --skip-tests

ng g interface core/models/api-response-model
ng g interface core/models/pagination-model

ng g c core/pages/forbidden-page --skip-tests --style=none
ng g c core/pages/In-development-page --skip-tests --style=none
ng g c core/pages/not-found-page --skip-tests --style=none

ng g s core/services/error-modal-service --skip-tests
ng g s core/services/api-response-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES AUTH
ng g c features/auth/components/auth-button-component --skip-tests --style=none

ng g interface features/auth/models/api-auth-google-request
ng g interface features/auth/models/api-auth-google-response
ng g interface features/auth/models/auth-user

ng g s features/auth/services/auth-google-service --skip-tests
ng g s features/auth/services/auth-service --skip-tests
ng g s features/auth/services/auth-store --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK
ng g c features/book/components/book-card-component --skip-tests --style=none
ng g c features/book/components/book-card-list-component --skip-tests --style=none
ng g c features/book/components/book-detail-component --skip-tests --style=none
ng g c features/book/components/book-form-component --skip-tests --style=none
ng g c features/book/components/book-list-component --skip-tests --style=none
ng g c features/book/components/book-list-row-component --skip-tests --style=none

ng g interface features/book/models/book-detail-model
ng g interface features/book/models/book-form-model
ng g interface features/book/models/book-model

ng g c features/book/pages/book-form-page --skip-tests --style=none
ng g c features/book/pages/book-list-page --skip-tests --style=none

ng g s features/book/services/book-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK AUTHOR
ng g c features/book-author/components/author-list-components --skip-tests --style=none
ng g c features/book-author/components/author-select-components --skip-tests --style=none

ng g interface features/book-author/models/author-model

ng g s features/book-author/services/author-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK AUTHOR STEP
ng g interface features/book-author-step/models/book-author-step-model

ng g s features/book-author-step/services/book-author-step-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK COPY STATUS
ng g c features/book-copy-status/components/book-copy-status-select-components --skip-tests --style=none

ng g interface features/book-copy-status/models/book-copy-status-model

ng g s features/book-copy-status/services/book-copy-status-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK EDITORIAL
ng g c features/book-editorial/components/editorial-select-components --skip-tests --style=none

ng g interface features/book-editorial/models/editorial-model

ng g s features/book-editorial/services/editorial-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK GENRE
ng g c features/book-genre/components/genre-select-components --skip-tests --style=none

ng g interface features/book-genre/models/genre-model

ng g s features/book-genre/services/genre-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK SUBJECT
ng g c features/book-subject/components/subject-list-components --skip-tests --style=none
ng g c features/book-subject/components/subject-select-components --skip-tests --style=none
ng g c features/book-subject/components/subject-select-with-list-components --skip-tests --style=none

ng g interface features/book-subject/models/subject-model

ng g s features/book-subject/services/subject-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES BOOK SUBJECT STEP
ng g interface features/book-subject-step/models/book-subject-step-model

ng g s features/book-subject-step/services/book-subject-step-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES DIVISION COMMUNE
ng g c features/division-commune/components/commune-select-components --skip-tests --style=none

ng g interface features/division-commune/models/commune-model

ng g s features/division-commune/services/commune-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES DIVISION PROVINCE
ng g c features/division-province/components/province-select-components --skip-tests --style=none

ng g interface features/division-province/models/province-model

ng g s features/division-province/services/province-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES DIVISION REGION
ng g c features/division-region/components/region-select-components --skip-tests --style=none

ng g interface features/division-region/models/region-model

ng g s features/division-region/services/region-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES EDITION
ng g c features/edition/components/edition-form-components --skip-tests --style=none
ng g c features/edition/components/edition-list-components --skip-tests --style=none

ng g interface features/edition/models/edition-model

ng g c features/edition/pages/edition-form-page --skip-tests --style=none

ng g s features/edition/services/edition-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES HOME
ng g c features/home/components/about-component --skip-tests --style=none

ng g c features/home/pages/book-detail-page --skip-tests --style=none
ng g c features/home/pages/home-page --skip-tests --style=none
ng g c features/home/pages/news-page --skip-tests --style=none
ng g c features/home/pages/news-detail-page --skip-tests --style=none

# ---------------------------------------------------------------------------------
# FEATURES NEWS
ng g c features/news/components/news-card-component --skip-tests --style=none
ng g c features/news/components/news-card-list-component --skip-tests --style=none
ng g c features/news/components/news-detail-component --skip-tests --style=none
ng g c features/news/components/news-detail-gallery-component --skip-tests --style=none
ng g c features/news/components/news-featured-component --skip-tests --style=none
ng g c features/news/components/news-form-component --skip-tests --style=none
ng g c features/news/components/news-list-component --skip-tests --style=none
ng g c features/news/components/news-list-row-component --skip-tests --style=none

ng g interface features/news/models/news-form-model
ng g interface features/news/models/news-model
ng g interface features/news/models/news-with-images-model

ng g c features/news/pages/news-card-list-page --skip-tests --style=none
ng g c features/news/pages/news-details-page --skip-tests --style=none
ng g c features/news/pages/news-form-page --skip-tests --style=none
ng g c features/news/pages/news-list-page --skip-tests --style=none

ng g s features/news/services/news-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES NEWS GALLERY
ng g c features/news-gallery/components/image-list-component --skip-tests --style=none
ng g c features/news-gallery/components/news-gallery-component --skip-tests --style=none

ng g interface features/news-gallery/models/news-gallery-model
ng g interface features/news-gallery/models/create-news-gallery-model

ng g s features/news-gallery/services/news-gallery-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES STATS
ng g interface features/stats/models/stat-model

ng g c features/stats/pages/stat.page --skip-tests --style=none

ng g s features/stats/services/stat-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES USER
ng g c features/user/components/user-form-components --skip-tests --style=none
ng g c features/user/components/user-list-components --skip-tests --style=none
ng g c features/user/components/user-list-row-component --skip-tests --style=none
ng g c features/user/components/user-profile-components --skip-tests --style=none

ng g interface features/user/models/user-detail-model
ng g interface features/user/models/user-form-model
ng g interface features/user/models/user-model
ng g interface features/user/models/user-update-model

ng g c features/user/pages/user-form.page --skip-tests --style=none
ng g c features/user/pages/user-list.page --skip-tests --style=none
ng g c features/user/pages/user-profile.page --skip-tests --style=none

ng g s features/user/services/user-service --skip-tests

# ---------------------------------------------------------------------------------
# FEATURES USER ROL
ng g interface features/user-role/models/user-role-model

ng g s features/user-role/services/user-role-service --skip-tests

ng g c features/user-role/components/user-role-select-components --skip-tests --style=none

# ---------------------------------------------------------------------------------
# FEATURES USER STATUS
ng g interface features/user-status/models/user-status-model

ng g s features/user-status/services/user-status-service --skip-tests

ng g c features/user-status/components/user-status-select-components --skip-tests --style=none

# ---------------------------------------------------------------------------------
# LAYOUT
ng g c layouts/components/arrow-up-component --skip-tests --style=none
ng g c layouts/components/dashboard-component --skip-tests --style=none
ng g c layouts/components/dashboard-navbar-component --skip-tests --style=none
ng g c layouts/components/dashboard-sidebar-component --skip-tests --style=none
ng g c layouts/components/footer-component --skip-tests --style=none
ng g c layouts/components/navbar-component --skip-tests --style=none

ng g c layouts/layout --skip-tests --style=none
ng g c layouts/layout-admin --skip-tests --style=none
ng g c layouts/layout-user --skip-tests --style=none

# ---------------------------------------------------------------------------------
# SHARED COMPONENTS
ng g c shared/components/header-component --skip-tests --style=none
ng g c shared/components/loading-component --skip-tests --style=none
ng g c shared/components/message-error-component --skip-tests --style=none
ng g c shared/components/message-success-component --skip-tests --style=none
ng g c shared/components/modal-delete-component --skip-tests --style=none
ng g c shared/components/modal-error-component --skip-tests --style=none
ng g c shared/components/modal-image-component --skip-tests --style=none
ng g c shared/components/Pagination-component --skip-tests --style=none
ng g c shared/components/section-header-component --skip-tests --style=none

# ---------------------------------------------------------------------------------
# SHARED MODELS
ng g interface shared/models/navigation-model

# ---------------------------------------------------------------------------------
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

## Google Auth
- [Google Credentials](https://console.cloud.google.com/apis/credentials)

## Prompt
```text

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
