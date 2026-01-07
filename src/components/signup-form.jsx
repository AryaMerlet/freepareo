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
import { useState } from "react";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from "./ui/select";
import { useAuth } from "../context/authContext";

export function SignupForm({ ...props }) {
	const [role, setRole] = useState("");
	const [email, setemail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const { signUpNewUser } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		if (formData.get("password") !== formData.get("confirm-password")) {
			alert("Passwords do not match");
			return;
		}
		await signUpNewUser(
			formData.get("email"),
			formData.get("password"),
			formData.get("nom"),
			formData.get("prenom"),
			role
		);
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
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								required
							/>
							<FieldDescription>
								Must be at least 8 characters long.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm-password">
								Confirm Password
							</FieldLabel>
							<Input
								id="confirm-password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								type="password"
								required
							/>
							<FieldDescription>Please confirm your password.</FieldDescription>
						</Field>
						<FieldGroup>
							<Field>
								<Button type="submit">Create Account</Button>
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
