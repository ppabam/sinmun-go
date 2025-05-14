import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await openDb();
    
    const sql = `
      SELECT 
        f.dutySctnNm,
        COUNT(*) AS cnt 
      FROM
        faq_de d 
        JOIN faq f ON d.faqNo = f.faqNo
      GROUP BY dutySctnNm
    `;
    const result = await db.all(sql);
    const total_tqapttn = result.find(r => r.dutySctnNm === 'tqapttn')?.cnt || 0;
    const total_tqaplcy = result.find(r => r.dutySctnNm === 'tqaplcy')?.cnt || 0;

    const sql_group_by = `
    SELECT
      SUBSTR(regDate, 1, 4) || '-' || SUBSTR(regDate, 5, 2) || '-' || SUBSTR(regDate, 7, 2) AS regDate,
      CASE dutySctnNm
      WHEN 'tqapttn' THEN '민원'
      WHEN 'tqaplcy' THEN '정책'
      ELSE dutySctnNm
      END AS dutySctnNm,
      cnt
    FROM (
      SELECT 
        d.regDate, 
        f.dutySctnNm,
        COUNT(*) cnt 
      FROM
        faq_de d JOIN faq f
      ON d.faqNo = f.faqNo
      GROUP BY d.regDate, f.dutySctnNm
      ORDER BY d.regDate DESC LIMIT 30
    )`;
    const result_group_by = await db.all(sql_group_by);
    
    return NextResponse.json(
      { 
        민원: total_tqapttn,
        정책: total_tqaplcy,
        group_by: result_group_by
      }
    )
  } catch (error) {
    const err_msg = 'daily count 조회 오류'; 
    console.error(err_msg, error);
    return NextResponse.json({ error: err_msg }, { status: 500 });
  }
}