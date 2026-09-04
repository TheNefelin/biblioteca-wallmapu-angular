import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { GenreFormComponents } from '@features/book-genre/components/genre-form-components/genre-form-components';
import { CreateGenreModel, GenreModel, UpdateGenreModel } from '@features/book-genre/models/genre-model';
import { GenreService } from '@features/book-genre/services/genre-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';
import { PaginationComponent } from '@shared/components/pagination-component/pagination-component';
import { SearchInputComponent } from '@shared/components/search-input-component/search-input-component';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-genre-form-page',
  imports: [
    DatePipe,
    SectionHeaderComponent,
    GenreFormComponents,
    SearchInputComponent,
    LoadingComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './genre-form-page.html',
})
export class GenreFormPage extends CrudPage<GenreModel> {
  private location = inject(Location);
  private service = inject(GenreService);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  protected readonly isFormModalOpen = signal<boolean>(false);
  protected readonly selectedGenre = signal<GenreModel | null>(null);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly computedList = computed<GenreModel[]>(() => this.getAllRX.value() ?? []);

  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.service.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[GenreService::GenreFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // Metodos de Herencia CrudPage ------------------------------------------------------------
  protected override reload(): void {
    this.getAllRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // Acciones --------------------------------------------------------------------------------
  protected onSelectedGenre(item: GenreModel): void {
    this.selectedGenre.set(item);
    this.isFormModalOpen.set(true);
  }

  protected onClearForm(): void {
    this.selectedGenre.set(null);
    this.isFormModalOpen.set(false);
  }

  protected onSubmitForm(form: GenreModel): void {
    const id = form.id_genre;
    const payload: CreateGenreModel | UpdateGenreModel = id > 0
      ? { id_genre: id, name: form.name }
      : { name: form.name };

    this.mutation.run(
      id > 0
        ? this.service.update(id, payload as UpdateGenreModel)
        : this.service.create(payload as CreateGenreModel),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0
          ? `Género: ${form.name} modificado correctamente`
          : `Género: ${form.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Género' : 'Error al crear el Género',
        onSuccess: () => {
          this.onClearForm();
          this.reload();
        },
      }
    );
  }

  protected async onDelete(item: GenreModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Género',
      message: `Estás seguro que deseas eliminar el Género (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.service.delete(item.id_genre),
      { isSaving: this.isSaving },
      {
        successMsg: `Género: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Género',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected navigateBack(): void {
    this.location.back();
  }
}