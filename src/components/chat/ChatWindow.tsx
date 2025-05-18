import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  file_url: string | null;
  file_type: string | null;
  file_name: string | null;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();
    // Optionally, add real-time updates here
  }, []);

  return (
    <div style={{maxHeight: 400, overflowY: 'auto', border: '1px solid #ccc', marginBottom: 12}}>
      {messages.map(msg => (
        <div key={msg.id} style={{marginBottom: 16, padding: 8, borderBottom: '1px solid #eee'}}>
          <div>{msg.content}</div>
          {msg.file_url && (
            <div style={{marginTop: 8}}>
              {msg.file_type?.startsWith('image/') ? (
                <img src={msg.file_url} alt={msg.file_name ?? ''} style={{maxWidth: 200, display: 'block'}} />
              ) : msg.file_type === 'application/pdf' ? (
                <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              ) : (
                <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              )}
              <div>
                <strong>File:</strong> {msg.file_name} ({msg.file_type})
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
