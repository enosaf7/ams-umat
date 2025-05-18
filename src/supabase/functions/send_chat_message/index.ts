import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const {
    content,
    sender_id,
    receiver_id,
    file_url = null,
    file_type = null,
    file_name = null
  } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase
    .from('chat_messages')
    .insert([{
      content,
      sender_id,
      receiver_id,
      file_url,
      file_type,
      file_name
    }])

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
