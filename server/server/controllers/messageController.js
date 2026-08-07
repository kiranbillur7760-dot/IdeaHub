import Message from "../models/Message.js";

// Get all messages of a project
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      project: req.params.projectId,
    })
      .populate("sender", "name profilePicture")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Save a new message
export const sendMessage = async (req, res) => {
  try {
    const { project, text } = req.body;

    const message = await Message.create({
      project,
      sender: req.user.id,
      text,
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name profilePicture"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};