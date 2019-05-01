import { SELECTED, ALL, SORT_OPTIONS } from "./constants";
import { fetchMovies } from "./api";
import { MovieGrid } from "./MovieGrid";
import { convertToSortOptionLabel, debounce } from "./utils/helpers";

import "./assets/scss/styles.scss";
import DEFAULT_IMG from './assets/images/placeholder.jpg';

let filtersContainerDOMEle;
let filtersLoaderDOMEle;
let libraryBtnDOMEle;
let catalogBtnDOMEle;
let sortSelectDOMEle;
let searchBoxDOMEle;
let movieGridContainerDOMEle;
let movieGridLoaderDOMEle;
let movieGrid;

window.onload = () => {
  filtersLoaderDOMEle = document.querySelector(".filters-loader");
  filtersContainerDOMEle = document.querySelector(".filters-container");
  movieGridLoaderDOMEle = document.querySelector(".movie-grid-loader");
  movieGridContainerDOMEle = document.querySelector(".movie-grid-container");

  fetchMovies().then(movies => {
    movieGrid = new MovieGrid(movies);
    renderGrid();
    // lazy load movie posters
    movieGrid.loadMoviePosters();
    // show/hide dom elements on successful loading of movies
    showEle(filtersLoaderDOMEle, false);
    showEle(movieGridLoaderDOMEle, false);
    showEle(filtersContainerDOMEle, true);
    showEle(movieGridContainerDOMEle, true);
    
    libraryBtnDOMEle = document.querySelector(".library-btn");
    catalogBtnDOMEle = document.querySelector(".catalog-btn");
    sortSelectDOMEle = document.querySelector(".sort-filter");
    searchBoxDOMEle = document.querySelector(".search-box");
    registerEventsForFilterActions();
    checkAndDisableLibraryBtn() && movieGrid.visibilityFilter === SELECTED
      ? catalogBtnDOMEle.click()
      : undefined;
  })
  .catch(error => {
    console.error(error);
  });
};

/**
 * To render movie grid
 */
const renderGrid = () => {
  let htmlStr = "";
  const movies = movieGrid.getVisibleMovies();
  if (movies.length) {
    movies.forEach(({ id, title, year, poster, isSelected }) => {
      htmlStr += `
        <div class="movie">
          <div class="movie-media">
            <img src=${DEFAULT_IMG} class="lazy movie-media-img" alt="${title} Image" data-src="${poster}" />
            <div class="movie-overlay">
              <button class="movie-button btn" data-id="${id}">
                ${!isSelected ? "ADD" : "REMOVE"}
              </button>
            </div>
          </div>
          <div class="movie-info">
            <p class="movie-title" title="${title}">${title}</p>
            <p class="movie-year">${year}</p>
          </div>
        </div>
      `;
    });
  } else {
    htmlStr = `
      <p class="info-msg">No Movies Found</p>
    `
  }
  movieGridContainerDOMEle.innerHTML = htmlStr;
  registerMovieBtnClickEvent();
};

/**
 * Registers click event handler for add or remove button on movie 
 */
const registerMovieBtnClickEvent = () => {
  const movieEles = [].slice.call(document.querySelectorAll(".movie"));
  movieEles.forEach(movie => {
    movie.addEventListener("click", evt => {
      if (evt.target.classList.contains("movie-button")) {
        const id = evt.target.getAttribute("data-id");
        const isNowSelected = movieGrid.toggleMovieSelection(id);
        if (movieGrid.visibilityFilter === ALL) {
          // changes innerText of button if all items are being viewed
          evt.target.innerText = !isNowSelected ? "ADD" : "REMOVE";
        } else if (movieGrid.visibilityFilter === SELECTED) {
          // remove the clicked item if selected items are viewed
          movieGridContainerDOMEle.removeChild(movie);
        }
        checkAndDisableLibraryBtn() && movieGrid.visibilityFilter === SELECTED
          ? catalogBtnDOMEle.click()
          : undefined;
      }
    });
  });
};

/**
 * Register event handler for all filter actions
 */
const registerEventsForFilterActions = () => {
  // Search and select movie button
  catalogBtnDOMEle.addEventListener("click", () => {
    if (movieGrid.visibilityFilter !== ALL) {
      movieGrid.visibilityFilter = ALL;
      renderGrid();
      movieGrid.loadMoviePosters();
    }
  });

  // movie library button
  libraryBtnDOMEle.addEventListener("click", () => {
    if (movieGrid.visibilityFilter !== SELECTED) {
      movieGrid.visibilityFilter = SELECTED;
      renderGrid();
      movieGrid.loadMoviePosters();
    }
  });

  // sort
  renderSortOptions();
  sortSelectDOMEle.addEventListener("change", evt => {
    movieGrid.sortBy = evt.target.value;
    renderGrid();
    movieGrid.loadMoviePosters();
  });

  // serach filter
  searchBoxDOMEle.addEventListener(
    "keyup",
    debounce(evt => {
      movieGrid.searchString = evt.target.value;
      renderGrid();
      movieGrid.loadMoviePosters();
    }, 300)
  );
};

const renderSortOptions = () => {
  let htmlStr = "";
  Object.keys(SORT_OPTIONS).forEach(key => {
    htmlStr += `
      <option value=${SORT_OPTIONS[key]}>
        ${convertToSortOptionLabel(SORT_OPTIONS[key])}
      </option>
    `;
  });
  sortSelectDOMEle.innerHTML = htmlStr;
};

/**
 * Disable movie library button if no movie is selected
 */
const checkAndDisableLibraryBtn = () => {
  libraryBtnDOMEle.disabled = !movieGrid.getSelectedMovies().length
    ? true
    : false;
  return libraryBtnDOMEle.disabled;
};

const showEle = (ele, isVisible) => {
  ele.style.display = isVisible ? "block" : "none";
};

const loadDefaultImg = () => {
  const img = new Image();
  img.src = DEFAULT_IMG;
};

loadDefaultImg();
