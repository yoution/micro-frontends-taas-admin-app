import axios from "axios";
import moment from "moment";
import * as actions from "store/actions/workPeriods";
import * as selectors from "store/selectors/workPeriods";
import * as services from "services/workPeriods";
import {
  SORT_BY_MAP,
  API_SORT_BY,
  DATE_FORMAT,
  PAYMENT_STATUS_MAP,
  FIELDS_QUERY,
} from "constants/workPeriods";
import {
  extractResponseData,
  extractResponsePagination,
  replaceItems,
} from "utils/misc";
import { normalizePeriodItems } from "utils/workPeriods";
import { USER_HANDLE } from "constants/workPeriods/apiSortBy";

/**
 * Thunk that loads the specified challenges' page. If page number is not
 * provided the current page number from current state is used. All relevant
 * challenge parameters are loaded from the current state to construct a request
 * query.
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

    const [startDate, endDate] = filters.dateRange;
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
      ["workPeriods.userHandle"]: filters.userHandle,
      ["workPeriods.startDate"]: startDate.format(DATE_FORMAT),
      ["workPeriods.paymentStatus"]:
        // Currently resourceBookings API does not support multiple payment statuses.
        // When the support is implemented remove the next line and uncomment
        // the following line.
        paymentStatuses.length === 1 ? paymentStatuses[0] : null,
      // paymentStatuses,
    });
    dispatch(actions.loadWorkPeriodsPagePending(cancelSource, pageNumber));
    let totalCount, periods, pageCount, pageSize;
    try {
      const response = await promise;
      ({ totalCount, pageNumber, pageCount, pageSize } =
        extractResponsePagination(response));
      const data = extractResponseData(response);
      periods = normalizePeriodItems(data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        dispatch(actions.loadWorkPeriodsPageError(error.toString()));
      }
      // If request was cancelled by the next call to loadWorkPeriodsPage
      // there's nothing more to do.
      return;
    }
    dispatch(
      actions.loadWorkPeriodsPageSuccess(periods, totalCount, pageCount)
    );
  };
