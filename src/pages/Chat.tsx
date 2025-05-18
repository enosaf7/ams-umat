import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { Layout } from "@/components/layout/Layout";

export type ChatContact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
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

  // For message input
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchContacts();
      const channel = setupRealtimeSubscription();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  // Clean up preview when file is deselected or component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

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
            } else {
              toast({
                title: "New Message",
                description: "You received a new message",
              });
              fetchContacts();
            }
          }
        }
      )
      .subscribe();
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, username, avatar_url")
        .neq("id", user?.id);
      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
    setSelectedFile(file);

    // Image preview
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  // Remove selected file (and preview) before sending
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Message sending
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

  return (
    <Layout>
      <div className="flex h-[80vh] w-full">
        <ChatSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
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
