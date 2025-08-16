import {
	CandidateStatus,
	AppliedJob,
	AppliedJobStatus,
	CandidateSortField,
	SortOrder,
} from "./enums";

export interface CreateCandidateSkillInput {
	university: string;
	qualification: string;
	proficiencyLevel: number;
}

export interface UpdateCandidateSkillInput {
	id: string;
	university?: string;
	qualification?: string;
	proficiencyLevel?: number;
}

export interface CreateInterviewStageInput {
	name: string;
	feedback: string;
	interviewerName: string;
	rating: number;
	nextStepNotes: string;
	jobApplicationId: string;
}

export interface UpdateInterviewStageInput {
	id: string;
	name?: string;
	feedback?: string;
	interviewerName?: string;
	rating?: number;
	nextStepNotes?: string;
}

export interface CreateJobApplicationInput {
	title: string;
	appliedJob?: AppliedJob;
	applicationStatus?: AppliedJobStatus;
	department?: string;
	requirements?: string;
	isActive: boolean;
}

export interface UpdateJobApplicationInput {
	id: string;
	title?: string;
	appliedJob?: AppliedJob;
	applicationStatus?: AppliedJobStatus;
	department?: string;
	requirements?: string;
	isActive?: boolean;
}

export interface CreateCandidateInput {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	currentLocation?: string;
	citizenship?: string;
	status: CandidateStatus;
	resumeUrl?: string;
	candidateSkill: CreateCandidateSkillInput;
	jobApplications: CreateJobApplicationInput[];
}

export interface UpdateCandidateInput {
	id: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	currentLocation?: string;
	citizenship?: string;
	status?: CandidateStatus;
	resumeUrl?: string;
}

export interface CandidateFilterInput {
	search?: string;
	status?: CandidateStatus;
	jobType?: AppliedJob;
	jobStatus?: AppliedJobStatus;
}

export interface SortInput {
	field: CandidateSortField;
	direction: SortOrder;
}

export interface PaginationInput {
	page: number;
	pageSize: number;
}
