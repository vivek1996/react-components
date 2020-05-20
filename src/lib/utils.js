export const isDefined = (value) => value !== undefined;

export const isEmpty = (value) => value === undefined || value === null || value === '';

export const isArray = (value) => Array.isArray(value);

export const isFunction = (obj) => typeof obj === 'function';

export const isObject = (obj) => obj !== null && typeof obj === 'object';

export const isMobile = () => {
  return true
};

export const isPromise = (obj) => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export const getUniqueArray = (itemArr, itemKey) => {
  const uniqueFields =  itemArr.map(item => (isDefined(item[itemKey]) && item[itemKey]) || item)
  // store the indexes of the unique objects
  .map((e, i, final) => final.indexOf(e) === i && i)

  // eliminate the false indexes & return unique objects
  .filter((e) => itemArr[e]).map(e => itemArr[e]);

  return uniqueFields;
}