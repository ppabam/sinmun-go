import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "신문고 검색",
  description: "대한민국 국민권익위원회 국민신문고 정부민원안내콜센터 110 수집 민원 데이터 종합적으로 분석 제공 검색",
  openGraph: {
    title: "신문고 검색",
    description: "대한민국 국민권익위원회 국민신문고 정부민원안내콜센터 110 수집 민원 데이터 종합적으로 분석 제공 검색",
    images: ["https://sinnum-go.vercel.app/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
