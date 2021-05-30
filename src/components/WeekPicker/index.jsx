import React, { forwardRef, useCallback, useRef, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import DatePicker from "react-datepicker";
import Button from "components/Button";
import IconArrowLeft from "components/Icons/ArrowLeft";
import IconArrowRight from "components/Icons/ArrowRight";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.scss";

/**
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {Object} props.startDate
 * @param {Object} props.endDate
 * @param {() => void} props.onWeekSelect
 * @param {() => void} props.onNextWeekSelect
 * @param {() => void} props.onPreviousWeekSelect
 * @returns {JSX.Element}
 */
const WeekPicker = ({
  className,
  startDate,
  endDate,
  onWeekSelect,
  onNextWeekSelect,
  onPreviousWeekSelect,
}) => {
  const onDateChange = useCallback((date) => {
    onWeekSelect(date);
  }, []);

  const onBtnPrevClick = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      onPreviousWeekSelect();
    },
    [onPreviousWeekSelect]
  );

  const onBtnNextClick = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      onNextWeekSelect();
    },
    [onNextWeekSelect]
  );

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      ref={ref}
      className={styles.customInput}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      <Button
        color="primary-dark"
        size="small"
        style="circle"
        onClick={onBtnPrevClick}
      >
        <IconArrowLeft />
      </Button>
      <span className={styles.dateRange}>
        {formatDateRange(startDate, endDate)}
      </span>
      <Button
        color="primary-dark"
        size="small"
        style="circle"
        onClick={onBtnNextClick}
      >
        <IconArrowRight />
      </Button>
    </div>
  ));

  return (
    <div className={cn(styles.container, className)}>
      <DatePicker
        selected={new Date()}
        startDate={startDate.toDate()}
        endDate={endDate.toDate()}
        onChange={onDateChange}
        showMonthDropdown
        showYearDropdown
        formatWeekDay={formatWeekDay}
        customInput={<CustomInput />}
        popperPlacement="top-center"
      />
    </div>
  );
};

WeekPicker.propTypes = {
  className: PT.string,
  startDate: PT.object.isRequired,
  endDate: PT.object.isRequired,
  onWeekSelect: PT.func.isRequired,
  onNextWeekSelect: PT.func.isRequired,
  onPreviousWeekSelect: PT.func.isRequired,
};

const DATE_FORMAT = "MM/DD";

function formatDateRange(startDate, endDate) {
  return `${startDate.format(DATE_FORMAT)} - ${endDate.format(DATE_FORMAT)}`;
}

function formatWeekDay(dayName) {
  return dayName.slice(0, 3);
}

export default WeekPicker;
