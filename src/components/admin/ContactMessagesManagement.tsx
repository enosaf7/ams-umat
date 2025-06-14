import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

const ContactMessagesManagement = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setMessages([]);
      } else if (data) {
        setMessages(data as ContactMessage[]);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Contact Messages</h2>
      {loading ? (
        <div>Loading messages...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded mb-4">
          <strong>Error loading messages:</strong> {error}
        </div>
      ) : messages.length === 0 ? (
        <div>No contact messages yet.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map(msg => (
              <TableRow key={msg.id}>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell>{new Date(msg.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ContactMessagesManagement;
