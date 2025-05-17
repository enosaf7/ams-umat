
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

  const setupRealtimeSubscription = () => {
    return supabase
      .channel('chat_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Check if the message is related to the current user
          if (newMessage.sender_id === user?.id || newMessage.receiver_id === user?.id) {
            // If we're in a conversation with this person, update the messages
            if (selectedContact && 
                (newMessage.sender_id === selectedContact.id || newMessage.receiver_id === selectedContact.id)) {
              fetchMessages(selectedContact.id);
            } else {
              // Otherwise notify about the new message
              toast({
                title: "New Message",
                description: "You received a new message",
              });
              // Refresh contacts to show latest message
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
        .from('profiles')
        .select('id, first_name, last_name, username, avatar_url')
        .neq('id', user?.id);

      if (error) {
        throw error;
      }

      // Get the last message for each contact to display in the sidebar
      const contactsWithLastMessage = await Promise.all((data || []).map(async (contact) => {
        const { data: messageData } = await supabase
          .from('chat_messages')
          .select('content, created_at')
          .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${contact.id}),and(sender_id.eq.${contact.id},receiver_id.eq.${user?.id})`)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const lastMessage = messageData && messageData.length > 0 ? messageData[0] : null;
        
        return {
          ...contact,
          last_message: lastMessage?.content || undefined,
          last_message_time: lastMessage?.created_at || undefined
        };
      }));

      setContacts(contactsWithLastMessage || []);
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
      
      // 1. Fetch messages without joining
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        throw messagesError;
      }

      // 2. Fetch all unique sender profiles in one go
      const senderIds = Array.from(new Set(messagesData.map(msg => msg.sender_id)));
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', senderIds);

      if (profilesError) {
        throw profilesError;
      }

      // 3. Create a map for quick profile lookup
      const profilesMap = new Map();
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        });
      });

      // 4. Join the data manually
      const enrichedMessages: ChatMessage[] = messagesData.map(message => ({
        ...message,
        sender: profilesMap.get(message.sender_id) || {
          first_name: null,
          last_name: null,
          avatar_url: null
        }
      }));

      setMessages(enrichedMessages);
      
      // Mark received messages as read
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('receiver_id', user?.id)
        .eq('sender_id', contactId);
        
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

  const sendMessage = async (content: string) => {
    if (!selectedContact || !content.trim() || !user?.id) return;

    try {
      // Direct database insert instead of using Edge Function
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedContact.id,
          content: content.trim()
        })
        .select();

      if (error) {
        throw error;
      }

      // No need to refresh messages here as the realtime subscription will handle it
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
