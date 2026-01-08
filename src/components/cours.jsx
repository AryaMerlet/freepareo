import { useEffect, useState, useRef } from "react";
import {
  fetchMatieres,
  addMatiere,
  updateMatiere,
  deleteMatiere,
  addCoursToMatiere,
  deleteCoursFromMatiere,
  fetchProfs,
  fetchGroups,
} from "../services/coursService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Cours() {
  const [matieres, setMatieres] = useState([]);
  const [profs, setProfs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    id_prof: "",
    id_group: "",
  });
  const [horaires, setHoraires] = useState([]); // Array of { jour: "" }

  const [searchProf, setSearchProf] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [profDropdownOpen, setProfDropdownOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);

  const profRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    getAllMatieres();
    getAllProfs();
    getAllGroups();
  }, []);

  async function getAllMatieres() {
    const { data } = await fetchMatieres();
    if (data) setMatieres(data);
  }

  async function getAllProfs() {
    const { data } = await fetchProfs();
    if (data) setProfs(data);
  }

  async function getAllGroups() {
    const { data } = await fetchGroups();
    if (data) setGroups(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.id_prof || !formData.id_group) {
      alert("Veuillez remplir tous les champs de la matière");
      return;
    }

    let matiereId;

    if (editingMatiere) {
      // Update existing matiere
      await updateMatiere(editingMatiere.id, {
        nom: formData.nom,
        id_prof: formData.id_prof,
        id_group: formData.id_group,
      });
      matiereId = editingMatiere.id;

      // Get existing cours IDs
      const existingCoursIds =
        editingMatiere.cours && Array.isArray(editingMatiere.cours)
          ? editingMatiere.cours.map((c) => c.id).filter(Boolean)
          : [];

      // Get current horaires IDs (those that have an id)
      const currentHorairesIds = horaires.map((h) => h.id).filter(Boolean);

      // Delete cours that were removed
      const coursToDelete = existingCoursIds.filter(
        (id) => !currentHorairesIds.includes(id)
      );
      for (const coursId of coursToDelete) {
        await deleteCoursFromMatiere(coursId);
      }

      // Add new cours (those without id)
      for (const horaire of horaires) {
        if (horaire.jour && !horaire.id) {
          await addCoursToMatiere({
            jour: horaire.jour,
            id_matiere: matiereId,
          });
        }
      }
    } else {
      // Create new matiere
      const { data } = await addMatiere({
        nom: formData.nom,
        id_prof: formData.id_prof,
        id_group: formData.id_group,
      });
      if (data) matiereId = data.id;

      // Add all horaires (cours) for this new matiere
      if (matiereId) {
        for (const horaire of horaires) {
          if (horaire.jour) {
            await addCoursToMatiere({
              jour: horaire.jour,
              id_matiere: matiereId,
            });
          }
        }
      }
    }

    setDialogOpen(false);
    setEditingMatiere(null);
    setFormData({ nom: "", id_prof: "", id_group: "" });
    setHoraires([]);
    setSearchProf("");
    setSearchGroup("");
    getAllMatieres();
  };

  const handleDeleteMatiere = async (id) => {
    if (
      !confirm(
        "Voulez-vous vraiment supprimer cette matière ? Tous les cours associés seront également supprimés."
      )
    )
      return;
    await deleteMatiere(id);
    getAllMatieres();
  };

  const handleDeleteCours = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet horaire ?")) return;
    await deleteCoursFromMatiere(id);
    getAllMatieres();
  };

  const handleEdit = (matiere) => {
    setEditingMatiere(matiere);
    setFormData({
      nom: matiere.nom,
      id_prof: matiere.id_prof,
      id_group: matiere.id_group,
    });

    const prof = profs.find((p) => p.id === matiere.id_prof);
    setSearchProf(prof ? `${prof.nom} ${prof.prenom}` : "");

    const group = groups.find((g) => g.id === matiere.id_group);
    setSearchGroup(group ? group.nom : "");

    // Load existing cours as horaires
    if (matiere.cours && Array.isArray(matiere.cours)) {
      setHoraires(matiere.cours.map((c) => ({ id: c.id, jour: c.jour })));
    } else {
      setHoraires([]);
    }

    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingMatiere(null);
    setFormData({ nom: "", id_prof: "", id_group: "" });
    setHoraires([]);
    setSearchProf("");
    setSearchGroup("");
    setDialogOpen(true);
  };

  const addHoraire = () => {
    setHoraires([...horaires, { jour: "" }]);
  };

  const removeHoraire = (index) => {
    const newHoraires = horaires.filter((_, i) => i !== index);
    setHoraires(newHoraires);
  };

  const updateHoraire = (index, jour) => {
    const newHoraires = [...horaires];
    newHoraires[index] = { ...newHoraires[index], jour };
    setHoraires(newHoraires);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profRef.current && !profRef.current.contains(event.target))
        setProfDropdownOpen(false);
      if (groupRef.current && !groupRef.current.contains(event.target))
        setGroupDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Liste des matières</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>Ajouter une matière</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMatiere ? "Modifier la matière" : "Ajouter une matière"}
              </DialogTitle>
              <DialogDescription>
                {editingMatiere
                  ? "Modifiez les informations de la matière et ses horaires"
                  : "Remplissez les informations pour créer une nouvelle matière et ajoutez ses horaires"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de la matière</Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  required
                  placeholder="Nom de la matière"
                />
              </div>

              <div className="space-y-2 relative" ref={profRef}>
                <Label htmlFor="prof">Professeur</Label>
                <div
                  className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer relative flex items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setProfDropdownOpen(!profDropdownOpen)}
                >
                  <Input
                    id="prof"
                    type="text"
                    className="w-full border-none outline-none cursor-pointer bg-transparent p-0 focus-visible:ring-0"
                    value={searchProf}
                    onChange={(e) => {
                      setSearchProf(e.target.value);
                      setFormData({ ...formData, id_prof: "" });
                      setProfDropdownOpen(true);
                    }}
                    placeholder="Sélectionnez un professeur"
                    required
                  />
                  <span className="absolute right-3 text-gray-500">▼</span>
                </div>

                {profDropdownOpen && (
                  <ul className="list-none m-0 p-0 absolute w-full max-h-[150px] overflow-y-auto border border-gray-300 bg-white z-50 rounded-md shadow-lg">
                    {profs
                      .filter((p) =>
                        `${p.nom} ${p.prenom}`
                          .toLowerCase()
                          .includes(searchProf.toLowerCase())
                      )
                      .map((p) => (
                        <li
                          key={p.id}
                          className="px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, id_prof: p.id });
                            setSearchProf(`${p.nom} ${p.prenom}`);
                            setProfDropdownOpen(false);
                          }}
                        >
                          {p.nom} {p.prenom}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2 relative" ref={groupRef}>
                <Label htmlFor="group">Groupe</Label>
                <div
                  className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer relative flex items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                >
                  <Input
                    id="group"
                    type="text"
                    className="w-full border-none outline-none cursor-pointer bg-transparent p-0 focus-visible:ring-0"
                    value={searchGroup}
                    onChange={(e) => {
                      setSearchGroup(e.target.value);
                      setFormData({ ...formData, id_group: "" });
                      setGroupDropdownOpen(true);
                    }}
                    placeholder="Sélectionnez un groupe"
                    required
                  />
                  <span className="absolute right-3 text-gray-500">▼</span>
                </div>

                {groupDropdownOpen && (
                  <ul className="list-none m-0 p-0 absolute w-full max-h-[150px] overflow-y-auto border border-gray-300 bg-white z-50 rounded-md shadow-lg">
                    {groups
                      .filter((g) =>
                        g.nom.toLowerCase().includes(searchGroup.toLowerCase())
                      )
                      .map((g) => (
                        <li
                          key={g.id}
                          className="px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, id_group: g.id });
                            setSearchGroup(g.nom);
                            setGroupDropdownOpen(false);
                          }}
                        >
                          {g.nom}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Horaires (Cours)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHoraire}
                  >
                    + Ajouter un horaire
                  </Button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {horaires.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Aucun horaire ajouté. Cliquez sur "Ajouter un horaire"
                      pour en ajouter.
                    </p>
                  ) : (
                    horaires.map((horaire, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-center p-2 bg-gray-50 rounded-md"
                      >
                        <Input
                          type="date"
                          value={horaire.jour}
                          onChange={(e) => updateHoraire(index, e.target.value)}
                          className="flex-1"
                          placeholder="Date du cours"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeHoraire(index)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingMatiere ? "Enregistrer" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {matieres.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Aucune matière créée. Cliquez sur "Ajouter une matière" pour
            commencer.
          </p>
        ) : (
          matieres.map((matiere) => (
            <div
              key={matiere.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{matiere.nom}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Groupe:</span>{" "}
                      {matiere.group?.nom || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Professeur:</span>{" "}
                      {matiere.prof
                        ? `${matiere.prof.nom} ${matiere.prof.prenom}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(matiere)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMatiere(matiere.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="text-sm font-medium mb-2">Horaires:</h4>
                {matiere.cours &&
                Array.isArray(matiere.cours) &&
                matiere.cours.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {matiere.cours.map((cours) => (
                      <div
                        key={cours.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm"
                      >
                        <span>
                          {new Date(cours.jour).toLocaleDateString("fr-FR")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCours(cours.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Aucun horaire défini
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
