interface Candidate {
	id: string;
	name: string;
	email: string;
	position: string;
	status: "screening" | "technical" | "final" | "hired" | "rejected";
	experience: number;
	skills: string[];
	addedDate: string;
}

interface Feedback {
	id: string;
	candidateId: string;
	interviewerName: string;
	interviewStep: string;
	rating: number;
	comments: string;
	nextStepNotes: string;
	date: string;
}

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

export type { Candidate, Feedback, User, AuthContextType };
