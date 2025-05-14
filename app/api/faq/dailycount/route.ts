import { NextResponse } from 'next/server';
import { fetchGroupByDay } from '@/lib/db';

export async function GET() {
  try {
    const data = await fetchGroupByDay();
    return NextResponse.json(data);
  } catch (error) {
    const err_msg = 'daily count 조회 오류'; 
    console.error(err_msg, error);
    return NextResponse.json({ error: err_msg }, { status: 500 });
  }
}