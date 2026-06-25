import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "sans-serif",
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  fallback: ["ui-monospace", "Cascadia Code", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "bucket-list-ai · 你的人生剩余清单",
  description:
    "AI 驱动的人生遗愿清单引擎。基于你的剩余寿命、收入约束、性格画像，生成可落地的人生体验清单。",
  keywords: [
    "人生清单",
    "遗愿清单",
    "AI 推荐",
    "寿命倒计时",
    "MBTI",
    "Vision Pro",
    "TRAE",
  ],
  authors: [{ name: "老茅" }],
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider delay={200}>{children}</TooltipProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
