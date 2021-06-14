import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import IntegerField from "components/IntegerField";
import PaymentStatus from "../PaymentStatus";
import { PAYMENT_STATUS } from "constants/workPeriods";
import { setDetailsWorkingDays } from "store/actions/workPeriods";
import { updateWorkPeriodWorkingDays } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import {
  formatDateLabel,
  formatDateRange,
  formatWeeklyRate,
} from "utils/formatters";
import styles from "./styles.module.scss";
import PeriodsHistoryWeeklyRate from "../PeriodsHistoryWeeklyRate";

/**
 * Displays working period row in history table in details view.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodsHistoryItem = ({
  periodId,
  isDisabled,
  item,
  currentStartDate,
}) => {
  const dispatch = useDispatch();

  const dateLabel = formatDateLabel(item.startDate, currentStartDate);
  const workingDays = item.workingDays;

  const onWorkingDaysChange = useCallback(
    (workingDays) => {
      dispatch(setDetailsWorkingDays(periodId, item.id, workingDays));
    },
    [dispatch, periodId, item.id]
  );

  const updateWorkingDays = useCallback(
    debounce(
      (workingDays) => {
        dispatch(updateWorkPeriodWorkingDays(item.id, workingDays));
      },
      300,
      { leading: false }
    ),
    [dispatch, item.id]
  );

  // Update working days on server if working days change.
  useUpdateEffect(() => {
    updateWorkingDays(item.workingDays);
  }, [item.workingDays]);

  return (
    <tr
      className={cn(styles.container, {
        [styles.current]: dateLabel === "Current Period",
      })}
    >
      <td className={styles.dateRange}>
        {formatDateRange(item.startDate, item.endDate)}
      </td>
      <td className={styles.dateLabel}>{dateLabel}</td>
      <td className={styles.weeklyRate}>
        <PeriodsHistoryWeeklyRate
          className={styles.weeklyRateContainer}
          payments={item.payments}
          weeklyRate={formatWeeklyRate(item.weeklyRate)}
        />
      </td>
      <td className={styles.paymentStatus}>
        <PaymentStatus status={item.paymentStatus} />
      </td>
      <td className={styles.workingDays}>
        {item.paymentStatus === PAYMENT_STATUS.PAID ? (
          `${workingDays} ${workingDays === 1 ? "Day" : "Days"}`
        ) : (
          <IntegerField
            className={styles.workingDaysControl}
            name={`wp_det_wd_${item.id}`}
            isDisabled={isDisabled}
            onChange={onWorkingDaysChange}
            value={workingDays}
            maxValue={5}
            minValue={0}
          />
        )}
      </td>
    </tr>
  );
};

PeriodsHistoryItem.propTypes = {
  periodId: PT.string.isRequired,
  isDisabled: PT.bool.isRequired,
  item: PT.shape({
    id: PT.string.isRequired,
    startDate: PT.oneOfType([PT.string, PT.number]).isRequired,
    endDate: PT.oneOfType([PT.string, PT.number]).isRequired,
    paymentStatus: PT.string.isRequired,
    payments: PT.array,
    weeklyRate: PT.number,
    workingDays: PT.number.isRequired,
  }).isRequired,
  currentStartDate: PT.oneOfType([PT.string, PT.number, PT.object]).isRequired,
};

export default memo(PeriodsHistoryItem);
