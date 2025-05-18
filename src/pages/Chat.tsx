import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import ChatWindow from '../components/chat/ChatWindow';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Replace with your user context or however you get the current user
  const user = supabase.auth.user();
  const receiverId = 'recipient_user_id'; // Replace or determine dynamically

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let file_url: string | null = null;
    let file_type: string | null = null;
    let file_name: string | null = null;

    if (file && user) {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('chat_files')
        .upload(filePath, file);

      if (error) {
        alert("File upload failed: " + error.message);
        setUploading(false);
        return;
      }

      // Use getPublicUrl for public buckets, or createSignedUrl for private
      const { publicUrl } = supabase
        .storage
        .from('chat_files')
        .getPublicUrl(filePath).data;

      file_url = publicUrl;
      file_type = file.type;
      file_name = file.name;
    }

    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert([{
        content: message,
        sender_id: user.id,
        receiver_id: receiverId,
        file_url,
        file_type,
        file_name,
      }]);
    
    if (insertError) {
      alert("Failed to send message: " + insertError.message);
    } else {
      setMessage('');
      setFile(null);
    }
    setUploading(false);
  };

  return (
    <div>
      <ChatWindow />
      <form onSubmit={handleSendMessage}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message"
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Sending...' : 'Send'}
        </button>
        {file && (
          <div>
            Selected: {file.name} ({file.type})
          </div>
        )}
      </form>
    </div>
  );
}
