import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import supabase from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import "@/markdown.css";
import { CommentaireWrapper } from "./commentaire-wrapper";

export default function MarkdownEditor() {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showError, setShowError] = useState(false);
  const [ressources, setRessources] = useState([]);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchRessources = async () => {
    const { data, error } = await supabase
      .from("ressource")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setRessources(data);
  };

  useEffect(() => {
    fetchRessources();
  }, []);

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
    setTitle("");
    setValue("");
    setShowPreview(false);
  };

  const handleValidate = async () => {
    if (!title.trim() || !value.trim() || !user) return;

    const { error } = await supabase.from("ressource").insert({
      nom: title,
      content: value,
      id_prof: user.id,
    });

    if (!error) {
      setTitle("");
      setValue("");
      setShowPreview(false);
      fetchRessources();
      setSuccessMessage("Ressource ajoutée avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette ressource ?")) return;

    const { error } = await supabase.from("ressource").delete().eq("id", id);

    if (!error) {
      fetchRessources();
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditTitle(r.nom);
    setEditValue(r.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditValue("");
  };

  const saveEdit = async () => {
    const { error } = await supabase
      .from("ressource")
      .update({
        nom: editTitle,
        content: editValue,
      })
      .eq("id", editingId);

    if (!error) {
      cancelEdit();
      fetchRessources();
    }
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
              Aucune donnée à prévisualiser
            </div>
          )}

          {successMessage && (
            <div className="max-w-3xl w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <Input
            placeholder="Titre de la ressource"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {!showPreview ? (
            <Textarea
              placeholder="Écrivez votre ressource en markdown..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-60 font-mono"
            />
          ) : (
            <div className="markdown max-w-none rounded-md border bg-muted p-4">
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

      <div className="max-w-3xl w-full space-y-4">
        {ressources.map((r) => {
          const isOwner = user && user.id === r.id_prof;

          return (
            <Card key={r.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                {editingId === r.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{r.nom}</h3>
                )}

                {isOwner && (
                  <div className="flex gap-2">
                    {editingId === r.id ? (
                      <>
                        <Button size="sm" onClick={saveEdit}>
                          Sauvegarder
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={cancelEdit}
                        >
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => startEdit(r)}>
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(r.id)}
                        >
                          Supprimer
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="markdown max-w-none">
                {editingId === r.id ? (
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="min-h-40 font-mono"
                  />
                ) : (
                  <CommentaireWrapper>

                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {r.content}
                    </ReactMarkdown>
                  </CommentaireWrapper>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
