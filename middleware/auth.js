import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = jwt.decode(token);

    req.userId = decodedData?.id;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
