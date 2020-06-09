import React from "react";
import StyleButton from "../StyleButton";

export const COLORS = [
  { label: "Red", style: "red" },
  { label: "Orange", style: "orange" },
  { label: "Yellow", style: "yellow" },
  { label: "Green", style: "green" },
  { label: "Blue", style: "blue" },
  { label: "Indigo", style: "indigo" },
  { label: "Violet", style: "violet" },
];

// This object provides the styling information for our custom color
// styles.
export const styles = {
  styleButton: {
    color: "#999",
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0",
  },
};

const ColorControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div style={styles.controls}>
      {COLORS.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default ColorControls;
