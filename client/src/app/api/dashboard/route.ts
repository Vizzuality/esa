import { NextResponse } from 'next/server';

import axios from 'axios';

export const runtime = 'nodejs';

export async function GET() {
  const baseUrl = process.env.GDA_MASTER_DATA_FUNCTION_BASE_URL;
  const key = process.env.GDA_MASTER_DATA_FUNCTION_KEY;

  if (!baseUrl || !key) {
    return NextResponse.json(
      { error: 'Missing API configuration' },

      { status: 500 }
    );
  }
  try {
    const res = await axios.get(`${baseUrl}`, {
      headers: {
        'x-functions-key': key,
      },
    });
    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch dashboard data' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
