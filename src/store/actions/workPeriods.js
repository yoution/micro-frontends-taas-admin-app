import * as ACTION_TYPE from "store/actionTypes/workPeriods";

// Used to generate unique error ids.
let nextErrorId = 1;

/**
 * Creates an action denoting the start of loading specific challenge page.
 *
 * @param {Object} cancelSource object that can be used to cancel network request
 * @param {number} pageNumber the requested challenge page number
 * @returns {Object}
 */
export const loadWorkPeriodsPagePending = (cancelSource, pageNumber) => ({
  type: ACTION_TYPE.WP_LOAD_PAGE_PENDING,
  payload: { cancelSource, pageNumber },
});

/**
 * Creates an action denoting the saving of fetched challenge page.
 *
 * @param {Array} periods array of challenge objects
 * @param {number} totalCount total number of periods for current filters' state
 * @param {number} pageCount total number of pages
 * @returns {Object}
 */
export const loadWorkPeriodsPageSuccess = (periods, totalCount, pageCount) => ({
  type: ACTION_TYPE.WP_LOAD_PAGE_SUCCESS,
  payload: { periods, totalCount, pageCount },
});

/**
 * Creates an action denoting the occurrence of an error while loading challenges.
 *
 * @param {string} message error message
 * @returns {Object}
 */
export const loadWorkPeriodsPageError = (message) => ({
  type: ACTION_TYPE.WP_LOAD_PAGE_ERROR,
  payload: { id: nextErrorId++, message },
});

/**
 * Creates an action to reset working periods' filters.
 *
 * @returns {Object}
 */
export const resetWorkPeriodsFilters = () => ({
  type: ACTION_TYPE.WP_RESET_FILTERS,
});

/**
 * Creates an action denoting the changing of working periods' page number.
 *
 * @param {number} pageNumber number of pages
 * @returns {Object}
 */
export const setWorkPeriodsPageNumber = (pageNumber) => ({
  type: ACTION_TYPE.WP_SET_PAGE_NUMBER,
  payload: pageNumber,
});

/**
 * Creates an action denoting the changing of working periods' page size.
 *
 * @param {number} pageSize number of pages
 * @returns {Object}
 */
export const setWorkPeriodsPageSize = (pageSize) => ({
  type: ACTION_TYPE.WP_SET_PAGE_SIZE,
  payload: pageSize,
});

/**
 * Creates an action denoting the changing of working periods' start
 * and end date using the provided date.
 *
 * @param {Object} date selected date
 * @returns {Object}
 */
export const setWorkPeriodsDateRange = (date) => ({
  type: ACTION_TYPE.WP_SET_DATE_RANGE,
  payload: date,
});

/**
 * Creates an action denoting the changing of working periods' sort criteria.
 *
 * @param {string} sortBy working periods' sort criteria
 * @returns {Object}
 */
export const setWorkPeriodsSortBy = (sortBy) => ({
  type: ACTION_TYPE.WP_SET_SORT_BY,
  payload: sortBy,
});

/**
 * Creates an action denoting the changing of working periods' sort order.
 *
 * @param {string} sortOrder working periods' sort criteria
 * @returns {Object}
 */
export const setWorkPeriodsSortOrder = (sortOrder) => ({
  type: ACTION_TYPE.WP_SET_SORT_ORDER,
  payload: sortOrder,
});

/**
 * Creates an action to set working periods' sorting.
 *
 * @param {Object} payload sorting data
 * @param {string} payload.sortBy sorting criteria
 * @param {string} payload.sortOrder sorting order
 * @returns {Object}
 */
export const setWorkPeriodsSorting = (payload) => ({
  type: ACTION_TYPE.WP_SET_SORTING,
  payload,
});

/**
 * Creates an action denoting the changing of working periods' payment
 * statuses.
 *
 * @param {Object} paymentStatuses object with working periods' payment statuses
 * @returns {Object}
 */
export const setWorkPeriodsPaymentStatuses = (paymentStatuses) => ({
  type: ACTION_TYPE.WP_SET_PAYMENT_STATUSES,
  payload: paymentStatuses,
});

/**
 * Creates an action denoting the changing of working periods' topcoder handle.
 *
 * @param {string} handle user's Topcoder handle
 * @returns {Object}
 */
export const setWorkPeriodsUserHandle = (handle) => ({
  type: ACTION_TYPE.WP_SET_USER_HANDLE,
  payload: handle,
});

/**
 * Creates an action to change working days for specific working period.
 *
 * @param {Object} payload object containing period id and days number
 * @param {string|number} payload.periodId period id
 * @param {number} payload.workingDays number of working days
 * @returns {Object}
 */
export const setWorkPeriodWorkingDays = (payload) => ({
  type: ACTION_TYPE.WP_SET_WORKING_DAYS,
  payload,
});

/**
 * Creates an action to toggle certain working period by its id.
 *
 * @param {string} id period id
 * @returns {Object}
 */
export const toggleWorkPeriod = (id) => ({
  type: ACTION_TYPE.WP_TOGGLE_PERIOD,
  payload: id,
});

/**
 * Creates an action to toggle all working periods.
 *
 * @returns {Object}
 */
export const toggleWorkingPeriodsAll = () => ({
  type: ACTION_TYPE.WP_TOGGLE_PERIODS_ALL,
});

/**
 * Creates an action to toggle all visible working periods.
 *
 * @returns {Object}
 */
export const toggleWorkingPeriodsVisible = () => ({
  type: ACTION_TYPE.WP_TOGGLE_PERIODS_VISIBLE,
});
