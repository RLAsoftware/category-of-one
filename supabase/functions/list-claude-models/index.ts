import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ClaudeModelOption {
  id: string;
  label: string;
}

interface AnthropicModel {
  id: string;
  display_name?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const response = await fetch("https://api.anthropic.com/v1/models", {
      method: "GET",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic models error: ${errorText}`);
    }

    const data = await response.json();

    const models: ClaudeModelOption[] = (data.data as AnthropicModel[] | undefined)
      ?.filter((m) => typeof m.id === "string" && m.id.startsWith("claude"))
      .map((m) => ({
        id: m.id,
        label: m.display_name || m.id,
      })) ?? [];

    // Optional: sort alphabetically for nicer UX
    models.sort((a, b) => a.id.localeCompare(b.id));

    return new Response(JSON.stringify({ models }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("list-claude-models error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});


