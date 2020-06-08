import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
  genKey,
  ContentBlock,
} from "draft-js";
import ColorControls, { styles } from "./components/ColorControl";
import Headings from "./components/Headings";
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

  function toggleBlockType(blockType) {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  function undoHandler() {
    onChange(EditorState.undo(editorState));
  }

  function redoHandler() {
    onChange(EditorState.redo(editorState));
  }

  function codeBlockHandler() {
    onChange(RichUtils.toggleBlockType(editorState, "code-block"));
  }

  function orderedistHandler() {
    onChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
  }

  function unorderedListHandler() {
    onChange(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
  }

  function indentHandler(event) {
    onChange(RichUtils.onTab(event, editorState, 4));
  }

  function outdentHandler(event) {
    onChange(RichUtils.onTab(event, editorState, -4));
  }

  // function insertLink(type, data, text) {
  //   const contentState = editorState.getCurrentContent();
  //   const selection = editorState.getSelection();
  //   const textWithSpace = text.concat(" ");
  //   // create new content with text
  //   const newContent = Modifier.insertText(
  //     contentState,
  //     selection,
  //     textWithSpace
  //   );
  //   // create new link entity
  //   const newContentWithEntity = newContent.createEntity(
  //     type,
  //     "MUTABLE",
  //     { url: data },
  //     false
  //   );
  //   const entityKey = newContentWithEntity.getLastCreatedEntityKey();
  //   // create new selection with the inserted text
  //   const anchorOffset = selection.getAnchorOffset();
  //   const newSelection = new SelectionState({
  //     anchorKey: selection.getAnchorKey(),
  //     anchorOffset,
  //     focusKey: selection.getAnchorKey(),
  //     focusOffset: anchorOffset + text.length,
  //   });
  //   // and aply link entity to the inserted text
  //   const newContentWithLink = Modifier.applyEntity(
  //     newContentWithEntity,
  //     newSelection,
  //     entityKey
  //   );
  //   // create new state with link text
  //   const withLinkText = EditorState.push(
  //     editorState,
  //     newContentWithLink,
  //     "insert-characters"
  //   );
  //   // now lets add cursor right after the inserted link
  //   const withProperCursor = EditorState.forceSelection(
  //     withLinkText,
  //     newContent.getSelectionAfter()
  //   );
  //   // update the editor with all changes
  //   onChange(withProperCursor);
  // }

  return (
    <>
      <div className="container">
        <div className="action-buttons">
          <span style={styles.styleButton} onClick={boldClickHandler}>
            <b>B</b>
          </span>
          <span style={styles.styleButton} onClick={italicClickHandler}>
            <i>I</i>
          </span>
          <span style={styles.styleButton} onClick={underlineClickHandler}>
            <u>U</u>
          </span>
          <span style={styles.styleButton} onClick={strikeThroughClickHandler}>
            <s>S</s>
          </span>
          <span style={styles.styleButton} onClick={highlightTextHandler}>
            Highlight
          </span>
        </div>
        <div>
          <ColorControls editorState={editorState} onToggle={toggleColor} />
        </div>
        <div className="mt-3">
          <Headings onToggleHandler={toggleBlockType} />
        </div>
        <div className="mt-3">
          <span style={styles.styleButton} onClick={orderedistHandler}>
            Ordered List
          </span>
          <span style={styles.styleButton} onClick={unorderedListHandler}>
            Unordered List
          </span>
          <span style={styles.styleButton} onClick={indentHandler}>
            Indent
          </span>
          <span style={styles.styleButton} onClick={outdentHandler}>
            Outdent
          </span>
        </div>

        <div className="mt-3">
          <span style={styles.styleButton} onClick={codeBlockHandler}>
            Codeblock
          </span>
          {/* <span
            style={styles.styleButton}
            onClick={() =>
              insertLink("LINK", "https://www.google.com", "Google")
            }
          >
            Link
          </span> */}
          <span style={styles.styleButton} onClick={undoHandler}>
            Undo
          </span>
          <span style={styles.styleButton} onClick={redoHandler}>
            Redo
          </span>
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
