import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";
import { Admin } from "../db/models";

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ email: "admin@basketball.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", Number(config.saltRounds));

    await Admin.create({
      email: "admin@basketball.com",
      password: hashedPassword,
    });

    console.log("Admin seeded successfully");
    console.log("Email: admin@basketball.com");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
