import { Component } from '@angular/core';
import { News } from '@shared/models/news';

@Component({
  selector: 'app-news-component',
  imports: [],
  templateUrl: './news-component.html',
})
export class NewsComponent {
  news: News[] = [
    {
      id: 1,
      title: 'Título Noticia 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/01.jpg',
      date: '2026-01-01'
    },
    {
      id: 2,
      title: 'Título Noticia 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/04.jpg',
      date: '2026-02-01'
    },
    {
      id: 3,
      title: 'Título Noticia 3',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/test/03.jpg',
      date: '2026-03-01'
    }
  ];
}
