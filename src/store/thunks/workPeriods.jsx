import React from "react";
import axios from "axios";
import { toastr } from "react-redux-toastr";
import ToastrMessage from "components/ToastrMessage";
import ToastPaymentsProcessing from "routes/WorkPeriods/components/ToastPaymentsProcessing";
import ToastPaymentsSuccess from "routes/WorkPeriods/components/ToastPaymentsSuccess";
import ToastPaymentsWarning from "routes/WorkPeriods/components/ToastPaymentsWarning";
import ToastPaymentsError from "routes/WorkPeriods/components/ToastPaymentsError";
import * as actions from "store/actions/workPeriods";
import * as selectors from "store/selectors/workPeriods";
import * as services from "services/workPeriods";
import {
  SORT_BY_MAP,
  API_SORT_BY,
  DATE_FORMAT_API,
  PAYMENT_STATUS_MAP,
  FIELDS_QUERY,
} from "constants/workPeriods";
import {
  extractJobName,
  extractResponseData,
  extractResponsePagination,
  replaceItems,
} from "utils/misc";
import {
  normalizeBillingAccounts,
  normalizeDetailsPeriodItems,
  normalizePeriodItems,
} from "utils/workPeriods";
import { RESOURCE_BOOKING_STATUS } from "constants/index.js";

/**
 * Thunk that loads the specified working periods' page. If page number is not
 * provided the current page number from current state is used. All relevant
 * working period filters are loaded from the current state to construct
 * a request query.
 *
 * @param {number} [pageNumber] page number to load
 * @returns {function}
 */
export const loadWorkPeriodsPage =
  (pageNumber) => async (dispatch, getState) => {
    const workPeriods = selectors.getWorkPeriodsStateSlice(getState());
    if (workPeriods.cancelSource) {
      // If there's an ongoing request we just cancel it since the data that comes
      // with its response will not correspond to application's current state,
      // namely filters and sorting.
      workPeriods.cancelSource.cancel();
    }
    const { filters, sorting, pagination } = workPeriods;

    // If page number is not specified get it from current state.
    pageNumber = pageNumber || pagination.pageNumber;

    const sortOrder = sorting.order;
    const sortBy = SORT_BY_MAP[sorting.criteria] || API_SORT_BY.USER_HANDLE;

    const [startDate] = filters.dateRange;
    const paymentStatuses = replaceItems(
      Object.keys(filters.paymentStatuses),
      PAYMENT_STATUS_MAP
    );

    // For parameter description see:
    // https://topcoder-platform.github.io/taas-apis/#/ResourceBookings/get_resourceBookings
    const [promise, cancelSource] = services.fetchResourceBookings({
      fields: FIELDS_QUERY,
      page: pageNumber,
      perPage: pagination.pageSize,
      sortBy,
      sortOrder,
      // we only want to show Resource Bookings with status "placed"
      status: RESOURCE_BOOKING_STATUS.PLACED,
      ["workPeriods.userHandle"]: filters.userHandle,
      ["workPeriods.startDate"]: startDate.format(DATE_FORMAT_API),
      ["workPeriods.paymentStatus"]:
        // Currently resourceBookings API does not support multiple payment statuses.
        // When the support is implemented remove the next line and uncomment
        // the following line.
        paymentStatuses.length === 1 ? paymentStatuses[0] : null,
      // paymentStatuses,
    });
    dispatch(actions.loadWorkPeriodsPagePending(cancelSource, pageNumber));
    let totalCount, periods, pageCount;
    try {
      const response = await promise;
      ({ totalCount, pageNumber, pageCount } =
        extractResponsePagination(response));
      const data = extractResponseData(response);
      periods = normalizePeriodItems(data);
    } catch (error) {
      // If request was cancelled by the next call to loadWorkPeriodsPage
      // there's nothing more to do.
      if (!axios.isCancel(error)) {
        dispatch(actions.loadWorkPeriodsPageError(error.toString()));
      }
      return;
    }
    dispatch(
      actions.loadWorkPeriodsPageSuccess(periods, totalCount, pageCount)
    );
  };

/**
 * Thunk that either loads and displays or hides the details of the specified
 * working period.
 *
 * @param {Object} period working period object
 * @param {string} period.id working period id
 * @param {string} period.rbId resource booking id
 * @param {number|string} period.projectId resource booking's project id
 * @param {number|string} period.jobId resource booking's job id
 * @param {number} period.billingAccountId billing account id
 * @param {?boolean} [show] whether to show or hide working period details
 * @returns {function}
 */
