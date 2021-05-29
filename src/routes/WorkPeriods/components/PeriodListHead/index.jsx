import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import Checkbox from "components/Checkbox";
import SortingControl from "components/SortingControl";
import { SORT_BY } from "constants/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import {
  getWorkPeriodsIsSelectedVisible,
  getWorkPeriodsSorting,
} from "store/selectors/workPeriods";
import {
  setWorkPeriodsSorting,
  toggleWorkingPeriodsVisible,
} from "store/actions/workPeriods";
import { loadWorkPeriodsPage } from "store/thunks/workPeriods";
import styles from "./styles.module.scss";

const PeriodListHead = () => {
  const sorting = useSelector(getWorkPeriodsSorting);
  const isSelectedVisible = useSelector(getWorkPeriodsIsSelectedVisible);
  const dispatch = useDispatch();
  const { criteria, order } = sorting;

  const onSortingChange = useCallback((sorting) => {
    dispatch(setWorkPeriodsSorting(sorting));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleVisible = useCallback(() => {
    dispatch(toggleWorkingPeriodsVisible());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <tr className={styles.container}>
      <th>
        <div className={styles.colHead}>
          <Checkbox
            size="small"
            name={"visible_periods_selected"}
            onChange={onToggleVisible}
            checked={isSelectedVisible}
          />
        </div>
      </th>
      {HEAD_CELLS.map(({ id, label, disableSort }) => (
        <th key={id}>
          <div className={cn(styles.colHead)}>
            <span className={styles.colLabel}>{label}</span>
            {!disableSort && (
              <SortingControl
                className={styles.sortControl}
                onChange={onSortingChange}
                sortBy={id}
                value={criteria === id ? order : null}
              />
            )}
          </div>
        </th>
      ))}
    </tr>
  );
};

const HEAD_CELLS = [
  { label: "Topcoder Handle", id: SORT_BY.USER_HANDLE },
  { label: "Team Name", id: SORT_BY.TEAM_NAME, disableSort: true },
  { label: "Start Date", id: SORT_BY.START_DATE },
  { label: "End Date", id: SORT_BY.END_DATE },
  { label: "Weekly Rate", id: SORT_BY.WEEKLY_RATE },
  { label: "Status", id: SORT_BY.PAYMENT_STATUS },
  { label: "Working Days", id: SORT_BY.WORKING_DAYS },
];

export default PeriodListHead;
