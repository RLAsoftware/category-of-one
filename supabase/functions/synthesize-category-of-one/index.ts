// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  sessionId: string;
  messages: ChatMessage[];
  clientName: string;
}

interface CategoryOfOneProfile {
  positioning_statement: string;
  unique_differentiation: string;
  contrarian_position: {
    their_belief: string;
    mainstream_belief: string;
  };
  gap_they_fill: {
    frustration: string;
    desired_outcome: string;
  };
  unique_methodology: {
    name: string;
    description: string;
    components: string[];
  };
  transformation: {
    before: string;
    after: string;
  };
  competitive_landscape: string;
  raw_profile: string;
}

interface LLMConfig {
  id: string;
  name: string;
  model: string;
  chat_system_prompt: string;
  synthesis_system_prompt: string;
  updated_by: string | null;
  updated_at: string;
}

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

const DEFAULT_SYNTHESIS_PROMPT = `You are a Brand Strategy expert. Analyze the following conversation and extract a comprehensive "Category of One" profile.

Based on the conversation, create a detailed profile with EXACTLY this JSON structure:

{
  "positioning_statement": "I help [WHO] achieve [WHAT] by [HOW]",
  "unique_differentiation": "What makes them uniquely different from competitors",
  "contrarian_position": {
    "their_belief": "What they believe",
    "mainstream_belief": "What most in their industry believe"
  },
  "gap_they_fill": {
    "frustration": "What frustrates their clients before working with them",
    "desired_outcome": "What their clients want instead"
  },
  "unique_methodology": {
    "name": "Name of their framework/method (or 'Unnamed Method' if not specified)",
    "description": "How their method works",
    "components": ["Step 1", "Step 2", "Step 3"]
  },
  "transformation": {
    "before": "Client's state before working with them",
    "after": "Client's state after working with them"
  },
  "competitive_landscape": "Why choose them over 100 other experts in their field"
}

Rules:
1. Extract ONLY information that was explicitly shared in the conversation
2. If information for a field wasn't discussed, use a reasonable inference based on context, or write "Not discussed"
3. Write in third person about the client (e.g., "Sarah helps..." not "I help...")
4. Be specific and concrete - avoid vague language
5. Capture their authentic voice and personality in the descriptions

Return ONLY the JSON object, no markdown formatting, no code blocks, no explanation - just the raw JSON.`;

async function getLLMConfig(): Promise<LLMConfig | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  const client = createClient(supabaseUrl, serviceKey);

  const { data, error } = await client
    .from("llm_configs")
    .select("*")
    .eq("name", "category_of_one")
    .single();

  if (error) {
    console.error("Failed to load llm_configs:", error);
    return null;
  }

  return data as LLMConfig;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const config = await getLLMConfig();

    const { messages, clientName }: RequestBody = await req.json();

    // Build conversation transcript
    const transcript = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? clientName : 'Interviewer'}: ${m.content}`)
      .join('\n\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || DEFAULT_MODEL,
        max_tokens: 2048,
        system: config?.synthesis_system_prompt || DEFAULT_SYNTHESIS_PROMPT,
        messages: [
          { 
            role: 'user', 
            content: `Client Name: ${clientName}\n\nConversation Transcript:\n\n${transcript}` 
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error('No response from Claude');
    }

    // Parse the JSON response (Claude might wrap it in markdown code blocks)
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.slice(7);
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith('```')) {
      jsonContent = jsonContent.slice(0, -3);
    }
    jsonContent = jsonContent.trim();

    const profile: CategoryOfOneProfile = JSON.parse(jsonContent);

    // Generate markdown outputs
    const rawProfile = generateMarkdownProfile(profile, clientName);
    const businessProfile = generateBusinessProfile(profile, clientName);
    const categoryOfOneDoc = rawProfile; // alias for clarity / future customization

    profile.raw_profile = rawProfile;

    return new Response(
      JSON.stringify({
        profile: {
          ...profile,
          business_profile_md: businessProfile,
          category_of_one_md: categoryOfOneDoc,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateMarkdownProfile(profile: CategoryOfOneProfile, clientName: string): string {
  return `# Category of One: ${clientName}

## Positioning Statement

${profile.positioning_statement}

## Unique Differentiation

${profile.unique_differentiation}

## Contrarian Position

**What ${clientName} believes:**
${profile.contrarian_position.their_belief}

**What most in the industry believe:**
${profile.contrarian_position.mainstream_belief}

## The Gap They Fill

**Clients come to ${clientName} when they're frustrated with:**
${profile.gap_they_fill.frustration}

**They want:**
${profile.gap_they_fill.desired_outcome}

## Unique Methodology: ${profile.unique_methodology.name}

${profile.unique_methodology.description}

**Key Components:**
${profile.unique_methodology.components.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Transformation Delivered

**Before:** ${profile.transformation.before}

**After:** ${profile.transformation.after}

## Competitive Landscape

When someone searches for solutions in this space, why choose ${clientName}?

${profile.competitive_landscape}

---

*Generated by Category of One*
`;
}

function generateBusinessProfile(profile: CategoryOfOneProfile, clientName: string): string {
  return `# Business Profile: ${clientName}

## Positioning Statement

${profile.positioning_statement}

## Unique Differentiation

${profile.unique_differentiation}

## The Gap They Fill

Clients typically come to ${clientName} when they are frustrated with:
${profile.gap_they_fill.frustration}

They want:
${profile.gap_they_fill.desired_outcome}

## Transformation

Before working with ${clientName}:
${profile.transformation.before}

After working with ${clientName}:
${profile.transformation.after}
`;
}
