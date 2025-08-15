import { Query, Arg, ID, Mutation, Resolver, Int } from "type-graphql";
import { DataSource } from "typeorm";
import { CandidateEntity } from "../entities";
import { CandidateStatus } from "../types";
import { CandidateListResponse } from "../types/outputs";

@Resolver(() => CandidateEntity)
export class CandidateResolver {
	constructor(private dataSource: DataSource) {}

	private candidateRepository() {
		return this.dataSource.getRepository(CandidateEntity);
	}

	@Query(() => CandidateListResponse)
	async candidates(
		@Arg("page", () => Int, { defaultValue: 1 }) page: number,
		@Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
		@Arg("status", () => String, { nullable: true }) status?: string,
		@Arg("search", () => String, { nullable: true }) search?: string,
		@Arg("position", () => String, { nullable: true }) position?: string,
		@Arg("sortBy", () => String, { nullable: true }) sortBy?: string,
		@Arg("sortOrder", () => String, { nullable: true }) sortOrder?: string
	): Promise<CandidateListResponse> {
		const skip = (page - 1) * limit;

		let query = this.candidateRepository().createQueryBuilder("candidate");

		// Filters
		if (status)
			query = query.andWhere("candidate.status = :status", { status });
		if (position)
			query = query.andWhere("candidate.position = :position", { position });
		if (search) {
			query = query.andWhere(
				"(candidate.firstName ILIKE :search OR candidate.lastName ILIKE :search OR candidate.email ILIKE :search)",
				{ search: `%${search}%` }
			);
		}

		// Sort mapping based on entity fields
		const fieldMap: Record<string, string> = {
			name: "candidate.firstName",
			position: "candidate.position",
			experience: "candidate.experience",
			addedDate: "candidate.createdAt",
		};

		if (sortBy && sortOrder && fieldMap[sortBy]) {
			query = query.orderBy(
				fieldMap[sortBy],
				sortOrder.toUpperCase() as "ASC" | "DESC"
			);
		} else {
			query = query.orderBy("candidate.createdAt", "DESC");
		}

		const [items, total] = await Promise.all([
			query.skip(skip).take(limit).getMany(),
			query.getCount(),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			items,
			total,
			page,
			pageSize: limit,
			totalPages,
		};
	}

	@Query(() => CandidateEntity, { nullable: true })
	async candidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateEntity | null> {
		return this.candidateRepository().findOne({
			where: { id },
			relations: [
				"candidateSkill",
				"candidateSkill.history",
				"jobApplications",
				"jobApplications.history",
				"jobApplications.interviewStages",
				"jobApplications.interviewStages.history",
				"history",
			],
		});
	}

	@Mutation(() => CandidateEntity)
	async createCandidate(
		@Arg("firstName") firstName: string,
		@Arg("lastName") lastName: string,
		@Arg("email") email: string,
		@Arg("phone", { nullable: true }) phone?: string,
		@Arg("currentLocation", { nullable: true }) currentLocation?: string,
		@Arg("citizenship", { nullable: true }) citizenship?: string,
		@Arg("status", () => CandidateStatus, {
			defaultValue: CandidateStatus.OPEN,
		})
		status?: CandidateStatus
	): Promise<CandidateEntity> {
		const candidate = this.candidateRepository().create({
			firstName,
			lastName,
			email,
			phone,
			currentLocation,
			citizenship,
			status: status || CandidateStatus.OPEN,
		});
		return this.candidateRepository().save(candidate);
	}

	@Mutation(() => CandidateEntity)
	async updateCandidate(
		@Arg("id", () => ID) id: string,
		@Arg("firstName", { nullable: true }) firstName?: string,
		@Arg("lastName", { nullable: true }) lastName?: string,
		@Arg("email", { nullable: true }) email?: string,
		@Arg("phone", { nullable: true }) phone?: string,
		@Arg("currentLocation", { nullable: true }) currentLocation?: string,
		@Arg("citizenship", { nullable: true }) citizenship?: string,
		@Arg("status", () => CandidateStatus, { nullable: true })
		status?: CandidateStatus
	): Promise<CandidateEntity> {
		const repository = this.candidateRepository();
		const candidate = await repository.findOneOrFail({ where: { id } });

		if (firstName) candidate.firstName = firstName;
		if (lastName) candidate.lastName = lastName;
		if (email) candidate.email = email;
		if (phone !== undefined) candidate.phone = phone;
		if (currentLocation) candidate.currentLocation = currentLocation;
		if (citizenship) candidate.citizenship = citizenship;
		if (status) candidate.status = status;

		return repository.save(candidate);
	}

	@Mutation(() => Boolean)
	async deleteCandidate(@Arg("id", () => ID) id: string): Promise<boolean> {
		await this.candidateRepository().delete(id);
		return true;
	}

	// Keep fullCandidate for detailed view
	@Query(() => CandidateEntity, { nullable: true })
	async fullCandidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateEntity | null> {
		return this.candidateRepository().findOne({
			where: { id },
			relations: [
				"candidateSkill",
				"candidateSkill.history",
				"jobApplications",
				"jobApplications.history",
				"jobApplications.interviewStages",
				"jobApplications.interviewStages.history",
				"history",
			],
		});
	}
}
