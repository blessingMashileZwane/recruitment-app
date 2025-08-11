import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { CandidateEntity } from "../entities";
import { DataSource } from "typeorm";
import { CandidateStatus } from "../types";
import { CandidateListResponse } from "../types/responses";

@Resolver(() => CandidateEntity)
export class CandidateResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => CandidateListResponse)
	async candidates(
		@Arg("page", () => Number, { defaultValue: 1 }) page: number,
		@Arg("limit", () => Number, { defaultValue: 10 }) limit: number,
		@Arg("status", () => String, { nullable: true }) status?: string,
		@Arg("search", { nullable: true }) search?: string,
		@Arg("position", { nullable: true }) position?: string,
		@Arg("sortBy", { nullable: true }) sortBy?: string,
		@Arg("sortOrder", { nullable: true }) sortOrder?: string
	): Promise<{ items: CandidateEntity[]; total: number; totalPages: number }> {
		const skip = (page - 1) * limit;

		let query = this.dataSource
			.getRepository(CandidateEntity)
			.createQueryBuilder("candidate");

		if (status) {
			query = query.andWhere("candidate.status = :status", { status });
		}

		if (position) {
			query = query.andWhere("candidate.position = :position", { position });
		}

		if (search) {
			query = query.andWhere(
				"(candidate.name LIKE :search OR candidate.email LIKE :search)",
				{ search: `%${search}%` }
			);
		}

		// Map client-side field names to database column names if needed
		const fieldMap: Record<string, string> = {
			name: "name",
			position: "position",
			experience: "experience",
			addedDate: "addedDate",
		};

		if (sortBy && sortOrder && fieldMap[sortBy]) {
			const order = sortOrder.toUpperCase() as "ASC" | "DESC";
			query = query.orderBy(`candidate.${fieldMap[sortBy]}`, order);
		}

		const [items, total] = await Promise.all([
			query.skip(skip).take(limit).getMany(),
			query.getCount(),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			items,
			total,
			totalPages,
		};
	}

	// @Query(() => [CandidateEntity])
	// async candidatesWithPagination(
	// 	@Arg("page", () => ID, { defaultValue: 1 }) page: number,
	// 	@Arg("limit", () => ID, { defaultValue: 10 }) limit: number
	// ): Promise<CandidateEntity[]> {
	// 	const repository = this.dataSource.getRepository(CandidateEntity);
	// 	const skip = (page - 1) * limit;
	// 	return repository.find({ skip, take: limit });
	// }

	@Query(() => CandidateEntity, { nullable: true })
	async candidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateEntity | null> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		return repository.findOne({ where: { id } });
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
			defaultValue: CandidateStatus.ACTIVE,
		})
		status?: CandidateStatus
	): Promise<CandidateEntity> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		const candidate = repository.create({
			firstName,
			lastName,
			email,
			phone,
			currentLocation,
			citizenship,
			status: status || CandidateStatus.ACTIVE,
		});
		return repository.save(candidate);
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
		const repository = this.dataSource.getRepository(CandidateEntity);
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
		const repository = this.dataSource.getRepository(CandidateEntity);
		await repository.delete(id);
		return true;
	}
}
