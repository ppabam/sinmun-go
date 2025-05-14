// app/faqs/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import FAQList from '@/app/components/FAQList'; 
import FAQPiChart from '@/app/components/FAQPiChart';
import FAQBarChart from '@/app/components/FAQBarChart';
import { FAQ } from '@/app/types/faq';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loading from './components/Loading';



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
      <h1 className="text-xl font-bold mb-4 text-center bg-blue-300 text-gray-800 rounded-2xl shadow-sm py-3">
        국민권익위원회 문의 데이터 조회
      </h1>
      <div className="mb-4 flex justify-center">
        <Input
          type="text"
          placeholder="검색어 + 엔터"
          className="mr-3 text-center"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} variant="outline">⏎</Button>
      </div>

      {loading && <Loading message='0과 1 사이에서 문서를 찾는 중입니다... 💻📡'/>}

      {!loading && !hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FAQPiChart />
        <FAQBarChart />
      </div>
      )}

      {!loading && hasSearched && faqs.length > 0 && (
        <FAQList faqs={faqs} />
      )}

      {!loading && hasSearched && faqs.length === 0 && (
        <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
      )}
    </main>
  );
}