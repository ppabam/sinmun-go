import { NextResponse } from 'next/server';
import { fetchWhereDeptFaq } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deptNameParam = searchParams.get('deptName');

    if (!deptNameParam) {
      return NextResponse.json({ error: 'deptName 파라미터가 필요합니다.' }, { status: 400 });
    }
    
    const data = await fetchWhereDeptFaq(deptNameParam);

    return NextResponse.json( data );
  } catch (error) {
    console.error("상세 데이터 조회 오류:", error);
    return NextResponse.json({ error: '상세 데이터를 조회하는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}