import { DataSource, EntityManager } from "typeorm";

async function runTransaction<T>(
	dataSource: DataSource,
	fn: (manager: EntityManager) => Promise<T>
): Promise<T> {
	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();
	try {
		const result = await fn(queryRunner.manager);
		await queryRunner.commitTransaction();
		return result;
	} catch (err) {
		await queryRunner.rollbackTransaction();
		throw err;
	} finally {
		await queryRunner.release();
	}
}

export { runTransaction };
