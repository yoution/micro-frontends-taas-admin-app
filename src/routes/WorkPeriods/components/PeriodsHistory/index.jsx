import React from "react";
import { useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import PeriodHistoryItem from "../PeriodsHistoryItem";
import { getWorkPeriodsDateRange } from "store/selectors/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays all working periods' history.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodsHistory = ({ className, isDisabled, periodId, periods }) => {
  const [startDate] = useSelector(getWorkPeriodsDateRange);
  return (
    <div className={cn(styles.container, className)}>
      <table>
        <tbody>
          {periods.map((period) => (
            <PeriodHistoryItem
              key={period.id}
              periodId={periodId}
              isDisabled={isDisabled}
              item={period}
              currentStartDate={startDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

PeriodsHistory.propTypes = {
  className: PT.string,
  isDisabled: PT.bool.isRequired,
  periodId: PT.string.isRequired,
  periods: PT.arrayOf(PT.object),
};

export default PeriodsHistory;
