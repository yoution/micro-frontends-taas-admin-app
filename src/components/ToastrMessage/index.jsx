import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays toastr message.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const ToastrMessage = ({
  children,
  className,
  message,
  remove,
  type = "info",
}) => {
  return (
    <div className={cn(styles.container, styles[type], className)}>
      {message && <span className={styles.message}>{message}</span>}
      {children}
      <button
        type="button"
        className={styles.btnClose}
        onClick={remove}
      ></button>
    </div>
  );
};

ToastrMessage.propTypes = {
  children: PT.node,
  className: PT.string,
  message: PT.string,
  remove: PT.func,
  type: PT.oneOf(["info", "success", "warning", "error"]),
};

export default ToastrMessage;
