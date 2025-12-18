import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  password: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!serviceKey 
      });
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    let requestBody: RequestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body. Expected JSON.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { userId, password } = requestBody;

    if (!userId || !password) {
      return new Response(
        JSON.stringify({ error: 'userId and password are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Updating password for user:', userId);
    
    // Use GoTrue Admin API directly via REST
    // The Admin API endpoint is: PUT /auth/v1/admin/users/{user_id}
    const authUrl = supabaseUrl.replace(/\/$/, '');
    const adminApiUrl = `${authUrl}/auth/v1/admin/users/${userId}`;
    
    console.log('Calling Admin API:', adminApiUrl);
    
    try {
      const response = await fetch(adminApiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      const responseText = await response.text();
      console.log('Admin API Response status:', response.status);
      console.log('Admin API Response length:', responseText.length);
      console.log('Admin API Response (first 500 chars):', responseText.substring(0, 500));
      
      if (!response.ok) {
        let errorMessage = 'Failed to update password';
        let errorDetails: any = null;
        
        try {
          errorDetails = JSON.parse(responseText);
          errorMessage = errorDetails.message || errorDetails.error_description || errorDetails.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        console.error('Admin API Password update failed:', errorMessage);
        console.error('Error details:', errorDetails);
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            details: errorDetails
          }),
          {
            status: response.status || 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      let userData: any;
      try {
        userData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Admin API response:', parseError);
        return new Response(
          JSON.stringify({ error: 'Invalid response from auth service' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Password updated successfully',
          user: { id: userData.id, email: userData.email }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      const fetchErrorMessage = fetchError instanceof Error 
        ? fetchError.message 
        : String(fetchError);
      console.error('Error stack:', fetchError instanceof Error ? fetchError.stack : 'No stack trace');
      
      return new Response(
        JSON.stringify({ 
          error: 'Network error while updating password',
          details: fetchErrorMessage
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('set-client-password error:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);
    const errorStack = error instanceof Error && error.stack 
      ? error.stack 
      : null;
    console.error('Full error details:', errorMessage);
    if (errorStack) {
      console.error('Stack trace:', errorStack);
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage || 'Failed to update password',
        details: errorStack || errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

