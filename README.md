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
│   │   ├── api-service.ts        # Cliente HTTP genérico
│   │   ├── modal-error-service.ts
│   │   ├── modal-confirm-service.ts
│   │   ├── toast-success-service.ts
│   │   └── mutation-service.ts
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
│   │   ├── button-component/        # Botón unificado (icon tipado + textBtn + clicked)
│   │   ├── button-barcode-component/  # (basura futura: usar button-component)
│   │   ├── button-clear-component/    # (basura futura)
│   │   ├── button-create-component/   # (basura futura)
│   │   ├── button-delete-component/   # (basura futura)
│   │   ├── button-edit-component/     # (basura futura)
│   │   ├── button-goback-component/   # (basura futura)
│   │   ├── button-notification-component/  # (basura futura)
│   │   ├── button-refresh-component/  # (basura futura)
│   │   ├── button-search-component/   # (basura futura)
│   │   ├── footer-component/
│   │   ├── header-component/
│   │   ├── loading-component/
│   │   ├── message-error-component/   # (basura futura: usar toast/modal-error)
│   │   ├── message-success-component/ # (basura futura: usar toast)
│   │   ├── modal-action-component/    # (basura futura: usar modal-confirm)
│   │   ├── modal-barcode-label-component/
│   │   ├── modal-confirm-component/
│   │   ├── modal-delete-component/    # (basura futura: usar modal-confirm)
│   │   ├── modal-error-component/
│   │   ├── modal-image-component/
│   │   ├── pagination-component/
│   │   ├── search-input-component/
│   │   ├── search-codbar-component/
│   │   ├── section-header-component/
│   │   └── toast-success-component/
│   ├── base/
│   │   └── crud-page.ts         # Clase base de páginas de listado paginado
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

## Arquitectura de feedback (mutation, error, confirm, toast)

Los servicios de feedback centralizan la interacción con el usuario. Son singletons globales (`providedIn: 'root'`) y sus componentes de presentación se montan **una sola vez** en `app.html`. El feature **nunca** instancia el modal/toast: solo llama al servicio y reacciona a su retorno.

```
app.html  (montaje global único)
├─ <app-modal-error-component/>    ← inyecta ModalErrorService
├─ <app-modal-confirm-component/>  ← inyecta ModalConfirmService
└─ <app-toast-success-component/>  ← inyecta ToastSuccessService
```

### ToastSuccessService — notificaciones no bloqueantes

Confirmaciones de éxito/guardado/información. Solo `success`/`info` (los errores van por `modal-error`).

```
feature ── toastSuccess.show('Formato: X guardado correctamente', 'success')
             │  agrega {id, message, type} al signal
             ▼
       <app-toast-success-component/>  (montado en app.html)
             │  renderiza toast toast-end + auto-clear 5s
             ▼  el toast desaparece solo
```

- El **mensaje lo construye el feature**, el toast solo lo renderiza.
- Ej: `toastSuccess.show(Formato: ${name} guardado correctamente)`.

### ModalErrorService — errores críticos/bloqueantes

Para fallos que requieren atención (interceptor HTTP, 401, 500).

```
feature/interceptor ── modalError.open({ title, message })
                       ▼
              ModalErrorService (signal) → <app-modal-error-component/> → modal bloqueante
```

### ModalConfirmService — confirmación de acciones destructivas

```
feature ── const ok = await confirmService.confirm({ title, message })
              ▼ (Promise<boolean>)
      ModalConfirmService (signal) → <app-modal-confirm-component/>
              ▼  usuario pulsa Confirmar → true | Cancelar → false
     if (!ok) return;   // el feature decide seguir
```

El feature recibe `true`/`false` **sin tocar el modal**.

### MutationService — orquesta save/delete + toast

Encapsula el ciclo completo de una mutación y dispara el toast de éxito.

```typescript
this.mutation.run(request$, { isSaving: this.isSaving }, {
  successMsg: `Formato: ${name} guardado correctamente`,
  errorMsg: 'Error al guardar el Formato',
  onSuccess: () => this.reload(),
});
```

```
run(request$, {isSaving}, {successMsg, errorMsg, onSuccess})
  1. isSaving.set(true)        # deshabilita botones / muestra loading
  2. request$.subscribe(
       next → toastSuccess.show(successMsg); isSaving=false; onSuccess?.()
       error → console.error; isSaving=false
     )
```

### CrudPage — base para listados paginados

Para un **listado + form embebido** (caso `format`), el page extiende `CrudPage<TModel>`:

```typescript
class FormatFormPage extends CrudPage<FormatModel> {
  protected readonly computedList = computed(() => this.getAllRX.value() ?? []);

  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => this.service.getAllPagination(params).pipe(
      map(response => this.mapPaginated(response.data)),  // => array de items
      catchError(() => of(this.emptyPaginated()))
    ),
  });

  protected async onDelete(item: FormatModel) {
    const ok = await this.confirmService.confirm({ title, message });
    if (!ok) return;
    this.mutation.run(this.service.delete(item.id_format), { isSaving }, {
      successMsg: `Formato: ${item.name} eliminado correctamente`,
      onSuccess: () => this.reload(),
    });
  }
}
```

Pautas:
- La tabla se itera **inline** con `computedList()` y `button-component` (edit/delete).
- Paginación con `PaginationComponent` (`[currentPage]`, `[totalPages]`, `prevPage`/`nextPage`).
- No usar `MessageSuccess`/`MessageError`/`modal-action`: los reemplaza el toast/confirm global.

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
ng g c features/name/component-name

# Generar servicio
ng g s features/name/service-name

# Generar página
ng g c features/name/pages/page-name
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