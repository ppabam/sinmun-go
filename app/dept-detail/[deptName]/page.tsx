// /app/dept-detail/[deptName]/page.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';

interface Detail {
  deptName: string;
  cnt: number;
}

interface ApiResponse {
  details: Detail[];
}

export default function DeptDetailPage() {
  const { deptName: encodedDeptName } = useParams();
  const [details, setDetails] = useState<Detail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decodedDeptName, setDecodedDeptName] = useState<string>('');

  useEffect(() => {
    setDecodedDeptName(decodeURIComponent(encodedDeptName as string));

    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/faq/detail?deptName=${encodedDeptName}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setDetails(data.details);
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

  const totalCount = details.reduce((sum, item) => sum + item.cnt, 0);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">
          {decodedDeptName} - 소속 기관
        </h2>
        <Link href="/depttable" className="text-blue-600 hover:underline flex items-center">
          돌아가기
        </Link>
      </div>

      {/* 테이블 wrapper에 overflow-x-auto 추가 */}
      <div className="rounded-md shadow-sm overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기관명
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                문의(%)
              </TableHead>
            </TableRow>

            {/* 총합 정보를 테이블 상단에 표시 */}
            <TableRow>
              <TableCell className="px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-100">
                관련 부서 {details.length}
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm font-medium text-gray-700 bg-gray-100">
                {totalCount.toLocaleString()} 건
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white divide-y divide-gray-200">
            {details.map((detail) => (
              <TableRow key={detail.deptName}>
                <TableCell className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-normal break-words">
                  {detail.deptName}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-700 text-right">
                  {detail.cnt.toLocaleString()} ({((detail.cnt / totalCount) * 100).toFixed(1)})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
