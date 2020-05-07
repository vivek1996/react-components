export const isDefined = (value) => value !== undefined;

export const isFunction = (obj) => typeof obj === 'function';

export const isObject = (obj) => obj !== null && typeof obj === 'object';

export const isMobile = () => {
  return true
};

export const isPromise = (obj) => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
