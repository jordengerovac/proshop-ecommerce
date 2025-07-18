import path from "path";
import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config({
	path: `.env.${process.env.NODE_ENV || "development"}`,
});

const port = process.env.PORT || 5000;

connectDB();

const app: Application = express();

// Body parse middleware
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	}),
);

// Cookie parser middleware
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
	res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/config/paypal", (req: Request, res: Response) => {
	res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve(); // Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(port, (): void => {
	console.log(`Server running on port ${port}`);
});
