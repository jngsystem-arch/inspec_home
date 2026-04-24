import type { Metadata } from "next";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import ContactForm from "./ContactForm";
import ContactCards from "@/components/ContactCards";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "무료 상담 신청 — 정보통신설비 성능점검 문의",
  description:
    "정보통신설비 성능점검 대행 및 유지보수·관리 위탁 무료 상담을 신청하세요. 대상 여부 확인, 견적 안내, 법령 질문 모두 답변드립니다.",
  keywords: [
    "정보통신설비성능점검업체",
    "정보통신설비유지보수",
    "정보통신설비성능점검",
    "정보통신설비유지보수위탁",
    "정보통신설비유지보수관리자선임",
    "성능점검 상담",
    "유지보수 관리 문의",
  ],
  alternates: { canonical: "https://jngsystem.com/contact" },
  openGraph: {
    title: "무료 상담 신청 — 정보통신설비 성능점검·유지보수 문의",
    description: "정보통신설비 성능점검 대행 및 유지보수·관리 위탁 무료 상담을 신청하세요. 대상 여부 확인, 견적 안내, 법령 질문 모두 답변드립니다.",
    url: "https://jngsystem.com/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "정보통신설비 성능점검 무료 상담 — 제이앤지시스템",
    description: "대상 여부 확인, 견적 안내, 법령 질문 모두 무료. 영업일 당일 답변. 02-3444-3570",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "제이앤지시스템 JNGSYSTEM",
  telephone: "02-3444-3570",
  email: "sales@jngsystem.co.kr",
  areaServed: "KR",
  openingHours: "Mo-Fr 09:00-18:00",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "02-3444-3570",
    contactType: "customer service",
    availableLanguage: "Korean",
    areaServed: "KR",
  },
};

export default function ContactPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }, { name: "무료 상담 신청", path: "/contact" }]} />

      {/* 헤더 */}
      <section className="relative overflow-hidden">
        <Image
          src="/hero-contact.webp"
          alt="정보통신설비 성능점검 무료 상담 신청"
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
          <p className="text-white/60 text-sm mb-2">문의하기</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">무료 상담 신청</h1>
          <p className="text-white/80 max-w-xl leading-relaxed">
            대상 건축물 여부 확인부터 점검 견적까지 전문가가 무료로 안내해드립니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 연락처 정보 */}
            <div className="lg:col-span-1 space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>연락처</h2>
                <ContactCards />
              </div>

              <div className="bg-[var(--color-accent-light)] rounded-xl p-5">
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--color-primary)" }}>상담 신청 시 안내드리는 내용</h3>
                <ul className="space-y-2">
                  {[
                    "대상 건축물 여부 무료 확인",
                    "건물 규모별 의무 이행 기한",
                    "서비스 종류 및 견적 안내",
                    "관리자 선임 절차 안내",
                    "점검 일정 협의",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-primary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-accent)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 상담 신청 폼 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] card-shadow">
                <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>상담 신청서</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
