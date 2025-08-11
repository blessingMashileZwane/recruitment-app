interface User {
	id: string;
	name: string;
	email: string;
	role: "recruiter" | "interviewer" | "admin";
}

interface AuthContextType {
	user: User | null;
	isLoggedIn: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	loginWithSSO: () => Promise<boolean>;
	logout: () => void;
}

export type { User, AuthContextType };
