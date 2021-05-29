import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "components/Pagination";
import { getWorkPeriodsPagination } from "store/selectors/workPeriods";
import {
  setWorkPeriodsPageNumber,
  setWorkPeriodsPageSize,
} from "store/actions/workPeriods";
import { loadWorkPeriodsPage } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import styles from "./styles.module.scss";

/**
 * Displays working periods' pagination and a menu to choose page size.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} props.id unique pagination id
 * @returns {JSX.Element}
 */
const PeriodsPagination = ({ className, id }) => {
  const pagination = useSelector(getWorkPeriodsPagination);
  const dispatch = useDispatch();

  const onPageNumberClick = useCallback(
    (pageNumber) => {
      dispatch(setWorkPeriodsPageNumber(+pageNumber));
    },
    [dispatch]
  );

  const onPageSizeChange = useCallback(
    (pageSize) => {
      dispatch(setWorkPeriodsPageSize(+pageSize));
    },
    [dispatch]
  );

  const loadWorkPeriodsFirstPage = useCallback(() => {
    dispatch(loadWorkPeriodsPage(1));
  }, [dispatch]);

  const loadWorkPeriodsNewPage = useCallback(() => {
    dispatch(loadWorkPeriodsPage());
  }, [dispatch]);

  // Load working periods' first page if page size changes.
  useUpdateEffect(loadWorkPeriodsFirstPage, [pagination.pageSize]);

  // Load working periods' new page if page number changes.
  useUpdateEffect(loadWorkPeriodsNewPage, [pagination.pageNumber]);

  return (
    <Pagination
      id={id}
      label={"Records/Page"}
      className={cn(styles.pagination, className)}
      pageSizeClassName={styles.pageSize}
      pagination={pagination}
      onPageNumberClick={onPageNumberClick}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
    />
  );
};

PeriodsPagination.propTypes = {
  className: PT.string,
  id: PT.string.isRequired,
};

export default PeriodsPagination;

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];
