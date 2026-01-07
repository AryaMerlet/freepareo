import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/utils/supabase";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function Profile({ ...props }) {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfileData() {
            if (!user) {
                setIsLoading(false);
                return;
            }

            const { data: userData, error: userError } = await supabase
                .from("user")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (userError) {
                console.error("Error fetching profile:", userError);
                setError(userError.message);
                setIsLoading(false);
                return;
            }

            setProfileData(userData);

            if (userData?.id_group) {
                const { data: groupData, error: groupError } = await supabase
                    .from("group")
                    .select("nom, annee")
                    .eq("id", userData.id_group)
                    .maybeSingle();

                if (!groupError && groupData) {
                    setGroupName(`${groupData.nom} (${groupData.annee})`);
                }
            }

            setIsLoading(false);
        }

        fetchProfileData();
    }, [user]);

    if (isLoading) {
        return <div>Chargement du profil...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    if (!user || !profileData) {
        return <div>Aucun utilisateur connecté</div>;
    }

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Mon Profil</CardTitle>
                <CardDescription>
                    Informations de votre compte
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Prénom</span>
                        <span className="text-base">{profileData.prenom || "Non renseigné"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Nom</span>
                        <span className="text-base">{profileData.nom || "Non renseigné"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <span className="text-base">{profileData.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Rôle</span>
                        <span className="text-base">{profileData.role || "Non renseigné"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Groupe</span>
                        <span className="text-base">{groupName || "Aucun groupe"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
