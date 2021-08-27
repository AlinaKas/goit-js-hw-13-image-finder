
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '23098575-38c072e060e8821b5779b85db';

export default class NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    fetchImages() {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;
        return fetch(url)
            .then(response => response.json())
            .then(({hits}) => {
                this.incrementPage();
                return hits;
            });
    }

    incrementPage() {
      this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
