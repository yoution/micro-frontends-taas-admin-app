import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IntegerField from "components/IntegerField";
import IconCheckmarkCircled from "components/Icons/CheckmarkCircled";
import styles from "./styles.module.scss";

/**
 * Displays working days input field with an icon hinting about the update.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {string} props.controlName working days input control name
 * @param {Object} props.data working period data object
 * @param {boolean} props.isDisabled whether the input field should be disabled
 * @param {(v: number) => void} props.onWorkingDaysChange function called when
 * working days change
 * @param {() => void} props.onWorkingDaysUpdateHintTimeout function called when
 * update hint icon has finished its animation
 * @param {number} [props.updateHintTimeout] timeout in milliseconds for update
 * hint icon
 * @returns {JSX.Element}
 */
const PeriodWorkingDays = ({
  className,
  controlName,
  data,
  isDisabled,
  onWorkingDaysChange,
  onWorkingDaysUpdateHintTimeout,
  updateHintTimeout = 2000,
}) => (
  <div className={cn(styles.container, className)}>
    <span className={styles.iconPlaceholder}>
      {data.daysWorkedIsUpdated && (
        <IconCheckmarkCircled
          className={styles.checkmarkIcon}
          onTimeout={onWorkingDaysUpdateHintTimeout}
          timeout={updateHintTimeout}
        />
      )}
    </span>
    <IntegerField
      className={styles.daysWorkedControl}
      isDisabled={isDisabled}
      name={controlName}
      onChange={onWorkingDaysChange}
      maxValue={5}
      minValue={data.daysPaid}
      value={data.daysWorked}
    />
  </div>
);

PeriodWorkingDays.propTypes = {
  className: PT.string,
  controlName: PT.string.isRequired,
  data: PT.shape({
    daysPaid: PT.number.isRequired,
    daysWorked: PT.number.isRequired,
    daysWorkedIsUpdated: PT.bool.isRequired,
  }).isRequired,
  isDisabled: PT.bool.isRequired,
  onWorkingDaysChange: PT.func.isRequired,
  onWorkingDaysUpdateHintTimeout: PT.func.isRequired,
  updateHintTimeout: PT.number,
};

export default PeriodWorkingDays;
