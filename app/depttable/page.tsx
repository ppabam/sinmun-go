'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Invoice {
  deptName: string;
  cnt: number;
}

interface ApiResponse {
  total_count: number;
  min_reg_date: string;
  max_reg_date: string;
  group_by: Invoice[];
}

export default function DeptTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalInquiries, setTotalInquiries] = useState<number>(0); // 전체 문의 건수 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/faq/chart');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setInvoices(data.group_by);
        setTotalCount(data.total_count);
        // 전체 문의 건수를 API 응답에서 직접 가져오거나, group_by 데이터를 기반으로 계산할 수 있습니다.
        // 여기서는 API 응답에 total_count가 있다고 가정합니다.
        setTotalInquiries(data.total_count);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold mt-3">부서별 문의 현황</h2>
        <Link href="/" className="text-blue-500 hover:underline">
        🔎
        </Link>
      </div>
      <Table>
        <TableCaption>최근 FAQ 현황 (총 {totalCount} 건)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">NAME</TableHead>
            <TableHead className="text-right">COUNT</TableHead>
            <TableHead className="text-right">PERCENT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.deptName}>
              <TableCell className="font-medium">{invoice.deptName}</TableCell>
              <TableCell className="text-right">
                {invoice.cnt.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {totalInquiries > 0 && (
                  <span className="ml-1 text-gray-500">
                    {((invoice.cnt / totalInquiries) * 100).toFixed(3)}%
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>총 부서 수</TableCell>
            <TableCell className="text-right">{invoices.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}