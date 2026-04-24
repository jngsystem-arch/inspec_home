import type { Metadata } from "next";

/**
 * /admin/* 레이아웃
 *
 * SEO 관점:
 * - 모든 관리자 경로는 검색엔진·AI 봇 색인 차단 (noindex, nofollow)
 * - public/robots.ts에서도 /admin/* Disallow 처리됨 (이중 방어)
 * - 사이트맵(sitemap.ts)에 포함되지 않음
 */
export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
