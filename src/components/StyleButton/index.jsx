import React from "react";
import { styles } from "../ColorControl";

export const colorStyleMap = {
  red: {
    color: "rgba(255, 0, 0, 1.0)",
  },
  orange: {
    color: "rgba(255, 127, 0, 1.0)",
  },
  yellow: {
    color: "rgba(180, 180, 0, 1.0)",
  },
  green: {
    color: "rgba(0, 180, 0, 1.0)",
  },
  blue: {
    color: "rgba(0, 0, 255, 1.0)",
  },
  indigo: {
    color: "rgba(75, 0, 130, 1.0)",
  },
  violet: {
    color: "rgba(127, 0, 255, 1.0)",
  },
};

function StyleButton(props) {
  const { label, style, active, onToggle } = props;
  const onToggleHandler = (e) => {
    e.preventDefault();
    onToggle(style);
  };

  let appliedStyle;
  if (active) {
    appliedStyle = { ...styles.styleButton, ...colorStyleMap[style] };
  } else {
    appliedStyle = styles.styleButton;
  }

  return (
    <span style={appliedStyle} onMouseDown={onToggleHandler}>
      {label}
    </span>
  );
}

export default StyleButton;
