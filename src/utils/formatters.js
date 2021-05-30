// @ts-ignore
import { PLATFORM_WEBSITE_URL } from "../config";
import { TAAS_BASE_PATH } from "../constants";

const rxWhitespace = /\s+/;

/**
 * Formats payment status.
 *
 * @param {string} status payment status
 * @returns {string}
 */
export function formatPaymentStatus(status) {
  let words = status.split(rxWhitespace);
  for (let i = 0, len = words.length; i < len; i++) {
    let word = words[i];
    words[i] = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
  }
  return words.join(" ");
}

/**
 * Formats user handle link.
 *
 * @param {number|string} rbProjectId ResourceBooking project id
 * @param {string} rbId ResourceBooking id
 * @returns {string}
 */
export function formatUserHandleLink(rbProjectId, rbId) {
  return `${PLATFORM_WEBSITE_URL}${TAAS_BASE_PATH}/${rbProjectId}/rb/${rbId}`;
}
