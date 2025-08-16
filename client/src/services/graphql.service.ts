import type { User } from "../types";
import type {
	CandidateFilterInput,
	CreateCandidateInput,
	CreateCandidateSkillInput,
	CreateInterviewStageInput,
	CreateJobApplicationInput,
	SortInput,
	UpdateCandidateInput,
	UpdateCandidateSkillInput,
	UpdateInterviewStageInput,
	UpdateJobApplicationInput,
} from "../types/inputs";
import type {
	CandidateListResponse,
	CandidateOutput,
	CandidateSkillOutput,
	InterviewStageOutput,
	JobApplicationOutput,
} from "../types/outputs";

export class GraphQLService {
	private endpoint = "http://localhost:5000/graphql";

	private async query<T>(
		query: string,
		variables?: Record<string, any>
	): Promise<T> {
		const response = await fetch(this.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const { data, errors } = await response.json();
		if (errors) {
			throw new Error(errors[0].message);
		}

		return data;
	}

	async authenticate(email: string, password: string): Promise<User | null> {
		const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          name
          email
          role
        }
      }
    `;

		const { login } = await this.query<{ login: User }>(query, {
			email,
			password,
		});
		return login;
	}

	async authenticateSSO(): Promise<User | null> {
		const query = `
      mutation LoginSSO {
        loginSSO {
          id
          name
          email
          role
        }
      }
    `;

		const { loginSSO } = await this.query<{ loginSSO: User }>(query);
		return loginSSO;
	}

	async getCandidatesList(
		page?: number,
		limit?: number,
		filter?: CandidateFilterInput,
		sort?: SortInput
	): Promise<CandidateListResponse> {
		const query = `
    query GetCandidates(
      $page: Int!
      $limit: Int!
      $status: String
      $search: String
      $jobStatus: String
      $jobType: String
      $sortBy: CandidateSortField
      $sortOrder: SortOrder
    ) {
      candidates(
        page: $page
        limit: $limit
        status: $status
        search: $search
        jobStatus: $jobStatus
        jobType: $jobType
        sortBy: $sortBy
        sortOrder: $sortOrder
      ) {
        items {
          id
          firstName
          lastName
          email
          phone
          currentLocation
          citizenship
          status
          resumeUrl
          createdAt
          updatedAt
          createdBy
          updatedBy
          appliedJob
          applicationStatus
        }
        total
        page
        pageSize
        totalPages
      }
    }
  `;

		const variables = {
			page: page ?? 1,
			limit: limit ?? 10,
			status: filter?.status?.toLowerCase(),
			search: filter?.search,
			jobStatus: filter?.jobStatus?.toLowerCase(),
			jobType: filter?.jobType?.toLowerCase(),
			sortBy: sort?.field,
			sortOrder: sort?.direction,
		};

		const { candidates } = await this.query<{
			candidates: CandidateListResponse;
		}>(query, variables);

		return candidates;
	}

	async getCandidateById(id: string): Promise<CandidateOutput> {
		const query = `
    query GetCandidate($id: ID!) {
      candidate(id: $id) {
        id
        firstName
        lastName
        email
        phone
        currentLocation
        citizenship
        status
        resumeUrl
        createdAt
        updatedAt
      }
    }
  `;

		console.log({ id });

		const { candidate } = await this.query<{ candidate: CandidateOutput }>(
			query,
			{ id }
		);

		return candidate;
	}

	async createFullCandidate(
		candidate: CreateCandidateInput
	): Promise<CandidateOutput> {
		const query = `
    mutation CreateFullCandidate($fullCandidate: CreateCandidateInput!) {
      createFullCandidate(fullCandidate: $fullCandidate) {
        id
        firstName
        lastName
        email
        phone
        currentLocation
        citizenship
        status
        resumeUrl
        createdAt
        updatedAt
        createdBy
        updatedBy
        candidateSkill {
          id
          university
          qualification
          proficiencyLevel
          yearsOfExperience
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
        jobApplications {
          id
          appliedJob
          applicationStatus
          isActive
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
    }
  `;

		const { createFullCandidate } = await this.query<{
			createFullCandidate: CandidateOutput;
		}>(query, { fullCandidate: candidate });
		return createFullCandidate;
	}

	async addCandidatesBulk(candidates: CreateCandidateInput[]): Promise<{
		success: CandidateOutput[];
		failed: { email: string; reason: string }[];
	}> {
		const query = `
    mutation BulkCreateCandidates($fullCandidates: [CreateCandidateInput!]!) {
      bulkCreateCandidates(input: $fullCandidates) {
        success {
          id
          firstName
          lastName
          email
          phone
          currentLocation
          citizenship
          status
          resumeUrl
          createdAt
          updatedAt
          createdBy
          updatedBy
          candidateSkill {
            id
            university
            qualification
            proficiencyLevel
            yearsOfExperience
            createdAt
            updatedAt
            createdBy
            updatedBy
          }
          jobApplications {
            id
            title
            appliedJob
            applicationStatus
            department
            requirements
            isActive
            createdAt
            updatedAt
            createdBy
            updatedBy
          }
        }
        failed {
          email
          reason
        }
      }
    }
  `;

		const { bulkCreateCandidates } = await this.query<{
			bulkCreateCandidates: {
				success: CandidateOutput[];
				failed: { email: string; reason: string }[];
			};
		}>(query, { fullCandidates: candidates });

		return bulkCreateCandidates;
	}

	async updateCandidate(
		id: string,
		candidate: UpdateCandidateInput
	): Promise<CandidateOutput> {
		const query = `
    mutation UpdateCandidate($id: ID!, $candidate: UpdateCandidateInput!) {
      updateCandidate(id: $id, candidate: $candidate) {
        id
        firstName
        lastName
        email
        phone
        currentLocation
        citizenship
        status
        resumeUrl
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const { updateCandidate } = await this.query<{
			updateCandidate: CandidateOutput;
		}>(query, { id, candidate });

		return updateCandidate;
	}

	async getCandidateSkillByCandidateId(
		candidateId: string
	): Promise<CandidateSkillOutput[]> {
		const query = `
    query GetCandidateSkillsByCandidate($candidateId: ID!) {
      candidateSkillsByCandidate(candidateId: $candidateId) {
        id
        university
        qualification
        proficiencyLevel
        yearsOfExperience
        possessedSkills
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const { candidateSkillsByCandidate } = await this.query<{
			candidateSkillsByCandidate: CandidateSkillOutput[];
		}>(query, { candidateId });

		return candidateSkillsByCandidate;
	}

	async addSkillToCandidate(
		candidateId: string,
		candidateSkill: CreateCandidateSkillInput
	): Promise<CandidateSkillOutput> {
		const query = `
    mutation AddSkillToCandidate(
      $candidateId: ID!,
      $candidateSkill: CreateCandidateSkillInput!
    ) {
      addSkillToCandidate(
        candidateId: $candidateId,
        candidateSkill: $candidateSkill
      ) {
        id
        university
        qualification
        proficiencyLevel
        yearsOfExperience
        createdAt
        updatedAt
      }
    }
  `;

		const { addSkillToCandidate } = await this.query<{
			addSkillToCandidate: CandidateSkillOutput;
		}>(query, { candidateId, candidateSkill });

		return addSkillToCandidate;
	}

	async updateCandidateSkill(
		skill: UpdateCandidateSkillInput
	): Promise<CandidateSkillOutput> {
		const query = `
    mutation UpdateCandidateSkill($input: UpdateCandidateSkillInput!) {
      updateCandidateSkill(input: $input) {
        id
        university
        qualification
        proficiencyLevel
        yearsOfExperience
        possessedSkills
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const { updateCandidateSkill } = await this.query<{
			updateCandidateSkill: CandidateSkillOutput;
		}>(query, { input: skill });

		return updateCandidateSkill;
	}

	async getJobApplicationsByCandidateId(
		candidateId: string
	): Promise<JobApplicationOutput[]> {
		const query = `
    query JobApplicationsByCandidateId($candidateId: ID!) {
      jobApplicationsByCandidateId(candidateId: $candidateId) {
        id
        candidateId
        appliedJob
        applicationStatus
        appliedJobOther
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const { jobApplicationsByCandidateId } = await this.query<{
			jobApplicationsByCandidateId: JobApplicationOutput[];
		}>(query, { candidateId });

		console.log({ jobApplicationsByCandidateId });

		return jobApplicationsByCandidateId;
	}

	async addJobApplicationToCandidate(
		candidateId: string,
		jobApplication: CreateJobApplicationInput
	): Promise<JobApplicationOutput> {
		const query = `
    mutation AddJobApplicationToCandidate(
      $candidateId: ID!,
      $jobApplication: CreateJobApplicationInput!
    ) {
      addJobApplicationToCandidate(
        candidateId: $candidateId,
        jobApplication: $jobApplication
      ) {
        id
        title
        appliedJob
        applicationStatus
        department
        requirements
        isActive
        createdAt
        updatedAt
      }
    }
  `;

		const { addJobApplicationToCandidate } = await this.query<{
			addJobApplicationToCandidate: JobApplicationOutput;
		}>(query, { candidateId, jobApplication });

		return addJobApplicationToCandidate;
	}

	async updateJobApplication(
		jobApp: UpdateJobApplicationInput
	): Promise<JobApplicationOutput> {
		const query = `
    mutation UpdateJobApplication($input: UpdateJobApplicationInput!) {
      updateJobApplication(input: $input) {
        id
        title
        appliedJob
        applicationStatus
        department
        requirements
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
        interviewStages {
          id
          name
          feedback
          interviewerName
          rating
          nextStepNotes
          createdAt
          updatedAt
          createdBy
          updatedBy
        }
      }
    }
  `;

		const { updateJobApplication } = await this.query<{
			updateJobApplication: JobApplicationOutput;
		}>(query, { input: jobApp });

		return updateJobApplication;
	}

	async getInterviewStagesByJobId(
		jobApplicationId: string
	): Promise<InterviewStageOutput[]> {
		const query = `
    query GetInterviewStages($jobApplicationId: ID!) {
      interviewStages(jobApplicationId: $jobApplicationId) {
        id
        name
        feedback
        interviewerName
        rating
        nextStepNotes
        comments
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const { interviewStages } = await this.query<{
			interviewStages: InterviewStageOutput[];
		}>(query, { jobApplicationId });

		return interviewStages;
	}

	async updateInterviewStage(
		stage: UpdateInterviewStageInput
	): Promise<InterviewStageOutput> {
		const query = `
    mutation UpdateInterviewStage($input: UpdateInterviewStageInput!) {
      updateInterviewStage(input: $input) {
        id
        name
        feedback
        interviewerName
        rating
        nextStepNotes
        comments
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const { updateInterviewStage } = await this.query<{
			updateInterviewStage: InterviewStageOutput;
		}>(query, { input: stage });

		return updateInterviewStage;
	}

	async addInterviewStageToJob(
		jobApplicationId: string,
		stageData: Omit<CreateInterviewStageInput, "jobApplicationId">
	): Promise<InterviewStageOutput> {
		const query = `
    mutation AddInterviewStage($input: CreateInterviewStageInput!) {
      createInterviewStage(input: $input) {
        id
        name
        feedback
        interviewerName
        rating
        nextStepNotes
        comments
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
    }
  `;

		const input: CreateInterviewStageInput = {
			...stageData,
			jobApplicationId,
		};

		const { createInterviewStage } = await this.query<{
			createInterviewStage: InterviewStageOutput;
		}>(query, { input });

		return createInterviewStage;
	}
}

export const graphqlService = new GraphQLService();
