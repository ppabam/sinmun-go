// app/api/faq/stats/route.ts
import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await openDb();

    // 일별 건수 (날짜별 그룹화)
    const regDateCounts = await db.all(`
      SELECT strftime('%Y-%m-%d', regDate) as date, COUNT(*) as count
      FROM faq_de
      GROUP BY date
      ORDER BY date DESC
    `);

    // deptName 상위 10개 부서 (변경 없음)
    const deptNameCounts = await db.all(`
      SELECT deptName, COUNT(*) as count
      FROM faq_de
      GROUP BY deptName
      ORDER BY count DESC
      LIMIT 10
    `);

    return NextResponse.json({
      regDateCounts,
      deptNameCounts,
    });
  } catch (error) {
    console.error('FAQ 통계 조회 오류:', error);
    return NextResponse.json({ error: '데이터베이스 쿼리 실패' }, { status: 500 });
  }
}