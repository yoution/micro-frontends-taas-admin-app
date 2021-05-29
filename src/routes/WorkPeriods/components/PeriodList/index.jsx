import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import PeriodItem from "../PeriodItem";
import PeriodListHead from "../PeriodListHead";
import {
  getWorkPeriods,
  getWorkPeriodsSelected,
} from "store/selectors/workPeriods";
import {
  setWorkPeriodWorkingDays,
  toggleWorkPeriod,
} from "store/actions/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays the main content of the challenges' page.
 *
 * @param {Object} props component properties
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
const PeriodList = ({ className }) => {
  const periods = useSelector(getWorkPeriods);
  const periodsSelected = useSelector(getWorkPeriodsSelected);
  const dispatch = useDispatch();

  const onTogglePeriod = useCallback((periodId) => {
    dispatch(toggleWorkPeriod(periodId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWorkingDaysChange = useCallback((payload) => {
    dispatch(setWorkPeriodWorkingDays(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn(styles.container, className)}>
      <table className={styles.table}>
        <thead>
          <PeriodListHead />
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className={styles.listTopMargin}></td>
          </tr>
          {periods.map((period) => (
            <PeriodItem
              key={period.id}
              isSelected={period.id in periodsSelected}
              item={period}
              onToggle={onTogglePeriod}
              onWorkingDaysChange={onWorkingDaysChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

PeriodList.propTypes = {
  className: PT.string,
};

export default PeriodList;
