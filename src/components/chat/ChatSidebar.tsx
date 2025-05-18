import React from "react";
import { ChatContact } from "@/pages/Chat";

interface ChatSidebarProps {
  contacts: ChatContact[];
  selectedContact: ChatContact | null;
  onSelectContact: (contact: ChatContact) => void;
  className?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
  className
}) => {
  return (
    <div className={`overflow-y-auto h-full bg-white ${className || ""}`}>
      <h2 className="px-4 py-2 font-semibold text-lg border-b">Chats</h2>
      <ul>
        {contacts.map(contact => (
          <li
            key={contact.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
              selectedContact?.id === contact.id ? "bg-gray-200" : ""
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="relative">
              <img
                src={contact.avatar_url || "/default-avatar.png"}
                className="w-12 h-12 rounded-full border object-cover"
                alt="avatar"
              />
              {contact.unread_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                  {contact.unread_count}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold">
                {contact.first_name} {contact.last_name}
              </div>
              {contact.last_message && (
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {contact.last_message}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
