

SELECT * FROM wm_news;
SELECT * FROM wm_news_gallery;

INSERT INTO wm_news (title, subtitle, body, date) VALUES
('Título Noticia 1', 'Lorem ipsum dolor sit amet, consectetur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2026-01-01'),
('Título Noticia 2', 'Lorem ipsum dolor sit amet, consectetur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2026-02-02'),
('Título Noticia 3', 'Lorem ipsum dolor sit amet, consectetur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2026-03-03'),
('Título Noticia 4', 'Lorem ipsum dolor sit amet, consectetur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2026-04-04'),
('Título Noticia 5', 'Lorem ipsum dolor sit amet, consectetur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2026-05-05'),
('Título Noticia 6', 'Lorem ipsum dolor sit amet, consectetur', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2026-06-06');

INSERT INTO wm_news_gallery (news_id, alt, url) VALUES
(1, 'news-01', 'images/test/news-01.jpg'),
(1, 'news-02', 'images/test/news-02.jpg'),
(1, 'news-03', 'images/test/news-03.jpg'),
(2, 'news-02', 'images/test/news-02.jpg'),
(2, 'news-03', 'images/test/news-03.jpg'),
(2, 'news-01', 'images/test/news-01.jpg'),
(3, 'news-03', 'images/test/news-03.jpg'),
(3, 'news-01', 'images/test/news-01.jpg'),
(3, 'news-02', 'images/test/news-02.jpg'),
(4, 'news-01', 'images/test/news-03.jpg'),
(4, 'news-03', 'images/test/news-03.jpg'),
(4, 'news-02', 'images/test/news-02.jpg'),
(5, 'news-02', 'images/test/news-02.jpg'),
(5, 'news-01', 'images/test/news-01.jpg'),
(5, 'news-03', 'images/test/news-03.jpg'),
(6, 'news-03', 'images/test/news-03.jpg'),
(6, 'news-02', 'images/test/news-02.jpg'),
(6, 'news-01', 'images/test/news-01.jpg');
