import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PT from "prop-types";
import moment from "moment";
import WeekPicker from "components/WeekPicker";
import { getWorkPeriodsDateRange } from "store/selectors/workPeriods";
import { setWorkPeriodsDateRange } from "store/actions/workPeriods";

/**
 * Displays working periods' week picker.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodWeekPicker = ({ className }) => {
  const [startDate, endDate] = useSelector(getWorkPeriodsDateRange);
  const dispatch = useDispatch();

  const onWeekSelect = useCallback(
    (date) => {
      dispatch(setWorkPeriodsDateRange(moment(date)));
    },
    [dispatch]
  );

  const onNextWeekSelect = useCallback(() => {
    dispatch(setWorkPeriodsDateRange(startDate.clone().add(1, "week")));
  }, [startDate, dispatch]);

  const onPreviousWeekSelect = useCallback(() => {
    dispatch(setWorkPeriodsDateRange(startDate.clone().add(-1, "week")));
  }, [startDate, dispatch]);

  return (
    <WeekPicker
      className={className}
      startDate={startDate}
      endDate={endDate}
      onWeekSelect={onWeekSelect}
      onNextWeekSelect={onNextWeekSelect}
      onPreviousWeekSelect={onPreviousWeekSelect}
    />
  );
};

PeriodWeekPicker.propTypes = {
  className: PT.string,
};

export default PeriodWeekPicker;
