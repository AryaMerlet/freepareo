import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarkdownViewer from "../../components/evaluations/MarkdownViewer";
import CsvViewer from "../../components/evaluations/CsvViewer";
import supabase from "../../utils/supabase";

import { useAuth } from "../../context/authContext";
import { isAdmin, isProf } from "@/utils/role";

export default function ViewEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [evaluation, setEvaluation] = useState(null);
  const [matiere, setMatiere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState(null);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const isTeacher = isAdmin(user) || isProf(user);

  useEffect(() => {
    const loadEvaluation = async () => {
      setLoading(true);

      // recuperation de l'infos
      const { data: evalData, error: evalError } = await supabase
        .from("evaluation")
        .select("id, nom, id_matiere, maximum, contenu")
        .eq("id", id)
        .single();

      if (evalError) {
        console.error(evalError);
        setLoading(false);
        return;
      }

      setEvaluation(evalData);

      // déterminer le type de contenu
      if (typeof evalData.contenu === "string") setFileType("md");
      else if (
        Array.isArray(evalData.contenu) ||
        (evalData.contenu && evalData.contenu.rows)
      )
        setFileType("csv");
      else setFileType(null);

      // affichage de nom de matières
      if (evalData.id_matiere) {
        const { data: matiereData } = await supabase
          .from("matiere")
          .select("nom")
          .eq("id", evalData.id_matiere)
          .single();
        setMatiere(matiereData);
      }

      setLoading(false);
    };

    loadEvaluation();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!evaluation) return <p>Évaluation introuvable</p>;

  const questions =
    fileType === "csv"
      ? evaluation.contenu?.rows ||
        (Array.isArray(evaluation.contenu) ? evaluation.contenu : [])
      : [];

  const handleAnswerChange = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q, i) => {
      const correct = q.correct;
      const pts = Number(q.points || 0);
      if (answers[i] === correct) total += pts;
    });
    setScore(total);
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* btn vers la liste */}
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Retour
      </Button>

      {/* infos d eval */}
      <h1 className="text-3xl font-bold">{evaluation.nom}</h1>
      {matiere && (
        <p className="text-sm text-muted-foreground">Matière : {matiere.nom}</p>
      )}
      <p className="text-sm text-muted-foreground">
        Score maximum : {evaluation.maximum}
      </p>

      {/* Markdown */}
      {fileType === "md" && (
        <div className="prose max-w-full">
          <MarkdownViewer markdown={evaluation.contenu} />
        </div>
      )}

      {/* CSV / QCM */}
      {fileType === "csv" && questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <p className="font-semibold text-lg">{q.question}</p>

              {/* Prof/Admin */}
              {isTeacher ? (
                <div className="space-y-1 mt-2">
                  <p className="text-sm">Option 1: {q.option1}</p>
                  <p className="text-sm">Option 2: {q.option2}</p>
                  <p className="text-sm">Option 3: {q.option3}</p>
                  <p className="text-sm text-green-600 font-medium">
                    Correct: {q.correct}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Points: {q.points}
                  </p>
                </div>
              ) : (
                // Élève QCM
                <div className="flex flex-col gap-2 mt-2">
                  {["option1", "option2", "option3"].map((optKey) => (
                    <label
                      key={optKey}
                      className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/20 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={q[optKey]}
                        checked={answers[i] === q[optKey]}
                        onChange={() => handleAnswerChange(i, q[optKey])}
                        className="accent-primary"
                      />
                      <span className="text-sm">{q[optKey]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* btn soumission */}
          {!isTeacher && questions.length > 0 && !submitted && (
            <Button variant="default" className="mt-2" onClick={handleSubmit}>
              Soumettre
            </Button>
          )}

          {/* Score élève */}
          {!isTeacher && submitted && (
            <p className="text-lg font-bold text-green-700 mt-2">
              Votre score : {score} / {evaluation.maximum}
            </p>
          )}
        </div>
      )}

      {!fileType && (
        <p className="text-sm text-muted-foreground">
          Contenu non reconnu ou vide
        </p>
      )}
    </div>
  );
}
