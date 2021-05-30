import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import styles from "./styles.module.scss";

/**
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {boolean} [props.isActive] a flag indicating whether the icon is active
 * @returns {JSX.Element}
 */
const WorkPeriods = ({ className, isActive = false }) => (
  <IconWrapper
    className={cn(styles.container, className, { [styles.isActive]: isActive })}
  >
    {jsx}
  </IconWrapper>
);

WorkPeriods.propTypes = {
  className: PT.string,
  isActive: PT.bool,
};

export default WorkPeriods;

// This JSX will never change so it's alright to create it only once.
const jsx = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 20 22"
    enableBackground="new 0 0 20 22"
    xmlSpace="preserve"
  >
    <path
      fill="none"
      stroke="#06D6A0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4,3.6111
	h12.2222c1.2887,0,2.3333,1.0447,2.3333,2.3333v12.2222c0,1.2887-1.0447,2.3333-2.3333,2.3333H4
	c-1.2887,0-2.3333-1.0447-2.3333-2.3333V5.9444C1.6667,4.6558,2.7113,3.6111,4,3.6111z"
    />
    <line
      fill="none"
      stroke="#06D6A0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      x1="14.3333"
      y1="1.5"
      x2="14.3333"
      y2="5.7222"
    />
    <line
      fill="none"
      stroke="#06D6A0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      x1="5.8889"
      y1="1.5"
      x2="5.8889"
      y2="5.7222"
    />
    <line
      fill="none"
      stroke="#06D6A0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      x1="1.6667"
      y1="9.9444"
      x2="18.5556"
      y2="9.9444"
    />
    <line
      fill="none"
      stroke="#06D6A0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      x1="8"
      y1="15.2222"
      x2="12.2222"
      y2="15.2222"
    />
  </svg>
);
