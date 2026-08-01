import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access Denied. No Token Provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, "ideahub_secret_key");

    console.log("DECODED:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

export default authMiddleware;