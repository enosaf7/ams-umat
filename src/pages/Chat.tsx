
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import Layout from "@/components/layout/Layout";
import AvatarWithBadge from "@/components/common/AvatarWithBadge";
import { Button } from "@/components/ui/button";
import { Menu, X, Send, Paperclip } from "lucide-react";

export type ChatContact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  unread_count: number;
  last_message?: string;
  last_message_time?: string;
};

export type ChatMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  file_url: string | null;
  file_type: string | null;
  file_name: string | null;
  sender?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Chat = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // For message input
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Unread count for current user
  const [myUnreadCount, setMyUnreadCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchMyUnreadCount();
      const channel = setupRealtimeSubscription();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      markMessagesAsRead(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const setupRealtimeSubscription = () => {
    return supabase
      .channel("chat_messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (
            newMessage.sender_id === user?.id ||
            newMessage.receiver_id === user?.id
          ) {
            if (
              selectedContact &&
              (newMessage.sender_id === selectedContact.id ||
                newMessage.receiver_id === selectedContact.id)
            ) {
              fetchMessages(selectedContact.id);
              markMessagesAsRead(selectedContact.id);
            }
            if (
              newMessage.receiver_id === user?.id &&
              (!selectedContact || selectedContact.id !== newMessage.sender_id)
            ) {
              showBrowserNotification(newMessage);
            }
            fetchContacts();
            fetchMyUnreadCount();
          }
        }
      )
      .subscribe();
  };

  const showBrowserNotification = (message: ChatMessage) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New message", {
        body: message.content || "Media message",
        icon: message.sender?.avatar_url || "/default-avatar.png",
      });
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, username, avatar_url")
        .neq("id", user?.id);

      if (error) throw error;

      const contactsWithUnread = await Promise.all(
        (profiles || []).map(async (contact) => {
          const { count } = await supabase
            .from("chat_messages")
            .select("id", { count: "exact", head: true })
            .eq("receiver_id", user?.id)
            .eq("sender_id", contact.id)
            .eq("read", false);
          return { ...contact, unread_count: count || 0 };
        })
      );

      setContacts(contactsWithUnread);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyUnreadCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", user.id)
      .eq("read", false);
    setMyUnreadCount(count || 0);
  };

  const markMessagesAsRead = async (contactId: string) => {
    if (!user) return;
    await supabase
      .from("chat_messages")
      .update({ read: true })
      .eq("sender_id", contactId)
      .eq("receiver_id", user.id)
      .eq("read", false);
    fetchContacts();
    fetchMyUnreadCount();
  };

  const fetchMessages = async (contactId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user?.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user?.id})`
        )
        .order("created_at", { ascending: true });
      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Only jpg, png, or pdf files allowed", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File must be ≤ 5MB", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !selectedContact) return;
    if (!messageText.trim() && !selectedFile) {
      toast({ title: "Cannot send empty message", variant: "destructive" });
      return;
    }

    let fileUrl = null;
    let fileType = null;
    let fileName = null;

    if (selectedFile) {
      setUploading(true);
      const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("chat-files")
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        toast({ title: "File upload failed", description: uploadError.message, variant: "destructive" });
        setUploading(false);
        return;
      }
      
      const { data } = supabase.storage.from("chat-files").getPublicUrl(filePath);
      fileUrl = data.publicUrl;
      fileType = selectedFile.type;
      fileName = selectedFile.name;
      setUploading(false);
      handleRemoveFile();
    }

    const { error: dbError } = await supabase.from("chat_messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact.id,
      content: messageText.trim(),
      file_url: fileUrl,
      file_type: fileType,
      file_name: fileName,
      read: false,
    });
    
    if (dbError) {
      toast({ title: "Failed to send message", description: dbError.message, variant: "destructive" });
    } else {
      setMessageText("");
      fetchMessages(selectedContact.id);
    }
  };

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    markMessagesAsRead(contact.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            fixed md:static
            z-50 md:z-0
            w-80 h-full
            transition-transform duration-300 ease-in-out
            bg-white border-r border-gray-200
          `}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <AvatarWithBadge
                src={profile?.avatar_url || "/default-avatar.png"}
                size={40}
                alt={profile?.username || "My profile"}
                unreadCount={myUnreadCount}
              />
              <div>
                <h2 className="font-semibold text-lg">Messages</h2>
                <p className="text-sm text-gray-500">{profile?.username}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ChatSidebar
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            className="h-[calc(100%-5rem)]"
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {selectedContact ? (
                <>
                  <AvatarWithBadge
                    src={selectedContact.avatar_url || "/default-avatar.png"}
                    size={40}
                    alt={`${selectedContact.first_name || ""} ${selectedContact.last_name || ""}`.trim()}
                    unreadCount={0}
                  />
                  <div>
                    <h3 className="font-semibold">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">@{selectedContact.username}</p>
                  </div>
                </>
              ) : (
                <h3 className="font-semibold text-gray-500">Select a conversation</h3>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            {selectedContact ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <ChatWindow messages={messages} userId={user?.id || ""} />
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  {filePreview && (
                    <div className="mb-3 relative inline-block">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-w-xs max-h-32 rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {selectedFile && !filePreview && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                      <Paperclip className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-umat-green focus:border-transparent"
                      disabled={uploading}
                    />
                    
                    <Button
                      type="submit"
                      disabled={uploading || (!messageText.trim() && !selectedFile)}
                      className="bg-umat-green hover:bg-umat-green/90"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
                  <p>Select a contact from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
