import React from "react";
import get from "lodash/get";
import PT from "prop-types";
import styles from "./styles.module.scss";

/**
 * Displays "Loading..." message or an error.
 *
 * @param {Object} props component properties
 * @param {Object} [props.error] error object
 * @returns {JSX.Element}
 */
const LoadingIndicator = ({ error }) => (
  <div className={styles.loadingIndicator}>
    {!error
      ? "Loading..."
      : get(error, "response.data.message", error.toString())}
  </div>
);

LoadingIndicator.propTypes = {
  error: PT.object,
};

export default LoadingIndicator;
