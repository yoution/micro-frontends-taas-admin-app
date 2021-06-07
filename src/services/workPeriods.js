import axiosDefault from "axios";
import axios from "./axios";
import { API } from "./../../config";
import { API_URL, QUERY_PARAM_NAMES } from "constants/workPeriods";
import { buildRequestQuery } from "utils/misc";

const CancelToken = axiosDefault.CancelToken;

/**
 * Fetches working periods using provided parameters.
 *
 * @param {Object} params object containing query parameters
 * @returns {[Promise, Object]}
 */
export const fetchResourceBookings = (params) => {
  const source = CancelToken.source();
  return [
    axios.get(`${API_URL}?${buildRequestQuery(params, QUERY_PARAM_NAMES)}`, {
      cancelToken: source.token,
    }),
    source,
  ];
};

/**
 * Fetches working periods by resource booking id.
 *
 * @param {String} id resource booking id
 * @param {Object} params object containing query parameters
 * @returns {[Promise, Object]}
 */
export const fetchResourceBookingById = (id) => {
  return axios.get( `${API.V5}/resourceBookings/${id}`)
};
