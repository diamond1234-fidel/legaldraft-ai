
// @ts-ignore - Deno is a global in Supabase Functions
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Get the connection string from the environment
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;

// Create a new database pool
const pool = new Pool(databaseUrl, 3, true);


serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const connection = await pool.connect();

  try {
    const { email, role, firm_id, inviter_id, inviter_name } = await req.json();

    if (!email || !role || !firm_id || !inviter_id || !inviter_name) {
        throw new Error("Missing required invitation details.");
    }

    // 1. Find user in profiles table by email
    const profileResult = await connection.queryObject(
        "SELECT id, firm_id, full_name, email FROM public.profiles WHERE email = $1 LIMIT 1",
        [email]
    );

    const profileData = profileResult.rows[0];

    if (!profileData) {
        // User does not exist, throw error as requested. No email will be sent.
        throw new Error("A user with this email does not exist. Please ask them to sign up first.");
    }
    
    // 2. Check if user is already in a firm
    if (profileData.firm_id) {
        throw new Error("This user is already a member of another firm.");
    }
    
    const invitedUserId = profileData.id;
    
    // Check for an existing pending invitation first to provide a clear error message.
    const existingInviteResult = await connection.queryObject(
        "SELECT id FROM public.invitations WHERE firm_id = $1 AND invited_user_id = $2 AND status = 'pending' LIMIT 1",
        [firm_id, invitedUserId]
    );

    if (existingInviteResult.rows.length > 0) {
        throw new Error("An invitation for this user to this firm already exists and is pending.");
    }

    // 3. Create an invitation record
    const invitationResult = await connection.queryObject(
      `INSERT INTO public.invitations (firm_id, invited_user_id, inviter_id, role, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id`,
      [firm_id, invitedUserId, inviter_id, role]
    );
    
    const invitation = invitationResult.rows[0];
    if (!invitation) {
        throw new Error(`Failed to create invitation record.`);
    }


    // 4. Create a notification for the invited user
    const firmProfileResult = await connection.queryObject(
        "SELECT full_name FROM public.profiles WHERE id = $1 LIMIT 1",
        [firm_id]
    );

    const firmProfile = firmProfileResult.rows[0];
    const firmDisplayName = firmProfile?.full_name ? `${firmProfile.full_name}'s Firm` : 'the firm';

    await connection.queryObject(
        `INSERT INTO public.notifications (user_id, message, link_to)
         VALUES ($1, $2, $3)`,
        [invitedUserId, `${inviter_name} has invited you to join their firm, ${firmDisplayName}.`, `invitation:${invitation.id}`]
    );


    return new Response(JSON.stringify({ 
        success: true, 
        message: `Invitation sent to ${profileData.full_name || profileData.email}. They will see it in their notifications.` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    let status = 400; // Default to Bad Request for user-facing errors
    if (error.message.includes('relation') || error.message.includes('database')) {
        status = 500; // Internal server error for DB issues
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: status,
    });
  } finally {
      // Release the connection back to the pool
      connection.release();
  }
});
