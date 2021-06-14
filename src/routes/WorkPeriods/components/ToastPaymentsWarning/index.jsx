import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";
import styles from "./styles.module.scss";

/**
 * Displays a toastr message with info about the number of resources for which
 * payments have been scheduled or failed to schedule.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const ToastPaymentsWarning = ({
  resourcesSucceeded,
  resourcesSucceededCount,
  resourcesFailed,
  resourcesFailedCount,
  remove,
}) => {
  return (
    <ToastMessage type="warning" remove={remove}>
      <div className={styles.sectionSucceeded}>
        <div className={styles.sectionTitle}>
          Payment scheduled for {resourcesSucceededCount} resources
        </div>
        {resourcesSucceeded && resourcesSucceeded.length && (
          <div className={styles.periodsSucceeded}>
            {resourcesSucceeded.map((period) => (
              <div key={period.workPeriodId} className={styles.periodSucceeded}>
                {period.workPeriodId}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.sectionFailed}>
        <div className={styles.sectionTitle}>
          Failed to schedule payment for {resourcesFailedCount} resources:
        </div>
        {resourcesFailed && resourcesFailed.length && (
          <div className={styles.periodsFailed}>
            {resourcesFailed.map((period) => (
              <div key={period.workPeriodId} className={styles.periodFailed}>
                {period.workPeriodId} ({period.error.code}):{" "}
                {period.error.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToastMessage>
  );
};

ToastPaymentsWarning.propTypes = {
  resourcesSucceeded: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number,
    })
  ),
  resourcesSucceededCount: PT.number.isRequired,
  resourcesFailed: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number,
      error: PT.shape({
        message: PT.string.isRequired,
        code: PT.number.isRequired,
      }),
    })
  ),
  resourcesFailedCount: PT.number.isRequired,
  remove: PT.func,
};

export default ToastPaymentsWarning;
