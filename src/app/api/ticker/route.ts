import { NextRequest, NextResponse } from 'next/server';
import { getTicker } from '../utils/binance';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const tickerData = await getTicker(symbol);
    return NextResponse.json(tickerData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}