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
  baseAnswers: BaseAnswers;
  followUpQuestions: string[];
  followUpAnswers: Record<string, string>;
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

    const { baseAnswers, followUpQuestions, followUpAnswers, brandKnowledge }: RequestBody = await req.json();

    // Build the brand context section
    let brandContext = '';
    if (brandKnowledge && brandKnowledge.length > 0) {
      brandContext = `
## Pre-existing Brand Knowledge:
${brandKnowledge.map(k => `### ${k.title}\n${k.content}`).join('\n\n')}
`;
    }

    // Build follow-up Q&A section
    const followUpSection = followUpQuestions
      .map((q, i) => `**Q${i + 1}:** ${q}\n**A${i + 1}:** ${followUpAnswers[`q${i}`] || 'No answer provided'}`)
      .join('\n\n');

    const systemPrompt = `You are an expert Brand Voice Architect. You specialize in distilling a person's unique writing style into actionable guidelines that can be used to create content that sounds authentically like them.

Your style profiles are known for being:
- Specific and concrete (with examples)
- Immediately actionable
- Nuanced yet clear
- Platform-aware`;

    const userPrompt = `Create a comprehensive Style Guide Profile based on this complete interview.

${brandContext}

## Base Interview Responses:

**Ideal Reader & Desired Impact:**
${baseAnswers.idealReader}

**Writing Sample:**
${baseAnswers.writingSample}

**Brand Voice Words:**
${baseAnswers.voiceWords}

**Words to Avoid:**
${baseAnswers.avoidWords}

**Publishing Platforms:**
${baseAnswers.platforms}

## Follow-Up Interview:

${followUpSection}

---

## Create a Style Guide Profile

Generate a detailed, actionable Style Guide Profile in Markdown format. This profile will be used by content creators (human or AI) to write in this person's authentic voice.

Structure your output EXACTLY like this:

# [Client Name]'s Voice Profile

## Core Voice Summary
[2-3 sentences capturing the essence of their voice]

## Linguistic Fingerprint

### Sentence Rhythm
[Describe their typical sentence patterns - short/punchy, flowing, varied, etc.]

### Signature Punctuation
[Their punctuation habits - em-dashes, ellipses, etc.]

### Vocabulary Tier
[Casual, professional, technical, accessible, etc. with examples]

### Tone Markers
[Key emotional/tonal qualities with examples]

## Platform-Specific Guidelines

### LinkedIn
- **Tone:** [specific guidance]
- **Structure:** [formatting preferences]
- **Length:** [typical post length]
- **Do:** [specific things to do]
- **Don't:** [specific things to avoid]

### Twitter/X
- **Tone:** [specific guidance]
- **Style:** [formatting, capitalization, etc.]
- **Length:** [character approach]
- **Do:** [specific things to do]
- **Don't:** [specific things to avoid]

### Email Newsletter
- **Tone:** [specific guidance]
- **Opening Style:** [how to start]
- **Closing Style:** [how to end]
- **Do:** [specific things to do]
- **Don't:** [specific things to avoid]

## Voice Cheat Sheet

### Always Do:
1. [Specific action]
2. [Specific action]
3. [Specific action]
4. [Specific action]
5. [Specific action]

### Never Do:
1. [Specific thing to avoid]
2. [Specific thing to avoid]
3. [Specific thing to avoid]
4. [Specific thing to avoid]
5. [Specific thing to avoid]

## Sample Phrases & Transitions
[List 5-10 phrases or transitions that sound like them]

---

Make this profile SPECIFIC to this person. Use concrete examples from their writing sample. Avoid generic advice.`;

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
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const profile = data.choices[0]?.message?.content;

    if (!profile) {
      throw new Error('No response from OpenAI');
    }

    // Extract sections for structured storage
    const coreVoiceMatch = profile.match(/## Core Voice Summary\n([\s\S]*?)(?=\n## )/);
    const linkedinMatch = profile.match(/### LinkedIn\n([\s\S]*?)(?=\n### )/);
    const twitterMatch = profile.match(/### Twitter\/X\n([\s\S]*?)(?=\n### )/);
    const emailMatch = profile.match(/### Email Newsletter\n([\s\S]*?)(?=\n## )/);

    return new Response(
      JSON.stringify({
        profile,
        coreVoice: coreVoiceMatch?.[1]?.trim() || null,
        linkedinRules: linkedinMatch?.[1]?.trim() || null,
        twitterRules: twitterMatch?.[1]?.trim() || null,
        emailRules: emailMatch?.[1]?.trim() || null,
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

