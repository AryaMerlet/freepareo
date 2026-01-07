import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarkdownViewer from "../../components/MarkdownViewer";
import CsvViewer from "../../components/CsvViewer";
import supabase from "../../utils/supabase";

export default function ViewEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const loadEvaluation = async () => {
      setLoading(true);

      const { data: evalData, error: evalError } = await supabase
        .from("evaluation")
        .select("id, nom, id_cours, maximum, contenu")
        .eq("id", id)
        .single();

      if (evalError) {
        console.error(evalError);
        setLoading(false);
        return;
      }

      setEvaluation(evalData);

      if (typeof evalData.contenu === "string") {
        setFileType("md");
      } else if (Array.isArray(evalData.contenu)) {
        setFileType("csv");
      } else {
        setFileType(null);
        console.warn("Contenu non reconnu :", evalData.contenu);
      }

      if (evalData.id_cours) {
        const { data: coursData } = await supabase
          .from("cours")
          .select("nom")
          .eq("id", evalData.id_cours)
          .single();
        setCours(coursData);
      }

      setLoading(false);
    };

    loadEvaluation();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!evaluation) return <p>Évaluation introuvable</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* btn vers la liste */}
      <Button variant="outline" onClick={() => navigate(-1)}>
        Retour
      </Button>

      {/* infos d eval */}
      <h1 className="text-2xl font-bold">{evaluation.nom}</h1>
      {cours && (
        <p className="text-sm text-muted-foreground">Cours : {cours.nom}</p>
      )}
      <p className="text-sm">Score maximum : {evaluation.maximum}</p>

      {/* contenu */}
      <div className="border p-4 max-h-[70vh] overflow-auto">
        {fileType === "md" && <MarkdownViewer markdown={evaluation.contenu} />}

        {fileType === "csv" && Array.isArray(evaluation.contenu) && (
          <CsvViewer rows={evaluation.contenu} />
        )}

        {!fileType && (
          <p className="text-sm text-muted-foreground">
            Contenu non reconnu ou vide
          </p>
        )}
      </div>
    </div>
  );
}
