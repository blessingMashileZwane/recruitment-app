import { AsyncLocalStorage } from "async_hooks";

export const userContext = new AsyncLocalStorage<{ userId: string }>();

export function getCurrentUserId(): string | undefined {
	return userContext.getStore()?.userId;
}
