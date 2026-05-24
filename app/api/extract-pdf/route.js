import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const buffer = Buffer.from(await req.arrayBuffer());
    if (!buffer.length) return NextResponse.json({ error: 'Empty file' }, { status: 400 });

    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const result = await pdfParse(buffer);

    if (!result.text?.trim()) {
      return NextResponse.json(
        { error: 'No embedded text in PDF. Upload a scanned image instead.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: result.text, pages: result.numpages });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
