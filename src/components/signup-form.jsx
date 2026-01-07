import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Role } from "@/utils/role";
import { useState, useEffect } from "react";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from "./ui/select";
import { useAuth } from "../context/authContext";
import { getGroupes } from "../services/groupeService";

export function SignupForm({ ...props }) {
	const [role, setRole] = useState("");
	const [email, setemail] = useState("");
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [groupes, setGroupes] = useState([]);
	const [selectedGroupe, setSelectedGroupe] = useState("");
	const { signUpNewUser } = useAuth();

	useEffect(() => {
		const fetchGroupes = async () => {
			try {
				const data = await getGroupes();
				setGroupes(data);
			} catch (error) {
				console.error("Error loading groupes:", error);
			}
		};
		fetchGroupes();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		try {
			await signUpNewUser(
				formData.get("email"),
				formData.get("nom"),
				formData.get("prenom"),
				role,
				selectedGroupe
			);
			alert(
				"User invited successfully! They will receive an email to set their password."
			);
		} catch (error) {
			alert("Error inviting user: " + error.message);
		}
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter the informations below to create an account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="prenom">Prénom</FieldLabel>
							<Input
								id="prenom"
								name="prenom"
								value={prenom}
								onChange={(e) => setPrenom(e.target.value)}
								type="text"
								placeholder="John"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="nom">NOM</FieldLabel>
							<Input
								id="nom"
								name="nom"
								value={nom}
								onChange={(e) => setNom(e.target.value)}
								type="text"
								placeholder="DOE"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(e) => setemail(e.target.value)}
								placeholder="m@example.com"
								required
							/>
							<FieldDescription>
								We&apos;ll use this to contact you. We will not share your email
								with anyone else.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="role">Role</FieldLabel>
							<Select value={role} onValueChange={(value) => setRole(value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={Role.ADMIN}>Admin</SelectItem>
									<SelectItem value={Role.PROF}>Professeur</SelectItem>
									<SelectItem value={Role.ELEVE}>Elève</SelectItem>
								</SelectContent>
							</Select>
							<FieldDescription>
								User will receive an email to set their password.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="groupe">Groupe</FieldLabel>
							<Select
								value={selectedGroupe}
								onValueChange={(value) => setSelectedGroupe(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select groupe" />
								</SelectTrigger>
								<SelectContent>
									{groupes.map((g) => (
										<SelectItem key={g.id} value={g.id}>
											{g.nom} ({g.annee})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldDescription>
								Select the user's group.
							</FieldDescription>
						</Field>
						<FieldGroup>
							<Field>
								<Button type="submit">Invite User</Button>
								{/* <Button variant="outline" type="button">
									Sign up with Google
								</Button>
								<FieldDescription className="px-6 text-center">
									Already have an account? <a href="#">Sign in</a>
								</FieldDescription> */}
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}

export default SignupForm;
