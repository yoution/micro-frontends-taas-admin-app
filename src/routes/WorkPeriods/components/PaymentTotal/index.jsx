/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useRef, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import Popup from "components/Popup";
import PaymentsList from "../PaymentsList";
import { useClickOutside } from "utils/hooks";
import { currencyFormatter } from "utils/formatters";
import { negate, stopPropagation } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays the total paid sum and a popup with payments' list.
 *
 * @param {Object} props component properties
 * @param {string}  [props.className] class name to be added to root element
 * @param {Array} [props.payments] an array with payments information
 * @param {number} props.paymentTotal total paid sum
 * @param {number} props.daysPaid number of paid days
 * @returns {JSX.Element}
 */
const PaymentTotal = ({ className, payments, paymentTotal, daysPaid }) => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [refElem, setRefElem] = useState(null);
  const containerRef = useRef(null);

  const onWeeklyRateClick = useCallback(() => {
    setIsShowPopup(negate);
  }, []);

  const onClickOutside = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  const hasPayments = !!payments && !!payments.length;

  useClickOutside(containerRef, onClickOutside, []);

  return (
    <div
      className={cn(styles.container, className)}
      ref={containerRef}
      onClick={hasPayments ? stopPropagation : null}
    >
      <span
        className={cn(styles.paymentTotal, {
          [styles.hasPayments]: hasPayments,
        })}
        onClick={onWeeklyRateClick}
        ref={setRefElem}
      >
        <span className={styles.paymentTotalSum}>
          {currencyFormatter.format(paymentTotal)}
        </span>
        &nbsp;
        <span className={styles.daysPaid}>({daysPaid})</span>
      </span>
      {hasPayments && isShowPopup && (
        <Popup referenceElement={refElem}>
          <PaymentsList payments={payments} />
        </Popup>
      )}
    </div>
  );
};

PaymentTotal.propTypes = {
  className: PT.string,
  payments: PT.array,
  paymentTotal: PT.number.isRequired,
  daysPaid: PT.number.isRequired,
};

export default PaymentTotal;
