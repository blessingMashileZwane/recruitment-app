import { CandidateStatus, AppliedJob, AppliedJobStatus } from "./enums";

export interface CandidateSkillOutput {
	id: string;
	university: string;
	qualification: string;
	proficiencyLevel: number;
	yearsOfExperience: number;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

export interface InterviewStageOutput {
	id: string;
	name: string;
	feedback: string;
	interviewerName: string;
	rating: number;
	nextStepNotes: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

export interface JobApplicationOutput {
	id: string;
	title: string;
	appliedJob?: AppliedJob;
	applicationStatus?: AppliedJobStatus;
	department?: string;
	requirements?: string;
	isActive: boolean;
	interviewStages: InterviewStageOutput[];
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
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
	jobApplications: JobApplicationOutput[];
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

export interface CandidateListResponse {
	items: CandidateOutput[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
