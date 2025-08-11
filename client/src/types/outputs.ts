import { CandidateStatus, AppliedJob } from "./enums";

export interface CandidateSkillOutput {
	id: string;
	university: string;
	qualification: string;
	proficiencyLevel: number;
	createdAt: string;
	updatedAt: string;
}

export interface InterviewStageOutput {
	id: string;
	name: string;
	description?: string;
	feedback: string;
	interviewerName: string;
	rating: number;
	comments: string;
	nextStepNotes: string;
	createdAt: string;
	updatedAt: string;
}

export interface JobApplicationOutput {
	id: string;
	title: string;
	status: AppliedJob;
	department?: string;
	description?: string;
	requirements?: string;
	isActive: boolean;
	interviewStages: InterviewStageOutput[];
	createdAt: string;
	updatedAt: string;
}

export interface CandidateOutput {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	currentLocation?: string;
	citizenship?: string;
	status: CandidateStatus;
	resumeUrl?: string;
	candidateSkill: CandidateSkillOutput;
	jobApplication: JobApplicationOutput;
	createdAt: string;
	updatedAt: string;
}

export interface CandidateListResponse {
	items: CandidateOutput[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
