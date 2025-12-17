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

interface PositioningStatement {
  who: string;
  what: string;
  how: string;
  full_statement: string;
}

interface Megatrend {
  name: string;
  description: string;
}

interface Confluence {
  megatrends: Megatrend[];
  named_phenomenon: string | null;
  why_now_summary: string;
}

interface ContrarianApproach {
  conventional_frustration: string;
  where_they_break_convention: string;
  contrarian_beliefs: string[];
  mind_share_word: string | null;
}

interface AllRoadsStory {
  mercenary_story: string;
  missionary_story: string;
  critical_combo: string[];
}

interface DetailedTransformation {
  before: {
    frustrations: string[];
    failed_alternatives: string[];
  };
  after: {
    outcomes: string[];
    what_becomes_possible: string;
  };
  client_example: string | null;
}

interface ProofPoints {
  client_results: string[];
  testimonials: string[];
  credentials: string[];
  media_and_publications: string[];
  awards_and_recognition: string[];
  experience_metrics: string | null;
}

interface UniqueMethodology {
  name: string | null;
  steps_or_components: string[];
  what_makes_it_distinctive: string | null;
}

interface VoiceAndLanguage {
  distinctive_phrases: string[];
  tone_notes: string | null;
}

interface CategoryOfOneProfile {
  client_name: string;
  business_name: string | null;
  positioning_statement: PositioningStatement;
  unique_differentiation: string | null;
  confluence: Confluence;
  contrarian_approach: ContrarianApproach;
  all_roads_story: AllRoadsStory;
  transformation: DetailedTransformation;
  proof_points: ProofPoints;
  unique_methodology: UniqueMethodology;
  voice_and_language: VoiceAndLanguage;
  competitive_landscape: string | null;
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

const DEFAULT_SYNTHESIS_PROMPT = `You are a senior business strategist synthesizing an interview transcript into a Category-of-One positioning document.

You do NOT invent information.
You do NOT exaggerate.
You do NOT use hype, cheerleading, or marketing language.
Your tone is measured, professional, and precise—like an internal strategy memo.

If information is missing or unclear, explicitly state: "Not discussed in interview."

---

## TASK

Distill the interview into a canonical Category-of-One profile that accurately reflects:
- WHY NOW (Confluence of Events)
- WHY THIS (Contrarian Approach)
- WHY YOU (Criteria to Buy)

---

## OUTPUT REQUIREMENTS

Produce a strict JSON object matching the schema below. Do not include commentary outside the JSON.

---

## JSON SCHEMA

\`\`\`json
{
  "client_name": "string",
  "business_name": "string or null",
  "positioning_statement": {
    "who": "string",
    "what": "string",
    "how": "string",
    "full_statement": "string"
  },
  "confluence": {
    "megatrends": [
      {"name": "string", "description": "string"}
    ],
    "named_phenomenon": "string or null",
    "why_now_summary": "string"
  },
  "contrarian_approach": {
    "conventional_frustration": "string",
    "where_they_break_convention": "string",
    "contrarian_beliefs": ["string"],
    "mind_share_word": "string or null"
  },
  "all_roads_story": {
    "mercenary_story": "string",
    "missionary_story": "string",
    "critical_combo": ["string"]
  },
  "transformation": {
    "before": {
      "frustrations": ["string"],
      "failed_alternatives": ["string"]
    },
    "after": {
      "outcomes": ["string"],
      "what_becomes_possible": "string"
    },
    "client_example": "string or null"
  },
  "proof_points": {
    "client_results": ["string"],
    "testimonials": ["string"],
    "credentials": ["string"],
    "media_and_publications": ["string"],
    "awards_and_recognition": ["string"],
    "experience_metrics": "string or null"
  },
  "unique_methodology": {
    "name": "string or null",
    "steps_or_components": ["string"],
    "what_makes_it_distinctive": "string or null"
  },
  "voice_and_language": {
    "distinctive_phrases": ["string"],
    "tone_notes": "string or null"
  }
}
\`\`\`

CONSTRAINTS:
- Use null for missing fields; do not invent
- Use their exact language where possible
- Match their energy (bold client = bold profile; understated client = understated profile)
- No "incredible," "amazing," "revolutionary"
- Flag suggestions explicitly: "Based on the interview, a potential mind share concept could be [X], though not explicitly stated."

QUALITY CHECKLIST:
Before output, verify:
- JSON matches schema exactly
- All information comes from transcript (nothing invented)
- Missing info marked with null or "Not discussed"
- Positioning statement is specific, not generic
- Contrarian beliefs are genuinely contrarian
- Critical combo is specific enough to be unreplicable
- Tone matches client's energy
- No hype language
- Voice notes capture authentic speaking style

OUTPUT FORMAT:
Output exactly a complete JSON object. No preamble. No commentary. No markdown code blocks. Just the raw JSON.`;

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

function validateProfile(profile: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!profile.client_name) errors.push("Missing client_name");
  if (!profile.positioning_statement) errors.push("Missing positioning_statement");
  if (!profile.confluence) errors.push("Missing confluence");
  if (!profile.contrarian_approach) errors.push("Missing contrarian_approach");
  if (!profile.all_roads_story) errors.push("Missing all_roads_story");
  if (!profile.transformation) errors.push("Missing transformation");
  if (!profile.proof_points) errors.push("Missing proof_points");
  if (!profile.unique_methodology) errors.push("Missing unique_methodology");
  if (!profile.voice_and_language) errors.push("Missing voice_and_language");

