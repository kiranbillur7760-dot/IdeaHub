import Chat from "../models/Chat.js";

// Get user's chats
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .select("title createdAt updatedAt");

    res.json(chats);
  } catch (error) {
    console.error("GET CHATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch chats",
    });
  }
};

// Get one chat
export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json(chat);
  } catch (error) {
    console.error("GET CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch chat",
    });
  }
};

// Create new chat
export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      title: req.body.title || "New Chat",
      messages: [],
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error("CREATE CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to create chat",
    });
  }
};

// Delete chat
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete chat",
    });
  }
};

// Update chat messages
export const updateChat = async (req, res) => {
  try {
    const { messages, title } = req.body;

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        ...(messages && { messages }),
        ...(title && { title }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json(chat);
  } catch (error) {
    console.error("UPDATE CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to update chat",
    });
  }
};