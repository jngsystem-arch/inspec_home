import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D2B5E",
};

export const metadata: Metadata = {
  title: {
    default: "제이앤지시스템 JNGSYSTEM | 정보통신설비 성능점검 & 유지보수 전문",
    template: "%s | 제이앤지시스템 JNGSYSTEM",
  },
  description:
    "정보통신공사업법 제37조의2에 따른 정보통신설비 성능점검 대행 및 유지보수·관리 위탁 전문 업체. 연면적 5천㎡ 이상 건축물 관리주체의 법적 의무 이행을 지원합니다.",
  keywords: [
    // 붙여쓰기 — 네이버 검색량 상위 키워드
    "정보통신설비유지보수",
    "정보통신설비",
    "정보통신설비유지관리",
    "정보통신설비유지보수선임",
    "정보통신설비성능점검",
    "정보통신설비유지보수관리자선임",
    "정보통신설비유지보수관리기준",
    "정보통신설비유지보수위탁",
    "정보통신설비유지보수성능점검",
    "정보통신설비성능점검업체",
    "정보통신설비관리점검",
    // 띄어쓰기 — 구글 및 일반 검색
    "정보통신설비 성능점검",
    "정보통신설비 유지보수",
    "성능점검 대행",
    "유지보수 관리 위탁",
    "정보통신공사업법 제37조의2",
    "유지보수 관리자 선임",
    "연면적 5천㎡ 이상 건축물",
    "과태료 300만원",
  ],
  metadataBase: new URL("https://jngsystem.com"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "제이앤지시스템 JNGSYSTEM",
    title: "제이앤지시스템 JNGSYSTEM | 정보통신설비 성능점검 & 유지보수 전문",
    description: "정보통신공사업법 제37조의2에 따른 정보통신설비 성능점검 대행 및 유지보수·관리 위탁 전문 업체. 연면적 5천㎡ 이상 건축물 관리주체의 법적 의무 이행을 지원합니다.",
    url: "https://jngsystem.com",
    images: [
      {
        url: "https://jngsystem.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "제이앤지시스템 | 정보통신설비 성능점검 & 유지보수",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "제이앤지시스템 JNGSYSTEM | 정보통신설비 성능점검 & 유지보수 전문",
    description: "정보통신공사업법 제37조의2에 따른 정보통신설비 성능점검 대행 및 유지보수·관리 위탁 전문 업체. 연면적 5천㎡ 이상 건축물 관리주체의 법적 의무 이행을 지원합니다.",
    images: ["https://jngsystem.com/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full`}>
      <head>
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5SZ94ZMW');`,
        }}
      />
      <body className="min-h-full flex flex-col antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5SZ94ZMW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
