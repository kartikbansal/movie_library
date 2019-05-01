import data from "../assets/data/data.json";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMovies = () => {
  return delay(300).then(() => {
    return [...data.movies];
  });
};
