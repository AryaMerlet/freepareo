import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({ className, ...props }) {
	const [email, setemail] = useState("");
	const [password, setPassword] = useState("");
	const { signInWithEmail, user } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		await signInWithEmail(formData.get("email"), formData.get("password"));
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									value={email}
									onChange={(e) => setemail(e.target.value)}
									placeholder="Entrez votre e-mail	"
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>

									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input
									id="password"
									type="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Mot de passe"
									required
								/>
							</Field>
							<Field>
								<Button type="submit">Login</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
