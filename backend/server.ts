import express, { Request, Response, Application } from "express";
import products from "./data/products.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.get("/api/products", (req: Request, res: Response) => {
  res.json(products);
});

app.get("/api/products/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.listen(port, (): void => {
  console.log(`Server running on port ${port}`);
});
