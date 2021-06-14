import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";

/**
 * Displays a toastr message with info about the number of resources payments
 * for which have been scheduled.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ToastPaymentsSuccess = ({ periods, remove }) => {
  return (
    <ToastMessage type="success" remove={remove}>
      Payment scheduled for {periods.length} resources
    </ToastMessage>
  );
};

ToastPaymentsSuccess.propTypes = {
  periods: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number.isRequired,
    })
  ),
  remove: PT.func,
};

export default ToastPaymentsSuccess;
