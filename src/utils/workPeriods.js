import moment from "moment";
import { API_PAYMENT_STATUS_MAP, PAYMENT_STATUS } from "constants/workPeriods";

const DATE_FORMAT_UI = "MMM DD, YYYY";

export function normalizePeriodItems(items) {
  const empty = {};
  const periods = [];
  for (let item of items) {
    const workPeriod = item.workPeriods?.[0] || empty;
    const paymentStatus = workPeriod.paymentStatus;
    const daysWorked = workPeriod.daysWorked;
    periods.push({
      id: workPeriod.id || item.id,
      rbId: item.id,
      projectId: item.projectId,
      teamName: "",
      userHandle: workPeriod.userHandle || "",
      startDate: item.startDate
        ? moment(item.startDate).format(DATE_FORMAT_UI)
        : "",
      endDate: item.endDate ? moment(item.endDate).format(DATE_FORMAT_UI) : "",
      weeklyRate: item.memberRate,
      paymentStatus: paymentStatus
        ? API_PAYMENT_STATUS_MAP[paymentStatus] || paymentStatus.toUpperCase()
        : PAYMENT_STATUS.UNDEFINED,
      workingDays: daysWorked === null ? 5 : +daysWorked || 0,
    });
  }
  return periods;
}
