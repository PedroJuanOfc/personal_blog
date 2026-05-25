"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const tools = [
  { group: "heading", items: [
    { label: "H1", before: "# ", after: "", placeholder: "Heading" },
    { label: "H2", before: "## ", after: "", placeholder: "Heading" },
    { label: "H3", before: "### ", after: "", placeholder: "Heading" },
  ]},
  { group: "inline", items: [
    { label: "B", before: "**", after: "**", placeholder: "bold", style: { fontWeight: 700 } },
    { label: "I", before: "*", after: "*", placeholder: "italic", style: { fontStyle: "italic" } },
    { label: "`", before: "`", after: "`", placeholder: "code" },
  ]},
  { group: "block", items: [
    { label: "bash", before: "```bash\n", after: "\n```", placeholder: "" },
    { label: "python", before: "```python\n", after: "\n```", placeholder: "" },
    { label: "·  list", before: "- ", after: "", placeholder: "item" },
    { label: '" quote', before: "> ", after: "", placeholder: "quote" },
    { label: "———", before: "\n---\n", after: "", placeholder: "" },
  ]},
];

export default function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const INDENT = "  ";

    if (start === end) {
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        if (value.slice(lineStart, lineStart + INDENT.length) === INDENT) {
          textarea.setSelectionRange(lineStart, lineStart + INDENT.length);
          document.execCommand("delete", false);
        }
      } else {
        document.execCommand("insertText", false, INDENT);
      }
    } else {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const block = value.slice(lineStart, end);

      if (e.shiftKey) {
        const unindented = block.replace(/^  /gm, "");
        textarea.setSelectionRange(lineStart, end);
        document.execCommand("insertText", false, unindented);
        setTimeout(() => {
          textarea.setSelectionRange(Math.max(lineStart, start - INDENT.length), lineStart + unindented.length);
        }, 0);
      } else {
        const indented = block.replace(/^/gm, INDENT);
        textarea.setSelectionRange(lineStart, end);
        document.execCommand("insertText", false, indented);
        setTimeout(() => {
          textarea.setSelectionRange(start + INDENT.length, lineStart + indented.length);
        }, 0);
      }
    }
  }

  function insert(before: string, after: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    document.execCommand("insertText", false, before + selected + after);
    setTimeout(() => {
      const cursor = start + before.length + selected.length + after.length;
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  }

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-3 py-2 flex-wrap"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
      >
        {tools.map((group, gi) => (
          <div key={gi} className="flex items-center gap-1">
            {gi > 0 && (
              <span className="w-px h-4 mx-1" style={{ background: "var(--border)" }} />
            )}
            {group.items.map((tool) => (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                onClick={() => insert(tool.before, tool.after, tool.placeholder)}
                className="px-2 py-1 rounded text-xs transition-all hover:opacity-60"
                style={{
                  background: "transparent",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  ...((tool as any).style || {}),
                }}
              >
                {tool.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Split view — both panes at reading width (680px), resizable vertically */}
      <div
        className="flex"
        style={{ height: "600px", minHeight: "300px", resize: "vertical", overflow: "hidden" }}
      >
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="px-4 py-4 text-sm outline-none font-mono leading-7 resize-none"
          style={{
            width: "680px",
            flexShrink: 0,
            height: "100%",
            background: "var(--background)",
            color: "var(--foreground)",
            borderRight: "1px solid var(--border)",
          }}
          placeholder="Start writing..."
        />

        {/* Preview — same width as reading view (680px) */}
        <div
          style={{
            width: "680px",
            flexShrink: 0,
            height: "100%",
            overflowY: "auto",
            background: "var(--card)",
          }}
        >
          <div className="prose max-w-none px-8 py-4 text-sm">
            {value ? (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{value}</ReactMarkdown>
            ) : (
              <p style={{ color: "var(--muted)" }} className="text-sm font-mono">Preview will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
