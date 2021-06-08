import React, { useCallback, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import _ from "lodash";
import AsyncSelect from "react-select/async";
import { getMemberSuggestions } from "services/teams";
// import { getOptionByValue } from "utils/misc";
import styles from "./styles.module.scss";

const selectComponents = {
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

/**
 * Displays search input field.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} props.id id for input element
 * @param {string} props.placeholder placeholder text
 * @param {string} props.name name for input element
 * @param {'medium'|'small'} [props.size] field size
 * @param {function} props.onChange function called when input value changes
 * @param {string} props.value input value
 * @returns {JSX.Element}
 */
const SearchAutocomplete = ({
  className,
  id,
  size = "medium",
  onChange,
  placeholder,
  value,
}) => {
  // const option = getOptionByValue(options, value);
  const [savedInput, setSavedInput] = useState("");

  const onValueChange = useCallback(
    (option) => {
      onChange(option.value);
    },
    [onChange]
  );

  return (
    <div className={cn(styles.container, styles[size], className)}>
      <span className={styles.icon} />
      <AsyncSelect
        className={styles.select}
        classNamePrefix="custom"
        components={selectComponents}
        id={id}
        isSearchable={true}
        // menuIsOpen={true} // for debugging
        // onChange={onOptionChange}
        // onMenuOpen={onMenuOpen}
        // onMenuClose={onMenuClose}
        value={{ value, label: value }}
        onInputChange={setSavedInput}
        onFocus={() => {
          setSavedInput("");
          onChange(savedInput);
        }}
        placeholder={placeholder}
        onChange={onValueChange}
        noOptionsMessage={() => "No options"}
        loadingMessage={() => "Loading..."}
        loadOptions={loadSuggestions}
        blurInputOnSelect
      />
    </div>
  );
};

const loadSuggestions = (inputVal) => {
  return getMemberSuggestions(inputVal)
    .then((res) => {
      const users = _.get(res, "data.result.content", []);
      return users.map((user) => ({
        label: user.handle,
        value: user.handle,
      }));
    })
    .catch(() => {
      console.warn("could not get suggestions");
      return [];
    });
};

SearchAutocomplete.propTypes = {
  className: PT.string,
  id: PT.string.isRequired,
  size: PT.oneOf(["medium", "small"]),
  name: PT.string.isRequired,
  onChange: PT.func.isRequired,
  options: PT.array,
  placeholder: PT.string,
  value: PT.oneOfType([PT.number, PT.string]),
};

export default SearchAutocomplete;
