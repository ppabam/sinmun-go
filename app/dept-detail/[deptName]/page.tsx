// /app/dept-detail/[deptName]/page.tsx
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Detail {
  deptName: string;
  cnt: number;
}

interface ApiResponse {
  details: Detail[];
}

interface Props {
  params: {
    deptName: string;
  };
}

export default function DeptDetailPage({ params }: Props) {
  const { deptName } = params;
  const [details, setDetails] = useState<Detail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/faq/detail?deptName=${encodeURIComponent(deptName)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setDetails(data.details);
      } catch (error: any) {
        console.error("상세 데이터 호출 오류:", error);
        setError("상세 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [deptName]);

  if (loading) {
    return <div>Loading 상세 데이터...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">{deptName} 상세 문의 현황</h2>
        <Link href="/depttable" className="text-blue-600 hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          돌아가기
        </Link>
      </div>
      <div className="rounded-md shadow-sm">
        <Table>
          <TableCaption className="text-lg font-medium text-gray-700 mb-4">
            {deptName} 관련 상세 문의 내역
          </TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기관명
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                문의 수
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {details.map((detail) => (
              <TableRow key={detail.deptName}>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {detail.deptName}
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                  {detail.cnt.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-gray-50">
            <TableRow>
              <TableCell className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                총 {details.length} 건
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                {details.reduce((sum, item) => sum + item.cnt, 0).toLocaleString()} 건
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}