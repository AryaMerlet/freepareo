export enum Role {
	ADMIN = "admin",
	PROF = "prof",
	ELEVE = "eleve",
}
export const roleHierarchy: Role[] = [Role.ELEVE, Role.PROF, Role.ADMIN];

export function isAdmin(role: Role): boolean {
	return role === Role.ADMIN;
}
export function isProf(role: Role): boolean {
	return role === Role.PROF;
}
