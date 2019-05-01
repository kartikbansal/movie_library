const titleCase = str => {
  return str[0].toUpperCase().concat(str.slice(1).toLowerCase());
};

export const convertToSortOptionLabel = option => {
  const label = option.toLowerCase().split("_");
  return `${titleCase(label[0])} (${titleCase(label[1])})`;
};

export const debounce = (fn ,delay) => {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      timer = undefined;
    }, delay); 
  }
}
