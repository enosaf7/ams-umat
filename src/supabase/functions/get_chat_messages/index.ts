
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

    // Try to use the full query with all possible columns
    let query = supabaseClient
      .from('chat_messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        created_at,
        file_url,
        file_name,
        file_type,
        file_size,
        edited,
        edited_at,
        deleted,
        deleted_at,
        sender:profiles!sender_id(first_name, last_name, avatar_url)
      `)
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${p_contact_id}),and(sender_id.eq.${p_contact_id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    const { data, error } = await query;
    
    // If there's an error with the columns, try a fallback query with minimal columns
    if (error && error.message && error.message.includes("column")) {
      console.log("Using fallback query due to schema mismatch");
      
      const fallbackQuery = supabaseClient
        .from('chat_messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          sender:profiles!sender_id(first_name, last_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${p_contact_id}),and(sender_id.eq.${p_contact_id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        console.error('Error fetching messages (fallback):', fallbackError);
        return new Response(JSON.stringify({ error: fallbackError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      // Mark received messages as read
      await supabaseClient
        .from('chat_messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', p_contact_id);
        
      return new Response(JSON.stringify(fallbackData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    if (error) {
      console.error('Error fetching messages:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Mark received messages as read
    await supabaseClient
      .from('chat_messages')
      .update({ read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', p_contact_id);

    return new Response(JSON.stringify(data), {
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
