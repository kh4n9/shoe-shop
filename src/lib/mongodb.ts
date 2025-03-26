import mongoose from "mongoose";

// MongoDB connection
const mongodb_uri = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongodb_uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};
