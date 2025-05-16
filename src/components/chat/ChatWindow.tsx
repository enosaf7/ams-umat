
import { useRef, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { format } from "date-fns";
import { ChatContact, ChatMessage } from "@/pages/Chat";

interface ChatWindowProps {
  messages: ChatMessage[];
  selectedContact: ChatContact | null;
  currentUser: User | null;
  onSendMessage: (content: string) => void;
  loading: boolean;
}

const ChatWindow = ({
  messages,
  selectedContact,
  currentUser,
  onSendMessage,
  loading,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput("");
    }
  };

  const getInitials = (message: ChatMessage) => {
    if (message.sender?.first_name && message.sender?.last_name) {
      return `${message.sender.first_name[0]}${message.sender.last_name[0]}`;
    }
    return "U";
  };

  if (!selectedContact) {
    return (
      <div className="w-2/3 flex items-center justify-center h-full bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Select a contact to start chatting</p>
          <p className="text-sm">Your conversations will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col h-full">
      {/* Contact header */}
      <div className="p-4 border-b flex items-center bg-gray-50">
        <Avatar className="h-10 w-10 mr-4">
          {selectedContact.avatar_url ? (
            <AvatarImage src={selectedContact.avatar_url} alt={`${selectedContact.first_name || ""} ${selectedContact.last_name || ""}`} />
          ) : (
            <AvatarFallback className="bg-umat-green text-white">
              {selectedContact.first_name && selectedContact.last_name
                ? `${selectedContact.first_name[0]}${selectedContact.last_name[0]}`
                : (selectedContact.username?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-medium">
            {selectedContact.first_name && selectedContact.last_name
              ? `${selectedContact.first_name} ${selectedContact.last_name}`
              : selectedContact.username || "Unknown User"}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender_id === currentUser?.id;
            const messageDate = new Date(message.created_at);
            const formattedTime = format(messageDate, "h:mm a");

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex max-w-[70%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      {message.sender?.avatar_url ? (
                        <AvatarImage src={message.sender.avatar_url} alt="User" />
                      ) : (
                        <AvatarFallback className="bg-umat-green text-white">
                          {getInitials(message)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        isCurrentUser
                          ? "bg-umat-green text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${isCurrentUser ? "text-right" : ""} text-gray-500`}>
                      {formattedTime}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <Input
          placeholder="Type a message..."
          className="mr-2"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button type="submit" disabled={!messageInput.trim()}>
          <SendHorizonal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
