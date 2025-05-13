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
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/faq/chart'); // API 엔드포인트
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: ApiResponse = await response.json();
          setInvoices(data.group_by);
          setTotalCount(data.total_count);
        } catch (error) {
          console.error("API 호출 오류:", error);
          // 에러 처리 로직 추가 (예: 사용자에게 에러 메시지 표시)
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <Table>
        <TableCaption>최근 FAQ 현황 (총 {totalCount} 건)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">부서명</TableHead>
            <TableHead className="text-right">문의 건수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.deptName}>
              <TableCell className="font-medium">{invoice.deptName}</TableCell>
              <TableCell className="text-right">{invoice.cnt.toLocaleString()}</TableCell>
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
    );
  }