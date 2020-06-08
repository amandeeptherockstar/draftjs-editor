import React from "react";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import ColorControls from "./components/ColorControl";
import { colorStyleMap } from "./components/StyleButton";
import "./App.css";

const highlightStyleMap = {
  HIGHLIGHT: {
    backgroundColor: "#faed27",
  },
};

function App() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  function onChange(editorState) {
    setEditorState(editorState);
  }

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  React.useEffect(() => {
    focusEditor();
  }, []);

  function boldClickHandler() {
    onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  }

  function italicClickHandler() {
    onChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }

  function underlineClickHandler() {
    onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  }
  function strikeThroughClickHandler() {
    onChange(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  }

  function toggleColor(color) {
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, currentColor) => {
        return Modifier.removeInlineStyle(
          contentState,
          selection,
          currentColor
        );
      },
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, currentColor) => {
        return RichUtils.toggleInlineStyle(state, currentColor);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(color)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, color);
    }
    onChange(nextEditorState);
  }

  function highlightTextHandler() {
    onChange(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
  }

  return (
    <>
      <div className="container">
        <div className="action-buttons">
          <button onClick={boldClickHandler}>
            <b>B</b>
          </button>
          <button className="ml-2" onClick={italicClickHandler}>
            <i>I</i>
          </button>
          <button className="ml-2" onClick={underlineClickHandler}>
            <u>U</u>
          </button>
          <button className="ml-2" onClick={strikeThroughClickHandler}>
            <s>S</s>
          </button>
          <button className="ml-2" onClick={highlightTextHandler}>
            Highlight
          </button>
        </div>
        <div>
          <ColorControls editorState={editorState} onToggle={toggleColor} />
        </div>

        <div className="editor">
          <Editor
            customStyleMap={{ ...colorStyleMap, ...highlightStyleMap }}
            ref={editor}
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </div>
    </>
  );
}

export default App;
