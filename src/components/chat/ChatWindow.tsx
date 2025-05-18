import React from "react";
import { ChatMessage } from "@/pages/Chat";

interface ChatWindowProps {
  messages: ChatMessage[];
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, userId }) => {
  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto min-h-[300px]">
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
          {/* File rendering */}
          {message.file_url && (
            <div className="mb-1">
              {message.file_type?.startsWith("image/") ? (
                <img
                  src={message.file_url}
                  alt={message.file_name || ""}
                  className="max-w-xs max-h-48 rounded border"
                />
              ) : message.file_type === "application/pdf" ? (
                <a
                  href={message.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  download={message.file_name || true}
                >
                  {message.file_name || "View PDF"}
                </a>
              ) : (
                <a
                  href={message.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  download={message.file_name || true}
                >
                  {message.file_name || "Download file"}
                </a>
              )}
            </div>
          )}
          {/* Text rendering */}
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
    </div>
  );
};

export default ChatWindow;
