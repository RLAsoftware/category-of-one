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

interface LLMConfig {
  id: string;
  name: string;
  model: string;
  chat_system_prompt: string;
  synthesis_system_prompt: string;
  updated_by: string | null;
  updated_at: string;
}

// Default system prompt that guides the Category of One conversation.
// The actual prompt and model can be overridden via the llm_configs table.
const DEFAULT_CHAT_SYSTEM_PROMPT = `You are an expert Brand Strategist and Positioning Consultant conducting a conversational interview to help a client discover their "Category of One" - their unique market positioning that makes them incomparable to competitors.

Your personality:
- Warm, encouraging, and genuinely curious
- You ask thoughtful follow-up questions based on their answers
- You celebrate unique insights and perspectives
- You gently probe deeper when answers are vague or generic

Your goal is to extract the following 7 elements through natural conversation:

1. **Positioning Statement**: "I help [WHO] achieve [WHAT] by [HOW]"
2. **Unique Differentiation**: What makes them different from everyone else in their space
3. **Contrarian Position**: What they believe that others in their industry would disagree with
4. **The Gap They Fill**: What frustration brings clients to them, and what they want instead
5. **Unique Methodology**: Their "secret sauce" - the framework, process, or method they're known for
6. **Transformation**: The before/after journey their clients experience
7. **Competitive Landscape**: Why someone should choose them over 100 other experts

Conversation Guidelines:
- Start by warmly introducing yourself and explaining you'll have a conversation to uncover their unique positioning
- Ask ONE question at a time - never multiple questions in one message
- After each answer, acknowledge what they said, then ask a natural follow-up or move to the next area
- If an answer is vague, ask for a specific example or story
- Keep your messages concise (2-4 sentences typically)
- Use their name occasionally to keep it personal
- When you've gathered enough information on all 7 areas, signal that you're ready to synthesize their profile by saying exactly: "[SYNTHESIS_READY]"
- When you are ready to synthesize, provide ONE final, self-contained message that summarizes what you've learned and then ends with "[SYNTHESIS_READY]".
- Never write things like "(continued in next message)" or split your final summary across multiple messages. The complete summary must be in a single final message.

IMPORTANT: When the conversation is complete and you've gathered all the information, you MUST include "[SYNTHESIS_READY]" at the end of your final message. This signals the system to generate their Category of One profile. Do not send any additional assistant messages after the one that contains "[SYNTHESIS_READY]".

Do NOT generate the profile yourself - just have the conversation and signal when ready.`;

const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const ASSESSMENT_MODEL = "claude-3-5-haiku-20241022";

const READINESS_ASSESSMENT_PROMPT = `You are assessing how complete a brand positioning interview is. Evaluate the conversation for coverage of these 7 areas:

1. Positioning Statement (WHO they help, WHAT they achieve, HOW they do it)
2. Unique Differentiation (what makes them different from competitors)
3. Contrarian Position (beliefs that go against industry norms)
4. Gap They Fill (frustration clients have, what they want instead)
5. Unique Methodology (their framework, process, or "secret sauce")
6. Transformation (before/after journey clients experience)
7. Competitive Landscape (why choose them over others)

Based on the conversation so far, return ONLY valid JSON with no other text:
{"readiness": <0-100>, "stage": "<just_started|gathering_basics|exploring_depth|refining_details|ready>"}

Scoring guide:
- 0-19 (just_started): Initial greeting, no substantive info
- 20-39 (gathering_basics): 1-2 areas touched on
- 40-59 (exploring_depth): 3-4 areas with specific examples
- 60-79 (refining_details): 5-6 areas covered well
- 80-100 (ready): All 7 areas have sufficient depth`;

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

    // Build messages for Claude (system prompt is separate)
    const systemPrompt = (config?.chat_system_prompt || DEFAULT_CHAT_SYSTEM_PROMPT)
      .replace(/\[CLIENT_NAME\]/g, clientName);

    // If this is the start of conversation, add initial greeting context
    const isNewConversation = messages.length === 0 || 
      (messages.length === 1 && messages[0].role === 'system');

    let claudeMessages: Array<{role: 'user' | 'assistant', content: string}> = [];
    
    if (isNewConversation) {
      // Add a user message to prompt the assistant to introduce itself
      claudeMessages = [{
        role: 'user',
        content: `Hi, I'm ${clientName}. I'm ready to discover my Category of One positioning.`,
      }];
    } else {
      // Convert messages to Claude format (filter out system messages)
      claudeMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
    }

    // Make streaming request to Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || DEFAULT_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: claudeMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';
        let fullAssistantResponse = ''; // Accumulate full response for assessment

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  continue; // Don't emit [DONE] yet, we'll do it after assessment
                }

                try {
                  const parsed = JSON.parse(data);

                  // Handle different Claude event types
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    fullAssistantResponse += parsed.delta.text;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: parsed.delta.text })}\n\n`));
                  } else if (parsed.type === 'message_stop') {
                    // Don't emit [DONE] yet - we'll do it after assessment
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }

          // After streaming completes, assess readiness
          try {
            const assessmentResponse = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': anthropicApiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: ASSESSMENT_MODEL,
                max_tokens: 100,
                system: READINESS_ASSESSMENT_PROMPT,
                messages: [...claudeMessages, { role: 'assistant', content: fullAssistantResponse }],
              }),
            });

            if (assessmentResponse.ok) {
              const assessmentData = await assessmentResponse.json();
              const assessmentText = assessmentData.content?.[0]?.text || '';

              // Parse the JSON from the assessment response
              const jsonMatch = assessmentText.match(/\{[^}]+\}/);
              if (jsonMatch) {
                const readinessData = JSON.parse(jsonMatch[0]);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  readiness: readinessData.readiness,
                  stage: readinessData.stage
                })}\n\n`));
              }
            }
          } catch (assessmentError) {
            console.error('Readiness assessment failed:', assessmentError);
            // Continue without readiness data - UI will handle missing data gracefully
          }

          // Now emit [DONE]
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));

        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
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
