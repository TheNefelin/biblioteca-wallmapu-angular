import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { GenreFormComponents } from '@features/book-genre/components/genre-form-components/genre-form-components';
import { GenreModel, SaveGenreModel } from '@features/book-genre/models/genre-model';
import { GenreService } from '@features/book-genre/services/genre-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';
import { GenreListComponents } from "@features/book-genre/components/genre-list-components/genre-list-components";

@Component({
  selector: 'app-genre-form-page',
  imports: [
    SectionHeaderComponent,
    GenreFormComponents,
    GenreListComponents
],
  templateUrl: './genre-form-page.html',
})
export class GenreFormPage extends CrudPage<GenreModel> {
  private location = inject(Location);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  // SERVICES ----------------------------------------------------------------------
  private genreService = inject(GenreService);
  protected readonly genre = {
    dataList: computed<GenreModel[]>(() => this.getAllGenreRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllGenreRX.isLoading()),
    isSaving: signal<boolean>(false),
    showModal: signal<boolean>(false),
    selectedItem: signal<GenreModel | null>(null),
  }

  // FETCHS ------------------------------------------------------------------------
  private readonly getAllGenreRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.genreService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[GenreService::GenreFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------  
  protected override reload(): void {
    this.getAllGenreRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // GENRE ACTIONS -----------------------------------------------------------------
  protected onClearGenreForm(): void {
    this.genre.selectedItem.set(null);
    this.genre.showModal.set(false);
  }

  protected onCreateGenre(): void {
    this.genre.selectedItem.set(null); 
    this.genre.showModal.set(true)
  }

  protected onEditGenre(item: GenreModel): void {
    this.genre.selectedItem.set(item);
    this.genre.showModal.set(true);
  }

  protected onSubmitGenreForm(form: { id: number, data: SaveGenreModel}): void {
    const id = form.id;
    const payload: SaveGenreModel = form.data

    this.mutation.run(
      id > 0
        ? this.genreService.update(id, payload)
        : this.genreService.create(payload),
      { isSaving: this.genre.isSaving },
      {
        successMsg: id > 0
          ? `Género: ${payload.name} modificado correctamente`
          : `Género: ${payload.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Género' : 'Error al crear el Género',
        onSuccess: () => {
          this.onClearGenreForm();
          this.reload();
        },
      }
    );
  }

  protected async onDeleteGenre(item: GenreModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Género',
      message: `Estás seguro que deseas eliminar el Género (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.genreService.delete(item.id_genre),
      { isSaving: this.genre.isSaving },
      {
        successMsg: `Género: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Género',
        onSuccess: () => this.reload(),
      }
    );
  }

  // ACTIONS ----------------------------------------------------------------------- 
  protected navigateBack(): void {
    this.location.back();
  }
}