// import { createClient } from 'jsr:@supabase/supabase-js@2.46.2';
// import { corsHeaders } from "./_shared/cors.ts";
import { serve } from "https://deno.land/std@0.179.0/http/server.ts";
// import  { handleSignUp } from "./functions/sign_up.ts";
;


serve(async (req: Request) => {

    // Handle CORS preflight requests
    if(req.method === 'POST' && req.url === '/signup') {
        return handleSignUp(req);
    }
});