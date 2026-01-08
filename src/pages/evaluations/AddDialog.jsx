import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { parse as csvParse } from "csv-parse/browser/esm/sync";
import MarkdownViewer from "../../components/MarkdownViewer";
import CsvViewer from "../../components/CsvViewer";
import supabase from "../../utils/supabase";

export default function AddDialog({ open, onClose, onCreated }) {
  const [nom, setNom] = useState("");
  const [coursId, setCoursId] = useState("");
  const [coursList, setCoursList] = useState([]);
  const [maximum, setMaximum] = useState("");
  const [fileType, setFileType] = useState(null);
  const [preview, setPreview] = useState("");
  const [contenu, setContenu] = useState(null);

  // recup les cours
  useEffect(() => {
    const loadCours = async () => {
      const { data } = await supabase
        .from("cours")
        .select("id, nom")
        .order("nom", { ascending: true });
      setCoursList(data ?? []);
    };
    loadCours();
  }, []);

  const reset = () => {
    setNom("");
    setCoursId("");
    setMaximum("");
    setFileType(null);
    setPreview("");
    setContenu(null);
  };

  const readFile = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsText(file);
    });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await readFile(file);
    const ext = file.name.split(".").pop().toLowerCase();

    setPreview(text);

    if (ext === "md") {
      setFileType("md");
      setContenu(text);
    }

    if (ext === "csv") {
      setFileType("csv");
      // Parse CSV and preserve column order
      const parsed = csvParse(text, { columns: true, skip_empty_lines: true });
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Extract headers in original order from first row
        const headers = Object.keys(parsed[0]);
        // Store with headers to preserve order
        setContenu({
          headers: headers,
          rows: parsed,
        });
      } else {
        setContenu({ headers: [], rows: [] });
      }
    }
  };
  // obligation de remplissage
  const handleSubmit = async () => {
    if (!nom || !maximum || !contenu || !coursId) {
      alert("Tous les champs sont obligatoires");
      return;
    }
    //partie creation
    const { error } = await supabase.from("evaluation").insert({
      nom,
      id_cours: coursId,
      maximum: Number(maximum),
      contenu,
    });

    if (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement : " + error.message);
      return;
    }

    onCreated?.();
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nouvelle évaluation</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <Input
            placeholder="Nom de l'évaluation"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          {/* select pour choisir le cours */}
          <Select value={coursId} onValueChange={setCoursId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un cours" />
            </SelectTrigger>
            <SelectContent>
              {coursList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Score maximum"
            value={maximum}
            onChange={(e) => setMaximum(e.target.value)}
          />

          <Input type="file" accept=".md,.csv" onChange={handleFile} />

          {/* selon le type on applique le component demain 14h 30 */}
          {fileType === "md" && preview && (
            <div className="max-h-64 overflow-auto border p-2">
              <MarkdownViewer markdown={preview} />
            </div>
          )}

          {fileType === "csv" && contenu && contenu.rows && (
            <div className="max-h-64 overflow-auto border p-2">
              <CsvViewer rows={contenu.rows} headers={contenu.headers} />
            </div>
          )}
        </div>
        {/* btns de dialog */}
        <DialogFooter className="mt-2 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
