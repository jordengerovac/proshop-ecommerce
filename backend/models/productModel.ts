import mongoose, { Schema, Model } from "mongoose";

interface IReview {
	user: mongoose.Types.ObjectId;
	name: string;
	rating: number;
	comment: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export interface IProduct {
	user: mongoose.Types.ObjectId;
	name: string;
	image: string;
	brand: string;
	category: string;
	description: string;
	reviews: IReview[];
	rating: number;
	numReviews: number;
	price: number;
	countInStock: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		reviews: [reviewSchema],
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;
