export const isDefined = (value) => value !== undefined;

export const isEmpty = (value) =>
  (isArray(value) && value.length === 0) ||
  value === undefined ||
  value === null ||
  value === "";

export const isArray = (value) => Array.isArray(value);

export const isFunction = (obj) => typeof obj === "function";

export const isObject = (obj) => obj !== null && typeof obj === "object";

export const isMobile = () => {
  return true;
};

export const isPromise = (obj) => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};

export const getUniqueArray = (itemArr, itemKey) => {
  const uniqueFields = itemArr
    .map((item) => (isDefined(item[itemKey]) && item[itemKey]) || item)
    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the false indexes & return unique objects
    .filter((e) => itemArr[e])
    .map((e) => itemArr[e]);

  return uniqueFields;
};

export const times = (count, func) => {
  var i = 0,
    results = [];
  while (i < count) {
    results.push(func(i));
    i += 1;
  }
  return results;
};

/**
 * Converts a string path to a value that is existing in a json object.
 *
 * @param {Object} json Json data to use for searching the value.
 * @param {Object} path the path to use to find the value.
 * @returns {valueOfThePath|undefined}
 */
export const getValueFromJson = (json, path) => {
  if (!(json instanceof Object) || typeof path === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      console.error("Not valid argument:json:" + json + ", path:" + path);
    }
    return;
  }
  path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  path = path.replace(/^\./, ""); // strip a leading dot
  var pathArray = path.split(".");
  for (var i = 0, n = pathArray.length; i < n; ++i) {
    var key = pathArray[i];
    if (key in json) {
      if (json[key] !== undefined) {
        json = json[key];
      } else {
        return;
      }
    } else {
      return;
    }
  }
  return json;
};
