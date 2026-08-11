
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";

// Render backend URL
const API_URL = "https://ideahub-4-ybrb.onrender.com";

const PersonalChat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);

  // Selected media
  const [selectedMedia, setSelectedMedia] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // ========================================
  // Get current user
  // ========================================

  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem("user");

      if (user) {
        return JSON.parse(user);
      }

      return null;
    } catch (error) {
      console.error("GET CURRENT USER ERROR:", error);
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const currentUserId = currentUser?._id || currentUser?.id;

  // ========================================
  // Scroll to bottom
  // ========================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ========================================
  // Load conversation
  // ========================================

  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (!token || !userId) {
          return;
        }

        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/personal-messages/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(response.data.messages || []);

        const loadedMessages = response.data.messages || [];

        if (loadedMessages.length > 0) {
          const firstMessage = loadedMessages[0];

          const user =
            firstMessage.sender?._id === currentUserId
              ? firstMessage.receiver
              : firstMessage.sender;

          setOtherUser(user);
        }
      } catch (error) {
        console.error("LOAD PERSONAL MESSAGES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [userId, token, currentUserId]);

  // ========================================
  // Socket.IO
  // ========================================

  useEffect(() => {
    if (!currentUserId || !userId) {
      return;
    }

    console.log("Connecting Socket.IO to:", API_URL);

    const socket = io(API_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);

      socket.emit("joinPersonalChat", {
        userId: currentUserId,
        otherUserId: userId,
      });
    });

    socket.on("connect_error", (error) => {
      console.error("SOCKET CONNECTION ERROR:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("SOCKET DISCONNECTED:", reason);
    });

    socket.on("newPersonalMessage", (newMessage) => {
      console.log("NEW PERSONAL MESSAGE:", newMessage);

      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, userId]);

  // ========================================
  // Scroll when messages change
  // ========================================

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ========================================
  // Select photo/video
  // ========================================

  const handleMediaSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please select an image or video.");
      event.target.value = "";
      return;
    }

    // 50 MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert("File must be smaller than 50 MB.");
      event.target.value = "";
      return;
    }

    setSelectedMedia(file);

    console.log(
      "MEDIA SELECTED:",
      file.name,
      file.type,
      file.size
    );
  };

  // ========================================
  // Remove selected media
  // ========================================

  const removeSelectedMedia = () => {
    setSelectedMedia(null);

    const input = document.getElementById("media-input");

    if (input) {
      input.value = "";
    }
  };

  // ========================================
  // Upload media to Cloudinary
  // ========================================

  const uploadMedia = async () => {
    if (!selectedMedia) {
      return null;
    }

    const formData = new FormData();

    formData.append("image", selectedMedia);

    const response = await axios.post(
      `${API_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      mediaUrl:
        response.data.mediaUrl ||
        response.data.imageUrl,

      mediaType:
        response.data.mediaType ||
        (selectedMedia.type.startsWith("video/")
          ? "video"
          : "image"),
    };
  };

  // ========================================
  // Send message
  // ========================================

  const sendMessage = async () => {
    const cleanText = text.trim();

    // Need text or media
    if (!cleanText && !selectedMedia) {
      return;
    }

    if (!socketRef.current) {
      console.error("Socket is not connected");
      alert("Chat connection is not ready. Please wait a moment and try again.");
      return;
    }

    if (!socketRef.current.connected) {
      console.error("Socket is disconnected");
      alert("Chat connection lost. Please try again.");
      return;
    }

    if (!currentUserId || !userId) {
      console.error("Missing user IDs");
      return;
    }

    try {
      setSending(true);

      let mediaUrl = "";
      let mediaType = "";

      // Upload selected media
      if (selectedMedia) {
        console.log("Uploading media...");

        const uploaded = await uploadMedia();

        if (uploaded) {
          mediaUrl = uploaded.mediaUrl;
          mediaType = uploaded.mediaType;
        }

        console.log(
          "MEDIA UPLOADED:",
          mediaUrl,
          mediaType
        );
      }

      console.log("SENDING PERSONAL MESSAGE:", {
        senderId: currentUserId,
        receiverId: userId,
        text: cleanText,
        mediaUrl,
        mediaType,
      });

      // Send through Socket.IO
      socketRef.current.emit(
        "sendPersonalMessage",
        {
          senderId: currentUserId,
          receiverId: userId,
          text: cleanText,
          mediaUrl,
          mediaType,
        },
        (response) => {
          console.log("SEND MESSAGE RESPONSE:", response);
        }
      );

      // Clear text
      setText("");

      // Clear selected media
      setSelectedMedia(null);

      const input = document.getElementById("media-input");

      if (input) {
        input.value = "";
      }
    } catch (error) {
      console.error(
        "SEND MEDIA MESSAGE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // ========================================
  // Enter key
  // ========================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!sending) {
        sendMessage();
      }
    }
  };

  // ========================================
  // Message ownership
  // ========================================

  const isMyMessage = (message) => {
    return (
      message.sender?._id === currentUserId ||
      message.sender === currentUserId
    );
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* Header */}
      <div className="border-b px-4 py-4 flex items-center gap-3">

        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black"
        >
          ←
        </button>

        <div>
          <h2 className="font-semibold text-lg">
            {otherUser?.name ||
              otherUser?.username ||
              "Personal Chat"}
          </h2>

          <p className="text-xs text-gray-500">
            Private conversation
          </p>
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {loading ? (
          <div className="text-center text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">

            <p className="text-lg font-medium">
              No messages yet
            </p>

            <p className="text-sm mt-1">
              Start the conversation.
            </p>

          </div>
        ) : (
          messages.map((message) => {

            const mine = isMyMessage(message);

            return (
              <div
                key={message._id}
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl ${
                    mine
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >

                  {/* IMAGE */}
                  {message.mediaUrl &&
                    message.mediaType === "image" && (
                      <img
                        src={message.mediaUrl}
                        alt="Shared"
                        className="max-w-full max-h-80 rounded-xl mb-2 object-cover"
                      />
                    )}

                  {/* VIDEO */}
                  {message.mediaUrl &&
                    message.mediaType === "video" && (
                      <video
                        src={message.mediaUrl}
                        controls
                        playsInline
                        className="max-w-full max-h-80 rounded-xl mb-2"
                      />
                    )}

                  {/* TEXT */}
                  {message.text && (
                    <p className="text-sm break-words">
                      {message.text}
                    </p>
                  )}

                  {/* TIME */}
                  <p
                    className={`text-[10px] mt-1 ${
                      mine
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {message.createdAt
                      ? new Date(
                          message.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>

                </div>

              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Selected media preview */}
      {selectedMedia && (
        <div className="border-t px-3 pt-3">

          <div className="relative inline-block">

            {selectedMedia.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedMedia)}
                alt="Selected"
                className="w-28 h-28 object-cover rounded-xl border"
              />
            ) : (
              <video
                src={URL.createObjectURL(selectedMedia)}
                controls
                className="w-40 h-28 object-cover rounded-xl border"
              />
            )}

            <button
              onClick={removeSelectedMedia}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
            >
              ×
            </button>

          </div>

        </div>
      )}

      {/* Input */}
      <div className="border-t p-3 flex gap-2">

        {/* Hidden image/video input */}
        <input
          type="file"
          accept="image/*,video/*"
          id="media-input"
          className="hidden"
          onChange={handleMediaSelect}
        />

        {/* Media button */}
        <label
          htmlFor="media-input"
          className="cursor-pointer px-3 py-2 border rounded-xl hover:bg-gray-100 flex items-center justify-center"
          title="Send photo or video"
        >
          📷
        </label>

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
        />

        {/* Send */}
        <button
          onClick={sendMessage}
          disabled={
            sending ||
            (!text.trim() && !selectedMedia)
          }
          className="bg-black text-white px-5 py-2 rounded-xl disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>

      </div>

    </div>
  );
};

export default PersonalChat;
