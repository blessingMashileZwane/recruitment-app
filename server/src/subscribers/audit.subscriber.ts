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
		console.log("Before Insert:", event.entity);
		const userId = ctx?.userId ?? "system";
		console.log("User ID:", userId);

		// Set the values directly on the entity
		if ("createdBy" in event.entity && !event.entity.createdBy) {
			event.entity.createdBy = userId;
			console.log("Set createdBy to:", userId);
		}
		if ("updatedBy" in event.entity && !event.entity.updatedBy) {
			event.entity.updatedBy = userId;
			console.log("Set updatedBy to:", userId);
		}
	}

	beforeUpdate(event: UpdateEvent<any>): void {
		const ctx = userContext.getStore();
		console.log("Before Update:", event.entity);
		const userId = ctx?.userId ?? "system";
		console.log("User ID:", userId);

		if (event.entity && "updatedBy" in event.entity) {
			event.entity.updatedBy = userId;
			console.log("Set updatedBy to:", userId);
		}
	}
}
