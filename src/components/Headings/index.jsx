import React from "react";
import { styles } from "../ColorControl";

export const BLOCK_TYPE_HEADINGS = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
];

function Headings(props) {
  const { onToggleHandler } = props;
  return BLOCK_TYPE_HEADINGS.map((heading) => (
    <span
      key={heading.label}
      style={styles.styleButton}
      onMouseDown={() => onToggleHandler(heading.style)}
    >
      {heading.label}
    </span>
  ));
}

export default Headings;

// This is a heading 1
// This is a heading 2
// This is a heading 3
// This is a heading 4
// This is a heading 5
// This is a heading 6
