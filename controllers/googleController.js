import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
const ACCESS_SECRET = process.env.ACCESS_SECRET;
import axios from "axios";
import bcrypt from "bcryptjs";

const signin = async (req, res) => {
  const googleToken = req.body.token;
  const config = {
    headers: {
      Authorization: `Bearer ${googleToken}`,
    },
  };
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      config
    );
    const userInfo = response.data;
    if (!userInfo) return res.status(404).send("User not found");

    const existingUser = await User.findOne({ email: userInfo.email });
    if (existingUser) {
      const token = jwt.sign(
        { email: existingUser?.email, id: existingUser?._id },
        ACCESS_SECRET,
        { expiresIn: "1h" }
      );
      const objectId = existingUser._id.toString();
      const updatedUser = await User.findByIdAndUpdate(
        objectId,
        { sub: userInfo.sub },
        { new: true }
      );
      return res.status(201).json({
        userInfo: { _id: updatedUser._id, name: updatedUser.name },
        token,
      });
    }

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(
        userInfo.sub + new Date().getTime(),
        12
      );
      const newUser = await User.create({
        email: userInfo.email,
        password: hashedPassword,
        name: `${userInfo.given_name} ${userInfo.family_name}`,
      });
      const token = jwt.sign(
        { email: newUser?.email, id: newUser?._id },
        ACCESS_SECRET,
        { expiresIn: "1h" }
      );
      console.log(newUser._id);
      return res.status(201).json({
        userInfo: { _id: newUser._id, name: newUser.name },
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(409).json({ error });
  }
};

export { signin };
