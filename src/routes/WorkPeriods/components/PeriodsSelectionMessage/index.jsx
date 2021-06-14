import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import {
  getWorkPeriodsIsSelectedAll,
  getWorkPeriodsIsSelectedVisible,
  getWorkPeriodsPageSize,
  getWorkPeriodsTotalCount,
} from "store/selectors/workPeriods";
import { toggleWorkingPeriodsAll } from "store/actions/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays messages about the number of selected periods and selection controls.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodsSelectionMessage = ({ className }) => {
  const isSelectedAll = useSelector(getWorkPeriodsIsSelectedAll);
  const isSelectedVisible = useSelector(getWorkPeriodsIsSelectedVisible);
  const pageSize = useSelector(getWorkPeriodsPageSize);
  const totalCount = useSelector(getWorkPeriodsTotalCount);
  const dispatch = useDispatch();

  const onBtnClick = useCallback(() => {
    dispatch(toggleWorkingPeriodsAll());
  }, [dispatch]);

  const infoText = isSelectedAll
    ? `All ${totalCount} Records are selected. `
    : `All ${pageSize} Records on this page are selected. `;
  const btnText = isSelectedAll
    ? "Deselect"
    : `Select all ${totalCount} Records`;

  return (
    <div className={cn(styles.container, className)}>
      {isSelectedVisible && (
        <span className={styles.message}>
          {infoText}
          <span
            className={styles.button}
            onClick={onBtnClick}
            role="button"
            tabIndex={0}
          >
            {btnText}
          </span>
        </span>
      )}
    </div>
  );
};

PeriodsSelectionMessage.propTypes = {
  className: PT.string,
};

export default PeriodsSelectionMessage;
