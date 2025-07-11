import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
	name: string;
	email: string;
	password: string;
	isAdmin: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<IUser>("User", userSchema);
