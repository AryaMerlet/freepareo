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
import { useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";

export function SetPasswordForm({ ...props }) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		// if (password.length < 8) {
		// 	alert("Password must be at least 8 characters long");
		// 	return;
		// }

		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({
				password: password,
			});

			if (error) throw error;

			alert("Password set successfully! You can now log in.");
			navigate("/login");
		} catch (error) {
			console.error("Error setting password:", error);
			alert("Error setting password: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Set Your Password</CardTitle>
				<CardDescription>
					Create a password for your account to complete setup.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
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
						<Field>
							<Button type="submit" disabled={loading}>
								{loading ? "Setting password..." : "Set Password"}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}

export default SetPasswordForm;
