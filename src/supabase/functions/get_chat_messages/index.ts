
// @ts-nocheck
// This is a Supabase Edge Function
// TypeScript errors will be ignored at build time as these will run in the Supabase Deno environment

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Now we can get the session or user object
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Parse the request body
    const { p_contact_id } = await req.json()

    // Validate the contact ID
    if (!p_contact_id) {
      return new Response(JSON.stringify({ error: 'Contact ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Query chat messages with minimal columns first
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .select(`
        id, 
        sender_id, 
        receiver_id, 
        content, 
        created_at, 
        read
      `)
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${p_contact_id}),and(sender_id.eq.${p_contact_id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Fetch sender profiles for the messages
    const senderIds = Array.from(new Set(data.map(msg => msg.sender_id)));
    const { data: profilesData, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', senderIds);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(JSON.stringify({ error: profilesError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Create a map for quick profile lookup
    const profilesMap = new Map();
    profilesData.forEach(profile => {
      profilesMap.set(profile.id, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url
      });
    });

    // Check for extended fields availability
    const { data: testData, error: testError } = await supabaseClient
      .from('chat_messages')
      .select('file_url')
      .limit(1);
    
    const hasExtendedFields = !testError; // If there's no error, the fields exist

    // Prepare messages with sender info and handle file fields
    const messages = data.map(msg => {
      const message = {
        ...msg,
        sender: profilesMap.get(msg.sender_id) || {
          first_name: null,
          last_name: null,
          avatar_url: null
        }
      };

      // If extended fields aren't available in the schema, add defaults
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
    await supabaseClient
      .from('chat_messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', p_contact_id);
    
    return new Response(JSON.stringify(messages), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
