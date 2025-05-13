"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// API 데이터 타입 정의
interface DeptData {
  deptName: string;
  cnt: number;
}

interface ApiResponse {
  total_count: number;
  min_reg_date: string;
  max_reg_date: string;
  group_by: DeptData[];
}

// 초기 chartData (로딩 전 기본값)
const initialChartData: { deptName: string; cnt: number; fill: string }[] = [];

// chartConfig 초기 설정
const initialChartConfig: ChartConfig = {
  cnt: {
    label: "Count",
  },
};

// 기존 CSS 변수 (global.css에 정의된 값)
const predefinedColors = [
  "221.2 83.2% 53.3%", // --chart-1
  "212 95% 68%",      // --chart-2
  "216 92% 60%",      // --chart-3
  "210 98% 78%",      // --chart-4
  "212 97% 87%",      // --chart-5
];

// 동적 색상 생성 함수
const generateColor = (index: number): string => {
  if (index < predefinedColors.length) {
    return predefinedColors[index];
  }
  // 추가 색상 생성 (HSL 기반)
  const hue = (index * 137.5) % 360; // 황금각도 비율로 색상 분포
  return `${hue} 70% 60%`;
};

const fetchData = async (): Promise<ApiResponse | null> => {
  try {
    const res = await fetch("/api/faq/chart");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    // console.log("차트 데이터:", data);
    return data;
  } catch (error) {
    console.error("차트 데이터 로딩 실패:", error);
    return null;
  }
};

export default function FAQPieChart() {
  const [chartData, setChartData] = React.useState(initialChartData);
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>(initialChartConfig);
  const [totalCount, setTotalCount] = React.useState(0);
  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");

  React.useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data && data.group_by) {
        // chartData 생성
        const newChartData = data.group_by.map((item) => ({
          deptName: item.deptName,
          cnt: item.cnt,
          fill: `var(--color-${item.deptName.replace(/\s/g, "-").toLowerCase()})`,
        }));

        // chartConfig 생성
        const newChartConfig: ChartConfig = {
          cnt: {
            label: "Count",
          },
          ...data.group_by.reduce((acc, item, index) => {
            const key = item.deptName.replace(/\s/g, "-").toLowerCase();
            acc[key] = {
              label: item.deptName,
              color: `hsl(${generateColor(index)})`,
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>),
        };

        // 동적 CSS 변수 주입
        const styleSheet = document.createElement("style");
        const cssRules = data.group_by
          .map((item, index) => {
            const key = item.deptName.replace(/\s/g, "-").toLowerCase();
            return `--color-${key}: ${generateColor(index)};`;
          })
          .join("\n");
        styleSheet.textContent = `:root {\n${cssRules}\n}`;
        document.head.appendChild(styleSheet);

        setChartData(newChartData);
        setChartConfig(newChartConfig);
        setTotalCount(data.total_count);
        setMinDate(data.min_reg_date);
        setMaxDate(data.max_reg_date);

        // cleanup: 컴포넌트 언마운트 시 style 태그 제거
        return () => {
          document.head.removeChild(styleSheet);
        };
      }
    };

    loadData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>답변 기관</CardTitle>
        <CardDescription>{ minDate } ~ { maxDate }</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="cnt"
              nameKey="deptName"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          FAQ
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {(chartData[0]?.cnt ?? 0).toLocaleString()} 건의 {chartData[0]?.deptName ?? "기관"} 문의가{" "}
          {(((chartData[0]?.cnt ?? 0) / (totalCount || 1)) * 100).toFixed(1)}%
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          상위 {chartData.length}개 기관의 답변은 {chartData.reduce((sum, item) => sum + item.cnt, 0).toLocaleString()} 건 이며 전체 문의의 {((chartData.reduce((sum, item) => sum + item.cnt, 0) / totalCount) * 100).toFixed(1)}%를 차지합니다.
          <Link href="/depts" className="ml-2 text-blue-500 hover:underline">
          ✔️상세보기
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}