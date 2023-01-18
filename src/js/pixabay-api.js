import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32900750-5d55daf97b577b91954971888';

  constructor() {
    this.page = 1;
    this.query = null;
    this.per_page = 40;
  }

  async getPhotosByQuery() {
    const searchParams = {
      params: {
        key: PixabayAPI.API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      },
    };

    const response = await axios.get(`${PixabayAPI.BASE_URL}`, searchParams);

    return response;
  }
}
