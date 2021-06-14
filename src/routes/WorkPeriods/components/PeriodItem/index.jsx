import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import Checkbox from "components/Checkbox";
import IntegerField from "components/IntegerField";
import PaymentStatus from "../PaymentStatus";
import PeriodDetails from "../PeriodDetails";
import {
  setWorkPeriodWorkingDays,
  toggleWorkPeriod,
} from "store/actions/workPeriods";
import {
  toggleWorkPeriodDetails,
  updateWorkPeriodWorkingDays,
} from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { formatUserHandleLink, formatWeeklyRate } from "utils/formatters";
import styles from "./styles.module.scss";

/**
 * @param {(v: string) => void} props.onToggle function called when working period checkbox is clicked
 * @param {(id: object) => void} props.onToggleDetails function called when item row is clicked
 * @param {(v: { periodId: string, workingDays: number }) => void} props.onWorkingDaysChange
 * function called when the number of working days is changed
 */

/**
 * Displays the working period data row to be used in PeriodList component.
 *
 * @param {Object} props component properties
 * @param {boolean} [props.isDisabled] whether the item is disabled
 * @param {boolean} props.isSelected whether the item is selected
 * @param {Object} props.item object describing a working period
 * @param {Object} [props.details] object with working period details
 * @returns {JSX.Element}
 */
const PeriodItem = ({ isDisabled = false, isSelected, item, details }) => {
  const dispatch = useDispatch();

  const onToggleItem = useCallback(
    (event) => {
      dispatch(toggleWorkPeriod(event.target.value));
    },
    [dispatch]
  );

  const onToggleItemDetails = useCallback(() => {
    dispatch(toggleWorkPeriodDetails(item));
  }, [dispatch, item]);

  const onWorkingDaysChange = useCallback(
    (workingDays) => {
      dispatch(setWorkPeriodWorkingDays({ periodId: item.id, workingDays }));
    },
    [dispatch, item.id]
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
    <>
      <tr
        className={cn(styles.container, { [styles.hasDetails]: !!details })}
        onClick={onToggleItemDetails}
      >
        <td className={styles.toggle}>
          <Checkbox
            size="small"
            isDisabled={isDisabled}
            checked={isSelected}
            name={`wp_chb_${item.id}`}
            onChange={onToggleItem}
            option={{ value: item.id }}
            stopClickPropagation={true}
          />
        </td>
        <td className={styles.userHandle}>
          <span>
            <a
              href={formatUserHandleLink(item.projectId, item.rbId)}
              onClick={stopPropagation}
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
            isDisabled={isDisabled}
            name={`wp_wrk_days_${item.id}`}
            onChange={onWorkingDaysChange}
            maxValue={5}
            minValue={0}
            value={item.workingDays}
          />
        </td>
      </tr>
      {details && <PeriodDetails details={details} isDisabled={isDisabled} />}
    </>
  );
};

PeriodItem.propTypes = {
  className: PT.string,
  isDisabled: PT.bool,
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
  details: PT.shape({
    periodId: PT.string.isRequired,
    rbId: PT.string.isRequired,
    jobName: PT.string.isRequired,
    jobNameIsLoading: PT.bool.isRequired,
    billingAccountId: PT.number.isRequired,
    billingAccounts: PT.arrayOf(
      PT.shape({
        value: PT.string.isRequired,
        label: PT.string.isRequired,
      })
    ),
    billingAccountsIsLoading: PT.bool.isRequired,
    periods: PT.arrayOf(
      PT.shape({
        id: PT.string.isRequired,
      })
    ),
    periodsIsLoading: PT.bool.isRequired,
  }),
  // onToggle: PT.func.isRequired,
  // onToggleDetails: PT.func.isRequired,
  // onWorkingDaysChange: PT.func.isRequired,
};

function stopPropagation(event) {
  event.stopPropagation();
}

export default memo(PeriodItem);
