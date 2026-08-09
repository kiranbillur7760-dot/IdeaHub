import User from "../models/user.js";
import Idea from "../models/Idea.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==========================
// Register User
// ==========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      { id: user._id },
      "ideahub_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Registration Successful",
      token,
      user,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Login User
// ==========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "ideahub_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Save / Unsave Idea
// ==========================
export const saveIdea = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const ideaId = req.params.id;

    // Check whether idea exists
    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    const alreadySaved = user.savedIdeas.some(
      (id) => id.toString() === ideaId
    );

    if (alreadySaved) {

      // Remove from saved ideas
      user.savedIdeas = user.savedIdeas.filter(
        (id) => id.toString() !== ideaId
      );

    } else {

      // Add to saved ideas
      user.savedIdeas.push(ideaId);

    }

    await user.save();

    res.json({
      message: alreadySaved
        ? "Idea removed from saved"
        : "Idea saved successfully",

      saved: !alreadySaved,
    });

  } catch (error) {
    console.error("SAVE IDEA ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// Get Saved Ideas
// ==========================
export const getSavedIdeas = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .populate("savedIdeas");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.savedIdeas);

  } catch (error) {
    console.error("GET SAVED IDEAS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};