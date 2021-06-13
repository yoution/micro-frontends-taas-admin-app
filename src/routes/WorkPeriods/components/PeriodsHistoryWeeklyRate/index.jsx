/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import PT from "prop-types";
import cn from "classnames";
import ChallengePopup from "../PaymentsPopup";
import compStyles from "./styles.module.scss";
import { useClickOutside } from "utils/hooks";

const PeriodsHistoryWeeklyRate = ({ className, payments, weeklyRate }) => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const containerRef = useRef();

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    modifiers: [
      { name: "arrow", options: { element: arrowElement, padding: 10 } },
      { name: "offset", options: { offset: [0, 5] } },
      { name: "preventOverflow", options: { padding: 15 } },
    ],
  });

  const onWeeklyRateClick = useCallback(() => {
    setIsShowPopup(negate);
  }, []);

  const onClickOutside = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  useClickOutside(containerRef, onClickOutside, []);

  const hasPayments = !!payments && !!payments.length;

  return (
    <div className={cn(compStyles.container, className)} ref={containerRef}>
      <span
        className={cn(compStyles.weeklyRateValue, {
          [compStyles.hasPayments]: hasPayments,
        })}
        ref={setReferenceElement}
        onClick={onWeeklyRateClick}
      >
        {weeklyRate}
      </span>
      {hasPayments && isShowPopup && (
        <div
          className={compStyles.popup}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <ChallengePopup payments={payments} />
          <div
            className="dropdown-arrow"
            ref={setArrowElement}
            style={styles.arrow}
          />
        </div>
      )}
    </div>
  );
};

PeriodsHistoryWeeklyRate.propTypes = {
  className: PT.string,
  payments: PT.array,
  weeklyRate: PT.string.isRequired,
};

function negate(value) {
  return !value;
}

export default PeriodsHistoryWeeklyRate;
