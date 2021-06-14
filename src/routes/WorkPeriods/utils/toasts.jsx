import React from "react";
import { toastr } from "react-redux-toastr";
import ToastPaymentsProcessing from "../components/ToastPaymentsProcessing";
import ToastPaymentsSuccess from "../components/ToastPaymentsSuccess";
import ToastPaymentsWarning from "../components/ToastPaymentsWarning";
import ToastPaymentsError from "../components/ToastPaymentsError";
import { TOAST_DEFAULT_TIMEOUT } from "constants/index.js";

const options = { timeOut: TOAST_DEFAULT_TIMEOUT };

/**
 * Creates a redux toastr message denoting the start of payments processing.
 *
 * @param {Array} periods array with info about periods that were sent for processing
 */
export function makeToastPaymentsProcessing(periods) {
  const component = <ToastPaymentsProcessing periods={periods} />;
  toastr.info("", { component, options });
}

/**
 * Creates a redux toastr message denoting the successful scheduling of payments
 * for the specified periods.
 *
 * @param {Array} periods array with info about periods for which payments were
 * successfully scheduled
 */
export function makeToastPaymentsSuccess(periods) {
  const component = <ToastPaymentsSuccess periods={periods} />;
  toastr.success("", { component, options });
}

/**
 * Creates a redux toastr message denoting the partial success in shceduling
 * payments for specified working periods.
 *
 * @param {Array} periodsSucceeded periods for which payments were successfully
 * scheduled
 * @param {Array} periodsFailed periods for which payments were failed to be
 * scheduled
 */
export function makeToastPaymentsWarning(periodsSucceeded, periodsFailed) {
  const component = (
    <ToastPaymentsWarning
      periodsSucceeded={periodsSucceeded}
      periodsFailed={periodsFailed}
    />
  );
  toastr.warning("", { component, options });
}

/**
 * Creates redux toastr message showing the information about working
 * periods for which the payments were failed to be scheduled.
 *
 * @param {Array} periods periods for which payments were failed to be scheduled
 */
export function makeToastPaymentsError(periods) {
  const component = <ToastPaymentsError periods={periods} />;
  toastr.error("", { component, options });
}
