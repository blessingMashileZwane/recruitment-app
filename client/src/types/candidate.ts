import { AppliedJob } from "./enums";

export type SkillData = {
	university: string;
	qualification: string;
	proficiencyLevel: number;
	yearsOfExperience?: number; // Optional for backward compatibility
};

export type JobData = {
	title: string;
	appliedJob?: AppliedJob;
	department?: string;
	requirements?: string;
	isActive: boolean;
};

export type CandidateFormData = {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	currentLocation?: string;
	citizenship?: string;
	resumeUrl?: string;
};

export type ModalType = "skill" | "job" | null;
