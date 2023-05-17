import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
const ACCESS_SECRET = process.env.ACCESS_SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({
        userInfo: { _id: existingUser._id, name: existingUser.name },
        token,
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      ACCESS_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(201)
      .json({ userInfo: { _id: newUser._id, name: newUser.name }, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
