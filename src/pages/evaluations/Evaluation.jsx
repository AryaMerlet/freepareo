import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import supabase from "../../utils/supabase";
import AddDialog from "./AddDialog";

export default function Evaluations() {
  const [open, setOpen] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const navigate = useNavigate();

  const loadEvaluations = async () => {
    const { data } = await supabase
      .from("evaluation")
      .select("id, nom")
      .order("created_at", { ascending: false });
    setEvaluations(data ?? []);
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      {/* btn+ pour ajouter */}
      <Button size="icon" onClick={() => setOpen(true)}>
        +
      </Button>

      {/* liste des evals */}
      <div className="space-y-2">
        {evaluations.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune évaluation</p>
        )}

        {evaluations.map((e) => (
          <Button
            key={e.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate(`/evaluations/${e.id}`)}
          >
            {e.nom}
          </Button>
        ))}
      </div>

      {/* dialog */}
      <AddDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={loadEvaluations}
      />
    </div>
  );
}
