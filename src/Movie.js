import DEFAULT_IMG from './assets/images/placeholder.jpg';

export class Movie {
  constructor(movie) {
    this.id = movie.id;
    this.title = movie.title || "Untitled";
    this.year = movie.year || "";
    this.poster = movie.poster || DEFAULT_IMG;
    this.isSelected = movie.isSelected || false;
  }
}