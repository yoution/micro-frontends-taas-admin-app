import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import PT from "prop-types";
import cn from "classnames";
import SidebarSection from "components/SidebarSection";
import Button from "components/Button";
import CheckboxList from "components/CheckboxList";
import { PAYMENT_STATUS } from "constants/workPeriods";
import { getWorkPeriodsFilters } from "store/selectors/workPeriods";
import {
  resetWorkPeriodsFilters,
  setWorkPeriodsPaymentStatuses,
  setWorkPeriodsUserHandle,
} from "store/actions/workPeriods";
import { loadWorkPeriodsPage as loadWorkingPeriodsPage } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import styles from "./styles.module.scss";
import SearchField from "components/SearchField";

/**
 * Displays challenges' and gigs' menu and challenge filters.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] optional class name added to root element
 * @returns {JSX.Element}
 */
const Filters = ({ className }) => {
  const dispatch = useDispatch();
  const filters = useSelector(getWorkPeriodsFilters);
  const { paymentStatuses, userHandle } = filters;

  const onUserHandleChange = useCallback((value) => {
    dispatch(setWorkPeriodsUserHandle(value));
  }, []);

  const onPaymentStatusesChange = useCallback((statuses) => {
    dispatch(setWorkPeriodsPaymentStatuses(statuses));
  }, []);

  const onClearFilter = useCallback(() => {
    dispatch(resetWorkPeriodsFilters());
  }, []);

  const loadWorkingPeriodsFirstPage = useCallback(
    debounce(
      () => {
        dispatch(loadWorkingPeriodsPage(1));
      },
      200,
      { leading: false }
    ),
    []
  );

  // Load challenges' first page when any filter option changes.
  useUpdateEffect(loadWorkingPeriodsFirstPage, [filters]);

  return (
    <form className={styles.container} action="#">
      <div className={styles.handleSection}>
        <SearchField
          id="topcoder-handle"
          name="topcoder_handle"
          placeholder="Search Topcoder Handle"
          onChange={onUserHandleChange}
          value={userHandle}
        />
      </div>
      <SidebarSection label="Payment Status">
        <CheckboxList
          name="payment_status[]"
          onChange={onPaymentStatusesChange}
          options={PAYMENT_STATUS_OPTIONS}
          value={paymentStatuses}
        />
      </SidebarSection>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          size="small"
          color="primary-dark"
          onClick={onClearFilter}
        >
          Clear Filter
        </Button>
      </div>
    </form>
  );
};

Filters.propTypes = {
  className: PT.string,
};

const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUS.PENDING, label: "Pending" },
  { value: PAYMENT_STATUS.PAID, label: "Paid" },
  { value: PAYMENT_STATUS.IN_PROGRESS, label: "In Progress" },
];

export default Filters;
