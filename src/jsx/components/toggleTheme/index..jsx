/* eslint-disable */
import React, { useEffect } from "react";
import styles from "./styles.module.css";

const defaultOptions = {
  invertedIconLogic: false
};

const ToggleTheme = ({
  isDark,
  onChange,
  invertedIconLogic = defaultOptions.invertedIconLogic
}) => {

 

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={`${styles.container} ${isDark ? styles.IsDark : styles.IsLight}`}
      title={isDark ? "Activate light mode" : "Activate dark mode"}
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
    >
      <input
        type="checkbox"
        defaultChecked={invertedIconLogic ? !isDark : isDark}
        onChange={onChange}
      />
      <div />
    </label>
  );
};

export default ToggleTheme;
