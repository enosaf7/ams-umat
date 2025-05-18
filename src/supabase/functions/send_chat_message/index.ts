
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
    const { p_receiver_id, p_content, p_file_url, p_file_name, p_file_type, p_file_size } = await req.json()

    // Validate inputs
    if (!p_receiver_id || !p_content) {
      return new Response(JSON.stringify({ error: 'Receiver ID and content are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Prepare the message object with all possible fields
    const messageData = {
      sender_id: user.id,
      receiver_id: p_receiver_id,
      content: p_content,
      read: false
    }

    // Add file properties if they exist
    if (p_file_url) {
      messageData.file_url = p_file_url
    }
    if (p_file_name) {
      messageData.file_name = p_file_name
    }
    if (p_file_type) {
      messageData.file_type = p_file_type
    }
    if (p_file_size !== null && p_file_size !== undefined) {
      messageData.file_size = p_file_size
    }

    // Insert the new message
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert(messageData)
      .select()

    if (error) {
      console.error('Error sending message:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
