export interface SelectItem {
  id: number;
  name: string;
}

type ModelWithIdAndName = { id: number; name: string };
type AuthorModel = { id_author: number; name: string };
type GenreModel = { id_genre: number; name: string };
type SubjectModel = { id_subject: number; name: string };
type EditorialModel = { id_editorial: number; name: string };
type CommuneModel = { id_commune: number; name: string };

export function toSelectItem(item: ModelWithIdAndName): SelectItem;
export function toSelectItem(item: AuthorModel): SelectItem;
export function toSelectItem(item: GenreModel): SelectItem;
export function toSelectItem(item: SubjectModel): SelectItem;
export function toSelectItem(item: EditorialModel): SelectItem;
export function toSelectItem(item: CommuneModel): SelectItem;
export function toSelectItem(item: ModelWithIdAndName | AuthorModel | GenreModel | SubjectModel | EditorialModel | CommuneModel): SelectItem {
  if ('id_author' in item) return { id: item.id_author, name: item.name };
  if ('id_genre' in item) return { id: item.id_genre, name: item.name };
  if ('id_subject' in item) return { id: item.id_subject, name: item.name };
  if ('id_editorial' in item) return { id: item.id_editorial, name: item.name };
  if ('id_commune' in item) return { id: item.id_commune, name: item.name };
  return { id: item.id, name: item.name };
}

export function toSelectItemList(items: AuthorModel[]): SelectItem[];
export function toSelectItemList(items: GenreModel[]): SelectItem[];
export function toSelectItemList(items: SubjectModel[]): SelectItem[];
export function toSelectItemList(items: EditorialModel[]): SelectItem[];
export function toSelectItemList(items: CommuneModel[]): SelectItem[];
export function toSelectItemList(items: ModelWithIdAndName[]): SelectItem[];
export function toSelectItemList(items: AuthorModel[] | GenreModel[] | SubjectModel[] | EditorialModel[] | CommuneModel[] | ModelWithIdAndName[]): SelectItem[] {
  return items.map(toSelectItem);
}
