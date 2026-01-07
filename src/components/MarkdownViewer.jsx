import ReactMarkdown from "react-markdown";

export default function MarkdownViewer({ markdown }) {
  return (
    <div
      style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
