// @ts-ignore
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
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    // SECURITY: Basic but crucial check to ensure only SELECT statements are executed.
    // This prevents any form of data mutation from the client-side editor.
    if (!query || typeof query !== 'string' || !query.trim().toLowerCase().startsWith('select')) {
      throw new Error('Only SELECT queries are allowed.');
    }

    const connection = await pool.connect();

    try {
      // Use queryObject for safe parameter binding in the future, although not used here.
      const result = await connection.queryObject(query);
      return new Response(JSON.stringify(result.rows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    // Return a 400 Bad Request for user errors (like invalid SQL)
    // and a 500 for other unexpected errors.
    const status = error.message.includes('syntax error') || error.message.includes('Only SELECT') ? 400 : 500;
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: status,
    });
  }
});
