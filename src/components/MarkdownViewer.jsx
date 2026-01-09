import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CommentaireWrapper } from "./commentaire-wrapper";

export default function MarkdownViewer({ markdown, resourceId }) {
  return (
    <div
      style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <CommentaireWrapper resourceId={resourceId}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </CommentaireWrapper>
    </div>
  );
}
