import React from "react";
import PT from "prop-types";
import cn from "classnames";
import ReduxToastr from "react-redux-toastr";
import styles from "./styles.module.scss";

/**
 * Used for laying out appliction's page.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.children component children
 * @returns {Object}
 */
const Page = ({ className, children }) => (
  <div className={cn(styles.container, className)}>
    {children}
    <ReduxToastr
      timeOut={60000}
      position="top-right"
      transitionIn="fadeIn"
      transitionOut="fadeOut"
    />
  </div>
);

Page.propTypes = {
  className: PT.string,
  children: PT.node,
};

export default Page;
