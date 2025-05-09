import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await openDb();
    
    const sql = 'SELECT count(*) total_count FROM faq_de';
    const result = await db.get(sql);
    const total_count = result['total_count'];

    const sql_group_by = `
      SELECT
        SUBSTRING(deptName, 1, INSTR(deptName, ' ') - 1) as deptName,
        COUNT(*) cnt
      FROM faq_de
      GROUP BY SUBSTRING(deptName, 1, INSTR(deptName, ' ') - 1)
      ORDER BY cnt DESC
      LIMIT 20`
    const result_group_by = await db.all(sql_group_by);
    
    return NextResponse.json(
      { 
        total_count: total_count,
        group_by: result_group_by
      }
    )
  } catch (error) {
    const err_msg = 'CHART 조회 오류'; 
    console.error(err_msg, error);
    return NextResponse.json({ error: err_msg }, { status: 500 });
  }
}