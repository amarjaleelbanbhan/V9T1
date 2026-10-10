import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
const scientificSyntax = HighlightStyle.define([
  { tag: [tags.keyword, tags.operator], color: "#B8E6ED" },
  { tag: [tags.string, tags.number, tags.bool], color: "#F2D395" },
  {
    tag: [tags.variableName, tags.function(tags.variableName)],
    color: "#EDF7F8",
  },
  { tag: [tags.comment], color: "#B3D4DD" },
  { tag: [tags.typeName, tags.className], color: "#99DACA" },
  { tag: [tags.invalid], color: "#FF9078" },
]);
export function PythonEditor({
  value,
  onChange,
  readOnly = false,
  label = "Python source",
}: {
  value: string;
  onChange?: (source: string) => void;
  readOnly?: boolean;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null),
    view = useRef<EditorView | null>(null),
    change = useRef(onChange);
  change.current = onChange;
  useEffect(() => {
    if (!host.current) return;
    const editor = new EditorView({
      parent: host.current,
      doc: value,
      extensions: [
        basicSetup,
        python(),
        syntaxHighlighting(scientificSyntax),
        EditorView.theme(
          {
            "&": { backgroundColor: "var(--background)", color: "var(--text)" },
            ".cm-gutters": {
              backgroundColor: "var(--surface)",
              color: "var(--muted)",
              borderColor: "var(--line)",
            },
            ".cm-activeLine, .cm-activeLineGutter": {
              backgroundColor: "var(--surface)",
            },
            "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
              backgroundColor: "var(--line)",
            },
            ".cm-cursor": { borderLeftColor: "var(--text)" },
          },
          { dark: true },
        ),
        EditorView.lineWrapping,
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
        EditorView.contentAttributes.of({
          "aria-label": label,
          "aria-multiline": "true",
        }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) change.current?.(u.state.doc.toString());
        }),
      ],
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
  }, [readOnly, label]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      });
  }, [value]);
  return <div ref={host} className="python-editor" />;
}
