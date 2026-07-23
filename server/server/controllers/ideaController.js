import Idea from "../models/Idea.js";

// =========================
// Create Idea
// =========================
export const createIdea = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const idea = await Idea.create({
      title,
      description,
      category,
      author: req.user.name,
      userId: req.user._id,
    });

    res.status(201).json(idea);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Get All Ideas
// =========================
export const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({
      createdAt: -1,
    });

    res.json(ideas);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};