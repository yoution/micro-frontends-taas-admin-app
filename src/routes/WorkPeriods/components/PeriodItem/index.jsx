import React, { memo, useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import Checkbox from "components/Checkbox";
import IntegerField from "components/IntegerField";
import PaymentStatus from "../PaymentStatus";
import { formatUserHandleLink } from "utils/formatters";
import styles from "./styles.module.scss";

const PeriodItem = ({ isSelected, item, onToggle, onWorkingDaysChange }) => {
  const onToggleItem = useCallback((event) => {
    onToggle(event.target.value);
  }, []);
  const onDaysChange = useCallback(
    (workingDays) => {
      onWorkingDaysChange({ periodId: item.id, workingDays });
    },
    [item]
  );
  return (
    <tr className={styles.container}>
      <td className={styles.toggle}>
        <Checkbox
          size="small"
          checked={isSelected}
          name={`res_chb_${item.id}`}
          onChange={onToggleItem}
          option={{ value: item.id }}
        />
      </td>
      <td className={styles.userHandle}>
        <span>
          <a href={formatUserHandleLink(item.projectId, item.id)}>
            {item.userHandle}
          </a>
        </span>
      </td>
      <td>{item.projectId}</td>
      <td>{item.startDate}</td>
      <td>{item.endDate}</td>
      <td>{currencyFormatter.format(item.weeklyRate)}</td>
      <td>
        <PaymentStatus status={item.paymentStatus} />
      </td>
      <td className={styles.workingDays}>
        <IntegerField
          className={styles.workingDaysControl}
          name={`res_wrk_days_${item.id}`}
          onChange={onDaysChange}
          maxValue={7}
          minValue={0}
          value={item.workingDays}
        />
      </td>
    </tr>
  );
};

PeriodItem.propTypes = {
  className: PT.string,
  isSelected: PT.bool.isRequired,
  item: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    userHandle: PT.string.isRequired,
    teamName: PT.oneOfType([PT.number, PT.string]).isRequired,
    startDate: PT.string.isRequired,
    endDate: PT.string.isRequired,
    weeklyRate: PT.number.isRequired,
    paymentStatus: PT.string.isRequired,
    workingDays: PT.number.isRequired,
  }),
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default memo(PeriodItem);
