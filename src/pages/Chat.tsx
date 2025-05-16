
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { User } from "@supabase/supabase-js";
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
  sender?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

const Chat = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchContacts();
      subscribeToMessages();
    }
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username, avatar_url')
        .neq('id', user?.id);

      if (error) {
        throw error;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      setLoading(true);
      // Use the REST API directly since we don't have types for chat_messages yet
      const { data, error } = await supabase.rpc('get_chat_messages', {
        p_contact_id: contactId
      });

      if (error) {
        throw error;
      }

      // Type assertion since we know the data structure
      setMessages((data as unknown) as ChatMessage[] || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Only update messages if we're currently viewing the conversation with this sender
          if (selectedContact && newMessage.sender_id === selectedContact.id) {
            fetchMessages(selectedContact.id);
          } else {
            // Notify about new message from someone else
            toast({
              title: "New Message",
              description: "You received a new message",
            });
            // Refresh contacts to show latest message
            fetchContacts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string) => {
    if (!selectedContact || !content.trim() || !user?.id) return;

    try {
      // Use the REST API directly since we don't have types for chat_messages yet
      const { error } = await supabase.rpc('send_chat_message', {
        p_receiver_id: selectedContact.id,
        p_content: content.trim()
      });

      if (error) {
        throw error;
      }

      // Refresh messages
      fetchMessages(selectedContact.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: "calc(100vh - 12rem)" }}>
          <div className="flex h-full">
            <ChatSidebar 
              contacts={contacts} 
              selectedContact={selectedContact} 
              onSelectContact={setSelectedContact} 
              loading={loading}
              currentUser={user}
            />
            <ChatWindow
              messages={messages}
              selectedContact={selectedContact}
              currentUser={user}
              onSendMessage={sendMessage}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
