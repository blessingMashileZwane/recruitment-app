import type { User } from "../types";
import type {
	CreateCandidateInput,
	CreateInterviewStageInput,
	UpdateCandidateInput,
	UpdateInterviewStageInput,
} from "../types/inputs";
import type {
	CandidateListResponse,
	CandidateOutput,
	InterviewStageOutput,
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
          candidateSkill {
            id
            university
            qualification
            proficiencyLevel
            createdAt
            updatedAt
          }
          jobApplications {
            id
            title
            appliedJob
            applicationStatus
            department
            description
            requirements
            isActive
            createdAt
            createdBy
            updatedAt
            updatedBy
            interviewStages {
              id
              name
              feedback
              interviewerName
              rating
              nextStepNotes
              createdBy
              createdAt
              updatedAt
              updatedBy
            }
          }
        }
      }
    `;

		const { candidate } = await this.query<{ candidate: CandidateOutput }>(
			query,
			{
				id,
			}
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
    }
  `;

		console.log({ candidate });

		const { createFullCandidate } = await this.query<{
			createFullCandidate: CandidateOutput;
		}>(query, { fullCandidate: candidate });

		return createFullCandidate;
	}

	async addCandidate(
		candidate: CreateCandidateInput
	): Promise<CandidateOutput> {
		const query = `
      mutation CreateCandidate($input: CreateCandidateInput!) {
        createCandidate(input: $input) {
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
          candidateSkill {
            id
            university
            qualification
            proficiencyLevel
            createdAt
            updatedAt
          }
          jobApplication {
            id
            title
            status
            department
            description
            requirements
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;

		const { createCandidate } = await this.query<{
			createCandidate: CandidateOutput;
		}>(query, { input: candidate });
		return createCandidate;
	}

	async getFeedback(candidateId: string): Promise<InterviewStageOutput[]> {
		const query = `
      query GetFeedback($candidateId: ID!) {
        feedback(candidateId: $candidateId) {
          id
          candidateId
          interviewerName
          interviewStep
          rating
          comments
          nextStepNotes
          date
        }
      }
    `;

		const { feedback } = await this.query<{ feedback: InterviewStageOutput[] }>(
			query,
			{
				candidateId,
			}
		);
		return feedback;
	}

	async getFeedbackById(feedbackId: string): Promise<InterviewStageOutput> {
		const query = `
      query GetFeedbackById($id: ID!) {
        feedbackById(id: $id) {
          id
          candidateId
          interviewerName
          interviewStep
          rating
          comments
          nextStepNotes
          date
        }
      }
    `;

		const { feedbackById } = await this.query<{
			feedbackById: InterviewStageOutput;
		}>(query, { id: feedbackId });
		return feedbackById;
	}

	async addFeedback(
		feedback: Omit<CreateInterviewStageInput, "id" | "date">
	): Promise<InterviewStageOutput> {
		const query = `
      mutation CreateFeedback($input: FeedbackInput!) {
        createFeedback(input: $input) {
          id
          candidateId
          interviewerName
          interviewStep
          rating
          comments
          nextStepNotes
          date
        }
      }
    `;

		const { createFeedback } = await this.query<{
			createFeedback: InterviewStageOutput;
		}>(query, { input: feedback });
		return createFeedback;
	}

	async updateFeedback(
		feedback: Omit<UpdateInterviewStageInput, "date">
	): Promise<InterviewStageOutput> {
		const query = `
      mutation UpdateFeedback($id: ID!, $input: FeedbackInput!) {
        updateFeedback(id: $id, input: $input) {
          id
          candidateId
          interviewerName
          interviewStep
          rating
          comments
          nextStepNotes
          date
        }
      }
    `;

		const { updateFeedback } = await this.query<{
			updateFeedback: InterviewStageOutput;
		}>(query, {
			id: feedback.id,
			input: { ...feedback, id: undefined },
		});
		return updateFeedback;
	}

	async updateCandidate(
		candidate: UpdateCandidateInput
	): Promise<CandidateOutput> {
		const query = `
      mutation UpdateCandidate($input: UpdateCandidateInput!) {
        updateCandidate(input: $input) {
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
          candidateSkill {
            id
            university
            qualification
            proficiencyLevel
            createdAt
            updatedAt
          }
          jobApplication {
            id
            title
            status
            department
            description
            requirements
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;

		const { updateCandidate } = await this.query<{
			updateCandidate: CandidateOutput;
		}>(query, { input: candidate });

		return updateCandidate;
	}

	async getCandidatesList(
		page?: number,
		limit?: number,
		status?: string,
		search?: string,
		position?: string,
		sortBy?: string,
		sortOrder?: string
	): Promise<CandidateListResponse> {
		const query = `
    query GetCandidates(
      $page: Int!
      $limit: Int!
      $status: String
      $search: String
      $position: String
      $sortBy: String
      $sortOrder: String
    ) {
      candidates(
        page: $page
        limit: $limit
        status: $status
        search: $search
        position: $position
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
        }
        total
        page
        pageSize
        totalPages
      }
    }
  `;

		const variables = {
			page: Number(page ?? 1),
			limit: Number(limit ?? 10),
			status: status ?? null,
			search: search ?? null,
			position: position ?? null,
			sortBy: sortBy ?? null,
			sortOrder: sortOrder ?? null,
		};

		const { candidates } = await this.query<{
			candidates: CandidateListResponse;
		}>(query, variables);

		return candidates;
	}

	async addCandidatesBulk(candidates: CreateCandidateInput[]): Promise<{
		success: CandidateOutput[];
		failed: { email: string; reason: string }[];
	}> {
		const query = `
      mutation BulkCreateCandidates($input: [CreateCandidateInput!]!) {
        bulkCreateCandidates(input: $input) {
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
            candidateSkill {
              id
              university
              qualification
              proficiencyLevel
              createdAt
              updatedAt
            }
            jobApplication {
              id
              title
              status
              department
              description
              requirements
              isActive
              createdAt
              updatedAt
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
		}>(query, { input: candidates });

		return bulkCreateCandidates;
	}
}

export const graphqlService = new GraphQLService();
