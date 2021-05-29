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
const Freelancers = ({ className, isActive = false }) => (
  <IconWrapper
    className={cn(styles.container, className, { [styles.isActive]: isActive })}
  >
    {jsx}
  </IconWrapper>
);

Freelancers.propTypes = {
  className: PT.string,
  isActive: PT.bool,
};

export default Freelancers;

// This JSX will never change so it's alright to create it only once.
const jsx = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 24 24"
    enableBackground="new 0 0 24 24"
    xmlSpace="preserve"
  >
    <path
      fill="#555555"
      d="M4.5,9c-1.6569,0-3-1.3431-3-3s1.3431-3,3-3s3,1.3431,3,3c0,0.7956-0.3161,1.5587-0.8787,2.1213
	C6.0587,8.6839,5.2956,9,4.5,9z M4.5,4.5C3.6716,4.5,3,5.1716,3,6s0.6716,1.5,1.5,1.5S6,6.8284,6,6S5.3284,4.5,4.5,4.5z"
    />
    <path
      fill="#555555"
      d="M3,22.5c-0.378-0.0006-0.6967-0.282-0.744-0.657L1.588,16.5H0.75C0.3358,16.5,0,16.1642,0,15.75
	V13.5C0.0028,11.0159,2.0159,9.0028,4.5,9c0.4142,0,0.75,0.3358,0.75,0.75S4.9142,10.5,4.5,10.5c-1.6569,0-3,1.3431-3,3V15h0.75
	c0.378,0.0006,0.6967,0.282,0.744,0.657L3.662,21H6c0.4142,0,0.75,0.3358,0.75,0.75S6.4142,22.5,6,22.5H3z"
    />
    <path
      fill="#555555"
      d="M19.5,9c-1.6569,0-3-1.3431-3-3s1.3431-3,3-3s3,1.3431,3,3
	c0,0.7956-0.3161,1.5587-0.8787,2.1213C21.0587,8.6839,20.2956,9,19.5,9z M19.5,4.5C18.6716,4.5,18,5.1716,18,6s0.6716,1.5,1.5,1.5
	S21,6.8284,21,6S20.3284,4.5,19.5,4.5z"
    />
    <path
      fill="#555555"
      d="M18,22.5c-0.4142,0-0.75-0.3358-0.75-0.75S17.5858,21,18,21h2.338l0.668-5.343
	c0.0473-0.375,0.366-0.6564,0.744-0.657h0.75v-1.5c0-1.6569-1.3431-3-3-3c-0.4142,0-0.75-0.3358-0.75-0.75S19.0858,9,19.5,9
	c2.4841,0.0028,4.4972,2.0159,4.5,4.5v2.25c0,0.4142-0.3358,0.75-0.75,0.75h-0.838l-0.668,5.343
	C21.6967,22.218,21.378,22.4994,21,22.5H18z"
    />
    <path
      fill="#555555"
      d="M12,7.5c-2.0711,0-3.75-1.6789-3.75-3.75S9.9289,0,12,0s3.75,1.6789,3.75,3.75
	C15.7478,5.8202,14.0702,7.4978,12,7.5L12,7.5z M12,1.5c-1.2426,0-2.25,1.0074-2.25,2.25S10.7574,6,12,6s2.25-1.0074,2.25-2.25
	C14.2489,2.5078,13.2422,1.5011,12,1.5L12,1.5z"
    />
    <path
      fill="#555555"
      d="M9.75,24C9.3629,24.0034,9.0373,23.7104,9,23.325L8.321,16.5H6.75
	C6.3358,16.5,6,16.1642,6,15.75V13.5c0-3.3137,2.6863-6,6-6s6,2.6863,6,6v2.25c0,0.4142-0.3358,0.75-0.75,0.75h-1.571L15,23.325
	c-0.0373,0.3854-0.3629,0.6784-0.75,0.675H9.75z M13.571,22.5l0.683-6.825C14.2912,15.2912,14.6144,14.9987,15,15h1.5v-1.5
	c0-2.4853-2.0147-4.5-4.5-4.5s-4.5,2.0147-4.5,4.5V15H9c0.3856-0.0013,0.7088,0.2912,0.746,0.675l0.682,6.825H13.571z"
    />
  </svg>
);