  return {
    valid: errors.length === 0,
    errors
  };
}

async function callClaudeForSynthesis(
  systemPrompt: string,
  userPrompt: string,
  model: string,
  anthropicApiKey: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
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

  return content;
}

function extractJSON(content: string): string {
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
  
  return jsonContent.trim();
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

    const systemPrompt = config?.synthesis_system_prompt || DEFAULT_SYNTHESIS_PROMPT;
    const userPrompt = `Client Name: ${clientName}\n\nConversation Transcript:\n\n${transcript}`;

    // First attempt
    let content = await callClaudeForSynthesis(
      systemPrompt,
      userPrompt,
      config?.model || DEFAULT_MODEL,
      anthropicApiKey
    );

    let jsonContent = extractJSON(content);
    let profile: CategoryOfOneProfile;
    let attempts = 1;
    let synthesisError: string | null = null;

    try {
      profile = JSON.parse(jsonContent);
      const validation = validateProfile(profile);
      
      if (!validation.valid) {
        console.warn('First attempt validation failed:', validation.errors);
        
        // Retry with explicit schema reminder
        attempts = 2;
        const retryPrompt = `The previous response had validation errors: ${validation.errors.join(', ')}.

Please provide the Category of One profile as a complete, valid JSON object matching this exact schema:

${systemPrompt}

Original request:
${userPrompt}`;

        content = await callClaudeForSynthesis(
          "You are a senior business strategist. Output ONLY valid JSON matching the provided schema.",
          retryPrompt,
          config?.model || DEFAULT_MODEL,
          anthropicApiKey
        );

        jsonContent = extractJSON(content);
        profile = JSON.parse(jsonContent);
        
        const retryValidation = validateProfile(profile);
        if (!retryValidation.valid) {
          synthesisError = `Validation failed after retry: ${retryValidation.errors.join(', ')}`;
          console.error(synthesisError);
        }
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      synthesisError = `JSON parsing failed: ${parseError.message}`;
      
      // If first attempt, try retry
      if (attempts === 1) {
        attempts = 2;
        try {
          const retryPrompt = `The previous response was not valid JSON. Please provide ONLY a valid JSON object matching the schema. No markdown, no explanations, just JSON.

Original request:
${userPrompt}`;

          content = await callClaudeForSynthesis(
            systemPrompt,
            retryPrompt,
            config?.model || DEFAULT_MODEL,
            anthropicApiKey
          );

          jsonContent = extractJSON(content);
          profile = JSON.parse(jsonContent);
          synthesisError = null; // Success on retry
        } catch (retryError) {
          synthesisError = `Retry also failed: ${retryError.message}`;
          throw new Error(synthesisError);
        }
      } else {
        throw new Error(synthesisError);
      }
    }

    // Generate markdown outputs
    const categoryOfOneMd = generateCategoryOfOneMarkdown(profile);
    const businessProfileMd = generateBusinessProfileMarkdown(profile);
    const rawProfile = categoryOfOneMd; // For legacy compatibility

    return new Response(
      JSON.stringify({
        profile: {
          client_name: profile.client_name,
          business_name: profile.business_name,
          positioning_statement: profile.positioning_statement,
          unique_differentiation: profile.unique_differentiation,
          confluence: profile.confluence,
          contrarian_approach: profile.contrarian_approach,
          all_roads_story: profile.all_roads_story,
          transformation: profile.transformation,
          proof_points: profile.proof_points,
          unique_methodology: profile.unique_methodology,
          voice_and_language: profile.voice_and_language,
          competitive_landscape: profile.competitive_landscape,
          raw_profile: rawProfile,
          business_profile_md: businessProfileMd,
          category_of_one_md: categoryOfOneMd,
          synthesis_attempts: attempts,
          synthesis_error: synthesisError,
          needs_review: synthesisError !== null,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        synthesis_attempts: 2,
        needs_review: true,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateCategoryOfOneMarkdown(profile: CategoryOfOneProfile): string {
  const name = profile.client_name;
  
  return `# Category of One Profile: ${name}

## Positioning Statement

${profile.positioning_statement.full_statement}

---

## The Confluence — Why Now

${profile.confluence.why_now_summary}

${profile.confluence.megatrends.map(t => `**${t.name}**: ${t.description}`).join('\n\n')}

${profile.confluence.named_phenomenon ? `This convergence represents what can be called **${profile.confluence.named_phenomenon}**.` : ''}

---

## The Contrarian Approach — Why This

${profile.contrarian_approach.conventional_frustration}

${profile.contrarian_approach.where_they_break_convention}

**Contrarian beliefs:**
${profile.contrarian_approach.contrarian_beliefs.map(b => `- ${b}`).join('\n')}

${profile.contrarian_approach.mind_share_word ? `**Mind share word:** ${profile.contrarian_approach.mind_share_word}` : ''}

---

## The All Roads Story — Why You

### The Mercenary Story

${profile.all_roads_story.mercenary_story}

### The Missionary Story

${profile.all_roads_story.missionary_story}

### The Critical Combo

${profile.all_roads_story.critical_combo.map(c => `- ${c}`).join('\n')}

---

## The Transformation

### Before

**Frustrations:**
${profile.transformation.before.frustrations.map(f => `- ${f}`).join('\n')}

**Failed alternatives:**
${profile.transformation.before.failed_alternatives.map(f => `- ${f}`).join('\n')}

### After

**Outcomes:**
${profile.transformation.after.outcomes.map(o => `- ${o}`).join('\n')}

**What becomes possible:**
${profile.transformation.after.what_becomes_possible}

${profile.transformation.client_example ? `\n### Client Example\n\n${profile.transformation.client_example}` : ''}

---

## Proof Points

${profile.proof_points.client_results.length > 0 ? `**Client Results:**\n${profile.proof_points.client_results.map(r => `- ${r}`).join('\n')}\n` : ''}
${profile.proof_points.testimonials.length > 0 ? `\n**Testimonials:**\n${profile.proof_points.testimonials.map(t => `- "${t}"`).join('\n')}\n` : ''}
${profile.proof_points.credentials.length > 0 ? `\n**Credentials:**\n${profile.proof_points.credentials.map(c => `- ${c}`).join('\n')}\n` : ''}
${profile.proof_points.media_and_publications.length > 0 ? `\n**Media & Publications:**\n${profile.proof_points.media_and_publications.map(m => `- ${m}`).join('\n')}\n` : ''}
${profile.proof_points.awards_and_recognition.length > 0 ? `\n**Awards & Recognition:**\n${profile.proof_points.awards_and_recognition.map(a => `- ${a}`).join('\n')}\n` : ''}
${profile.proof_points.experience_metrics ? `\n**Experience:** ${profile.proof_points.experience_metrics}` : ''}

---

## Unique Methodology

${profile.unique_methodology.name ? `**${profile.unique_methodology.name}**\n\n` : ''}
${profile.unique_methodology.steps_or_components.length > 0 ? profile.unique_methodology.steps_or_components.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'No named methodology was discussed.'}

${profile.unique_methodology.what_makes_it_distinctive ? `\n**What makes it distinctive:** ${profile.unique_methodology.what_makes_it_distinctive}` : ''}

---

## Voice and Language Notes

${profile.voice_and_language.distinctive_phrases.length > 0 ? `**Distinctive phrases:**\n${profile.voice_and_language.distinctive_phrases.map(p => `- "${p}"`).join('\n')}\n` : 'No distinctive phrases captured.'}

${profile.voice_and_language.tone_notes ? `\n**Tone:** ${profile.voice_and_language.tone_notes}` : ''}

---

*Generated by Category of One*
`;
}

function generateBusinessProfileMarkdown(profile: CategoryOfOneProfile): string {
  const name = profile.client_name;
  
  return `# Business Profile: ${name}

## Positioning Statement

${profile.positioning_statement.full_statement}

---

## Unique Differentiation

${profile.unique_differentiation || 'Not discussed in interview.'}

---

## The Gap They Fill

**Clients come to ${name} when they're frustrated with:**
${profile.transformation.before.frustrations.map(f => `- ${f}`).join('\n')}

**They want:**
${profile.transformation.after.outcomes.map(o => `- ${o}`).join('\n')}

---

## Transformation

**Before working with ${name}:**
${profile.transformation.before.frustrations.map(f => `- ${f}`).join('\n')}

**After working with ${name}:**
${profile.transformation.after.outcomes.map(o => `- ${o}`).join('\n')}

${profile.transformation.after.what_becomes_possible}

---

## Proof Points

${profile.proof_points.client_results.length > 0 ? profile.proof_points.client_results.map(r => `- ${r}`).join('\n') : ''}
${profile.proof_points.testimonials.length > 0 ? `\n${profile.proof_points.testimonials.map(t => `> "${t}"`).join('\n\n')}` : ''}

---

*Generated by Category of One*
`;
}
