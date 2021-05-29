import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import styles from "./styles.module.scss";

/**
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @returns {JSX.Element}
 */
const ArrowLeft = ({ className }) => (
  <IconWrapper className={cn(styles.arrow, className)}>{jsx}</IconWrapper>
);

ArrowLeft.propTypes = {
  className: PT.string,
};

export default ArrowLeft;

// This JSX will never change so it's alright to create it only once.
const jsx = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 8 12"
    enableBackground="new 0 0 8 12"
    xmlSpace="preserve"
  >
    <polygon
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#137D60"
      points="6.325,11.775 7.45,10.725 2.725,6
	7.45,1.275 6.325,0.225 0.55,6 "
    />
  </svg>
);
