import { NextResponse } from 'next/server';
import { fetchPiChart } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50; // 기본값 50

    const data = await fetchPiChart(limit);
    return NextResponse.json(data);
    
  } catch (error) {
    const err_msg = 'CHART 조회 오류'; 
    console.error(err_msg, error);
    return NextResponse.json({ error: err_msg }, { status: 500 });
  }
}