export const runtime = 'edge';

const TYPHOON_KEY = process.env.TYPHOON_KEY || 'sk-1SdK6jnHrTUcL1Oequec6MWWWjGxUee57HM2qJ36WBHTgXTD';

export async function POST(request) {
  const { base64, mimeType = 'image/jpeg' } = await request.json();

  const upstream = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TYPHOON_KEY}`,
    },
    body: JSON.stringify({
      model: 'typhoon-ocr-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
            {
              type: 'text',
              text: 'Extract all text from this legal document. Preserve article numbers, paragraph structure, and formatting. Output plain text only, no commentary.',
            },
          ],
        },
      ],
      max_tokens: 4096,
    }),
  });

  const data = await upstream.json();
  return Response.json(data);
}
