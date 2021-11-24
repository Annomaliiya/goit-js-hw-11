'use strict';

//импорты
import './css/main.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import SimpleLightbox from "simplelightbox";
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
            console.log(hits)

            galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(hits, totalHits));
            const lightbox = new SimpleLightbox('.gallery a', {
                captionDelay: 250
            });
            showLoadMoreBtn();
        })
        .catch(err => {
            console.log(err);
        });
};
// кнопка загрузить больше


const onLoadMoreBtnClick = () => {
    const query = localStorage.getItem('query');

    fetchImages(query,)
        .then(({ data }) => {
            const { hits, totalHits } = data;
            galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(hits, totalHits));
            increasePageInLocalStorage();
        })
        .catch(err => {
            console.log(err);
        });
};


// вешаем слушателей событий

searchFormEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

// подключаем simplylightbox

// const lightbox = new SimpleLightbox('.gallery a', {
//     captionDelay: 250
// });


// let mar = imgCardTmp(hits);
// function imgCardTmp(hits) {
//     return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//         return `<div class="photo-card">
//         <a href="${largeImageURL}"
//                 <img src="${webformatURL}"
//                      lt="${tags}"
//                      data-src="${largeImageURL}"
//                      width="270"
//                      height="auto"
//                      loading="lazy" />
//                 <div class="info">
//                   <p class="info-item"><b>Likes:</b>${likes}</p>
//                   <p class="info-item"><b>Views:</b>${views}</p>
//                   <p class="info-item"><b>Comments:</b>${comments}</p>
//                   <p class="info-item"><b>Downloads:</b>${downloads}</p>
//                 </div>
//               </div>`
//     }).join("")
// }