import mongoose from "mongoose";
import config from "config";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
