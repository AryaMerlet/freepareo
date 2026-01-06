import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function MarkdownEditor() {
  const [value, setValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div class="flex items-center justify-center">
      {" "}
      <Card className="max-w-3xl">
        {" "}
        <CardHeader className="flex flex-row items-center justify-between">
          {" "}
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            //style={{ pointer: "cursor" }}
          >
            {" "}
            {showPreview ? "Retour à l'édition" : "Prévisualiser"}{" "}
          </Button>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          {!showPreview ? (
            <Textarea
              placeholder="Écrivez votre ressource ici..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-96 font-mono"
            />
          ) : (
            <div className="prose prose-sm max-w-none rounded-md border bg-muted p-4">
              {" "}
              <ReactMarkdown>{value}</ReactMarkdown>{" "}
            </div>
          )}{" "}
        </CardContent>{" "}
      </Card>{" "}
    </div>
  );
}
