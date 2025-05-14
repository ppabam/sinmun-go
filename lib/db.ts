// lib/db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { unstable_cache } from 'next/cache';

export async function openDb() {
  const dbPath = path.join(process.cwd(), 'note', 'faq20072.db');
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export const fetchPiChart = unstable_cache(
  async (limit: number = 50) => {
    const db = await openDb();

    const sql = `
      SELECT
        total_count,
        SUBSTR(min_reg_date, 1, 4) || '-' || SUBSTR(min_reg_date, 5, 2) || '-' || SUBSTR(min_reg_date, 7, 2) AS min_reg_date,
        SUBSTR(max_reg_date, 1, 4) || '-' || SUBSTR(max_reg_date, 5, 2) || '-' || SUBSTR(max_reg_date, 7, 2) AS max_reg_date
      FROM (
        SELECT
          COUNT(*) total_count,
          MIN(regDate) AS min_reg_date,
          MAX(regDate) AS max_reg_date
        FROM faq_de
      )
    `;
    const result = await db.get(sql);

    const sql_group_by = `
      SELECT
        SUBSTR(deptName, 1, INSTR(deptName, ' ') - 1) AS deptName,
        COUNT(*) cnt
      FROM faq_de
      GROUP BY SUBSTR(deptName, 1, INSTR(deptName, ' ') - 1)
      ORDER BY cnt DESC
      LIMIT ?
    `;
    const result_group_by = await db.all(sql_group_by, [limit]);

    return {
      total_count: result.total_count,
      min_reg_date: result.min_reg_date,
      max_reg_date: result.max_reg_date,
      group_by: result_group_by
    };
  },
  ['fetchPiChart'], // 캐시 키 (선택 사항)
  { revalidate: 3600 } // 캐시 유효 시간 (초) - 예: 1시간
);