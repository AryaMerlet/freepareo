import React, { useEffect, useState } from "react";
import { getCoursDetails } from "../services/coursService";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, FileText, GraduationCap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownViewer from "./MarkdownViewer";
import "@/markdown.css";
import { useAuth } from "@/context/authContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MarkdownEditor from "./MarkdownEditor";
import { ScrollArea } from "./ui/scroll-area";

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b last:border-b-0 border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 px-2 text-sm font-medium transition-all hover:bg-muted/30 rounded-md text-left group"
      >
        <span className="text-base font-semibold group-hover:text-primary transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100 mb-4"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="text-sm text-foreground bg-secondary/20 p-6 rounded-lg border border-border/50 shadow-sm mt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CoursDetails = () => {
  const { id } = useParams();
  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { data, error } = await getCoursDetails(id);
      if (data) {
        setCours(data);
      }
      setLoading(false);
    }

    init();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="h-8 w-64 bg-muted rounded-full"></div>
          <div className="space-y-3 w-full max-w-md">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-10 space-y-12 max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          {cours?.infos?.nom || "Détails du Cours"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Accédez aux supports de cours, exercices et évaluations pour ce
          module. Cliquez sur une ressource pour en afficher le contenu.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 min-h-[500px]">
        {/* Ressources Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl shadow-sm ring-1 ring-blue-500/20">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Ressources Pédagogiques
              </h2>
              <p className="text-sm text-muted-foreground">
                Supports, documents et lectures
              </p>
            </div>

            {user?.profile?.role === "prof" && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4" />
                      Ajouter une ressource
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une ressource</DialogTitle>
                      <DialogDescription>
                        <ScrollArea className="h-[500px]">
                          <MarkdownEditor id_matiere={id} />
                        </ScrollArea>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>

          <Card className="border shadow-md bg-card/60 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-1">
              {cours?.ressources?.length > 0 ? (
                <div className="divide-y divide-border/50 p-4">
                  {cours.ressources.map((ressource) => (
                    <AccordionItem key={ressource.id} title={ressource.nom}>
                      <div className="markdown max-w-none">
                        <MarkdownViewer
                          resourceId={ressource.id}
                          markdown={
                            ressource.content || "Aucun contenu disponible."
                          }
                        />
                      </div>
                    </AccordionItem>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 opacity-40" />
                  </div>
                  <p className="font-medium">Aucune ressource disponible</p>
                  <p className="text-sm opacity-70">
                    Les documents apparaîtront ici.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Evaluations Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-xl shadow-sm ring-1 ring-orange-500/20">
              <GraduationCap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Évaluations</h2>
              <p className="text-sm text-muted-foreground">
                Examens et devoirs à rendre
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {cours?.evaluations?.length > 0 ? (
              cours.evaluations.map((evaluation) => (
                <Card
                  key={evaluation.id}
                  className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-orange-500/70"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <GraduationCap className="w-20 h-20 rotate-12" />
                  </div>
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-xl flex justify-between items-start gap-4">
                      <span className="leading-tight">{evaluation.nom}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        Sur {evaluation.maximum} points
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {evaluation.contenu &&
                      typeof evaluation.contenu !== "object"
                        ? evaluation.contenu
                        : evaluation.contenu?.description ||
                          "Consultez les détails pour plus d'informations."}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground opacity-70">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <GraduationCap className="h-8 w-8 opacity-40" />
                  </div>
                  <p className="font-medium">Aucune évaluation prévue</p>
                  <p className="text-sm opacity-70">
                    Tout est calme pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
