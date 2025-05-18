import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { Layout } from "@/components/layout/Layout";
import AvatarWithBadge from "@/components/common/AvatarWithBadge";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hide by default on mobile

  // For message input
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unread count for current user (for their own avatar)
  const [myUnreadCount, setMyUnreadCount] = useState(0);

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
      // Mark all messages as read when opening a chat
      markMessagesAsRead(selectedContact.id);
    }
  }, [selectedContact]);

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
            // Show notification if user is not currently chatting with the sender
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

  // Fetch contacts, with unread count (messages where receiver is current user and read is false)
  const fetchContacts = async () => {
    try {
      setLoading(true);
      // Fetch contacts
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, username, avatar_url")
        .neq("id", user?.id);

      if (error) throw error;

      // For each contact, fetch unread count (as receiver)
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

  // Fetch unread for this user (for their own avatar badge)
  const fetchMyUnreadCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", user.id)
      .eq("read", false);
    setMyUnreadCount(count || 0);
  };

  // Mark all messages as read when user opens a chat
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
        .select(
          `
            *,
            sender:profiles!chat_messages_sender_id_fkey (
              id, first_name, last_name, avatar_url
            )
          `
        )
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

  // File input validation and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Only jpg, png, or pdf files allowed" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File must be ≤ 5MB" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(file);

    // Image preview
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
    if (!messageText && !selectedFile) {
      toast({ title: "Cannot send empty message" });
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
        toast({ title: "File upload failed", description: uploadError.message });
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from("chat-files").getPublicUrl(filePath);
      fileUrl = data.publicUrl;
      fileType = selectedFile.type;
      fileName = selectedFile.name;
      setUploading(false);
      setSelectedFile(null);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
        setFilePreview(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const { error: dbError } = await supabase.from("chat_messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact.id,
      content: messageText,
      file_url: fileUrl,
      file_type: fileType,
      file_name: fileName,
      read: false,
    });
    if (dbError) {
      toast({ title: "Failed to send message", description: dbError.message });
    } else {
      setMessageText("");
      setSelectedFile(null);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
        setFilePreview(null);
      }
      fetchMessages(selectedContact.id);
    }
  };

  // When a contact is selected, close sidebar on mobile
  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
    markMessagesAsRead(contact.id);
  };

  // Example: use AvatarWithBadge for the user's avatar in the header (adjust as needed)
  // Replace your current avatar code with this wherever you display the user's profile picture
  // <AvatarWithBadge src={user.avatar_url || "/default-avatar.png"} size={40} alt={user.username} unreadCount={myUnreadCount} />

  return (
    <Layout>
      {/* Example usage in top bar - adjust location as needed */}
      <div className="flex items-center p-2 border-b bg-white">
        <AvatarWithBadge
          src={user?.avatar_url || "/default-avatar.png"}
          size={40}
          alt={user?.username || "My profile"}
          unreadCount={myUnreadCount}
        />
        <span className="ml-2 font-bold">{user?.username}</span>
      </div>
      <div className="flex h-[80vh] w-full relative">
        {/* Sidebar */}
        <div
          className={`
            ${sidebarOpen ? "block absolute z-30 bg-white w-64 sm:static sm:z-0" : "hidden"}
            sm:block
            sm:w-80
            transition-all
            h-full
            border-r
          `}
        >
          <ChatSidebar
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            className="h-full"
          />
        </div>

        {/* Sidebar Toggle Button for Mobile */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-40 sm:hidden bg-umat-green text-white p-2 rounded-full shadow"
            aria-label="Open chat list"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <div className="flex-1 flex flex-col border-l">
          <div className="flex-1 overflow-y-auto">
            {selectedContact ? (
              <ChatWindow messages={messages} userId={user?.id || ""} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a contact to start chatting
              </div>
            )}
          </div>
          {selectedContact && (
            <form
              onSubmit={sendMessage}
              className="p-4 border-t flex flex-col gap-2 bg-white"
            >
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="border rounded px-2 py-1"
                />
                {selectedFile && (
                  <>
                    <span className="text-xs text-gray-700">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-2 px-2 py-1 border rounded text-xs text-red-600"
                      disabled={uploading}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
              {/* Preview Section */}
              {filePreview && (
                <div className="mb-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded border"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type your message"
                  className="flex-1 border rounded px-2 py-1"
                  disabled={uploading}
                />
                <button
                  type="submit"
                  className="bg-umat-green text-white px-4 py-2 rounded"
                  disabled={uploading}
                >
                  {uploading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
