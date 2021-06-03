import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays checkbox with label.
 *
 * @param {Object} props component properties
 * @param {boolean} props.checked whether checkbox is checked
 * @param {string} [props.className] class name added to root element
 * @param {string} props.name name for input element
 * @param {() => void} props.onChange function called when checkbox changes state
 * @param {Object} [props.option] object { value, label }
 * @param {'medium'|'small'} [props.size] checkbox size
 * @returns {JSX.Element}
 */
const Checkbox = ({
  checked,
  className,
  name,
  onChange,
  option,
  size = "medium",
}) => (
  <label
    className={cn(
      styles.container,
      styles[size],
      { [styles.single]: !option || !option.label },
      className
    )}
  >
    <input
      type="checkbox"
      className={styles.checkbox}
      name={name}
      onChange={onChange}
      checked={checked}
      value={option ? option.value : ""}
    />
    <span className={styles.impostor} />
    {option && option.label && (
      <span className={styles.label}>{option.label}</span>
    )}
  </label>
);

Checkbox.propTypes = {
  checked: PT.bool,
  className: PT.string,
  name: PT.string.isRequired,
  size: PT.oneOf(["medium", "small"]),
  onChange: PT.func.isRequired,
  option: PT.shape({
    value: PT.string.isRequired,
    label: PT.string,
  }),
};

export default Checkbox;
