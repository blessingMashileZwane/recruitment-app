import { Field, ID, ObjectType } from "type-graphql";
import { CandidateStatus, AppliedJob, AppliedJobStatus } from "./index";

@ObjectType()
export class CandidateSkillOutput {
	@Field(() => ID)
	id: string;

	@Field()
	candidateId: string;

	@Field()
	university: string;

	@Field()
	qualification: string;

	@Field()
	yearsOfExperience: number;

	@Field({ nullable: true })
	proficiencyLevel?: number;

	@Field({ nullable: true })
	possessedSkills?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class InterviewStageOutput {
	@Field(() => ID)
	id: string;

	@Field()
	name: string;

	@Field()
	feedback: string;

	@Field()
	rating: number;

	@Field()
	nextStepNotes: string;

	@Field()
	jobApplicationId: string;

	@Field()
	progressToNextStage: boolean;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class JobApplicationOutput {
	@Field(() => ID)
	id: string;

	@Field()
	candidateId: string;

	@Field(() => AppliedJob)
	appliedJob: AppliedJob;

	@Field(() => AppliedJobStatus)
	applicationStatus: AppliedJobStatus;

	@Field({ nullable: true })
	appliedJobOther?: string;

	@Field()
	isActive: boolean;

	@Field(() => [InterviewStageOutput])
	interviewStages: InterviewStageOutput[];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class CandidateOutput {
	@Field(() => ID)
	id: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;

	@Field({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	currentLocation?: string;

	@Field({ nullable: true })
	citizenship?: string;

	@Field(() => CandidateStatus)
	status: CandidateStatus;

	@Field({ nullable: true })
	resumeUrl?: string;

	@Field(() => CandidateSkillOutput)
	candidateSkill: CandidateSkillOutput;

	@Field(() => [JobApplicationOutput])
	jobApplications: JobApplicationOutput[];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class BulkCreateFailure {
	@Field()
	email: string;

	@Field()
	reason: string;
}

@ObjectType()
export class BulkCreateCandidatesOutput {
	@Field(() => [CandidateOutput])
	success: CandidateOutput[];

	@Field(() => [BulkCreateFailure])
	failed: BulkCreateFailure[];

	@Field()
	totalProcessed: number;

	@Field()
	successCount: number;

	@Field()
	failureCount: number;

	@Field()
	processingTimeMs: number;
}

@ObjectType()
export class CandidateBasicOutput {
	@Field(() => ID)
	id: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;

	@Field({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	currentLocation?: string;

	@Field({ nullable: true })
	citizenship?: string;

	@Field(() => CandidateStatus)
	status: CandidateStatus;

	@Field({ nullable: true })
	resumeUrl?: string;

	@Field(() => AppliedJob, { nullable: true })
	appliedJob?: AppliedJob;

	@Field(() => AppliedJobStatus, { nullable: true })
	applicationStatus?: AppliedJobStatus;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class CandidateListResponse {
	@Field(() => [CandidateBasicOutput])
	items: CandidateBasicOutput[];

	@Field()
	total: number;

	@Field()
	page: number;

	@Field()
	pageSize: number;

	@Field()
	totalPages: number;
}
