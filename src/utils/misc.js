import moment from "moment";

/**
 * Returns the option which matches the provided value or null.
 *
 * @param {{ value: string, label: string }[]} options options object
 * @param {string} value value to search for
 * @returns {?{ value: string, label: string }}
 */
export function getOptionByValue(options, value) {
  for (let i = 0, len = options.length; i < len; i++) {
    let option = options[i];
    if (option.value === value) {
      return option;
    }
  }
  return null;
}

/**
 * Returns the start and end dates of the week for the provided date.
 *
 * @param {Object} date momentjs object denoting the date
 * @returns {Array} array with two objects: [weekStart, weekEnd]
 */
export function getWeekByDate(date) {
  let d = moment(date);
  return [d.startOf("week"), d.clone().endOf("week")];
}

/**
 * Replaces string elements from the specified array using provided map object.
 *
 * @param {string[]} array array of strings
 * @param {Object} map a mapping from string keys to string values
 * @returns {string[]} array containing new string values from map
 */
export function replaceItems(array, map) {
  let result = [];
  for (let str of array) {
    if (str in map) {
      result.push(map[str]);
    }
  }
  return result;
}

/**
 * This function takes keys referring to truthy values in `newOptions`
 * and adds them to `oldOptions` returning a new object.
 *
 * @param {Object} oldOptions object containing key-value pairs with keys
 * mapped to boolean values
 * @param {Object} newOptions object containing key-value pairs with keys
 * mapped to truthy or falsy values
 * @returns {Object} a new updated options object
 */
export function updateOptionMap(oldOptions, newOptions) {
  oldOptions = { ...oldOptions };
  for (let key in newOptions) {
    if (Object.prototype.hasOwnProperty.call(newOptions, key)) {
      let value = newOptions[key];
      if (value) {
        oldOptions[key] = true;
      } else {
        delete oldOptions[key];
      }
    }
  }
  return oldOptions;
}

/**
 * Constructs query string to be sent to API. The provided object must contain
 * valid API query parameter names as keys. Keys that refer to values
 * that are not numbers and are falsy are ignored.
 *
 * @param {Object} params query parameters object
 * @param {string[]} paramNames array of valid query parameter names
 * @returns {string} query string
 */
export const buildRequestQuery = (params, paramNames) => {
  const queryParams = [];
  for (const paramName of paramNames) {
    const paramValue = params[paramName];
    if (
      !(paramName in params) ||
      (!paramValue && typeof paramValue !== "number")
    ) {
      continue;
    }
    if (Array.isArray(paramValue)) {
      if (paramValue.length) {
        queryParams.push(
          paramValue.map((value) => `${paramName}[]=${value}`).join("&")
        );
      }
    } else {
      queryParams.push(`${paramName}=${paramValue}`);
    }
  }
  return queryParams.join("&");
};

export const extractResponsePagination = ({ headers }) => ({
  totalCount: +headers["x-total"] || 0,
  pageCount: +headers["x-total-pages"] || 0,
  pageNumber: +headers["x-page"] || 1,
  pageSize: +headers["x-per-page"] || 10,
});

export const extractResponseData = (response) => response.data;
