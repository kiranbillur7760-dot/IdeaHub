import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function AIChat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ==========================================
  // SCROLL TO LATEST MESSAGE
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat]);

  // ==========================================
  // LOAD CHAT HISTORY FROM MONGODB
  // ==========================================

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await API.get("/chats");

        const chatList = response.data || [];

        setChats(chatList);

        // Open most recent chat
        if (chatList.length > 0) {
          const firstChat = await API.get(
            `/chats/${chatList[0]._id}`
          );

          setActiveChat(firstChat.data);
        }
      } catch (error) {
        console.error(
          "LOAD CHAT HISTORY ERROR:",
          error
        );
      } finally {
        setHistoryLoading(false);
      }
    };

    loadChats();
  }, []);

  // ==========================================
  // CREATE NEW CHAT
  // ==========================================

  const createNewChat = async () => {
    try {
      const response = await API.post("/chats", {
        title: "New Chat",
      });

      const newChat = response.data;

      setChats((prev) => [
        newChat,
        ...prev,
      ]);

      setActiveChat(newChat);

      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error(
        "CREATE CHAT ERROR:",
        error
      );
    }
  };

  // ==========================================
  // SELECT CHAT
  // ==========================================

  const selectChat = async (chat) => {
    try {
      const response = await API.get(
        `/chats/${chat._id}`
      );

      setActiveChat(response.data);

      setSelectedFile(null);
    } catch (error) {
      console.error(
        "SELECT CHAT ERROR:",
        error
      );
    }
  };

  // ==========================================
  // FILE SELECTION
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async () => {
    if (
      (!message.trim() && !selectedFile) ||
      loading
    ) {
      return;
    }

    // If no chat exists, create one first
    let currentChat = activeChat;

    if (!currentChat) {
      try {
        const createResponse = await API.post(
          "/chats",
          {
            title:
              message.trim().slice(0, 30) ||
              selectedFile?.name ||
              "New Chat",
          }
        );

        currentChat = createResponse.data;

        setChats((prev) => [
          currentChat,
          ...prev,
        ]);

        setActiveChat(currentChat);
      } catch (error) {
        console.error(
          "CREATE CHAT ERROR:",
          error
        );

        return;
      }
    }

    const userMessage = {
      role: "user",
      content: message.trim(),
    };

    // Add user message immediately
    const updatedMessages = [
      ...(currentChat.messages || []),
      userMessage,
    ];

    const updatedChat = {
      ...currentChat,
      messages: updatedMessages,
    };

    setActiveChat(updatedChat);

    setMessage("");
    setSelectedFile(null);
    setLoading(true);

    try {
      // ======================================
      // SEND TO AI
      // ======================================

      const response = await API.post(
        "/ai/chat",
        {
          message: message.trim(),
        }
      );

      const aiMessage = {
        role: "assistant",
        content:
          response.data.reply ||
          "I couldn't generate a response.",
      };

      const finalMessages = [
        ...updatedMessages,
        aiMessage,
      ];

      const finalChat = {
        ...updatedChat,
        messages: finalMessages,
      };

      setActiveChat(finalChat);

      // ======================================
      // SAVE MESSAGES TO MONGODB
      // ======================================

      try {
        await API.put(
          `/chats/${currentChat._id}`,
          {
            messages: finalMessages,
          }
        );
      } catch (saveError) {
        console.error(
          "SAVE CHAT ERROR:",
          saveError
        );
      }

      // Update sidebar
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === finalChat._id
            ? {
                ...chat,
                title:
                  chat.title === "New Chat"
                    ? message
                        .trim()
                        .slice(0, 30)
                    : chat.title,
                updatedAt:
                  new Date().toISOString(),
              }
            : chat
        )
      );
    } catch (error) {
      console.error(
        "AI CHAT ERROR:",
        error
      );

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, something went wrong. Please try again.",
      };

      const errorChat = {
        ...updatedChat,
        messages: [
          ...updatedMessages,
          errorMessage,
        ],
      };

      setActiveChat(errorChat);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE CHAT
  // ==========================================

  const deleteChat = async (chatId) => {
    try {
      await API.delete(
        `/chats/${chatId}`
      );

      const remainingChats = chats.filter(
        (chat) => chat._id !== chatId
      );

      setChats(remainingChats);

      if (activeChat?._id === chatId) {
        if (remainingChats.length > 0) {
          const response = await API.get(
            `/chats/${remainingChats[0]._id}`
          );

          setActiveChat(response.data);
        } else {
          setActiveChat(null);
        }
      }
    } catch (error) {
      console.error(
        "DELETE CHAT ERROR:",
        error
      );
    }
  };

  // ==========================================
  // ENTER TO SEND
  // ==========================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

        {/* Header */}

        <div className="p-4 border-b border-slate-800">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h1 className="text-xl font-bold">
                IdeaHub AI
              </h1>

              <p className="text-xs text-slate-400">
                Your AI assistant
              </p>
            </div>

            <button
              onClick={createNewChat}
              className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-xl"
              title="New chat"
            >
              +
            </button>

          </div>

          <button
            onClick={createNewChat}
            className="w-full py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
          >
            + New Chat
          </button>

        </div>

        {/* History */}

        <div className="flex-1 overflow-y-auto p-3">

          <p className="text-xs text-slate-500 uppercase px-2 mb-2">
            History
          </p>

          {historyLoading ? (

            <p className="text-sm text-slate-500 px-2 py-4">
              Loading chats...
            </p>

          ) : chats.length === 0 ? (

            <p className="text-sm text-slate-500 px-2 py-4">
              No conversations yet.
            </p>

          ) : (

            <div className="space-y-1">

              {chats.map((chat) => (

                <div
                  key={chat._id}
                  className={`group flex items-center gap-2 rounded-lg ${
                    activeChat?._id === chat._id
                      ? "bg-slate-800"
                      : "hover:bg-slate-800/70"
                  }`}
                >

                  <button
                    onClick={() =>
                      selectChat(chat)
                    }
                    className="flex-1 text-left px-3 py-2.5 truncate"
                  >

                    <span className="text-sm">
                      {chat.title ||
                        "New Chat"}
                    </span>

                  </button>

                  <button
                    onClick={() =>
                      deleteChat(
                        chat._id
                      )
                    }
                    className="opacity-0 group-hover:opacity-100 px-2 text-slate-500 hover:text-red-400"
                    title="Delete"
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </aside>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}

        <header className="h-16 border-b border-slate-800 flex items-center px-6">

          <div>

            <h2 className="font-semibold">
              {activeChat?.title ||
                "IdeaHub AI"}
            </h2>

            <p className="text-xs text-slate-500">
              AI Assistant
            </p>

          </div>

        </header>

        {/* ====================================
            MESSAGES
        ==================================== */}

        <div className="flex-1 overflow-y-auto">

          {!activeChat ||
          !activeChat.messages ||
          activeChat.messages.length === 0 ? (

            <div className="h-full flex items-center justify-center px-6">

              <div className="max-w-2xl text-center">

                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-600/20 flex items-center justify-center text-3xl">
                  ✨
                </div>

                <h1 className="text-3xl font-bold mb-3">
                  What can I help you build?
                </h1>

                <p className="text-slate-400">
                  Ask IdeaHub AI about ideas,
                  projects, programming,
                  startups, teamwork,
                  or anything else.
                </p>

              </div>

            </div>

          ) : (

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

              {activeChat.messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={`flex gap-4 ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    {msg.role ===
                      "assistant" && (

                      <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center">
                        ✨
                      </div>

                    )}

                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-100"
                      }`}
                    >

                      {msg.content && (

                        <p className="whitespace-pre-wrap leading-7">
                          {msg.content}
                        </p>

                      )}

                    </div>

                  </div>

                )
              )}

              {loading && (

                <div className="flex gap-4">

                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                    ✨
                  </div>

                  <div className="bg-slate-800 rounded-2xl px-5 py-4">

                    <div className="flex gap-1">

                      <span className="animate-bounce">
                        ●
                      </span>

                      <span className="animate-bounce delay-100">
                        ●
                      </span>

                      <span className="animate-bounce delay-200">
                        ●
                      </span>

                    </div>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

          )}

        </div>

        {/* ====================================
            SELECTED FILE
        ==================================== */}

        {selectedFile && (

          <div className="max-w-4xl w-full mx-auto px-6">

            <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-2">

              <div className="flex items-center gap-2 text-sm">

                📎

                <span className="truncate max-w-xs">
                  {selectedFile.name}
                </span>

              </div>

              <button
                onClick={() =>
                  setSelectedFile(null)
                }
                className="text-slate-400 hover:text-red-400"
              >
                ×
              </button>

            </div>

          </div>

        )}

        {/* ====================================
            INPUT
        ==================================== */}

        <div className="border-t border-slate-800 p-4">

          <div className="max-w-4xl mx-auto">

            <div className="flex items-end gap-2 bg-slate-900 border border-slate-700 rounded-2xl p-2">

              {/* File */}

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="w-10 h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center text-xl"
                title="Upload file"
              >
                📎
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Message */}

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Message IdeaHub AI..."
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none px-2 py-2 max-h-32 text-white placeholder-slate-500"
              />

              {/* Send */}

              <button
                onClick={sendMessage}
                disabled={
                  loading ||
                  (!message.trim() &&
                    !selectedFile)
                }
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 flex items-center justify-center transition"
              >
                ↑
              </button>

            </div>

            <p className="text-center text-xs text-slate-600 mt-2">
              IdeaHub AI can make mistakes.
              Verify important information.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AIChat;