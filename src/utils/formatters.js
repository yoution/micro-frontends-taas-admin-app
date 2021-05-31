// @ts-ignore
import { PAYMENT_STATUS_LABELS } from "constants/workPeriods";
import { PLATFORM_WEBSITE_URL, TAAS_BASE_PATH } from "../constants";

const rxWhitespace = /\s+/;

/**
 * Formats payment status.
 *
 * @param {string} status payment status as defined by PAYMENT_STATUS enum constant
 * @returns {string}
 */
export function formatPaymentStatus(status) {
  let paymentStatus = PAYMENT_STATUS_LABELS[status];
  if (!paymentStatus) {
    let words = status.split(rxWhitespace);
    for (let i = 0, len = words.length; i < len; i++) {
      let word = words[i];
      words[i] = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    }
    paymentStatus = words.join(" ");
  }
  return paymentStatus;
}

/**
 * Formats user handle link.
 *
 * @param {number|string} rbProjectId ResourceBooking project id
 * @param {string} rbId ResourceBooking id
 * @returns {string}
 */
export function formatUserHandleLink(rbProjectId, rbId) {
  return `${PLATFORM_WEBSITE_URL}${TAAS_BASE_PATH}/myteams/${rbProjectId}/rb/${rbId}`;
}
