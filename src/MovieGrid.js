import { ALL, SELECTED, SORT_OPTIONS } from "./constants";
import { Movie } from "./Movie";

export class MovieGrid {
  constructor(movies, ele) {
    this.allMovies = movies.map(movie => new Movie(movie));
    this.DOMEle = ele;
    this.visibilityFilter = ALL;
    this.searchString = "";
    this.sortBy = SORT_OPTIONS.TITLE_ASC;
  }

  toggleMovieSelection(id) {
    if (!id) {
      return;
    }

    let isNowSelected;
    this.allMovies = this.allMovies.map(movie => {
      if (movie.id === id) {
        isNowSelected = !movie.isSelected;
        return new Movie({ ...movie, isSelected: !movie.isSelected });
      } else {
        return movie;
      }
    });

    return isNowSelected;
  }

  getVisibleMovies() {
    const movies = this.visibilityFilter === SELECTED
        ? this.getSelectedMovies()
        : this.allMovies;

    return movies
      .sort((movie1, movie2) => {
        if (this.sortBy === SORT_OPTIONS.TITLE_ASC) {
          return movie1.title < movie2.title ? -1 : 1;
        } else if (this.sortBy === SORT_OPTIONS.TITLE_DESC) {
          return movie1.title < movie2.title ? 1 : -1;
        } else if (this.sortBy === SORT_OPTIONS.YEAR_ASC) {
          return movie1.year < movie2.year ? -1 : 1;
        } else if (this.sortBy === SORT_OPTIONS.YEAR_DESC) {
          return movie1.year < movie2.year ? 1 : -1;
        }
      })
      .filter(
        movie =>
          movie.title.toLowerCase().indexOf(this.searchString.toLowerCase()) >
          -1
      );
  }

  getSelectedMovies() {
    return this.allMovies.filter(movie => movie.isSelected);
  }

  loadMoviePosters() {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    lazyImages.forEach(img => {
      const newImg = new Image();
      newImg.src = img.dataset.src;
      newImg.onload = () => {
        img.src = img.dataset.src;
        img.classList.remove("lazy");
      }
    });
  }
}
