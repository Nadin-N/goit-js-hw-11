function renderMarkup(photosArr) {
  const markup = photosArr.map(photo => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = photo;
    return `<a class="gallery-item" href ="${largeImageURL}">
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b class="info-type">Likes</b>
		<span class="info-quantity">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-type">Views</b>
		<span class="info-quantity">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-type">Comments</b>
		<span class="info-quantity">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-type">Downloads</b>
		<span class="info-quantity">${downloads}</span>
    </p>
  </div>
</div>
</a>`;
  });
  return markup.join('');
}

export { renderMarkup };
