import { useRef, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Paperclip, X, FileImage, FileVideo, FilePdf, FileText, FileAudio, FileArchive } from "lucide-react";
import { format } from "date-fns";
import { ChatContact, ChatMessage } from "@/pages/Chat";
import { Progress } from "@/components/ui/progress";

interface ChatWindowProps {
  messages: ChatMessage[];
  selectedContact: ChatContact | null;
  currentUser: User | null;
  onSendMessage: (content: string, file?: File) => void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() || selectedFile) {
      onSendMessage(messageInput, selectedFile || undefined);
      setMessageInput("");
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert("File size exceeds 100MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = (message: ChatMessage) => {
    if (message.sender?.first_name && message.sender?.last_name) {
      return `${message.sender.first_name[0]}${message.sender.last_name[0]}`;
    }
    return "U";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="h-6 w-6" />;
    } else if (fileType.startsWith("video/")) {
      return <FileVideo className="h-6 w-6" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-6 w-6" />;
    } else if (fileType.includes("audio/")) {
      return <FileAudio className="h-6 w-6" />;
    } else if (fileType.includes("application/zip") || fileType.includes("application/x-rar")) {
      return <FileArchive className="h-6 w-6" />;
    } else if (fileType.includes("application/msword") || fileType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml")) {
      return <FileText className="h-6 w-6" />;
    } else {
      return <FileText className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const renderFilePreview = (message: ChatMessage) => {
    if (!message.file_url || !message.file_type) return null;

    if (message.file_type.startsWith("image/")) {
      return (
        <div className="mt-2">
          <img 
            src={message.file_url} 
            alt={message.file_name || "Image"} 
            className="max-w-full rounded-lg max-h-64 object-contain"
          />
          <a 
            href={message.file_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-blue-600 hover:underline block mt-1"
            download={message.file_name || "download"}
          >
            {message.file_name} {message.file_size && `(${formatFileSize(message.file_size)})`}
          </a>
        </div>
      );
    } else if (message.file_type.startsWith("video/")) {
      return (
        <div className="mt-2">
          <video 
            src={message.file_url} 
            controls 
            className="max-w-full rounded-lg max-h-64"
          >
            Your browser does not support the video tag.
          </video>
          <a 
            href={message.file_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-blue-600 hover:underline block mt-1"
            download={message.file_name || "download"}
          >
            {message.file_name} {message.file_size && `(${formatFileSize(message.file_size)})`}
          </a>
        </div>
      );
    } else if (message.file_type.startsWith("audio/")) {
      return (
        <div className="mt-2">
          <audio 
            src={message.file_url} 
            controls 
            className="max-w-full"
          >
            Your browser does not support the audio tag.
          </audio>
          <a 
            href={message.file_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-blue-600 hover:underline block mt-1"
            download={message.file_name || "download"}
          >
            {message.file_name} {message.file_size && `(${formatFileSize(message.file_size)})`}
          </a>
        </div>
      );
    } else {
      // For other file types like PDFs, documents, etc.
      return (
        <div className="mt-2 p-3 bg-gray-100 rounded-lg flex items-center">
          {getFileIcon(message.file_type)}
          <a 
            href={message.file_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-2 text-sm text-blue-600 hover:underline flex-1 truncate"
            download={message.file_name || "download"}
          >
            {message.file_name}
          </a>
          <span className="text-xs text-gray-500 ml-2">
            {message.file_size && formatFileSize(message.file_size)}
          </span>
        </div>
      );
    }
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
                      {message.content && <p className="text-sm">{message.content}</p>}
                      {renderFilePreview(message)}
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

      {/* Selected file preview */}
      {selectedFile && (
        <div className="p-2 border-t bg-gray-50">
          <div className="flex items-center p-2 bg-gray-100 rounded-md">
            {getFileIcon(selectedFile.type)}
            <span className="ml-2 text-sm truncate flex-1">{selectedFile.name}</span>
            <span className="text-xs text-gray-500 mx-2">{formatFileSize(selectedFile.size)}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveFile} 
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mr-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Input
          placeholder="Type a message..."
          className="mr-2"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button type="submit" disabled={(!messageInput.trim() && !selectedFile)}>
          <SendHorizonal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
