import './sass/main.scss';
import cardTpl from './templates/card.hbs';
import NewsApiService from './js/apiService';
import getRefs from './js/getRefs'
import LoadMoreBtn from './js/load-more-btn.js';

import { error } from '../node_modules/@pnotify/core/dist/PNotify';
// import * as basicLightbox from 'basiclightbox';
import '../node_modules/basicLightbox/dist/basicLightbox.min.css';


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
        return onFetchError();
    }

    loadMoreBtn.show();
    newsApiService.resetPage();
    clearGalleryContainer();
    fetchImages();
}
//     e.target.query.value = '';
//      if (!searchQuery) {
//         return;
//   }

function fetchImages() {
    loadMoreBtn.disable();
    newsApiService.fetchImages().then(hits => {
            renderCardsMarkup(hits);
            loadMoreBtn.enable();
        })
        .catch(onFetchError);
};

function onLoadMore() {
fetchImages()
};

function renderCardsMarkup(hits) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', cardTpl(hits));

    // if (searchQuery.status === 404) {
    //     refs.galleryContainer.innerHTML = '';
    // onFetchError();
    // return;
    // }
};

function clearGalleryContainer() {
refs.galleryContainer.innerHTML = '';
};



function onFetchError() {
    error({
        title: 'INCORRECT REQUEST',
        text: 'Please enter a more specific query!',
        delay: 2000,
  })
};
