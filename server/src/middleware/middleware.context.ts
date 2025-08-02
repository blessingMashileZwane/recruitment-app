import { Request, Response, NextFunction } from "express";
import { userContext } from "./userContext";
import jwt from "jsonwebtoken";

export function contextMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = extractUserIdFromRequest(req) ?? "system";

	userContext.run({ userId }, () => {
		next();
	});
}

function extractUserIdFromRequest(req: Request): string | undefined {
	const authHeader = req.headers.authorization;
	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
			return decoded.sub ?? decoded.userId;
		} catch (err) {
			console.warn("Invalid token:", err);
			return undefined;
		}
	}
	return undefined;
}
