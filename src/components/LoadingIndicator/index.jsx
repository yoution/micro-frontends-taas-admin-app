/**
 * LoadingIndicator
 *
 * Optionally shows error.
 */
import React from "react";
import get from "lodash/get";
import PT from "prop-types";
import styles from "./styles.module.scss";

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
