import { AppliedJob, AppliedJobStatus, CandidateStatus } from "./enums";

export interface CandidateSkillOutput {
	id: string;
	candidateId: string;
	university: string;
	qualification: string;
	proficiencyLevel: number;
	yearsOfExperience: number;
	possessedSkills?: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

export interface InterviewStageOutput {
	id: string;
	name: string;
	feedback: string;
	rating: number;
	nextStepNotes: string;
	progressToNextStage: boolean;
	jobApplicationId: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
}

export interface JobApplicationOutput {
	id: string;
	candidateId: string;
	appliedJob?: AppliedJob;
	applicationStatus?: AppliedJobStatus;
	appliedJobOther?: string;
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
