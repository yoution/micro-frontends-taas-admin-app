import React, { memo } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * This component is used as a wrapper for SVG icons.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name appliet to root element
 * @param {() => void} [props.onClick] click handler
 * @param {JSX.Element} props.children SVG element
 * @returns {JSX.Element}
 */
const IconWrapper = (props) => (
  <span {...props} className={cn(styles.iconWrapper, props.className)} />
);

export default memo(IconWrapper);
