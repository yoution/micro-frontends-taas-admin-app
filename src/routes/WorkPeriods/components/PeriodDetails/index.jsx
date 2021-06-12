import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import Button from "components/Button";
import Toggle from "components/Toggle";
import SelectField from "components/SelectField";
import PeriodsHistory from "../PeriodsHistory";
import IconComputer from "../../../../assets/images/icon-computer.svg";
import {
  hideWorkPeriodDetails,
  setBillingAccount,
  setDetailsHidePastPeriods,
  setDetailsLockWorkingDays,
} from "store/actions/workPeriods";
import styles from "./styles.module.scss";
import { updateWorkPeriodBillingAccount } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";

/**
 * Displays working period details.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.details working period details object
 * @param {boolean} props.isDisabled whether the details are disabled
 * @param {boolean} props.isFailed whether the payments for the period has failed
 * @returns {JSX.Element}
 */
const PeriodDetails = ({ className, details, isDisabled, isFailed }) => {
  const dispatch = useDispatch();
  const {
    periodId,
    rbId,
    jobName,
    jobNameIsLoading,
    billingAccountId,
    billingAccounts,
    billingAccountsIsLoading,
    periodsVisible,
    periodsIsLoading,
    hidePastPeriods,
    lockWorkingDays,
  } = details;

  const onHideDetailsBtnClick = useCallback(() => {
    dispatch(hideWorkPeriodDetails(periodId));
  }, [dispatch, periodId]);

  const onChangeHidePastPeriods = useCallback(
    (hide) => {
      dispatch(setDetailsHidePastPeriods(periodId, hide));
    },
    [dispatch, periodId]
  );

  const onChangeLockWorkingDays = useCallback(
    (lock) => {
      dispatch(setDetailsLockWorkingDays(periodId, lock));
    },
    [dispatch, periodId]
  );

  const onChangeBillingAccount = useCallback(
    (value) => {
      dispatch(setBillingAccount(periodId, value));
    },
    [dispatch, periodId]
  );

  const updateBillingAccount = useCallback(
    debounce(
      (billingAccountId) => {
        dispatch(updateWorkPeriodBillingAccount(rbId, billingAccountId));
      },
      300,
      { leading: false }
    ),
    [dispatch, rbId]
  );

  useUpdateEffect(() => {
    updateBillingAccount(billingAccountId);
  }, [billingAccountId]);

  const isFailedLoadingJobName = !jobNameIsLoading && jobName === "Error";
  const isFailedLoadingBilAccs =
    !billingAccountsIsLoading &&
    billingAccounts.length === 1 &&
    billingAccounts[0].value === 0;
  const isDisabledBilAccs =
    !billingAccountsIsLoading &&
    billingAccounts.length === 1 &&
    billingAccounts[0].value === -1;

  return (
    <tr
      className={cn(
        styles.container,
        { [styles.isFailed]: isFailed },
        className
      )}
    >
      {periodsIsLoading ? (
        <td colSpan={8}>
          <div className={styles.loadingIndicator}>Loading...</div>
        </td>
      ) : (
        <>
          <td colSpan={3} className={styles.periodInfo}>
            <div className={styles.jobNameSection}>
              <IconComputer className={styles.jobNameIcon} />
              <div className={styles.sectionField}>
                <div className={styles.label}>Job Name</div>
                <div
                  className={cn(styles.jobName, {
                    [styles.jobNameError]: isFailedLoadingJobName,
                  })}
                >
                  {jobNameIsLoading ? "Loading..." : jobName}
                </div>
              </div>
            </div>
            <div className={styles.lockWorkingDaysSection}>
              <div className={styles.sectionLabel}>Lock Working Days</div>
              <Toggle
                size="small"
                className={styles.lockWorkingDaysToggle}
                name={`rb_lck_wd_${periodId}`}
                onChange={onChangeLockWorkingDays}
                isOn={lockWorkingDays}
              />
            </div>
            <div className={styles.billingAccountSection}>
              <div className={styles.sectionLabel}>Billing Account</div>
              <SelectField
                className={
                  isFailedLoadingBilAccs ? styles.billingAccountError : ""
                }
                id={`rb_bil_acc_${periodId}`}
                isDisabled={isDisabledBilAccs}
                size="small"
                onChange={onChangeBillingAccount}
                options={billingAccounts}
                value={billingAccountId}
              />
            </div>
            <div className={styles.detailsControls}>
              <Button size="small" onClick={onHideDetailsBtnClick}>
                Hide Details
              </Button>
            </div>
          </td>
          <td colSpan={5} className={styles.periodHistory}>
            <div className={styles.periodsContainer}>
              <div className={styles.periodsHeader}>
                <span className={styles.periodsHeaderTitle}>History</span>
                <span className={styles.hidePastPeriods}>
                  <label
                    htmlFor={`hide_past_wp_${periodId}`}
                    className={styles.hidePastPeriodsLabel}
                  >
                    Current &amp; Future Only
                  </label>
                  <Toggle
                    className={styles.hidePastPeriodsToggle}
                    name={`hide_past_wp_${periodId}`}
                    onChange={onChangeHidePastPeriods}
                    size="small"
                    isOn={hidePastPeriods}
                  />
                </span>
              </div>
              <PeriodsHistory
                isDisabled={isDisabled}
                periodId={periodId}
                periods={periodsVisible}
              />
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

PeriodDetails.propTypes = {
  className: PT.string,
  details: PT.shape({
    periodId: PT.string.isRequired,
    rbId: PT.string.isRequired,
    jobName: PT.string,
    jobNameIsLoading: PT.bool.isRequired,
    billingAccountId: PT.number.isRequired,
    billingAccounts: PT.arrayOf(
      PT.shape({
        label: PT.string.isRequired,
        value: PT.string.isRequired,
      })
    ),
    billingAccountsIsLoading: PT.bool.isRequired,
    periodsVisible: PT.array.isRequired,
    periodsIsLoading: PT.bool.isRequired,
    hidePastPeriods: PT.bool.isRequired,
    lockWorkingDays: PT.bool.isRequired,
  }).isRequired,
  isDisabled: PT.bool.isRequired,
  isFailed: PT.bool.isRequired,
};

export default memo(PeriodDetails);
