import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";
import styles from "./styles.module.scss";

/**
 * Displays a toastr message with info about the number of resources for which
 * payments have been scheduled or failed to schedule.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ToastPaymentsWarning = ({ periodsSucceeded, periodsFailed, remove }) => {
  return (
    <ToastMessage type="warning" remove={remove}>
      Payment scheduled for {periodsSucceeded.length} resources
      <br />
      <div className={styles.periodsSucceeded}>
        {periodsSucceeded.map((period) => (
          <div key={period.workPeriodId} className={styles.periodSucceeded}>
            {period.workPeriodId}
          </div>
        ))}
      </div>
      Failed to schedule payment for {periodsFailed.length} resources:
      <br />
      <div className={styles.periodsFailed}>
        {periodsFailed.map((period) => (
          <div key={period.workPeriodId} className={styles.periodFailed}>
            {period.workPeriodId}: ({period.error.code}) {period.error.message}
          </div>
        ))}
      </div>
    </ToastMessage>
  );
};

ToastPaymentsWarning.propTypes = {
  periodsSucceeded: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number.isRequired,
    })
  ),
  periodsFailed: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number.isRequired,
      error: PT.shape({
        message: PT.string.isRequired,
        code: PT.number.isRequired,
      }),
    })
  ),
  remove: PT.func,
};

export default ToastPaymentsWarning;
