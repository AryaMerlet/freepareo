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
import MarkdownViewer from "../../components/evaluations/MarkdownViewer";
import CsvViewer from "../../components/evaluations/CsvViewer";
import supabase from "../../utils/supabase";

export default function AddDialog({ open, onClose, onCreated }) {
  const [nom, setNom] = useState("");
  const [matiereId, setMatiereId] = useState("");
  const [matiereList, setMatiereList] = useState([]);
  const [maximum, setMaximum] = useState("");
  const [fileType, setFileType] = useState(null);
  const [preview, setPreview] = useState("");
  const [contenu, setContenu] = useState(null);

  // recup les matiere
  useEffect(() => {
    const loadMatiere = async () => {
      const { data } = await supabase
        .from("matiere")
        .select("id, nom")
        .order("nom", { ascending: true });
      setMatiereList(data ?? []);
    };
    loadMatiere();
  }, []);

  const reset = () => {
    setNom("");
    setMatiereId("");
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
      const parsed = csvParse(text, { columns: true, skip_empty_lines: true });

      if (Array.isArray(parsed) && parsed.length > 0) {
        const headers = Object.keys(parsed[0]);

        // Convertir toutes les colonnes "points" en int
        const rows = parsed.map((row) => {
          const newRow = { ...row };
          Object.keys(newRow).forEach((key) => {
            if (key.toLowerCase().includes("points")) {
              newRow[key] = parseInt(newRow[key], 10) || 0;
            }
          });
          return newRow;
        });

        // Calcul du score max
        const maxPoints = rows.reduce((sum, row) => {
          const pointsCols = Object.keys(row).filter((k) =>
            k.toLowerCase().includes("points")
          );
          const rowSum = pointsCols.reduce((s, col) => s + row[col], 0);
          return sum + rowSum;
        }, 0);

        setMaximum(maxPoints);
        setContenu({ headers, rows });
      } else {
        setContenu({ headers: [], rows: [] });
        setMaximum(0);
      }
    }
  };
  // obligation de remplissage
  const handleSubmit = async () => {
    if (!nom || !maximum || !contenu || !matiereId) {
      alert("Tous les champs sont obligatoires");
      return;
    }
    //partie creation
    const { error } = await supabase.from("evaluation").insert({
      nom,
      id_matiere: matiereId,
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

          {/* select pour choisir la matière */}
          <Select value={matiereId} onValueChange={setMatiereId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une matière" />
            </SelectTrigger>
            <SelectContent>
              {matiereList.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.nom}
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
