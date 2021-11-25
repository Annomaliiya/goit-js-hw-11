'use strict';

//импорты
import './css/main.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/pixabay-api';
import galleryCardsTemplate from './templates/gallery-card.hbs';
///////////////////////////////

// вытаскиваем елементы из html
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const btnSearch = document.querySelector('.btn-submit');
const loadMoreBtn = document.querySelector('.load-more');
///////////////////////////////

// вспомагательные функции для поиска
const clearGallery = () => {
    galleryEl.innerHTML = '';
};

const showLoadMoreBtn = () => {
    loadMoreBtn.classList.remove('is-hidden');
};
const increasePageInLocalStorage = () => {
    const pageIterattor = Number(localStorage.getItem('page')) + 1;
    localStorage.setItem('page', JSON.stringify(pageIterattor));
    if (totalHits > page * per_page) {
        Notify.info("We're sorry, but you've reached the end of search results.")
    }
    // galleryCardsTemplate();
    //подключаем simpleLightBox

    const gallery = new SimpleLightbox('.gallery a', {
        scaleImageRatio: true,
        captionDelay: 250
    });
};
// 

// ПОИСК ИЗОБРАЖЕНИЙ ЧЕРЕЗ ФОРМУ
const onFormSubmit = event => {
    event.preventDefault();

    localStorage.setItem('page', '0');

    const query = document.querySelector('.input-box').value.trim();
    localStorage.setItem('query', query);
    clearGallery();

    fetchImages(query)
        .then(({ data }) => {
            console.log(data);
            const { hits, totalHits } = data;
            const imagesArr = data.hits;

            if (imagesArr.length === 0) {
                clearGallery();
                return Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.')
            } else {
                Notify.success(`'Hooray! We found ${totalHits} images.`);
                galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(hits));
                showLoadMoreBtn();
                //подключаем simpleLightBox
                const gallery = new SimpleLightbox('.gallery a', {
                    scaleImageRatio: true,
                    captionDelay: 250
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
};
// кнопка загрузить больше


const onLoadMoreBtnClick = () => {

    const query = localStorage.getItem('query');

    fetchImages(query)
        .then(({ data }) => {
            const { hits, totalHits } = data;
            // console.log(data.totalHits)
            galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(hits, totalHits));
            increasePageInLocalStorage();
            const totalPages = Math.ceil(data.totalHits / 40);
            console.log(totalPages)
            if (page >= totalPages) {
                loadMoreBtn.classList.add('is-hidden');
                Notify.failure("We're sorry, but you've reached the end of search results.");
            }

        })
        .catch(err => {
            console.log(err);
        });
}
// вешаем слушателей событий

searchFormEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

//подключаем simplylightbox

// const lightbox = new SimpleLightbox('.gallery a', {
//     captionDelay: 250
// });