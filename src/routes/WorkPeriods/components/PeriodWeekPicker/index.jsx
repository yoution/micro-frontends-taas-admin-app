import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import moment from "moment";
import WeekPicker from "components/WeekPicker";
import { getWorkPeriodsDateRange } from "store/selectors/workPeriods";
import styles from "./styles.module.scss";
import { setWorkPeriodsDateRange } from "store/actions/workPeriods";

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

export default PeriodWeekPicker;
