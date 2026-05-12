import { NextResponse } from 'next/server';

import axios from 'axios';

export const runtime = 'nodejs';

export async function GET() {
  const baseUrl = process.env.GDA_MASTER_DATA_FUNCTION_BASE_URL;
  const key = process.env.GDA_MASTER_DATA_FUNCTION_KEY;

  if (!baseUrl) {
    return NextResponse.json(
      { error: 'Missing API configuration' },

      { status: 500 }
    );
  }

  if (!key) {
    return NextResponse.json(
      { error: 'Missing KEY configuration' },

      { status: 500 }
    );
  }

  try {
    const res = await axios.get(`${baseUrl}/ExcelWebAPI`, {
      headers: {
        'x-functions-key': key,
      },
      timeout: 10_000,
    });
    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    const upstreamStatus =
      axios.isAxiosError(error) && error.response ? error.response.status : 502;
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', status: upstreamStatus },
      { status: upstreamStatus }
    );
  }
}
