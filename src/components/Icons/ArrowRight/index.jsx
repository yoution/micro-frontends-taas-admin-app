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
const ArrowRight = ({ className }) => (
  <IconWrapper className={cn(styles.arrow, className)}>{jsx}</IconWrapper>
);

ArrowRight.propTypes = {
  className: PT.string,
};

export default ArrowRight;

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
      points="1.675,11.775 0.55,10.725 5.275,6
	0.55,1.275 1.675,0.225 7.45,6 "
    />
  </svg>
);
