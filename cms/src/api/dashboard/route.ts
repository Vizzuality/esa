import { NextResponse } from 'next/server';
import axios from 'axios';

export const runtime = 'nodejs';

export async function GET() {
  const baseUrl = process.env.GDA_MASTER_DATA_FUNCTION_BASE_URL!;
  const key = process.env.GDA_MASTER_DATA_FUNCTION_KEY!;

  try {
    const res = await axios.get(`${baseUrl}/ExcelWebAPI`, {
      headers: {
        'x-functions-key': key,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: 'Upstream error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    } as any);
  }
}
