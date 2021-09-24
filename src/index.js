import './sass/main.scss';
import cardTpl from './templates/card.hbs';
import NewsApiService from './js/apiService';
import getRefs from './js/getRefs'
import LoadMoreBtn from './js/load-more-btn.js';
// Оповещение
import { error } from '../node_modules/@pnotify/core/dist/PNotify';
// Модалка
import * as basicLightbox from 'basiclightbox';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
//Иконки
// import '../node_modules/material-design-icons/iconfont/material-icons.css';
// Ccылки на ключевые элементы разметки
const refs = getRefs();

// Кнопка загрузки
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

// Класс с данными с API
const newsApiService = new NewsApiService();

// Слушатели событий
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
refs.galleryContainer.addEventListener('click', openModal);
refs.topBtn.addEventListener('click', goToTop);
window.addEventListener('scroll', scrollTop);

// Поиск по запросу пользователя из инпута формы
function onSearch(e) {
    e.preventDefault();

    newsApiService.query = e.currentTarget.elements.query.value.trim();

    if (newsApiService.query === '') {
        clearGalleryContainer();
        onFetchError();
        return;
    }

    loadMoreBtn.show();
    newsApiService.resetPage();
    clearGalleryContainer();
    onLoadMore();
}

// Отрисовка разметки с API
function onLoadMore() {
    loadMoreBtn.disable();
    newsApiService.fetchImages().then(imgs => {
        if (imgs.length === 0) {
            clearInput();
            onFetchError();
            return;
        };
        renderCardsMarkup(imgs);
        scrollToNewMarkup();
        loadMoreBtn.enable();
    });
};

// Рендер разметки
function renderCardsMarkup(imgs) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', cardTpl(imgs));
};

// Очистка разметки
function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
};

// Очистка инпута
function clearInput() {
    refs.searchForm.query.value = '';
};

// Оповещение про ошибку
function onFetchError() {
    error({
        title: 'IMAGES NOT FOUND.',
        text: 'Please enter a more specific query!',
        delay: 2000,
    })
    loadMoreBtn.hide();
};

// Скролл при загрузке новых картинок
function scrollToNewMarkup() {
        loadMoreBtn.refs.button.scrollIntoView({
            block: 'end',
            behavior: 'smooth',
        });
};

// Скролл вверх
function goToTop() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function scrollTop() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    refs.topBtn.style.display = 'block';
  } else {
    refs.topBtn.style.display = 'none';
  }
}

// Модалка с картинкой
function openModal(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'IMG') {
    return;
    };
      basicLightbox.create(`<img src="${e.target.dataset.src}">`).show();
};

