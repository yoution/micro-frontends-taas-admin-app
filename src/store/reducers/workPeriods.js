import moment from "moment";
import * as ACTION_TYPE from "store/actionTypes/workPeriods";
import {
  SORT_BY_DEFAULT,
  SORT_ORDER_DEFAULT,
  PAYMENT_STATUS,
} from "constants/workPeriods";
import {
  filterPeriodsByStartDate,
  getWeekByDate,
  updateOptionMap,
} from "utils/misc";

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

const cancelSourceDummy = { cancel: () => {} };

const initPeriodDetails = (
  periodId,
  rbId,
  billingAccountId = 0,
  cancelSource = cancelSourceDummy
) => ({
  periodId,
  rbId,
  cancelSource,
  jobName: "Loading...",
  jobNameIsLoading: true,
  billingAccountId,
  billingAccounts: [{ value: billingAccountId, label: "Loading..." }],
  billingAccountsIsLoading: true,
  periods: [],
  periodsVisible: [],
  periodsIsLoading: true,
  hidePastPeriods: false,
  lockWorkingDays: false,
});

const initialState = {
  error: null,
  cancelSource: cancelSourceDummy,
  periods: [],
  periodsDetails: {},
  periodsFailed: {},
  periodsSelected: {},
  isSelectedPeriodsAll: false,
  isSelectedPeriodsVisible: false,
  isProcessingPayments: false,
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
    periodsDetails: {},
    periodsFailed: {},
    periodsSelected: {},
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
  [ACTION_TYPE.WP_HIDE_PERIOD_DETAILS]: (state, periodId) => {
    const periodsDetails = { ...state.periodsDetails };
    delete periodsDetails[periodId];
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_HIGHLIGHT_FAILED_PERIODS]: (state, periods) => {
    const periodIds = Object.keys(periods);
    if (!periodIds.length) {
      return state;
    }
    let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
    let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
    const periodsFailed = { ...state.periodsFailed };
    const periodsSelected = { ...state.periodsSelected };
    for (let periodId of periodIds) {
      if (periods[periodId]) {
        periodsFailed[periodId] = true;
        periodsSelected[periodId] = true;
      } else {
        isSelectedPeriodsAll = false;
        isSelectedPeriodsVisible = false;
        delete periodsSelected[periodId];
      }
    }
    return {
      ...state,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
      periodsFailed,
      periodsSelected,
    };
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_PENDING]: (
    state,
    { periodId, rbId, billingAccountId, cancelSource }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    periodsDetails[periodId] = initPeriodDetails(
      periodId,
      rbId,
      billingAccountId,
      cancelSource
    );
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_SUCCESS]: (
    state,
    { periodId, details }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    // period details object must already be initialized
    if (!periodDetails) {
      // This branch should not be reachable but just in case.
      return state;
    }
    periodDetails = {
      ...periodDetails,
      periods: details.periods,
      periodsIsLoading: false,
    };
    if (periodDetails.hidePastPeriods) {
      periodDetails.periodsVisible = filterPeriodsByStartDate(
        periodDetails.periods,
        state.filters.dateRange[0]
      );
    } else {
      periodDetails.periodsVisible = periodDetails.periods;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_ERROR]: (
    state,
    { periodId, message }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    // No periods to show so we just hide period details.
    delete periodsDetails[periodId];
    console.error(message);
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_JOB_NAME_SUCCESS]: (state, { periodId, jobName }) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      // Period details may be removed at this point so we must handle this case.
      return state;
    }
    periodDetails = { ...periodDetails, jobName, jobNameIsLoading: false };
    if (!periodDetails.billingAccountsIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_JOB_NAME_ERROR]: (state, { periodId, message }) => {
    console.error(message);
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodDetails = {
      ...periodDetails,
      jobName: "Error",
      jobNameIsLoading: false,
    };
    if (!periodDetails.billingAccountsIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_SUCCESS]: (
    state,
    { periodId, accounts }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      // Period details may be removed at this point so we must handle this case.
      return state;
    }
    let billingAccountId = periodDetails.billingAccountId;
    if (!accounts.length) {
      accounts.push({ value: -1, label: "No Accounts Available" });
      billingAccountId = -1;
    }
    periodDetails = {
      ...periodDetails,
      billingAccountId,
      billingAccounts: accounts,
      billingAccountsIsLoading: false,
    };
    if (!periodDetails.jobNameIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_ERROR]: (
    state,
    { periodId, message }
  ) => {
    console.error(message);
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodDetails = {
      ...periodDetails,
      billingAccounts: [
        { value: periodDetails.billingAccountId, label: "Error" },
      ],
      billingAccountsIsLoading: false,
    };
    if (!periodDetails.jobNameIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_BILLING_ACCOUNT]: (state, { periodId, accountId }) => {
    const periodsDetails = { ...state.periodsDetails };
    const periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodsDetails[periodId] = {
      ...periodDetails,
      billingAccountId: accountId,
    };
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_DETAILS_HIDE_PAST_PERIODS]: (
    state,
    { periodId, hide }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodDetails = { ...periodDetails, hidePastPeriods: hide };
    if (hide) {
      periodDetails.periodsVisible = filterPeriodsByStartDate(
        periodDetails.periods,
        state.filters.dateRange[0]
      );
    } else {
      periodDetails.periodsVisible = periodDetails.periods;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_DETAILS_LOCK_WORKING_DAYS]: (
    state,
    { periodId, lock }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodsDetails[periodId] = { ...periodDetails, lockWorkingDays: lock };
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_DETAILS_WORKING_DAYS]: (
    state,
    { parentPeriodId, periodId, workingDays }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[parentPeriodId];
    if (!periodDetails) {
      return state;
    }
    workingDays = Math.min(Math.max(workingDays, 0), 5);
    const periods = [];
    for (let period of periodDetails.periods) {
      if (period.id === periodId) {
        period = { ...period, workingDays };
      }
      periods.push(period);
    }
    const periodsVisible = [];
    for (let period of periodDetails.periodsVisible) {
      if (period.id === periodId) {
        period = { ...period, workingDays };
      }
      periodsVisible.push(period);
    }
    periodsDetails[parentPeriodId] = {
      ...periodDetails,
      periods,
      periodsVisible,
    };
    return {
      ...state,
      periodsDetails,
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
  [ACTION_TYPE.WP_SELECT_PERIODS]: (state, periods) => {
    let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
    let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
    let periodsSelected = { ...state.periodsSelected };
    for (let periodId in periods) {
      if (periods[periodId] === true) {
        periodsSelected[periodId] = true;
      } else {
        isSelectedPeriodsAll = false;
        isSelectedPeriodsVisible = false;
        delete periodsSelected[periodId];
      }
    }
    return {
      ...state,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
      periodsSelected,
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
          workingDays: Math.min(Math.max(workingDays, 0), 5),
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
  [ACTION_TYPE.WP_TOGGLE_PROCESSING_PAYMENTS]: (state, on) => {
    let periodsFailed = state.periodsFailed;
    let isProcessingPayments = on === null ? !state.isProcessingPayments : on;
    if (isProcessingPayments) {
      periodsFailed = {};
    }
    return {
      ...state,
      periodsFailed,
      isProcessingPayments,
    };
  },
};

export default reducer;
