import type { Candidate, Feedback, User } from "../types";

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

	getCandidates: async (): Promise<Candidate[]> => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				position: "Frontend Developer",
				status: "technical",
				experience: 3,
				skills: ["React", "TypeScript", "CSS"],
				addedDate: "2024-01-15",
			},
			{
				id: "2",
				name: "Jane Smith",
				email: "jane@example.com",
				position: "Backend Developer",
				status: "screening",
				experience: 5,
				skills: ["Node.js", "Python", "PostgreSQL"],
				addedDate: "2024-01-16",
			},
		];
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
};
