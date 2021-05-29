import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import styles from "./styles.module.scss";

/**
 * Displays small down-arrow.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {() => void} props.onClick click handler
 * @param {boolean} props.isActive whether the icon is in active state
 * @param {'up'|'down'} [props.direction] arrow direction
 * @returns {JSX.Element}
 */
const ArrowSmall = ({ className, onClick, isActive, direction = "down" }) => (
  <IconWrapper
    onClick={onClick}
    className={cn(styles.arrow, styles[direction], className, {
      [styles.isActive]: isActive,
    })}
  >
    {jsx}
  </IconWrapper>
);

ArrowSmall.propTypes = {
  className: PT.string,
};

export default ArrowSmall;

const jsx = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 11 7"
    enableBackground="new 0 0 11 7"
    xmlSpace="preserve"
  >
    <polygon
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#FFFFFF"
      points="5.5,6.9 0.1,1.5 1.5,0.1 5.5,4.1 9.5,0.1
	10.9,1.5 "
    />
  </svg>
);
