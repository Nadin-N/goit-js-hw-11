import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { PixabayAPI } from './pixabay-api';
import { renderMarkup } from './renderMarkup';

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  searchInputEl: document.querySelector('[name="searchQuery"]'),
  searchBtnEl: document.querySelector('[type="submit"]'),
  galleryItem: document.querySelector('.gallery'),
  loadBtnEl: document.querySelector('.load-more'),
};

let gallery;

refs.searchInputEl.addEventListener(
  'input',
  debounce(e => {
    if (refs.searchInputEl.value === '') {
      refs.galleryItem.innerHTML = '';
      addHiddenClass();
    }
  }, 800)
);

const photoAPI = new PixabayAPI();

refs.searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(e) {
  e.preventDefault();

  addHiddenClass();

  refs.searchBtnEl.disabled = true;
  refs.searchBtnEl.classList.add('disabled');

  photoAPI.query = e.target.elements.searchQuery.value.trim();
  photoAPI.page = 1;

  try {
    const {
      data: { hits: photosArr, totalHits },
    } = await photoAPI.getPhotosByQuery();

    if (photosArr.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      e.target.reset();
      refs.galleryItem.innerHTML = '';
      refs.searchBtnEl.disabled = false;
      refs.searchBtnEl.classList.remove('disabled');
      addHiddenClass();

      return;
    }

    if (totalHits > photoAPI.per_page) {
      refs.loadBtnEl.classList.remove('is-hidden');
    }
    refs.galleryItem.innerHTML = renderMarkup(photosArr);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1,
      behavior: 'smooth',
    });

    gallery = new SimpleLightbox('.gallery a');

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

    refs.searchBtnEl.disabled = false;
    refs.searchBtnEl.classList.remove('disabled');
  } catch {
    err => console.log(err);
  }
}
refs.loadBtnEl.addEventListener('click', onLoadBtn);

async function onLoadBtn(e) {
  e.target.disabled = true;
  e.target.classList.add('disabled');

  photoAPI.page += 1;

  try {
    const {
      data: { hits: photosArr, totalHits },
    } = await photoAPI.getPhotosByQuery();

    refs.galleryItem.insertAdjacentHTML('beforeend', renderMarkup(photosArr));

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 10,
      behavior: 'smooth',
    });

    gallery.refresh('.gallery a');

    if (Math.ceil(totalHits / photoAPI.per_page) === photoAPI.page) {
      refs.loadBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (err) {
    console.log(err);
  }

  e.target.disabled = false;
  e.target.classList.remove('disabled');
}

function addHiddenClass() {
  if (!refs.loadBtnEl.classList.contains('is-hidden')) {
    refs.loadBtnEl.classList.add('is-hidden');
  }
}
