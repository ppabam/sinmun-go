import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await openDb();
    
    const sql = `
      SELECT
          total_count,
          SUBSTR(min_reg_date, 1, 4) || '-' || SUBSTR(min_reg_date, 5, 2) || '-' || SUBSTR(min_reg_date, 7, 2) AS min_reg_date,
          SUBSTR(max_reg_date, 1, 4) || '-' || SUBSTR(max_reg_date, 5, 2) || '-' || SUBSTR(max_reg_date, 7, 2) AS max_reg_date
      FROM 
      (
          SELECT
            COUNT(*) total_count,
              MIN(regDate) AS min_reg_date,
              MAX(regDate) AS max_reg_date
          FROM
              faq_de
      )
    `;
    const result = await db.get(sql);
    const total_count = result['total_count'];
    const min_reg_date = result['min_reg_date'];
    const max_reg_date = result['max_reg_date'];

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
        min_reg_date: min_reg_date,
        max_reg_date: max_reg_date,
        group_by: result_group_by
      }
    )
  } catch (error) {
    const err_msg = 'CHART 조회 오류'; 
    console.error(err_msg, error);
    return NextResponse.json({ error: err_msg }, { status: 500 });
  }
}