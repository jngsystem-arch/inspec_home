import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FaqClient from "@/components/FaqClient";
import { faqCategories } from "@/data/faq-data";

export const metadata: Metadata = {
  title: "정보통신설비 성능점검·유지보수 FAQ — 실무 질문 75건",
  description:
    "과학기술정보통신부 정보통신설비 유지보수·관리 제도 질의응답 사례집. 관리주체 판단, 대상건축물, 선임기준, 과태료 등 75개 이상 실무 Q&A.",
  keywords: [
    "정보통신설비유지보수",
    "정보통신설비성능점검",
    "정보통신설비유지관리",
    "정보통신설비유지보수선임",
    "정보통신설비유지보수관리자선임",
    "정보통신설비유지보수관리기준",
    "정보통신설비 성능점검 FAQ",
    "정보통신설비 유지보수 관리 질의응답",
    "관리주체 판단",
    "정보통신공사업법 제37조의2 과태료",
    "유지보수 관리자 선임 자격",
  ],
  alternates: { canonical: "https://jngsystem.com/faq" },
  openGraph: {
    title: "정보통신설비 성능점검·유지보수 FAQ — 실무 질문 75건",
    description: "과학기술정보통신부 정보통신설비 유지보수·관리 제도 질의응답 사례집. 관리주체 판단, 대상건축물, 선임기준, 과태료 등 75개 이상 실무 Q&A.",
    url: "https://jngsystem.com/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "정보통신설비 성능점검·유지보수 FAQ 75건 — 과기정통부 Q&A 기반",
    description: "관리주체 판단, 대상건축물, 선임기준, 과태료 등 실무 질문 75건. 검색으로 바로 찾기.",
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqCategories.flatMap((cat) =>
    cat.items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    }))
  ),
};

export default function FaqPage() {
  const totalCount = faqCategories.reduce((s, c) => s + c.items.length, 0);

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "홈", path: "/" },
          { name: "정보통신설비 FAQ", path: "/faq" },
        ]}
      />

      {/* 페이지 헤더 */}
      <section className="relative overflow-hidden">
        <Image
          src="/hero-faq.webp"
          alt="정보통신설비 성능점검·유지보수 자주 묻는 질문"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center center", filter: "brightness(0.15)" }}
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(4,13,28,0.92) 0%, rgba(4,13,28,0.88) 45%, rgba(4,13,28,0.78) 70%, rgba(4,13,28,0.68) 100%)"
        }} />
        <div className="relative z-10 container-main py-12">
          <p className="text-white/60 text-sm mb-2">자주 묻는 질문</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">정보통신설비 성능점검·유지보수 자주 묻는 질문</h1>
          <p className="text-white/80 max-w-2xl leading-relaxed">
            과학기술정보통신부 「정보통신설비 유지보수·관리 제도 질의응답 사례집」을 기반으로,
            관리주체 판단·대상건축물·선임기준·과태료 등 실무 질문{" "}
            <strong className="text-white">{totalCount}건</strong>을 정리했습니다.
            검색창에 궁금한 키워드를 입력하면 유사 질문을 바로 찾을 수 있습니다.
          </p>
        </div>
      </section>

      {/* 목차 (스크롤 앵커) — SSR로 렌더링되어 AI 크롤러가 파싱 가능 */}
      <section className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
        <div className="container-main py-4">
          <nav aria-label="FAQ 목차">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {faqCategories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.id}`}
                    className="hover:underline font-medium"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {cat.title}
                    <span className="ml-1 text-xs" style={{ color: "var(--color-gray-600)" }}>
                      ({cat.items.length})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {/* Answer-First 요약 블록 — AI 크롤러 인용 최적화 */}
          <div className="answer-block" aria-label="summary">
            <p>
              이 페이지는 과학기술정보통신부 「정보통신설비 유지보수·관리 제도 질의응답 사례집」을 기반으로
              관리주체 판단·대상건축물 확인·선임기준·과태료 등 실무 질문 {faqCategories.reduce((s, c) => s + c.items.length, 0)}건을 정리한 공식 Q&A입니다.
              연면적 5,000㎡ 이상 건축물 관리주체의 법적 의무 이행에 필요한 핵심 질문을 모두 담았습니다.
            </p>
          </div>

          {/* 클라이언트 컴포넌트: 검색·필터·아코디언 */}
          <FaqClient categories={faqCategories} />

          {/* SSR 콘텐츠: AI 크롤러를 위한 전체 Q&A (CSS로 숨기지 않고 노출) */}
          <div className="sr-only" aria-hidden="true">
            {faqCategories.map((cat) =>
              cat.items.map((item) => (
                <div key={item.id}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))
            )}
          </div>

          {/* 하단 CTA */}
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{ background: "var(--color-accent-light)" }}
          >
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "var(--color-primary)" }}
            >
              원하시는 답변을 찾지 못하셨나요?
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--color-gray-600)" }}>
              복합건축물, 다수 임차인, 관리주체 분쟁 등 복잡한 케이스는 전문가 상담을 권장합니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              전문가에게 문의하기 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
