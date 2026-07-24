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
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Get All Ideas
// =========================
export const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Get My Ideas
// =========================
export const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Update Idea
// =========================
export const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Delete Idea
// =========================
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Idea.findByIdAndDelete(req.params.id);

    res.json({
      message: "Idea deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};