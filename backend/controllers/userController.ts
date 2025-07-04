import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await (user as any).matchPassword(password))) {
		generateToken(res, (user as any)._id);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		generateToken(res, (user as any)._id);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
	res.cookie("PROSHOP_JWT", "", {
		httpOnly: true,
		expires: new Date(0),
	});

	res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
	const user = await User.findById((req as any).user._id);

	if (user) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
	const user = await User.findById((req as any).user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req: Request, res: Response) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
		throw new Error("Resource not found");
	}
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404);
			throw new Error("Resource not found");
		}
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
		throw new Error("Resource not found");
	}
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404);
			throw new Error("Resource not found");
		}
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
		throw new Error("Resource not found");
	}
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, isAdmin } = req.body;

	const user = await User.findById(req.params.id);

	if (user) {
		user.name = name;
		user.email = email;
		user.password = password;
		user.isAdmin = isAdmin;

		const updatedUser = await user.save();
		res.json(updatedUser);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
};
