import axios, { CancelToken } from "./axios";
import {
  RB_API_URL,
  JOBS_API_URL,
  PAYMENTS_API_URL,
  PROJECTS_API_URL,
  QUERY_PARAM_NAMES,
  WORK_PERIODS_API_URL,
} from "constants/workPeriods";
import { buildRequestQuery, extractResponseData } from "utils/misc";

/**
 * Fetches job name by job id.
 *
 * @param {number|string} jobId job id
 * @param {Object} [source] axios cancel token source
 * @returns {[Promise, Object]}
 */
export const fetchJob = (jobId, source) => {
  if (!source) {
    source = CancelToken.source();
  }
  return [
    axios
      .get(`${JOBS_API_URL}/${jobId}`, {
        cancelToken: source.token,
      })
      .then(extractResponseData),
    source,
  ];
};

/**
 * Fetches billing accounts for specific project id.
 *
 * @param {number|string} projectId resource booking's project id
 * @param {Object} [source] axios cancel token source
 * @returns {[Promise, Object]}
 */
export const fetchBillingAccounts = (projectId, source) => {
  if (!source) {
    source = CancelToken.source();
  }
  return [
    axios
      .get(`${PROJECTS_API_URL}/${projectId}/billingAccounts`, {
        cancelToken: source.token,
      })
      .then(extractResponseData),
    source,
  ];
};

/**
 * Fetches working periods for specific resource booking.
 *
 * @param {string} rbId ResourceBooking id
 * @param {Object} [source] optioinal cancel token source
 * @returns {[Promise, Object]}
 */
export const fetchWorkPeriods = (rbId, source) => {
  if (!source) {
    source = CancelToken.source();
  }
  return [
    axios
      .get(`${WORK_PERIODS_API_URL}/?resourceBookingIds=${rbId}`, {
        cancelToken: source.token,
      })
      .then(extractResponseData),
    source,
  ];
};

/**
 * Fetches working periods using provided parameters.
 *
 * @param {Object} params object containing query parameters
 * @returns {[Promise, Object]}
 */
export const fetchResourceBookings = (params) => {
  const source = CancelToken.source();
  return [
    axios.get(`${RB_API_URL}?${buildRequestQuery(params, QUERY_PARAM_NAMES)}`, {
      cancelToken: source.token,
    }),
    source,
  ];
};

/**
 * Updates working period's working days.
 *
 * @param {string} periodId working period id
 * @param {number} daysWorked new number of working days
 * @returns {Promise}
 */
export const patchWorkPeriodWorkingDays = (periodId, daysWorked) => {
  return axios.patch(`${WORK_PERIODS_API_URL}/${periodId}`, { daysWorked });
};

/**
 * Updates billing account id for resource booking with the specified id.
 *
 * @param {string} rbId resource booking id
 * @param {number} billingAccountId billing account id
 * @returns {Promise}
 */
export const patchWorkPeriodBillingAccount = (rbId, billingAccountId) => {
  return axios.patch(`${RB_API_URL}/${rbId}`, { billingAccountId });
};

/**
 * Sends request to queue payments for specific working periods and amounts
 * inside the provided array.
 *
 * @param {Array} payments
 * @returns {Promise}
 */
export const postWorkPeriodsPayments = (payments) => {
  return axios.post(`${PAYMENTS_API_URL}`, payments).then(extractResponseData);
};
