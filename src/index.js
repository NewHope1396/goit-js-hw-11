import './sass/main.scss';
const axios = require('axios');
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let currentSearchValue = '';
const gallery = document.querySelector('.gallery');
let maxPages = 1;


axios.defaults.baseURL = 'https://pixabay.com/api/?key=25354939-b34ef3161dfabf3cda0874337&q=cats';


form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', loadMore); 


async function onFormSubmit(e) {
    e.preventDefault();

    try {

        loadMoreBtn.classList.add('is-hidden')

        if (currentSearchValue === e.target.elements.searchQuery.value) {
            return
        }

        page = 1;
        maxPages = 1;
        currentSearchValue = e.target.elements.searchQuery.value;
        const response = await fetchImages(currentSearchValue, page)
        
        maxPages = Math.ceil(response.data.totalHits / 40);
        console.log(maxPages);

        if (response.data.hits.length === 0) {
            Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.')
            gallery.innerHTML = '';
            return
        }

        gallery.innerHTML = '';
        renderImages(response.data.hits);

        loadMoreBtn.classList.remove('is-hidden')
        
    } catch (error) {
        console.log(error);
    }

}



function renderImages (images) {
    const markup = images.map(image => {
        return `<div class="photo-card">
                    <img class='image' src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${image.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${image.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${image.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${image.downloads}
                        </p>
                    </div>
                </div>`
    }).join('');

    gallery.insertAdjacentHTML('beforeend', markup);
}

async function loadMore() {

    try {

        if (page === maxPages) {
        return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        }

        page += 1;
        const response = await fetchImages(currentSearchValue, page);
        renderImages(response.data.hits) 

    } catch (error) {
        console.log(error)
    }


}

async function fetchImages(value, page) {
    return await axios(`&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
}