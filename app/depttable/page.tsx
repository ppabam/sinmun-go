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
  const [totalInquiries, setTotalInquiries] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/faq/chart?limit=100');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setInvoices(data.group_by);
        setTotalCount(data.total_count);
        setTotalInquiries(data.total_count);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">기관별 문의 현황</h2>
        <Link href="/">
        ↩️
        </Link>
      </div>
      <div className="rounded-md shadow-sm">
        <Table>
          <TableCaption className="text-lg font-medium text-gray-700 mb-4">
            최근 FAQ 현황 (총 {totalCount.toLocaleString()} 건)
          </TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기관명
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                문의 수
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                비율
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <TableRow key={invoice.deptName}>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/dept-detail/${encodeURIComponent(invoice.deptName)}`} className="hover:underline text-blue-600">
                    {invoice.deptName}
                  </Link>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                  {invoice.cnt.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                  {totalInquiries > 0 && (
                    <span className="text-gray-500">
                      {((invoice.cnt / totalInquiries) * 100).toFixed(2)}%
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-gray-50">
            <TableRow>
              <TableCell className="px-4 py-3 text-left text-sm font-medium text-gray-700" colSpan={2}>
                총 상위기관
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                {invoices.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}