export const toggleWorkPeriodDetails =
  (period, show = null) =>
  async (dispatch, getState) => {
    const periodsDetails = selectors.getWorkPeriodsDetails(getState());
    const periodDetails = periodsDetails[period.id];
    // If there's an ongoing request to load details for specified working
    // period we cancel this request because
    // 1. If we show details the data that will come with its response will not
    // correspond to the current state.
    // 2. If we hide details we don't need details data anyway.
    periodDetails?.cancelSource?.cancel();
    show = show === null ? !periodDetails : show;
    if (show) {
      if (periodDetails) {
        // reload details?
      } else {
        const source = axios.CancelToken.source();
        dispatch(
          actions.loadWorkPeriodDetailsPending(
            period.id,
            period.rbId,
            period.billingAccountId,
            source
          )
        );
        const [rbPromise] = services.fetchWorkPeriods(period.rbId, source);
        const [jobNamePromise] = services.fetchJob(period.jobId, source);
        const [bilAccsPromise] = services.fetchBillingAccounts(
          period.projectId,
          source
        );
        let details = null;
        let errorMessage = null;
        try {
          const data = await rbPromise;
          const periods = normalizeDetailsPeriodItems(data);
          details = { periods };
        } catch (error) {
          if (!axios.isCancel(error)) {
            errorMessage = error.toString();
          }
        }
        if (details) {
          dispatch(actions.loadWorkPeriodDetailsSuccess(period.id, details));
        } else if (errorMessage) {
          dispatch(actions.loadWorkPeriodDetailsError(period.id, errorMessage));
          makeToast(errorMessage);
        }
        let jobName = null;
        errorMessage = null;
        try {
          const data = await jobNamePromise;
          jobName = extractJobName(data);
        } catch (error) {
          if (!axios.isCancel(error)) {
            errorMessage = error.toString();
          }
        }
        if (jobName) {
          dispatch(actions.loadJobNameSuccess(period.id, jobName));
        } else if (errorMessage) {
          dispatch(actions.loadJobNameError(period.id, errorMessage));
          makeToast(errorMessage);
        }
        let accounts = null;
        errorMessage = null;
        try {
          const data = await bilAccsPromise;
          const periodsDetails = selectors.getWorkPeriodsDetails(getState());
          const periodDetails = periodsDetails[period.id];
          const billingAccountId =
            (periodDetails && periodDetails.billingAccountId) ||
            period.billingAccountId;
          accounts = normalizeBillingAccounts(data, billingAccountId);
        } catch (error) {
          if (!axios.isCancel(error)) {
            errorMessage = error.toString();
          }
        }
        if (accounts) {
          dispatch(actions.loadBillingAccountsSuccess(period.id, accounts));
        } else if (errorMessage) {
          dispatch(actions.loadBillingAccountsError(period.id, errorMessage));
          makeToast(errorMessage);
        }
      }
    } else {
      dispatch(actions.hideWorkPeriodDetails(period.id));
    }
  };

/**
 *
 * @param {string} rbId
 * @param {number} billingAccountId
 * @returns {function}
 */
export const updateWorkPeriodBillingAccount =
  (rbId, billingAccountId) => async () => {
    try {
      await services.patchWorkPeriodBillingAccount(rbId, billingAccountId);
    } catch (error) {
      makeToast(
        `Failed to update billing account for resource booking ${rbId}.\n` +
          error.toString()
      );
    }
  };

/**
 *
 * @param {string} periodId
 * @param {number} workingDays
 * @returns {function}
 */
export const updateWorkPeriodWorkingDays =
  (periodId, workingDays) => async () => {
    try {
      await services.patchWorkPeriodWorkingDays(periodId, workingDays);
    } catch (error) {
      makeToast(
        `Failed to update working days for working period ${periodId}.\n` +
          error.toString()
      );
    }
  };

/**
 * Sends request to process payments for selected working periods.
 *
 * @param {function} dispatch redux store dispatch function
 * @param {function} getState function returning redux store root state
 */
export const processPayments = async (dispatch, getState) => {
  dispatch(actions.toggleWorkPeriodsProcessingPeyments(true));
  const state = getState();
  const periods = selectors.getWorkPeriods(state);
  const periodsSelected = selectors.getWorkPeriodsSelected(state);
  const payments = [];
  for (let period of periods) {
    if (period.id in periodsSelected) {
      payments.push({ workPeriodId: period.id, amount: period.weeklyRate });
    }
  }
  makeProcessingToast(payments);
  let results = null;
  let errorMessage = null;
  try {
    results = await services.postWorkPeriodsPayments(payments);
  } catch (error) {
    errorMessage = error.toString();
  }
  if (results) {
    const periodsToDeselect = {};
    const periodsSucceeded = [];
    const periodsFailed = [];
    for (let result of results) {
      if ("error" in result) {
        periodsFailed.push(result);
      } else {
        periodsToDeselect[result.workPeriodId] = false;
        periodsSucceeded.push(result);
      }
    }
    dispatch(actions.selectWorkPeriods(periodsToDeselect));
    if (periodsSucceeded.length) {
      if (periodsFailed.length) {
        makeWarningToast(periodsSucceeded, periodsFailed);
      } else {
        makeSuccessToast(periodsSucceeded);
      }
    } else {
      makeErrorToast(periodsFailed);
    }
  } else {
    makeToast(errorMessage);
  }
  dispatch(actions.toggleWorkPeriodsProcessingPeyments(false));
};

/**
 *
 * @param {string} message
 * @param {'info'|'success'|'warning'|'error'} type
 * @returns {Object}
 */
function makeToast(message, type = "error") {
  const component =
    typeof message === "string" ? (
      <ToastrMessage message={message} type={type} />
    ) : (
      <ToastrMessage type={type}>{message}</ToastrMessage>
    );
  toastr[type]("", { component });
}

function makeProcessingToast(periods) {
  const component = <ToastPaymentsProcessing periods={periods} />;
  toastr.info("", { component });
}

function makeSuccessToast(periods) {
  const component = <ToastPaymentsSuccess periods={periods} />;
  toastr.success("", { component });
}

function makeWarningToast(periodsSucceeded, periodsFailed) {
  const component = (
    <ToastPaymentsWarning
      periodsSucceeded={periodsSucceeded}
      periodsFailed={periodsFailed}
    />
  );
  toastr.warning("", { component });
}

function makeErrorToast(periods) {
  const component = <ToastPaymentsError periods={periods} />;
  toastr.error("", { component });
}
