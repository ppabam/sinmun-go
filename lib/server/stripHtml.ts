import { JSDOM } from 'jsdom';

export function stripHtmlWithDOM(html: string): string {
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
