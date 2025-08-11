import type { Candidate, Feedback, User } from "../types";

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

	async getCandidateById(id: string): Promise<Candidate> {
		const query = `
      query GetCandidate($id: ID!) {
        candidate(id: $id) {
          id
          name
          email
          position
          status
          experience
          skills
          addedDate
        }
      }
    `;

		const { candidate } = await this.query<{ candidate: Candidate }>(query, {
			id,
		});
		return candidate;
	}

	async getCandidates(): Promise<{
		candidates: Candidate[];
		total: number;
		totalPages: number;
	}> {
		const query = `
      query GetCandidates {
        candidates {
          items {
            id
            name
            email
            position
            status
            experience
            skills
            addedDate
          }
          total
          totalPages
        }
      }
    `;

		return this.query<{
			candidates: { items: Candidate[]; total: number; totalPages: number };
		}>(query).then((data) => ({
			candidates: data.candidates.items,
			total: data.candidates.total,
			totalPages: data.candidates.totalPages,
		}));
	}

	async addCandidate(
		candidate: Omit<Candidate, "id" | "addedDate">
	): Promise<Candidate> {
		const query = `
      mutation CreateCandidate($input: CandidateInput!) {
        createCandidate(input: $input) {
          id
          name
          email
          position
          status
          experience
          skills
          addedDate
        }
      }
    `;

		const { createCandidate } = await this.query<{
			createCandidate: Candidate;
		}>(query, { input: candidate });
		return createCandidate;
	}

	async getFeedback(candidateId: string): Promise<Feedback[]> {
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

		const { feedback } = await this.query<{ feedback: Feedback[] }>(query, {
			candidateId,
		});
		return feedback;
	}

	async getFeedbackById(feedbackId: string): Promise<Feedback> {
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

		const { feedbackById } = await this.query<{ feedbackById: Feedback }>(
			query,
			{ id: feedbackId }
		);
		return feedbackById;
	}

	async addFeedback(
		feedback: Omit<Feedback, "id" | "date">
	): Promise<Feedback> {
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

		const { createFeedback } = await this.query<{ createFeedback: Feedback }>(
			query,
			{ input: feedback }
		);
		return createFeedback;
	}

	async updateFeedback(feedback: Omit<Feedback, "date">): Promise<Feedback> {
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

		const { updateFeedback } = await this.query<{ updateFeedback: Feedback }>(
			query,
			{
				id: feedback.id,
				input: { ...feedback, id: undefined },
			}
		);
		return updateFeedback;
	}

	async updateCandidate(
		candidate: Omit<Candidate, "addedDate">
	): Promise<Candidate> {
		// Map client status to server status
		const statusMap: Record<string, string> = {
			screening: "ACTIVE",
			technical: "ACTIVE",
			final: "ACTIVE",
			hired: "HIRED",
			rejected: "REJECTED",
		};

		const query = `
      mutation UpdateCandidate($id: ID!, $firstName: String, $lastName: String, $email: String, $status: CandidateStatus) {
        updateCandidate(
          id: $id, 
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          status: $status
        ) {
          id
          firstName
          lastName
          email
          status
          createdAt
        }
      }
    `;

		// Split name into firstName and lastName
		const nameParts = candidate.name.split(" ");
		const firstName = nameParts[0];
		const lastName = nameParts.slice(1).join(" ");

		const { updateCandidate } = await this.query<{
			updateCandidate: {
				id: string;
				firstName: string;
				lastName: string;
				email: string;
				status: string;
				createdAt: string;
			};
		}>(query, {
			id: candidate.id,
			firstName,
			lastName,
			email: candidate.email,
			status: statusMap[candidate.status],
		});

		// Map the response back to client-side Candidate type
		return {
			id: updateCandidate.id,
			name: `${updateCandidate.firstName} ${updateCandidate.lastName}`,
			email: updateCandidate.email,
			status: candidate.status,
			position: candidate.position,
			experience: candidate.experience,
			skills: candidate.skills,
			addedDate: updateCandidate.createdAt,
		};
	}

	async getCandidatesList(params: {
		page: number;
		limit: number;
		search?: string;
		status?: string;
		position?: string;
		sortBy?: string;
		sortOrder?: string;
	}): Promise<{ candidates: Candidate[]; total: number; totalPages: number }> {
		// Map client-side sort fields to database fields
		const sortByMap: Record<string, string> = {
			name: "name",
			position: "position",
			experience: "experience",
			addedDate: "createdAt",
		};

		const query = `
      query GetCandidatesList(
        $page: Int!
        $limit: Int!
        $search: String
        $status: String
        $position: String
        $sortBy: String
        $sortOrder: String
      ) {
        candidates(
          page: $page
          limit: $limit
          search: $search
          status: $status
          position: $position
          sortBy: $sortBy
          sortOrder: $sortOrder
        ) {
          items {
            id
            name
            email
            position
            status
            experience
            skills
            addedDate
          }
          total
          totalPages
        }
      }
    `;

		const mappedParams = {
			...params,
			sortBy: params.sortBy
				? sortByMap[params.sortBy] || params.sortBy
				: undefined,
		};

		return this.query<{
			candidates: { items: Candidate[]; total: number; totalPages: number };
		}>(query, mappedParams).then((data) => ({
			candidates: data.candidates.items,
			total: data.candidates.total,
			totalPages: data.candidates.totalPages,
		}));
	}

	async addCandidatesBulk(candidates: Candidate[]): Promise<{
		success: Candidate[];
		failed: { email: string; reason: string }[];
	}> {
		const query = `
      mutation BulkCreateCandidates($input: [CandidateInput!]!) {
        bulkCreateCandidates(input: $input) {
          success {
            id
            name
            email
            position
            status
            experience
            skills
            addedDate
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
				success: Candidate[];
				failed: { email: string; reason: string }[];
			};
		}>(query, { input: candidates });

		return bulkCreateCandidates;
	}
}

export const graphqlService = new GraphQLService();
