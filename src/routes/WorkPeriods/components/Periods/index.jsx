import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ContentMessage from "components/ContentMessage";
import PeriodList from "../PeriodList";
import {
  getWorkPeriodsError,
  getWorkPeriodsIsLoading,
  getWorkPeriodsSorting,
  getWorkPeriodsTotalCount,
} from "store/selectors/workPeriods";
import { loadWorkPeriodsPage } from "store/thunks/workPeriods";

const Periods = () => {
  const sorting = useSelector(getWorkPeriodsSorting);
  const count = useSelector(getWorkPeriodsTotalCount);
  const error = useSelector(getWorkPeriodsError);
  const isLoading = useSelector(getWorkPeriodsIsLoading);
  const dispatch = useDispatch();

  // Load working periods' first page once when page loads and then
  // only if sorting changes.
  useEffect(() => {
    dispatch(loadWorkPeriodsPage(1));
  }, [sorting]);

  return (
    <>
      {!error && <PeriodList />}
      {isLoading && <ContentMessage>Loading...</ContentMessage>}
      {!isLoading && error && (
        <ContentMessage type="error">{error}</ContentMessage>
      )}
      {!isLoading && !error && !count && (
        <ContentMessage>No resource bookings found.</ContentMessage>
      )}
    </>
  );
};

export default Periods;
