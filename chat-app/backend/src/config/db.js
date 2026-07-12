import mongoose from "mongoose";

const connectDB = async () => {

  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI
    )
    console.log('connected to database')
  } catch (error) {
    console.log("mongoDb connection error", error);
    process.exit(1);
  }

};

export default connectDB;
