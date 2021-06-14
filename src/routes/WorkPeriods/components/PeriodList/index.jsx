import React from "react";
import { useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import PeriodItem from "../PeriodItem";
import PeriodListHead from "../PeriodListHead";
import {
  getWorkPeriods,
  getWorkPeriodsDetails,
  getWorkPeriodsIsProcessingPayments,
  getWorkPeriodsSelected,
} from "store/selectors/workPeriods";
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
  const periodsDetails = useSelector(getWorkPeriodsDetails);
  const periodsSelected = useSelector(getWorkPeriodsSelected);
  const isProcessingPayments = useSelector(getWorkPeriodsIsProcessingPayments);

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
              isDisabled={isProcessingPayments}
              isSelected={period.id in periodsSelected}
              item={period}
              details={periodsDetails[period.id]}
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
