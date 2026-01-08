import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/service/userService";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile({ ...props }) {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editNom, setEditNom] = useState("");
    const [editPrenom, setEditPrenom] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchProfileData() {
            if (!user) {
                setIsLoading(false);
                return;
            }

            const { data: userData, error: userError } = await userService.getUserProfile(user.id);

            if (userError) {
                setError(userError.message);
                setIsLoading(false);
                return;
            }

            setProfileData(userData || {
                id: user.id,
                email: user.email,
                nom: null,
                prenom: null,
                role: null,
                id_group: null
            });

            if (userData?.id_group) {
                const { data: groupData } = await userService.getUserGroup(userData.id_group);

                if (groupData) {
                    setGroupName(`${groupData.nom} (${groupData.annee})`);
                }
            }

            setIsLoading(false);
        }

        fetchProfileData();
    }, [user]);

    const handleEdit = () => {
        setEditNom(profileData?.nom || "");
        setEditPrenom(profileData?.prenom || "");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditNom("");
        setEditPrenom("");
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);

        const { data, error: saveError } = await userService.updateUserProfile(
            user.id,
            user.email,
            editNom,
            editPrenom
        );

        if (saveError) {
            setError(saveError.message);
            setIsSaving(false);
            return;
        }

        setProfileData(data);
        setIsEditing(false);
        setIsSaving(false);
    };

    if (isLoading) {
        return <div>Chargement du profil...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    if (!user) {
        return <div>Aucun utilisateur connecté</div>;
    }

    if (!profileData) {
        return <div>Chargement...</div>;
    }

    return (
        <Card {...props}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Mon Profil</CardTitle>
                        <CardDescription>
                            Informations de votre compte
                        </CardDescription>
                    </div>
                    {!isEditing && (
                        <Button variant="outline" onClick={handleEdit}>
                            Modifier
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Prénom</span>
                        {isEditing ? (
                            <Input
                                value={editPrenom}
                                onChange={(e) => setEditPrenom(e.target.value)}
                                placeholder="Votre prénom"
                            />
                        ) : (
                            <span className="text-base">{profileData.prenom || "Non renseigné"}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">Nom</span>
                        {isEditing ? (
                            <Input
                                value={editNom}
                                onChange={(e) => setEditNom(e.target.value)}
                                placeholder="Votre nom"
                            />
                        ) : (
                            <span className="text-base">{profileData.nom || "Non renseigné"}</span>
                        )}
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

                    {isEditing && (
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                Annuler
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
