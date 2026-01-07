import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor() {
  const [value, setValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showError, setShowError] = useState(false);
  const [validatedContents, setValidatedContents] = useState([]);

  const handlePreviewClick = () => {
    if (value.trim() === "") {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else {
      setShowPreview(!showPreview);
      setShowError(false);
    }
  };

  const handleClear = () => {
    setValue("");
    setShowPreview(false);
  };

  const handleValidate = () => {
    if (value.trim() === "") return;

    setValidatedContents((prev) => [value, ...prev]);
    setValue("");
    setShowPreview(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 gap-6">
      <Card className="max-w-3xl w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Création de ressources</h2>
          <Button variant="outline" onClick={handlePreviewClick}>
            {showPreview ? "Retour à l'édition" : "Prévisualiser"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {showError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Aucune donnée à prévisualiser, veuillez saisir quelque chose.
            </div>
          )}

          {!showPreview ? (
            <Textarea
              placeholder="Écrivez votre ressource ici..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-60 font-mono"
            />
          ) : (
            <div className="prose prose-sm max-w-none rounded-md border bg-muted p-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={handleClear}>
              Effacer
            </Button>
            <Button onClick={handleValidate}>Valider</Button>
          </div>
        </CardContent>
      </Card>

      {validatedContents.length > 0 && (
        <div className="max-w-3xl w-full space-y-4">
          {validatedContents.map((content, index) => (
            <Card key={index}>
              <CardContent className="prose prose-sm max-w-none p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
