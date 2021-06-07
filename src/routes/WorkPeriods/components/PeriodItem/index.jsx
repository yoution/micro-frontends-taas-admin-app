import React, { memo, useCallback } from "react";
import PT from "prop-types";
import Checkbox from "components/Checkbox";
import IntegerField from "components/IntegerField";
import PaymentStatus from "../PaymentStatus";
import { formatUserHandleLink, formatWeeklyRate } from "utils/formatters";
import styles from "./styles.module.scss";

/**
 * Displays the working period data row to be used in PeriodList component.
 *
 * @param {Object} props component properties
 * @param {boolean} props.isSelected whether the item is selected
 * @param {Object} props.item object describing a working period
 * @param {(v: string) => void} props.onToggle function called when working period checkbox is clicked
 * @param {(v: { periodId: string, workingDays: number }) => void} props.onWorkingDaysChange
 * function called when the number of working days is changed
 * @returns {JSX.Element}
 */
const PeriodItem = ({ isSelected, item, onToggleExpandRow, onToggle, onWorkingDaysChange }) => {
  const onToggleItem = useCallback(
    (event) => {
      onToggle(event.target.value);
    },
    [onToggle]
  );
  const onDaysChange = useCallback(
    (workingDays) => {
      onWorkingDaysChange({ periodId: item.id, workingDays });
    },
    [item, onWorkingDaysChange]
  );
  return (
    <>
      <tr className={styles.container} onClick={()=> {onToggleExpandRow(item)}}>
        <td className={styles.toggle}>
          <Checkbox
            size="small"
            checked={isSelected}
            name={`res_chb_${item.id}`}
            onChange={onToggleItem}
            option={{ value: item.id }}
          />
        </td>
        <td className={styles.userHandle}>
          <span>
            <a
              href={formatUserHandleLink(item.projectId, item.rbId)}
              target="_blank"
              rel="noreferrer"
            >
              {item.userHandle}
            </a>
          </span>
        </td>
        <td className={styles.teamName}>{item.projectId}</td>
        <td className={styles.startDate}>{item.startDate}</td>
        <td className={styles.endDate}>{item.endDate}</td>
        <td className={styles.weeklyRate}>
          <span>{formatWeeklyRate(item.weeklyRate)}</span>
        </td>
        <td>
          <PaymentStatus status={item.paymentStatus} />
        </td>
        <td className={styles.workingDays}>
          <IntegerField
            className={styles.workingDaysControl}
            name={`res_wrk_days_${item.id}`}
            onChange={onDaysChange}
            maxValue={7}
            minValue={0}
            value={item.workingDays}
          />
        </td>
      </tr>
      {item.isExpand ? (
          <tr className={styles.container}>
                  <td>a</td>
                  <td>b</td>
                  <td colSpan="6">
                    <table width="100%">
                      <thead>
                        <td>1</td>
                        <td>2d</td>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                        <td>d</td>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>2d</td>
                          <td>d</td>
                          <td>d</td>
                          <td>d</td>
                          <td>d</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>2d</td>
                          <td>d</td>
                          <td>d</td>
                          <td>d</td>
                          <td>d</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
      ): null}
    </>
  );
};

PeriodItem.propTypes = {
  className: PT.string,
  isSelected: PT.bool.isRequired,
  item: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    rbId: PT.string.isRequired,
    projectId: PT.oneOfType([PT.number, PT.string]).isRequired,
    userHandle: PT.string.isRequired,
    teamName: PT.oneOfType([PT.number, PT.string]).isRequired,
    startDate: PT.string.isRequired,
    endDate: PT.string.isRequired,
    weeklyRate: PT.number,
    paymentStatus: PT.string.isRequired,
    workingDays: PT.number.isRequired,
  }),
  onToggle: PT.func.isRequired,
  onToggleExpandRow: PT.func.isRequired,
  onWorkingDaysChange: PT.func.isRequired,
};

export default memo(PeriodItem);
