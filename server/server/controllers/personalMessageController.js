import PersonalMessage from "../models/PersonalMessage.js";

// Send a personal message
export const sendPersonalMessage = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver, text } = req.body;

    if (!receiver || !text?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    if (sender.toString() === receiver.toString()) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }

    const newMessage = await PersonalMessage.create({
      sender,
      receiver,
      text: text.trim(),
    });

    const populatedMessage = await PersonalMessage.findById(
      newMessage._id
    )
      .populate("sender", "name username")
      .populate("receiver", "name username");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("SEND PERSONAL MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get personal conversation between two users
export const getPersonalMessages = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const { userId } = req.params;

    const messages = await PersonalMessage.find({
      $or: [
        {
          sender: currentUser,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUser,
        },
      ],
    })
      .populate("sender", "name username")
      .populate("receiver", "name username")
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("GET PERSONAL MESSAGES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Mark messages as read
export const markPersonalMessagesAsRead = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const { userId } = req.params;

    await PersonalMessage.updateMany(
      {
        sender: userId,
        receiver: currentUser,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("MARK PERSONAL MESSAGES ERROR:", error);

    res.status(500).json({
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};