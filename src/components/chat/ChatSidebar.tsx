
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChatContact } from "@/pages/Chat";

interface ChatSidebarProps {
  contacts: ChatContact[];
  selectedContact: ChatContact | null;
  onSelectContact: (contact: ChatContact) => void;
  loading: boolean;
  currentUser: User | null;
}

const ChatSidebar = ({
  contacts,
  selectedContact,
  onSelectContact,
  loading,
  currentUser,
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.first_name || ""} ${contact.last_name || ""}`.toLowerCase();
    const username = (contact.username || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || username.includes(searchLower);
  });

  const getInitials = (contact: ChatContact) => {
    if (contact.first_name && contact.last_name) {
      return `${contact.first_name[0]}${contact.last_name[0]}`;
    }
    if (contact.username) {
      return contact.username[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="w-1/3 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? "No matching contacts found" : "No contacts available"}
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                selectedContact?.id === contact.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <Avatar className="h-10 w-10 mr-4">
                {contact.avatar_url ? (
                  <AvatarImage src={contact.avatar_url} alt={`${contact.first_name || ""} ${contact.last_name || ""}`} />
                ) : (
                  <AvatarFallback className="bg-umat-green text-white">
                    {getInitials(contact)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  {contact.first_name && contact.last_name
                    ? `${contact.first_name} ${contact.last_name}`
                    : contact.username || "Unknown User"}
                </h3>
                {contact.last_message && (
                  <p className="text-xs text-gray-500 truncate">
                    {contact.last_message}
                  </p>
                )}
              </div>
              {contact.last_message_time && (
                <span className="text-xs text-gray-400">{contact.last_message_time}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
