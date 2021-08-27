import './sass/main.scss';
import cardTpl from './templates/card.hbs';
import NewsApiService from './js/apiService';
import getRefs from './js/getRefs'
import LoadMoreBtn from './js/load-more-btn.js';

import { error } from '../node_modules/@pnotify/core/dist/PNotify';
// import * as basicLightbox from 'basiclightbox';
// import '../node_modules/basicLightbox/dist/basicLightbox.min.css';

const refs = getRefs();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();

    newsApiService.query = e.currentTarget.elements.query.value;

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

function renderCardsMarkup(imgs) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', cardTpl(imgs));
};

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
};

function clearInput() {
    refs.searchForm.query.value = '';
};

function onFetchError() {
    error({
        title: 'INCORRECT REQUEST',
        text: 'Please enter a more specific query!',
        delay: 2000,
    })
    loadMoreBtn.hide();
};

function scrollToNewMarkup() {
        loadMoreBtn.refs.button.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
        });
};
