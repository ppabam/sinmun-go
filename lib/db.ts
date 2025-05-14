// lib/db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { stripHtmlWithDOM } from '@/lib/server/stripHtml';

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

export const fetchGroupByDay = unstable_cache(
  async () => {
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

    return {
      민원: total_tqapttn,
      정책: total_tqaplcy,
      group_by: result_group_by
    };
  },
  ['fetchGroupByDay'], // 캐시 키 (선택 사항)
  { revalidate: 3600 } // 캐시 유효 시간 (초) - 예: 1시간
);

export const fetchWhereDeptFaq = unstable_cache(
  async (deptName: string) => {
    const db = await openDb();

    const sql = `
          SELECT * 
          FROM faq_de
          WHERE deptName = ?
          ORDER BY regDate DESC
        `;
        const faqs = await db.all(sql, [`${deptName}`]);
    
        const cleanedFaqs = faqs.map((faq) => ({
          ...faq,
          ansCntnCl: stripHtmlWithDOM(faq.ansCntnCl),
          qstnCntnCl: stripHtmlWithDOM(faq.qstnCntnCl),
        }));

    return cleanedFaqs;
  },
  ['fetchWhereDept'], // 캐시 키 (선택 사항)
  { revalidate: 3600 } // 캐시 유효 시간 (초) - 예: 1시간
);