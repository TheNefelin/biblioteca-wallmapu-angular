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
│   │   │   └─ services/
│   │   │       └─ book-service.ts
│   │   │
│   │   ├─ features/
│   │   │   ├─ admin/
│   │   │   ├─ public/
│   │   │   │   ├─ about/     <- sin implementar
│   │   │   │   ├─ contact/   <- sin implementar
│   │   │   │   ├─ home/
│   │   │   │   │   ├─ components/
│   │   │   │   │   ├─ pages/
│   │   │   │   │   └─ home.routes.ts
│   │   │   │   ├─ library/
│   │   │   │   │   ├─ components/
│   │   │   │   │   ├─ pages/
│   │   │   │   │   │   ├─ book-details-page/
│   │   │   │   │   │   └─ books-page/
│   │   │   │   │   └─ library.routes.ts
│   │   │   │   └─ news/
│   │   │   │       ├─ pages/
│   │   │   │       └─ news.routes.ts
│   │   │   └─ user/
│   │   │
│   │   ├─ layouts/
│   │   │   ├─ admin-layout/  <- sin implementar
│   │   │   ├─ public-layout/
│   │   │   └─ user-layout/   <- sin implementar
│   │   │
│   │   ├─ shared/
│   │   │   ├─ components/
│   │   │   └─ models/
│   │   │
│   │   ├─ app.config.ts
│   │   ├─ app.html
│   │   ├─ app.routes.ts
│   │   └─ app.ts
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
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


## Components
- Shortcut
```bash
ng g s core/helpers/api-response-service --skip-tests
ng generate interceptor core/interceptors/auth --skip-tests
ng g s core/services/book-service --skip-tests

ng g c layouts/public-layout --skip-tests --style=none
ng g c layouts/user-layout --skip-tests --style=none
ng g c layouts/admin-layout --skip-tests --style=none

ng g c shared/components/navbar-component --skip-tests --style=none
ng g c shared/components/footer-component --skip-tests --style=none
ng g c shared/components/arrow-up-component --skip-tests --style=none
ng g c shared/components/header-component --skip-tests --style=none
ng g c shared/pages/not-found-page --skip-tests --style=none
ng g interface shared/models/news
ng g interface shared/models/book

ng g c features/public/home/pages/home-page --skip-tests --style=none
ng g c features/public/home/components/title-component --skip-tests --style=none
ng g c features/public/home/components/banner-component --skip-tests --style=none
ng g c features/public/home/components/latest-news-component --skip-tests --style=none
ng g c features/public/home/components/recommended-books-component --skip-tests --style=none

ng g c features/public/library/pages/books-page --skip-tests --style=none
ng g c features/public/library/pages/book-details-page --skip-tests --style=none

ng g c features/public/news/pages/news-page --skip-tests --style=none

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
