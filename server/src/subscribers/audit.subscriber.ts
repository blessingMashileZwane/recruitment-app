import {
	EventSubscriber,
	EntitySubscriberInterface,
	InsertEvent,
	UpdateEvent,
} from "typeorm";
import { userContext } from "../middleware";

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
	beforeInsert(event: InsertEvent<any>): void {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";

		// Set the values directly on the entity
		if ("createdBy" in event.entity && !event.entity.createdBy) {
			event.entity.createdBy = userId;
		}
		if ("updatedBy" in event.entity && !event.entity.updatedBy) {
			event.entity.updatedBy = userId;
		}
	}

	beforeUpdate(event: UpdateEvent<any>): void {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";

		if (event.entity && "updatedBy" in event.entity) {
			event.entity.updatedBy = userId;
		}
	}
}
