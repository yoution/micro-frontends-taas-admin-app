import React, { useCallback } from "react";
import styles from "./styles.module.scss";

const TextField = ({ className, onChange, placeholder, value }) => {
  return (
    <div className={styles.textField}>
      <input
        type="text"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        value={value}
      />
    </div>
  );
};

export default TextField;
