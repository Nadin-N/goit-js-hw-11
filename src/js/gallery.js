import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { PixabayAPI } from './pixabay-api';
import { renderMarkup } from './renderMarkUp';

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
      // if (!refs.loadBtnEl.classList.contains('is-hidden')) {
      //   refs.loadBtnEl.classList.add('is-hidden');
      // }
    }
  }, 800)
);

const photoAPI = new PixabayAPI();
// console.log(photoAPI);

refs.searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(e) {
  e.preventDefault();

  addHiddenClass();
  //   if (!refs.loadBtnEl.classList.contains('is-hidden')) {
  //     refs.loadBtnEl.classList.add('is-hidden');
  //   }

  refs.searchBtnEl.disabled = true;
  refs.searchBtnEl.classList.add('disabled');

  photoAPI.query = e.target.elements.searchQuery.value.trim();
  photoAPI.page = 1;

  try {
    const {
      data: { hits: photosArr, totalHits },
    } = await photoAPI.getPhotosByQuery();

    //  console.log(total);
    //  console.log(totalHits);

    if (photosArr.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      e.target.reset();
      refs.galleryItem.innerHTML = '';
      refs.searchBtnEl.disabled = false;
      refs.searchBtnEl.classList.remove('disabled');
      addHiddenClass();
      // if (!refs.loadBtnEl.classList.contains('is-hidden')) {
      //   refs.loadBtnEl.classList.add('is-hidden');
      // }

      return;
    }

    //  console.log(totalHits);
    //  console.log(photoAPI.per_page);

    if (totalHits > photoAPI.per_page) {
      refs.loadBtnEl.classList.remove('is-hidden');
    }
    refs.galleryItem.innerHTML = renderMarkup(photosArr);

    gallery = new SimpleLightbox('.gallery a');

    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

    refs.searchBtnEl.disabled = false;
    refs.searchBtnEl.classList.remove('disabled');

    //  console.log(total, photoAPI.per_page);
  } catch {
    err => console.log(err);
  }

  //   const lightbox = new SimpleLightbox('.gallery a', {
  //     captionsData: 'alt',
  //     captionPosition: 'bottom',
  //     captionDelay: 250,
  //   });

  //   photoAPI.getPhotosByQuery().then(photos => {
  //     const photosArr = photos.data.hits;

  //   refs.galleryItem.insertAdjacentHTML('beforeend', renderMarkup(photosArr));
  //   });

  //   e.target.reset();
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
