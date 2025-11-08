import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ruturaj123_db:Patil123@cluster0.gz65ext.mongodb.net/smartsociety");
    console.log("✅ MongoDB Connected Successfully...");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

export default connectDB;
