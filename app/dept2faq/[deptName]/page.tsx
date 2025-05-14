'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import FAQList from '@/app/components/FAQList'; 
import { FAQ } from '@/app/types/faq';

export default function DeptDetailPage() {
  const { deptName: encodedDeptName } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [decodedDeptName, setDecodedDeptName] = useState<string>('');
  const decodedDeptName = decodeURIComponent(encodedDeptName as string);
  const mainDeptName = decodedDeptName.split(" ")[0];

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    // setDecodedDeptName(decodeURIComponent(encodedDeptName as string));

    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/faq/dept?deptName=${encodedDeptName}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("상세 데이터:", data);
        setFaqs(data.cleanedFaqs);
      } catch (error: unknown) {
        console.error("상세 데이터 호출 오류:", error);
        setError("상세 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [encodedDeptName]);

  if (loading) {
    return <div>Loading 상세 데이터...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {decodedDeptName}
        </h2>
        <Link href={`/depts/${mainDeptName}`} className="text-blue-600 hover:underline flex items-center">
        ↩️
        </Link>
      </div>

      {faqs.length > 0 ? (
        <FAQList faqs={faqs} />
      ) : (
        <p>해당 소속 기관에 대한 FAQ가 없습니다.</p>
      )}

    </div>
  );
}
