import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";
import googleRoutes from "./routes/google.js";

const PORT = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(express.urlencoded({extended: true}))

app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/google-auth", googleRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
