import moment from "moment";
import {
  API_PAYMENT_STATUS_MAP,
  DATE_FORMAT_UI,
  PAYMENT_STATUS,
} from "constants/workPeriods";

export function normalizePeriodItems(items) {
  const empty = {};
  const periods = [];
  for (let item of items) {
    const workPeriod = item.workPeriods?.[0] || empty;
    const billingAccountId = item.billingAccountId;
    const daysWorked = workPeriod.daysWorked;
    periods.push({
      id: workPeriod.id || item.id,
      rbId: item.id,
      jobId: item.jobId,
      projectId: item.projectId,
      billingAccountId: billingAccountId === null ? 0 : billingAccountId,
      teamName: "",
      userHandle: workPeriod.userHandle || "",
      startDate: item.startDate
        ? moment(item.startDate).format(DATE_FORMAT_UI)
        : "",
      endDate: item.endDate ? moment(item.endDate).format(DATE_FORMAT_UI) : "",
      weeklyRate: item.memberRate,
      paymentStatus: normalizePaymentStatus(workPeriod.paymentStatus),
      workingDays: daysWorked === null ? 5 : +daysWorked || 0,
    });
  }
  return periods;
}

/**
 * Creates options to be used in dropdown selecting working period's
 * billing account.
 *
 * @param {Array} accounts array of billing accounts received for specific project
 * @param {number} accountId resource booking's billing account id
 * @returns {Array}
 */
export function normalizeBillingAccounts(accounts, accountId = -1) {
  const accs = [];
  let hasSelectedAccount = false;
  for (let acc of accounts) {
    const value = +acc.tcBillingAccountId;
    hasSelectedAccount = hasSelectedAccount || value === accountId;
    const endDate = acc.endDate
      ? moment(acc.endDate).format("DD MMM YYYY")
      : "";
    accs.push({
      value,
      label: `${acc.name} (${value})` + (endDate ? ` - ${endDate}` : ""),
    });
  }
  if (!hasSelectedAccount && accountId > 0) {
    accs.unshift({
      value: accountId,
      label: `<Assigned Account> (${accountId})`,
    });
  }
  return accs;
}

export function normalizeDetailsPeriodItems(items) {
  const periods = [];
  for (let item of items) {
    const daysWorked = item.daysWorked;
    periods.push({
      id: item.id,
      startDate: item.startDate ? moment(item.startDate).valueOf() : 0,
      endDate: item.endDate ? moment(item.endDate).valueOf() : 0,
      paymentStatus: normalizePaymentStatus(item.paymentStatus),
      payments: item.payments || [],
      weeklyRate: item.memberRate,
      workingDays: daysWorked === null ? 5 : +daysWorked || 0,
    });
  }
  periods.sort(sortByStartDate);
  return periods;
}

export function normalizePaymentStatus(paymentStatus) {
  return API_PAYMENT_STATUS_MAP[paymentStatus] || PAYMENT_STATUS.UNDEFINED;
}

export function sortByStartDate(itemA, itemB) {
  return itemA.startDate - itemB.startDate;
}
