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

  // Auto-scroll to last message when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto min-h-[300px] h-full">
      {messages.length === 0 && (
        <div className="text-center text-gray-400">No messages yet.</div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col max-w-xs ${
            message.sender_id === userId ? "self-end items-end" : "self-start items-start"
          }`}
        >
          {/* FILE PREVIEW */}
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
          {/* MESSAGE TEXT IF ANY */}
          {message.content && (
            <div
              className={`px-4 py-2 rounded-lg ${
                message.sender_id === userId
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
      ))}

      {/* This div is for auto-scrolling to the last message */}
      <div ref={bottomRef} />

      {/* Modal for Image Preview */}
      <ImageViewerModal
        imageUrl={modalImage}
        onClose={() => setModalImage(null)}
      />
    </div>
  );
};

export default ChatWindow;
