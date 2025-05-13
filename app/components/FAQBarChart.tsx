"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DailyData {
  regDate: string;
  dutySctnNm: string;
  cnt: number;
}
interface ApiResponse {
  민원: number;
  정책: number;
  group_by: DailyData[];
}

const chartConfig = {
  views: {
    label: "Page Views",
  },
  민원: {
    label: "민원",
    color: "hsl(var(--chart-1))",
  },
  정책: {
    label: "정책",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const fetchData = async (): Promise<ApiResponse | null> => {
  try {
    const res = await fetch("/api/faq/dailycount");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("차트 데이터 로딩 실패:", error);
    return null;
  }
};

interface ChartDataItem {
  date: string;
  민원?: number;
  정책?: number;
  [key: string]: string | number | undefined; // 인덱스 시그니처 추가
}

const initialChartData: ChartDataItem[] = [];

export default function FAQBarChart() {
  const [chartData, setChartData] = React.useState(initialChartData);
  const [total, setTotal] = React.useState({ 민원: 0, 정책: 0 });
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("민원")

  React.useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data && data.group_by) {
        const groupedData: { [key: string]: ChartDataItem } = {};
        data.group_by.forEach((item) => {
          if (!groupedData[item.regDate]) {
            groupedData[item.regDate] = { date: item.regDate };
          }
          groupedData[item.regDate][item.dutySctnNm] = item.cnt;
        });
        setChartData(Object.values(groupedData).sort((a, b) => (a.date > b.date ? 1 : -1)));
        setTotal({ 민원: data.민원, 정책: data.정책 });
      }
    };

    loadData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>민원 및 정책 현황</CardTitle>
          <CardDescription>
            최근 데이터 기준 민원 및 정책 접수 현황
          </CardDescription>
        </div>
        <div className="flex">
          {["민원", "정책"].map((key) => {
            const chartKey = key as keyof typeof chartConfig
            return (
              <button
                key={chartKey}
                data-active={activeChart === chartKey}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chartKey)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chartKey].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 12,
              left: 12,
              bottom: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                })
              }}
              style={{
                fontSize: "0.8rem",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              style={{
                fontSize: "0.8rem",
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="date"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}