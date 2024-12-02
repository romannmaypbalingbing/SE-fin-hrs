import { corsHeaders } from '../_shared/cors.ts';
import { serve } from 'https://deno.land/std@0.179.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Service Role Key:', SUPABASE_SERVICE_ROLE_KEY);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set!');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler = oakCors({ origin: '*' })(async (req: Request) => {
  if (req.method !== 'POST' || !req.url.endsWith('/signup')) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    // Parse request body
    const { email, password } = await req.json();
    console.log('Received signup data:', { email, password });

    // Validate input data
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    // Create user
    const { data: user, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      console.error('Sign-up error:', signUpError);
      return new Response(
        JSON.stringify({ error: signUpError.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User creation failed.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500, // Internal server error
        },
      );
    }

    // Insert additional user data into the database
    const { error: dbError } = await supabase.from('users').insert([
      {
        user_id: user.id, // Use the id provided by Supabase
        user_email: email,
        role: 'guest',
      },
    ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: dbError.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    // Respond with a success message
    return new Response(
      JSON.stringify({ message: 'Sign up successful!' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Unexpected error:', error);

    // Respond with an error message
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

// Use port from environment variable or fallback to 8000
const PORT = Number(Deno.env.get('PORT')) || 8000;
console.log(`Server running on http://localhost:${PORT}`);
serve(handler, { port: PORT });
