import type { Candidate, Feedback, User } from "../types";

interface PaginatedCandidates {
	candidates: Candidate[];
	total: number;
	totalPages: number;
}

export const mockGraphQL = {
	authenticate: async (
		email: string,
		password: string
	): Promise<User | null> => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		// Mock authentication - in real app, this would validate credentials
		if (email && password) {
			return {
				id: "1",
				name: "John Recruiter",
				email: email,
				role: "recruiter",
			};
		}
		return null;
	},

	authenticateSSO: async (): Promise<User | null> => {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return {
			id: "2",
			name: "Jane Admin",
			email: "jane@company.com",
			role: "admin",
		};
	},

	getCandidateById: async (id: string): Promise<Candidate> => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			id,
			name: "John Doe",
			email: "john@example.com",
			position: "Frontend Developer",
			status: "technical" as const,
			experience: 3,
			skills: ["React", "TypeScript", "CSS"],
			addedDate: "2024-01-15",
		};
	},

	getCandidates: async (): Promise<PaginatedCandidates> => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const candidates = [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				position: "Frontend Developer",
				status: "technical" as const,
				experience: 3,
				skills: ["React", "TypeScript", "CSS"],
				addedDate: "2024-01-15",
			},
			{
				id: "2",
				name: "Jane Smith",
				email: "jane@example.com",
				position: "Backend Developer",
				status: "screening" as const,
				experience: 5,
				skills: ["Node.js", "Python", "PostgreSQL"],
				addedDate: "2024-01-16",
			},
			{
				id: "3",
				name: "Alice Johnson",
				email: "alice@example.com",
				position: "Full Stack Developer",
				status: "final" as const,
				experience: 4,
				skills: ["React", "Node.js", "MongoDB"],
				addedDate: "2024-01-17",
			},
			{
				id: "4",
				name: "Bob Wilson",
				email: "bob@example.com",
				position: "DevOps Engineer",
				status: "hired" as const,
				experience: 6,
				skills: ["AWS", "Docker", "Kubernetes"],
				addedDate: "2024-01-18",
			},
			{
				id: "5",
				name: "Carol Brown",
				email: "carol@example.com",
				position: "UI/UX Designer",
				status: "rejected" as const,
				experience: 2,
				skills: ["Figma", "Sketch", "Adobe XD"],
				addedDate: "2024-01-19",
			},
			{
				id: "6",
				name: "David Lee",
				email: "david@example.com",
				position: "Data Scientist",
				status: "screening" as const,
				experience: 7,
				skills: ["Python", "Machine Learning", "SQL"],
				addedDate: "2024-01-20",
			},
		];
		const total = candidates.length;
		const totalPages = Math.ceil(total / 10);
		return {
			candidates,
			total,
			totalPages,
		};
	},

	addCandidate: async (
		candidate: Omit<Candidate, "id" | "addedDate">
	): Promise<Candidate> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			...candidate,
			id: Date.now().toString(),
			addedDate: new Date().toISOString().split("T")[0],
		};
	},

	getFeedback: async (candidateId: string): Promise<Feedback[]> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return [
			{
				id: "1",
				candidateId,
				interviewerName: "Alice Johnson",
				interviewStep: "Technical Interview",
				rating: 4,
				comments:
					"Strong technical skills, good problem-solving approach. Demonstrated solid understanding of React concepts and was able to implement the coding challenge efficiently.",
				nextStepNotes:
					"Recommend for final interview. Focus on system design questions and leadership scenarios.",
				date: "2024-01-20",
			},
		];
	},

	getFeedbackById: async (feedBackId: string): Promise<Feedback> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id: "1",
			candidateId: feedBackId,
			interviewerName: "Alice Johnson",
			interviewStep: "Technical Interview",
			rating: 4,
			comments:
				"Strong technical skills, good problem-solving approach. Demonstrated solid understanding of React concepts and was able to implement the coding challenge efficiently.",
			nextStepNotes:
				"Recommend for final interview. Focus on system design questions and leadership scenarios.",
			date: "2024-01-20",
		};
	},

	addFeedback: async (
		feedback: Omit<Feedback, "id" | "date">
	): Promise<Feedback> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			...feedback,
			id: Date.now().toString(),
			date: new Date().toISOString().split("T")[0],
		};
	},

	updateFeedback: async (
		feedback: Omit<Feedback, "id" | "date">
	): Promise<Feedback> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			...feedback,
			id: Date.now().toString(),
			date: new Date().toISOString().split("T")[0],
		};
	},

	updateCandidate: async (
		candidate: Omit<Candidate, "id" | "addedDate">
	): Promise<Candidate> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			...candidate,
			id: Date.now().toString(),
			addedDate: new Date().toISOString().split("T")[0],
		};
	},
};
