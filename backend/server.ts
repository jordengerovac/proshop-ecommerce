import express, { Request, Response, Application, application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const port = process.env.PORT || 5000;

connectDB();

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);

app.listen(port, (): void => {
  console.log(`Server running on port ${port}`);
});
