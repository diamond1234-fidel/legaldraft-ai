// @ts-ignore - Deno is a global in Supabase Functions
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  // This is needed if you're deploying functions from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, role, firm_id } = await req.json();

    if (!email || !role || !firm_id) {
        throw new Error("Email, role, and firm_id are required.");
    }
    
    // The supabase client is created with the service_role key to perform admin actions.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get the site URL from environment variables to redirect the user back to your app
    const redirectTo = Deno.env.get('SITE_URL'); 

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: role,
        firm_id: firm_id,
        // Add a field to distinguish invited users from regular sign-ups if needed
        account_type: 'firm_member', 
      },
      redirectTo: redirectTo,
    });

    if (error) {
      // Throw Supabase-specific errors to be caught below
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Use 400 for client errors like missing params or auth errors
    });
  }
});
