import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (res: Response, userId: string) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" } as any);

	// Set jwt as http-only cookie
	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		sameSite: "strict",
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	});
};
