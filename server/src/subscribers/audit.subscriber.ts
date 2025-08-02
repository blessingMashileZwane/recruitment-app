import {
	EventSubscriber,
	EntitySubscriberInterface,
	InsertEvent,
	UpdateEvent,
} from "typeorm";
import { userContext } from "../middleware";

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
	/**
	 * Called before entity insertion.
	 */
	beforeInsert(event: InsertEvent<any>): void {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";

		if ("createdBy" in event.entity) {
			event.entity.createdBy = userId;
		}
		if ("updatedBy" in event.entity) {
			event.entity.updatedBy = userId;
		}
	}

	/**
	 * Called before entity update.
	 */
	beforeUpdate(event: UpdateEvent<any>): void {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";

		if (event.entity && "updatedBy" in event.entity) {
			event.entity.updatedBy = userId;
		}
	}
}
