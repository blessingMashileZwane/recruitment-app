import { Arg, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { DataSource } from "typeorm";
import { CandidateEntity } from "../entities";
import { CandidateStatus } from "../types";
import { CandidateListResponse, CandidateOutput } from "../types/outputs";
import { CandidateSortField, SortOrder } from "../types/sort";
import { HistoryService } from "../utils/history.service";
import { runTransaction } from "../utils";

@Resolver(() => CandidateEntity)
export class CandidateResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(this.dataSource);
	}

	private candidateRepository() {
		return this.dataSource.getRepository(CandidateEntity);
	}

	@Query(() => CandidateListResponse)
	async candidates(
		@Arg("page", () => Int, { defaultValue: 1 }) page: number,
		@Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
		@Arg("status", () => String, { nullable: true }) status?: string,
		@Arg("search", () => String, { nullable: true }) search?: string,
		@Arg("jobStatus", () => String, { nullable: true }) jobStatus?: string,
		@Arg("jobType", () => String, { nullable: true }) jobType?: string, // added
		@Arg("sortBy", () => CandidateSortField, { nullable: true })
		sortBy?: CandidateSortField,
		@Arg("sortOrder", () => SortOrder, { nullable: true }) sortOrder?: SortOrder
	): Promise<CandidateListResponse> {
		const skip = (page - 1) * limit;

		const query = this.candidateRepository()
			.createQueryBuilder("candidate")
			.leftJoinAndSelect("candidate.jobApplications", "jobApplication");

		if (status) {
			query.andWhere("candidate.status = :status", { status });
		}

		if (search) {
			query.andWhere(
				"(candidate.firstName ILIKE :search OR candidate.lastName ILIKE :search OR candidate.email ILIKE :search OR candidate.phone ILIKE :search)",
				{ search: `%${search}%` }
			);
		}

		if (jobStatus) {
			query.andWhere("jobApplication.applicationStatus = :jobStatus", {
				jobStatus,
			});
		}

		if (jobType) {
			query.andWhere("jobApplication.appliedJob = :jobType", { jobType });
		}

		const fieldMap: Record<CandidateSortField, string> = {
			firstName: "candidate.firstName",
			lastName: "candidate.lastName",
			createdAt: "candidate.createdAt",
		};

		if (sortBy && sortOrder && fieldMap[sortBy]) {
			query.orderBy(
				fieldMap[sortBy],
				sortOrder.toUpperCase() as "ASC" | "DESC"
			);
		} else {
			query.orderBy("candidate.createdAt", "DESC");
		}

		query.skip(skip).take(limit);

		const [candidates, total] = await Promise.all([
			query.getMany(),
			query.getCount(),
		]);
		const totalPages = Math.ceil(total / limit);

		const items = candidates.map((candidate) => {
			const latestJobApp = candidate.jobApplications?.sort(
				(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
			)[0];

			return {
				...candidate,
				appliedJob: latestJobApp?.appliedJob ?? null,
				applicationStatus: latestJobApp?.applicationStatus ?? null,
			};
		});

		return {
			items,
			total,
			page,
			pageSize: limit,
			totalPages,
		};
	}

	@Query(() => CandidateOutput, { nullable: true })
	async candidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateOutput | null> {
		return this.candidateRepository().findOne({
			where: { id },
		});
	}

	@Mutation(() => CandidateOutput)
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
			status,
		});

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(candidate);
			await this.historyService.createHistoryRecord(
				candidate,
				"CandidateEntity",
				"CREATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => CandidateOutput)
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
	): Promise<CandidateOutput> {
		const repository = this.candidateRepository();
		const candidate = await repository.findOneOrFail({ where: { id } });

		if (firstName) candidate.firstName = firstName;
		if (lastName) candidate.lastName = lastName;
		if (email) candidate.email = email;
		if (phone !== undefined) candidate.phone = phone;
		if (currentLocation) candidate.currentLocation = currentLocation;
		if (citizenship) candidate.citizenship = citizenship;
		if (status) candidate.status = status;

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(candidate);
			await this.historyService.createHistoryRecord(
				candidate,
				"CandidateEntity",
				"CREATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => Boolean)
	async deleteCandidate(@Arg("id", () => ID) id: string): Promise<boolean> {
		return runTransaction(this.dataSource, async (manager) => {
			await manager.delete(CandidateEntity, id);
			await this.historyService.createHistoryRecord(
				{ id },
				"CandidateEntity",
				"DELETE",
				manager
			);
			return true;
		});
	}
}
