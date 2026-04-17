import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info("MongoDB connection established successfully.");
  } catch (error) {
    logger.error({ err: error }, "Unable to connect to MongoDB:");
    process.exit(1);
  }
};
