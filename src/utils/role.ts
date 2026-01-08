export enum Role {
	ADMIN = "admin",
	PROF = "prof",
	ELEVE = "eleve",
}
export const roleHierarchy: Role[] = [Role.ELEVE, Role.PROF, Role.ADMIN];

export function isAdmin(user: any): boolean {
	return user?.profile?.role === Role.ADMIN;
}
export function isProf(user: any): boolean {
	return user?.profile?.role === Role.PROF;
}
