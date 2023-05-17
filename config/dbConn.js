import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //   dbName: "app-data",
    });
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;

