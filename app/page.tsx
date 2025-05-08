// app/faqs/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';

type FAQ = {
  faqNo: string;
  qnaTitl: string;
  qstnCntnCl: string;
  ansCntnCl: string;
  ancName: string;
  deptName: string;
  regDate: string;
  ancCode: string;
  deptCode: string;
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchFaqs = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/faq${query ? `?query=${query}` : ''}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setFaqs(data);
      setHasSearched(true);
    } catch (error) {
      console.error('FAQ 데이터 로딩 실패:', error);
      setFaqs([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    fetchFaqs(searchTerm);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // 초기 로딩을 막고 검색 후에만 데이터를 표시
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">국민권익위원회 질의/응답 조회</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="border p-2 rounded mr-2"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          검색
        </button>
      </div>

      {loading && <div className="text-center">데이터를 로딩 중입니다...</div>}

      {!loading && hasSearched && faqs.length === 0 && (
        <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
      )}

      {!loading && hasSearched && faqs.length > 0 && (
        <ul className="space-y-4">
          {faqs.map((faq) => (
            <li key={faq.faqNo} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{faq.qnaTitl}</h2>
              <p className="text-gray-600">{faq.qstnCntnCl}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">답변 보기</summary>
                <div dangerouslySetInnerHTML={{ __html: faq.ansCntnCl }} className="mt-1" />
              </details>
              <p className="text-sm text-gray-400 mt-2">
                등록일: {faq.regDate} / 부서: {faq.deptName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}