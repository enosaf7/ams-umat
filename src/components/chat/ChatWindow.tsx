import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/pages/Chat";
import ImageViewerModal from "./ImageViewerModal";

interface ChatWindowProps {
  messages: ChatMessage[];
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, userId }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto min-h-[300px] h-full">
      {messages.length === 0 && (
        <div className="text-center text-gray-400">No messages yet.</div>
      )}

      {messages.map((message) => {
        const isSender = message.sender_id === userId;
        const avatarUrl =
          message.sender?.avatar_url ||
          "/default-avatar.png"; // fallback image if avatar missing

        return (
          <div
            key={message.id}
            className={`flex items-end gap-2 max-w-xs ${
              isSender ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {/* Avatar */}
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full border object-cover"
            />
            <div className="flex flex-col items-start">
              {/* File Preview */}
              {message.file_url && (
                <div className="mb-1">
                  {(message.file_type === "image/jpeg" ||
                    message.file_type === "image/png") ? (
                    <img
                      src={message.file_url}
                      alt={message.file_name || ""}
                      className="max-w-xs max-h-48 rounded border cursor-pointer"
                      style={{ objectFit: "cover", background: "#fff" }}
                      onClick={() => setModalImage(message.file_url!)}
                    />
                  ) : message.file_type === "application/pdf" ? (
                    <a
                      href={message.file_url}
                      download={message.file_name || true}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {message.file_name || "Download PDF"}
                    </a>
                  ) : (
                    <a
                      href={message.file_url}
                      download={message.file_name || true}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {message.file_name || "Download file"}
                    </a>
                  )}
                </div>
              )}
              {/* Message Text */}
              {message.content && (
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isSender
                      ? "bg-umat-green text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              )}
              <span className="text-xs text-gray-400 mt-1">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
      <ImageViewerModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
    </div>
  );
};

export default ChatWindow;
