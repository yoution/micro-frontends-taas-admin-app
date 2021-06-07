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
  toggleExpandWorkPeriod,
} from "store/actions/workPeriods";
import { loadWorkPeriodDetail } from "store/thunks/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays the list of the working periods with column headers.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodList = ({ className }) => {
  const periods = useSelector(getWorkPeriods);
  const periodsSelected = useSelector(getWorkPeriodsSelected);
  const dispatch = useDispatch();

  const onTogglePeriod = useCallback(
    (periodId) => {
      dispatch(toggleWorkPeriod(periodId));
    },
    [dispatch]
  );

  const onWorkingDaysChange = useCallback(
    (payload) => {
      dispatch(setWorkPeriodWorkingDays(payload));
    },
    [dispatch]
  );

  const onToggleExpandRowClick = useCallback((item) => {
    debugger;
    if (item.isExpand) {
      dispatch(toggleExpandWorkPeriod(item.id, false))
    }else {
      dispatch(toggleExpandWorkPeriod(item.id, true))
      if (!item.detailLoaded) {
        dispatch(loadWorkPeriodDetail(item));
      }
    }
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
              onToggleExpandRow={onToggleExpandRowClick}
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
