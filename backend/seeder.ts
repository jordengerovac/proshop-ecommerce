import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

connectDB();

const importData = async (): Promise<void> => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert new data
    const createdUsers = await User.insertMany(users);
    const adminUser: mongoose.Types.ObjectId = createdUsers[0]._id;

    const sampleProducts = products.map((product: any) => ({
      ...product,
      user: adminUser,
    }));

    await Product.insertMany(sampleProducts);

    console.log(colors.green("Data Imported!"));
    process.exit();
  } catch (error: any) {
    console.error(colors.red(`Error: ${(error as Error).message}`));
    process.exit(1);
  }
};

const destroyData = async (): Promise<void> => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log(colors.red("Data Destroyed!"));
    process.exit();
  } catch (error: any) {
    console.error(colors.red(`Error: ${(error as Error).message}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
