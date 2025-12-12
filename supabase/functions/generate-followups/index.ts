import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrandKnowledge {
  title: string;
  content: string;
}

interface BaseAnswers {
  idealReader: string;
  writingSample: string;
  voiceWords: string;
  avoidWords: string;
  platforms: string;
}

interface RequestBody {
  sessionId: string;
  answers: BaseAnswers;
  brandKnowledge: BrandKnowledge[];
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const { answers, brandKnowledge }: RequestBody = await req.json();

    // Build the brand context section
    let brandContext = '';
    if (brandKnowledge && brandKnowledge.length > 0) {
      brandContext = `
## Pre-existing Brand Knowledge (provided by agency):
${brandKnowledge.map(k => `### ${k.title}\n${k.content}`).join('\n\n')}
`;
    }

    const systemPrompt = `You are an expert Editor-in-Chief conducting a brand voice interview. Your goal is to deeply understand a client's unique writing style and help them articulate it clearly.

You are analytical, perceptive, and notice subtle patterns in writing that most people miss. You ask questions that make people think deeply about their choices.`;

    const userPrompt = `Analyze this client's initial interview responses and generate follow-up questions.

${brandContext}

## Client's Initial Responses:

**Ideal Reader & Desired Impact:**
${answers.idealReader}

**Writing Sample (their best work):**
${answers.writingSample}

**Brand Voice Words (words they identify with):**
${answers.voiceWords}

**Words They Avoid:**
${answers.avoidWords}

**Publishing Platforms:**
${answers.platforms}

---

## Your Analysis Tasks:

1. **Analyze the Writing Sample for Micro-Nuances:**
   - Sentence structure patterns (short/punchy vs. flowing/complex)
   - Punctuation habits (em-dashes, ellipses, parentheticals, colons)
   - Vocabulary level (casual slang vs. technical jargon vs. accessible)
   - Rhetorical devices (questions, metaphors, lists, storytelling)
   - Emoji/formatting choices
   - Opening and closing patterns

2. **Compare Sample to Stated Goals:**
   - Does the writing sample match their stated voice words?
   - Are there contradictions between what they say and how they write?
   - What gaps exist between their ideal and their actual style?

3. **Generate Exactly 3 Follow-Up Questions:**
   Each question should:
   - Address a specific nuance or contradiction you observed
   - Help clarify platform-specific preferences
   - Be thought-provoking and specific (not generic)
   - Reference concrete examples from their sample when possible

Output your response as a JSON object with this exact structure:
{
  "questions": [
    "Question 1 text here",
    "Question 2 text here", 
    "Question 3 text here"
  ]
}

Make sure each question is specific to THIS client based on YOUR analysis. Avoid generic questions.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    return new Response(
      JSON.stringify({ questions: parsed.questions }),
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

