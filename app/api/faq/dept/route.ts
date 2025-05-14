import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { stripHtmlWithDOM } from '@/lib/server/stripHtml';

export async function GET(request: Request) {
  try {
    const db = await openDb();
    const { searchParams } = new URL(request.url);
    const deptNameParam = searchParams.get('deptName');

    if (!deptNameParam) {
      return NextResponse.json({ error: 'deptName 파라미터가 필요합니다.' }, { status: 400 });
    }

    const sql = `
      SELECT * 
      FROM faq_de
      WHERE deptName = ?
      ORDER BY regDate DESC
    `;
    const faqs = await db.all(sql, [`${deptNameParam}`]);

    const cleanedFaqs = faqs.map((faq) => ({
      ...faq,
      ansCntnCl: stripHtmlWithDOM(faq.ansCntnCl),
      qstnCntnCl: stripHtmlWithDOM(faq.qstnCntnCl),
    }));

    return NextResponse.json({ cleanedFaqs });
  } catch (error) {
    console.error("상세 데이터 조회 오류:", error);
    return NextResponse.json({ error: '상세 데이터를 조회하는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}