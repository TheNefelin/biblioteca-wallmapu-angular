import { inject, Injectable } from '@angular/core';
import { Book } from '@shared/models/book';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiService = inject(ApiResponseService<Book>);

  private books: Book[] = [
    {
      id: 1,
      title: 'Papelucho',
      description: 'Las aventuras de un niño travieso chileno que vive diversas experiencias llenas de humor e inocencia.',
      author: 'Marcela Paz',
      publishedDate: '1947-01-15',
      isbn: '978-9561111851',
      coverImageUrl: '01.jpg',
      stars: 4.5
    },
    {
      id: 2,
      title: 'Un viejo que leía novelas de amor',
      description: 'Un anciano pescador de una aldea remota descubre el amor a través de la lectura en la Amazonia.',
      author: 'Luis Sepúlveda',
      publishedDate: '1989-03-10',
      isbn: '978-8483835302',
      coverImageUrl: '02.jpg',
      stars: 4.8
    },
    {
      id: 3,
      title: 'El despertar de los dragones',
      description: 'Una épica fantasía donde los dragones despiertan de su letargo ancestral en un mundo de magia.',
      author: 'Christopher Paolini',
      publishedDate: '2003-06-20',
      isbn: '978-0-375-82668-0',
      coverImageUrl: '03.jpg',
      stars: 4.7
    },
    {
      id: 4,
      title: 'El mundo de Hielo y Fuego',
      description: 'La historia épica de reinos en guerra por el Trono de Hierro en un mundo de fantasía.',
      author: 'George R. R. Martin',
      publishedDate: '1996-08-01',
      isbn: '978-8416035342',
      coverImageUrl: '04.jpg',
      stars: 4.9
    },
    {
      id: 5,
      title: 'Cementerio de animales',
      description: 'Una inquietante historia de horror sobre un lugar misterioso donde los muertos regresan.',
      author: 'Stephen King',
      publishedDate: '1983-11-14',
      isbn: '978-0-385-18244-3',
      coverImageUrl: '05.jpg',
      stars: 4.6
    },
    {
      id: 6,
      title: 'El llamado de Cthulhu',
      description: 'Un relato de horror cósmico donde fuerzas sobrenaturales amenazan la cordura humana.',
      author: 'H. P. Lovecraft',
      publishedDate: '1928-02-01',
      isbn: '978-0-486-29438-0',
      coverImageUrl: '06.jpg',
      stars: 4.4
    },
    {
      id: 7,
      title: 'El Código Da Vinci',
      description: 'Un misterio que mezcla arte, historia y religión en una búsqueda frenética por descubrir secretos milenarios.',
      author: 'Dan Brown',
      publishedDate: '2003-03-18',
      isbn: '978-8408175728',
      coverImageUrl: '07.jpg',
      stars: 4.3
    },
    {
      id: 8,
      title: 'La Iliada y la Odisea',
      description: 'Las epopeyas clásicas que narran la Guerra de Troya y el viaje de Odiseo hacia su hogar.',
      author: 'Homero',
      publishedDate: '-800-01-01',
      isbn: '978-84-339-0648-9',
      coverImageUrl: '08.jpg',
      stars: 4.5
    },
    {
      id: 9,
      title: 'Superman Dawnbreaker',
      description: 'Las aventuras del superhéroe más poderoso en una batalla épica por salvar la humanidad.',
      author: 'Peter J. Tomasi',
      publishedDate: '2018-10-02',
      isbn: '978-1-4012-7891-9',
      coverImageUrl: '09.jpg',
      stars: 4.2
    },
    {
      id: 10,
      title: 'El silencio de los corderos',
      description: 'Un thriller psicológico sobre un agente del FBI que busca la ayuda de un asesino encarcelado.',
      author: 'Thomas Harris',
      publishedDate: '1988-06-01',
      isbn: '978-0-312-92722-6',
      coverImageUrl: '10.jpg',
      stars: 4.7
    },
    {
      id: 11,
      title: 'El fin de la Infancia',
      description: 'Una raza extraña llega a la Tierra y trae consigo paz, prosperidad y la inesperada tragedia de la perfección.',
      author: 'Arthur Clarke',
      publishedDate: '1985-08-24',
      isbn: '978-8-445-07700-9',
      coverImageUrl: '11.webp',
      stars: 4.0
    },
    {
      id: 12,
      title: 'El Hobbit',
      description: 'Bilbo se encuentra de pronto en medio de una conspiración que pretende apoderarse del tesoro de Smaug el magnífico, un enorme y muy peligroso Dragón.',
      author: 'J. R. R. Tolkien',
      publishedDate: '1937-09-21',
      isbn: '978-6-070-79721-7',
      coverImageUrl: '12.webp',
      stars: 5.0
    }
  ];

    // Método 1: Obtener los 12 mejores
    getTop12(): Observable<Book[]> {
      return of(this.books.slice(0, 12));
    }
  
    // Método 2: Obtener todos
    getAll(): Observable<Book[]> {
      return of(this.books);
    }
  
    // Método 3: Obtener por ID
    getById(id: number): Observable<Book> {
      const book = this.books.find(b => b.id === id);
      return of(book!);
    }
}
