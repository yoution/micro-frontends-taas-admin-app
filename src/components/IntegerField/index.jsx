import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays input field for inputing integer numbers with plus and minus buttons.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {string} props.name field's name
 * @param {number} props.value field's value
 * @param {number} [props.maxValue] maximum allowed value
 * @param {number} [props.minValue] minimum allowed value
 * @param {(v: number) => void} props.onChange
 * @returns {JSX.Element}
 */
const IntegerField = ({
  className,
  name,
  onChange,
  value,
  maxValue = Infinity,
  minValue = -Infinity,
}) => (
  <div className={cn(styles.container, className)}>
    <button
      className={styles.btnMinus}
      onClick={() => onChange(Math.max(value - 1, minValue))}
    />
    <button
      className={styles.btnPlus}
      onClick={() => onChange(Math.min(+value + 1, maxValue))}
    />
    <input readOnly className={styles.input} name={name} value={value} />
  </div>
);

IntegerField.propTypes = {
  className: PT.string,
  name: PT.string.isRequired,
  maxValue: PT.number,
  minValue: PT.string,
  onChange: PT.func.isRequired,
  value: PT.number.isRequired,
};

export default IntegerField;
