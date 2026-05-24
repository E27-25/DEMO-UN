export const runtime = 'edge';

const GROQ_KEY = process.env.GROQ_KEY || '';

const SYSTEM_PROMPT = `You are an expert legal analyst for ESCAP's RDTII (Regulatory and Digital Trade Inclusive Internet Index). Analyze the legal text and map ALL relevant provisions to RDTII indicators.

Pillar 6 — Cross-border Data Flows:
6.1 = Free flow of data principle
6.2 = Data localization requirements
6.3 = Government access to data
6.4 = Conditional flow regimes (adequacy decisions)
6.5 = Sector-specific data flow rules
6.6 = International framework alignment (CBPR, APEC, GDPR adequacy)

Pillar 7 — Domestic Data Protection:
7.1 = Comprehensive data protection legislation
7.2 = Independent supervisory authority
7.3 = Individual rights (access, correction, deletion, portability)
7.4 = Data breach notification obligations

Return ONLY a JSON array — no markdown fences, no backticks, no explanation outside the JSON:
[{"indicator_id":"6.4","indicator_name":"Conditional flow regimes","pillar":6,"evidence_text":"exact quote max 40 words","paragraph_ref":"Article 12","confidence":87,"concept_detected":"adequacy requirement","reasoning":"One sentence explaining the mapping.","status":"pending"}]`;

export async function POST(request) {
  const { text } = await request.json();

  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this legal document and map ALL provisions to RDTII indicators:\n\n${text}`,
        },
      ],
      stream: true,
      temperature: 0.05,
      max_tokens: 2500,
    }),
  });

  // Proxy the stream directly
  return new Response(upstream.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
