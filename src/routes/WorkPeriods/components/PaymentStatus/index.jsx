import React from "react";
import PT from "prop-types";
import cn from "classnames";
import { formatPaymentStatus } from "utils/formatters";
import styles from "./styles.module.scss";

/**
 *
 * @param {Object} props component properties
 * @param {string} [props.className]
 * @param {string} props.status
 * @returns {JSX.Element}
 */
const PaymentStatus = ({ className, status }) => (
  <span
    className={cn(styles.container, styles[status.toLowerCase()], className)}
  >
    {formatPaymentStatus(status)}
  </span>
);

PaymentStatus.propTypes = {
  className: PT.string,
  status: PT.string.isRequired,
};

export default PaymentStatus;
