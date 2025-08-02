import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { JobApplicationEntity } from "../entities";
import { DataSource } from "typeorm";

@Resolver(() => JobApplicationEntity)
export class JobApplicationResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [JobApplicationEntity])
	async jobApplications(): Promise<JobApplicationEntity[]> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		return repository.find();
	}

	@Query(() => JobApplicationEntity, { nullable: true })
	async jobApplication(
		@Arg("id", () => ID) id: string
	): Promise<JobApplicationEntity | null> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		return repository.findOne({ where: { id } });
	}

	@Mutation(() => JobApplicationEntity)
	async createJobApplication(
		@Arg("title") title: string,
		@Arg("description", { nullable: true }) description?: string,
		@Arg("requirements", { nullable: true }) requirements?: string,
		@Arg("isActive", { nullable: true }) isActive: boolean = true
	): Promise<JobApplicationEntity> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		const application = repository.create({
			title,
			description,
			requirements,
			isActive,
		});
		return repository.save(application);
	}

	@Mutation(() => JobApplicationEntity)
	async updateJobApplication(
		@Arg("id", () => ID) id: string,
		@Arg("title", { nullable: true }) title?: string,
		@Arg("description", { nullable: true }) description?: string,
		@Arg("requirements", { nullable: true }) requirements?: string,
		@Arg("isActive", { nullable: true }) isActive?: boolean
	): Promise<JobApplicationEntity> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		const application = await repository.findOneOrFail({ where: { id } });

		if (title) application.title = title;
		if (description !== undefined) application.description = description;
		if (requirements !== undefined) application.requirements = requirements;
		if (isActive !== undefined) application.isActive = isActive;

		return repository.save(application);
	}

	@Mutation(() => Boolean)
	async deleteJobApplication(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		await repository.delete(id);
		return true;
	}
}
