/**
 * Returns working periods' state slice.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsStateSlice = (state) => state.workPeriods;

/**
 * Returns currently loaded working periods.
 *
 * @param {Object} state redux root state
 * @returns {Array}
 */
export const getWorkPeriods = (state) => state.workPeriods.periods;

/**
 * Returns an object with working periods' ids as keys and booleans showing
 * whether the period is selected as values.
 *
 * @param {Object} state redux root state
 * @returns {Object.<string, boolean>}
 */
export const getWorkPeriodsSelected = (state) =>
  state.workPeriods.periodsSelected;

/**
 * Returns working periods filters' state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsFilters = (state) => state.workPeriods.filters;

export const getWorkPeriodsDateRange = (state) =>
  state.workPeriods.filters.dateRange;

export const getWorkPeriodsError = (state) => state.workPeriods.error;

export const getWorkPeriodsSorting = (state) => state.workPeriods.sorting;

export const getWorkPeriodsPagination = (state) => state.workPeriods.pagination;

export const getWorkPeriodsCount = (state) => state.workPeriods.periods.length;

export const getWorkPeriodsTotalCount = (state) =>
  state.workPeriods.pagination.totalCount;

export const getWorkPeriodsIsLoading = (state) =>
  !!state.workPeriods.cancelSource;

export const getWorkPeriodsIsSelectedAll = (state) =>
  state.workPeriods.isSelectedPeriodsAll;

export const getWorkPeriodsIsSelectedVisible = (state) =>
  state.workPeriods.isSelectedPeriodsVisible;
