import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";

// Protect routes
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let token: string;

	// Read the jwt from cookie
	// Name of token is PROSHOP_JWT which comes from userController res.cookie
	token = req.cookies.PROSHOP_JWT;

	if (token) {
		try {
			const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET as string);
			(req as any).user = await User.findById(decoded.userId).select("-password");
			next();
		} catch (error) {
			console.log(error);
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	} else {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

// Admin middleware
export const admin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user && (req as any).user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized as admin");
	}
});
