import moment from "moment";
import * as ACTION_TYPE from "store/actionTypes/workPeriods";
import {
  SORT_BY_DEFAULT,
  SORT_ORDER_DEFAULT,
  PAYMENT_STATUS,
} from "constants/workPeriods";
import { getWeekByDate, updateOptionMap } from "utils/misc";

const initPagination = () => ({
  totalCount: 0,
  pageCount: 0,
  pageNumber: 1,
  pageSize: +sessionStorage.getItem("workPeriods.pagination.pageSize") || 10,
});

const initFilters = () => ({
  dateRange: getWeekByDate(moment()),
  paymentStatuses: {
    [PAYMENT_STATUS.PAID]: true,
    [PAYMENT_STATUS.PENDING]: true,
    [PAYMENT_STATUS.IN_PROGRESS]: true,
  },
  userHandle: "",
});

const initialState = {
  error: null,
  cancelSource: { cancel: () => {} },
  periods: [],
  periodsSelected: {},
  isSelectedPeriodsAll: false,
  isSelectedPeriodsVisible: false,
  pagination: initPagination(),
  sorting: {
    criteria: SORT_BY_DEFAULT,
    order: SORT_ORDER_DEFAULT,
  },
  filters: initFilters(),
};

const reducer = (state = initialState, action) => {
  if (action.type in actionHandlers) {
    return actionHandlers[action.type](state, action.payload);
  }
  return state;
};

const actionHandlers = {
  [ACTION_TYPE.WP_LOAD_PAGE_PENDING]: (
    state,
    { cancelSource, pageNumber }
  ) => ({
    ...state,
    cancelSource,
    error: null,
    periods: [],
    pagination:
      pageNumber === state.pagination.pageNumber
        ? state.pagination
        : { ...state.pagination, pageNumber },
  }),
  [ACTION_TYPE.WP_LOAD_PAGE_SUCCESS]: (
    state,
    { periods, totalCount, pageCount }
  ) => {
    const oldPagination = state.pagination;
    const pagination =
      oldPagination.totalCount !== totalCount ||
      oldPagination.pageCount !== pageCount
        ? { ...oldPagination, totalCount, pageCount }
        : oldPagination;
    return {
      ...state,
      cancelSource: null,
      error: null,
      periods,
      pagination,
    };
  },
  [ACTION_TYPE.WP_LOAD_PAGE_ERROR]: (state, error) => {
    console.error(error.message);
    return {
      ...state,
      cancelSource: null,
      error: error.message,
      periods: [],
    };
  },
  [ACTION_TYPE.WP_RESET_FILTERS]: (state) => ({
    ...state,
    filters: initFilters(),
  }),
  [ACTION_TYPE.WP_SET_DATE_RANGE]: (state, date) => {
    const oldRange = state.filters.dateRange;
    const range = getWeekByDate(date);
    if (range[0].isSame(oldRange[0]) && range[1].isSame(oldRange[1])) {
      return state;
    }
    return {
      ...state,
      filters: {
        ...state.filters,
        dateRange: range,
      },
    };
  },
  [ACTION_TYPE.WP_SET_PAGE_NUMBER]: (state, pageNumber) => ({
    ...state,
    pagination:
      pageNumber === state.pagination.pageNumber
        ? state.pagination
        : { ...state.pagination, pageNumber },
  }),
  [ACTION_TYPE.WP_SET_PAGE_SIZE]: (state, pageSize) => ({
    ...state,
    pagination:
      pageSize === state.pagination.pageSize
        ? state.pagination
        : { ...state.pagination, pageSize },
  }),
  [ACTION_TYPE.WP_SET_SORT_BY]: (state, criteria) => ({
    ...state,
    sorting: {
      ...state.sorting,
      criteria,
    },
  }),
  [ACTION_TYPE.WP_SET_SORTING]: (state, { sortBy, sortOrder }) => {
    if (!sortOrder) {
      sortOrder = SORT_ORDER_DEFAULT;
      sortBy = SORT_BY_DEFAULT;
    }
    if (!sortBy) {
      sortBy = SORT_BY_DEFAULT;
    }
    return {
      ...state,
      sorting: {
        criteria: sortBy,
        order: sortOrder,
      },
    };
  },
  [ACTION_TYPE.WP_SET_PAYMENT_STATUSES]: (state, paymentStatuses) => ({
    ...state,
    filters: {
      ...state.filters,
      paymentStatuses: updateOptionMap(
        state.filters.paymentStatuses,
        paymentStatuses
      ),
    },
  }),
  [ACTION_TYPE.WP_SET_USER_HANDLE]: (state, userHandle) => ({
    ...state,
    filters: {
      ...state.filters,
      userHandle,
    },
  }),
  [ACTION_TYPE.WP_SET_WORKING_DAYS]: (state, { periodId, workingDays }) => {
    const oldPeriods = state.periods;
    const periods = [];
    for (let i = 0, len = oldPeriods.length; i < len; i++) {
      let period = oldPeriods[i];
      if (period.id === periodId) {
        period = {
          ...period,
          workingDays: Math.min(Math.max(workingDays, 0), 7),
        };
      }
      periods.push(period);
    }
    return {
      ...state,
      periods,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIOD]: (state, periodId) => {
    let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
    let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
    const periodsSelected = { ...state.periodsSelected };
    const isSelected = !periodsSelected[periodId];
    if (isSelected) {
      periodsSelected[periodId] = true;
    } else {
      isSelectedPeriodsAll = false;
      isSelectedPeriodsVisible = false;
      delete periodsSelected[periodId];
    }
    return {
      ...state,
      periodsSelected,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIODS_ALL]: (state) => {
    const isSelected = !state.isSelectedPeriodsAll;
    const periodsSelected = {};
    if (isSelected) {
      for (let period of state.periods) {
        periodsSelected[period.id] = true;
      }
    }
    return {
      ...state,
      periodsSelected,
      isSelectedPeriodsAll: isSelected,
      isSelectedPeriodsVisible: isSelected,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIODS_VISIBLE]: (state) => {
    const isSelected = !state.isSelectedPeriodsVisible;
    const periodsSelected = {};
    if (isSelected) {
      for (let period of state.periods) {
        periodsSelected[period.id] = true;
      }
    }
    return {
      ...state,
      periodsSelected,
      isSelectedPeriodsAll: false,
      isSelectedPeriodsVisible: isSelected,
    };
  },
};

export default reducer;
