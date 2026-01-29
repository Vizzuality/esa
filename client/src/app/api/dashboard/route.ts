import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const baseUrl = process.env.GDA_MASTER_DATA_FUNCTION_BASE_URL;
  const API_KEY = process.env.GDA_MASTER_DATA_FUNCTION_KEY;

  if (!baseUrl || !API_KEY) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-functions-key': API_KEY || '',
      },
    });
    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error logging baseUrl:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
