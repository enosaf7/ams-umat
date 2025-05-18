// This is a Supabase Edge Function
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Server configuration error', { SUPABASE_URL, SUPABASE_ANON_KEY });
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Get Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      console.error('User error:', userError.message);
      return new Response(JSON.stringify({ error: userError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    if (!user) {
      console.error('Unauthorized access - no user');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Parse request body safely
    let body;
    try {
      body = await req.json();
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    const { p_contact_id } = body || {};
    if (!p_contact_id) {
      console.error('Contact ID is required');
      return new Response(JSON.stringify({ error: 'Contact ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Query chat messages
    const { data: messagesData, error: messagesError } = await supabaseClient
      .from('chat_messages')
      .select(`
        id, 
        sender_id, 
        receiver_id, 
        content, 
        created_at, 
        read
      `)
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${p_contact_id}),and(sender_id.eq.${p_contact_id},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Messages fetch error:', messagesError.message);
      return new Response(JSON.stringify({ error: messagesError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    if (!messagesData) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get unique sender IDs
    const senderIds = Array.from(new Set(messagesData.map((msg: any) => msg.sender_id)));
    const { data: profilesData, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', senderIds);

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError.message);
      return new Response(JSON.stringify({ error: profilesError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Build profile map for sender info
    const profilesMap = new Map();
    (profilesData || []).forEach((profile: any) => {
      profilesMap.set(profile.id, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
      });
    });

    // Check if extended fields exist
    let hasExtendedFields = false;
    try {
      const { data: testData, error: testError } = await supabaseClient
        .from('chat_messages')
        .select('file_url')
        .limit(1);
      hasExtendedFields = !testError;
    } catch {
      hasExtendedFields = false;
    }

    // Attach sender profile and handle extended fields
    const messages = messagesData.map((msg: any) => {
      const message = {
        ...msg,
        sender: profilesMap.get(msg.sender_id) || {
          first_name: null,
          last_name: null,
          avatar_url: null,
        },
      };
      if (!hasExtendedFields) {
        message.file_url = null;
        message.file_name = null;
        message.file_type = null;
        message.file_size = null;
        message.edited = false;
        message.edited_at = null;
        message.deleted = false;
        message.deleted_at = null;
      }
      return message;
    });

    // Update read status for received messages
    const { error: updateError } = await supabaseClient
      .from('chat_messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', p_contact_id);

    if (updateError) {
      console.error('Failed to update read status:', updateError.message);
    }

    return new Response(JSON.stringify(messages), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
