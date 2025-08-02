import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { JobPositionEntity } from "../entities";
import { DataSource } from "typeorm";

@Resolver(() => JobPositionEntity)
export class JobPositionResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [JobPositionEntity])
	async jobPositions(): Promise<JobPositionEntity[]> {
		const repository = this.dataSource.getRepository(JobPositionEntity);
		return repository.find();
	}

	@Query(() => JobPositionEntity, { nullable: true })
	async jobPosition(
		@Arg("id", () => ID) id: string
	): Promise<JobPositionEntity | null> {
		const repository = this.dataSource.getRepository(JobPositionEntity);
		return repository.findOne({ where: { id } });
	}

	@Mutation(() => JobPositionEntity)
	async createJobPosition(
		@Arg("title") title: string,
		@Arg("description", { nullable: true }) description?: string,
		@Arg("requirements", { nullable: true }) requirements?: string,
		@Arg("isActive", { nullable: true }) isActive: boolean = true
	): Promise<JobPositionEntity> {
		const repository = this.dataSource.getRepository(JobPositionEntity);
		const position = repository.create({
			title,
			description,
			requirements,
			isActive,
		});
		return repository.save(position);
	}

	@Mutation(() => JobPositionEntity)
	async updateJobPosition(
		@Arg("id", () => ID) id: string,
		@Arg("title", { nullable: true }) title?: string,
		@Arg("description", { nullable: true }) description?: string,
		@Arg("requirements", { nullable: true }) requirements?: string,
		@Arg("isActive", { nullable: true }) isActive?: boolean
	): Promise<JobPositionEntity> {
		const repository = this.dataSource.getRepository(JobPositionEntity);
		const position = await repository.findOneOrFail({ where: { id } });

		if (title) position.title = title;
		if (description !== undefined) position.description = description;
		if (requirements !== undefined) position.requirements = requirements;
		if (isActive !== undefined) position.isActive = isActive;

		return repository.save(position);
	}

	@Mutation(() => Boolean)
	async deleteJobPosition(@Arg("id", () => ID) id: string): Promise<boolean> {
		const repository = this.dataSource.getRepository(JobPositionEntity);
		await repository.delete(id);
		return true;
	}
}
