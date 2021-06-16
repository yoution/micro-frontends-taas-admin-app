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
  const daysWorked = item.daysWorked;

  const onWorkingDaysChange = useCallback(
    (daysWorked) => {
      dispatch(setDetailsWorkingDays(periodId, item.id, daysWorked));
    },
    [dispatch, periodId, item.id]
  );

  const updateWorkingDays = useCallback(
    debounce(
      (daysWorked) => {
        dispatch(updateWorkPeriodWorkingDays(item.id, daysWorked));
      },
      300,
      { leading: false }
    ),
    [dispatch, item.id]
  );

  // Update working days on server if working days change.
  useUpdateEffect(() => {
    updateWorkingDays(item.daysWorked);
  }, [item.daysWorked]);

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
      <td className={styles.daysWorked}>
        {item.paymentStatus === PAYMENT_STATUS.PAID ? (
          `${daysWorked} ${daysWorked === 1 ? "Day" : "Days"}`
        ) : (
          <IntegerField
            className={styles.daysWorkedControl}
            name={`wp_det_wd_${item.id}`}
            isDisabled={isDisabled}
            onChange={onWorkingDaysChange}
            value={daysWorked}
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
    daysWorked: PT.number.isRequired,
  }).isRequired,
  currentStartDate: PT.oneOfType([PT.string, PT.number, PT.object]).isRequired,
};

export default memo(PeriodsHistoryItem);
