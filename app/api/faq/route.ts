// app/api/faq/route.ts
import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { JSDOM } from 'jsdom';

function stripHtmlWithDOM(html: string): string {
  if (!html || typeof html !== 'string') {
    console.warn('stripHtmlWithDOM: 유효하지 않은 입력:', html);
    return '';
  }
  try {
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || '';
    return text.trim();
  } catch (error) {
    console.error('stripHtmlWithDOM 처리 오류:', error, '입력:', html);
    return html;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    const db = await openDb();
    let sql = 'SELECT * FROM faq_de';
    const params: string[] = [];

    if (query) {
      sql += ' WHERE qnaTitl LIKE ? OR qstnCntnCl LIKE ? OR ansCntnCl LIKE ?';
      const likeQuery = `%${query}%`;
      params.push(likeQuery, likeQuery, likeQuery);
    }

    sql += ' ORDER BY regDate DESC';
    const faqs = await db.all(sql, params);

    const cleanedFaqs = faqs.map((faq) => ({
      ...faq,
      ansCntnCl: stripHtmlWithDOM(faq.ansCntnCl),
      qstnCntnCl: stripHtmlWithDOM(faq.qstnCntnCl),
    }));

    return NextResponse.json(cleanedFaqs);
  } catch (error) {
    console.error('FAQ 조회 오류:', error);
    return NextResponse.json({ error: '데이터베이스 쿼리 실패' }, { status: 500 });
  }
}