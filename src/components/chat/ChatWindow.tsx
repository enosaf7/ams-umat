
import { useRef, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Paperclip, X, FileImage, FileVideo, FileText, FileAudio, FileArchive, Trash, Edit } from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { ChatContact, ChatMessage } from "@/pages/Chat";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface ChatWindowProps {
  messages: ChatMessage[];
  selectedContact: ChatContact | null;
  currentUser: User | null;
  onSendMessage: (content: string, file?: File) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  loading: boolean;
}

const ChatWindow = ({
  messages,
  selectedContact,
  currentUser,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  loading,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState("");
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

  const handleStartEditing = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditMessageContent(message.content);
  };

  const handleCancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editMessageContent.trim()) {
      onEditMessage(editingMessageId, editMessageContent.trim());
      setEditingMessageId(null);
      setEditMessageContent("");
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
      return <FileText className="h-6 w-6" />; // Using FileText instead of FilePdf
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

  const canEditOrDeleteMessage = (message: ChatMessage): boolean => {
    if (message.sender_id !== currentUser?.id) return false;
    if (message.deleted) return false;
    
    const now = new Date();
    const messageDate = new Date(message.created_at);
    const secondsDiff = differenceInSeconds(now, messageDate);
    
    return secondsDiff <= 600; // 10 minutes (600 seconds)
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
            const isEditing = message.id === editingMessageId;
            const canModify = canEditOrDeleteMessage(message);

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
                      {isEditing ? (
                        <div className="flex flex-col space-y-2">
                          <Textarea
                            value={editMessageContent}
                            onChange={(e) => setEditMessageContent(e.target.value)}
                            className="min-h-[60px] bg-white text-black p-2 rounded"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancelEditing}
                              className="h-8 px-2 py-1 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleSaveEdit}
                              className="h-8 px-2 py-1 text-xs"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.content && (
                            <div className="flex items-start">
                              <p className={`text-sm ${message.deleted ? "italic text-opacity-70" : ""}`}>
                                {message.content}
                              </p>
                              {message.edited && !message.deleted && (
                                <span className="text-xs ml-1 opacity-70">(edited)</span>
                              )}
                            </div>
                          )}
                          {renderFilePreview(message)}
                        </>
                      )}
                    </div>
                    <div className={`flex items-center mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <p className="text-xs text-gray-500">{formattedTime}</p>
                      
                      {isCurrentUser && canModify && !isEditing && !message.deleted && (
                        <div className="flex ml-2">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEditing(message)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3 text-gray-500" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteMessage(message.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash className="h-3 w-3 text-gray-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      )}
                    </div>
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
