import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import {
  fetchMatiereByUserId,
  fetchMatiereByGroupId,
  fetchMatieres,
} from "@/services/coursService";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap } from "lucide-react";

export const CoursPage = () => {
  const { user } = useAuth();
  const [cours, setCours] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user);
    setLoading(true);
    if (user.profile.role === "prof") {
      fetchMatiereByUserId(user.id).then((data) => {
        console.log(data);
        if (data.data) setMatieres(data.data);
        setLoading(false);
      });
    } else if (user.profile.role === "admin") {
      fetchMatieres().then((data) => {
        console.log(data);
        if (data.data) setMatieres(data.data);
        setLoading(false);
      });
    } else {
      fetchMatiereByGroupId(user.profile.id_group).then((data) => {
        console.log(data);
        if (data.data) setMatieres(data.data);
        setLoading(false);
      });
    }
  }, [user.id]);

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
    <div className="container mx-auto p-6 md:p-10 space-y-8 max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          Mes cours
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Accédez à tous vos cours et modules. Cliquez sur un cours pour voir
          les détails.
        </p>
      </div>

      {/* Courses Grid */}
      {matieres.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matieres.map((cours) => (
            <Link to={`/cours/${cours.id}`} key={cours.id}>
              <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-blue-500/70 h-full">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-20 h-20 rotate-12" />
                </div>
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-xl flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg shadow-sm ring-1 ring-blue-500/20 mt-1">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="leading-tight">{cours.nom}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-2">
                  {cours.group?.nom && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{cours.group.nom}</span>
                    </div>
                  )}
                  {cours.prof?.nom && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span>{cours.prof.nom}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground opacity-70">
            <div className="bg-muted p-4 rounded-full mb-4">
              <BookOpen className="h-8 w-8 opacity-40" />
            </div>
            <p className="font-medium">Aucun cours disponible</p>
            <p className="text-sm opacity-70">Vos cours apparaîtront ici.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
