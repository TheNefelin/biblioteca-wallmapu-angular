# Biblioteca Wallmapu - Angular 21

Frontend del proyecto Biblioteca Wallmapu desarrollado con Angular 21 siguiendo el patrón Senior.

---

## Dependencias

- [DaisyUI](https://daisyui.com/) - Componentes UI
- [bwip-js](https://github.com/bwip-js/bwip-js) - Generador de códigos de barras
  ```bash
  npm install bwip-js
  ```

---

## Estructura del Proyecto

```
src/app/
├── core/                        # Configuración central
│   ├── guards/                 # Guards de autenticación
│   │   └── auth-guard.ts
│   ├── interceptors/           # Interceptors HTTP
│   │   ├── auth-interceptor.ts
│   │   └── error-interceptor.ts
│   ├── models/                 # Modelos globales
│   │   ├── api-response-model.ts
│   │   ├── pagination-request-model.ts
│   │   └── pagination-response-model.ts
│   ├── pages/                  # Páginas de error
│   │   ├── forbidden-page/
│   │   ├── not-found-page/
│   │   └── book-not-found-page/
│   ├── services/                # Servicios core
│   │   ├── api-response-service.ts
│   │   └── error-modal-service.ts
│   └── utils/                  # Utilidades
│       └── error-handler.ts
│
├── features/                   # Módulos por dominio (Standalone)
│   ├── auth/                   # Autenticación
│   │   ├── components/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── auth-service.ts
│   │   │   ├── auth-google-service.ts
│   │   │   └── auth-store.ts
│   │   └── auth.routes.ts
│   │
│   ├── book/                   # Libros (Admin)
│   │   ├── components/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   └── book.routes.ts
│   │
│   ├── book-author/            # Autores de libros
│   ├── book-editorial/         # Editoriales
│   ├── book-genre/             # Géneros
│   ├── book-subject/           # Materias/Descriptores
│   │
│   ├── copy/                   # Ejemplares
│   │   ├── components/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   └── copy.routes.ts
│   │
│   ├── copy-status/            # Estados de ejemplares
│   ├── dashboard/              # Dashboard Admin/User
│   │   ├── components/
│   │   │   └── admin-stats-components/
│   │   └── pages/
│   │       ├── admin-dashboard-page/
│   │       └── user-dashboard-page/
│   │
│   ├── division-region/        # Regiones
│   ├── division-province/       # Provincias
│   ├── division-commune/       # Comunas
│   │
│   ├── edition/                 # Ediciones
│   │   ├── components/
│   │   │   ├── edition-card-list-component/
│   │   │   ├── edition-form-components/
│   │   │   ├── edition-list-components/
│   │   │   └── edition-search-component/
│   │   ├── models/
│   │   ├── pages/
│   │   │   ├── edition-form-page/
│   │   │   └── edition-list-page/
│   │   ├── services/
│   │   └── edition.routes.ts
│   │
│   ├── home/                   # Home público
│   │   ├── components/
│   │   │   └── about-component/
│   │   ├── pages/
│   │   │   └── home-page/
│   │   └── home.routes.ts
│   │
│   ├── loan/                   # Préstamos
│   │   ├── components/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── admin.loan.routes.ts
│   │   └── user.loan.routes.ts
│   │
│   ├── loan-policies/          # Políticas de préstamos
│   ├── loan-status/           # Estados de préstamos
│   │
│   ├── news/                   # Noticias
│   │   ├── components/
│   │   │   ├── news-card-component/
│   │   │   ├── news-card-list-component/
│   │   │   ├── news-detail-component/
│   │   │   ├── news-detail-gallery-component/
│   │   │   ├── news-featured-component/
│   │   │   ├── news-form-component/
│   │   │   ├── news-list-component/
│   │   │   └── news-list-row-component/
│   │   ├── models/
│   │   │   ├── news-form-model.ts
│   │   │   ├── news-model.ts
│   │   │   └── news-with-images-model.ts
│   │   ├── pages/
│   │   │   ├── news-detail-page/
│   │   │   ├── news-form-page/
│   │   │   ├── news-list-page/
│   │   │   └── news-page/
│   │   ├── services/
│   │   ├── news.routes.ts       # Admin (/admin/news)
│   │   └── home.news.routes.ts  # Público (/news)
│   │
│   ├── notification/           # Notificaciones
│   │   ├── components/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── notification-service.ts
│   │   │   └── notification-badge-state.service.ts
│   │   └── notification.routes.ts
│   │
│   ├── reservation/            # Reservas
│   │   ├── components/
│   │   ├── models/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── reservation.routes.ts
│   │   └── admin.reservation.routes.ts
│   │
│   ├── reservation-status/     # Estados de reservas
│   │
│   ├── stats/                  # Estadísticas
│   │   ├── components/
│   │   ├── models/
│   │   └── services/
│   │
│   └── user/                   # Usuarios
│       ├── components/
│       ├── models/
│       ├── pages/
│       │   ├── user-form.page/
│       │   ├── user-list.page/
│       │   └── user-profile.page/
│       ├── services/
│       ├── user.routes.ts
│       └── profile.route.ts
│
├── layouts/                    # Layouts
│   ├── layout/                # Layout público (home)
│   ├── layout-admin/         # Layout admin
│   │   ├── components/
│   │   │   ├── dashboard-navbar-component/
│   │   │   └── dashboard-sidebar-component/
│   │   └── layout-admin.ts
│   └── layout-user/           # Layout usuario
│
├── shared/                     # Componentes reutilizables
│   ├── components/
│   │   ├── arrow-up-component/
│   │   ├── barcode-generator.component/
│   │   ├── button-barcode-component/
│   │   ├── button-clear-component/
│   │   ├── button-create-component/
│   │   ├── button-delete-component/
│   │   ├── button-edit-component/
│   │   ├── button-goback-component/
│   │   ├── button-notification-component/
│   │   ├── button-refresh-component/
│   │   ├── button-search-component/
│   │   ├── footer-component/
│   │   ├── header-component/
│   │   ├── loading-component/
│   │   ├── message-error-component/
│   │   ├── message-success-component/
│   │   ├── modal-action-component/
│   │   ├── modal-barcode-label-component/
│   │   ├── modal-delete-component/
│   │   ├── modal-error-component/
│   │   ├── modal-image-component/
│   │   ├── pagination-component/
│   │   ├── search-input-component/
│   │   ├── search-codbar-component/
│   │   └── section-header-component/
│   ├── constants/
│   │   ├── roles-enum.ts
│   │   └── routes-constant.ts
│   └── models/
│       └── navigation-model.ts
│
├── app.config.ts              # Configuración de la app
├── app.routes.ts              # Rutas principales
└── app.ts                     # Componente raíz
```

---

## Patrón Senior - Angular 21

### Arquitectura Page vs Component

**Page:** Lógica de negocio, consume servicios, maneja rxResource
**Component:** Solo presentación, recibe datos por `input()`, emite eventos por `output()`

### Signals y rxResource

```typescript
// Estado reactivo
readonly count = signal<number>(0);
readonly computedValue = computed(() => this.count() * 2);

// Datos asíncronos
private readonly dataRX = rxResource({
  params: () => this.payload(),
  stream: ({ params }) => this.service.getAll(params).pipe(
    map(response => response.data)
  )
});

readonly data = computed(() => this.dataRX.value() ?? []);
readonly isLoading = computed(() => this.dataRX.isLoading());
```

### input() y output()

```typescript
@Component({...})
export class MyComponent {
  readonly data = input.required<MyModel[]>();
  readonly isLoading = input<boolean>(false);
  readonly onSelect = output<MyModel>();
}
```

---

## Rutas

### Públicos (`/`)
- `/` → Home
- `/news` → Noticias (público)
- `/news/:id` → Detalle noticia

### Admin (`/admin`)
- `/admin/dashboard` → Dashboard
- `/admin/book` → Libros
- `/admin/edition` → Ediciones
- `/admin/copy` → Ejemplares
- `/admin/loan` → Préstamos
- `/admin/reservation` → Reservas
- `/admin/news` → Noticias (admin)
- `/admin/users` → Usuarios

### Usuario (`/user`)
- `/user/profile` → Perfil
- `/user/reservations` → Mis reservas
- `/user/loans` → Mis préstamos

---

## Comandos

```bash
# Desarrollo
ng serve

# Build producción
ng build

# Lint
ng lint

# Generar componente
ng g c feature/name/component-name

# Generar servicio
ng g s feature/name/service-name

# Generar página
ng g c feature/name/pages/page-name
```

---

## Recursos

- [Angular.dev](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [DaisyUI](https://daisyui.com/)

---

*Documento basado en proyecto Biblioteca Wallmapu*
*Versión: Angular 21 (2026)*