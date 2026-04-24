import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck, ClipboardList, UserCheck,
  AlertTriangle, CheckCircle2, ArrowRight,
  Building2, Award, Server, Network,
  Monitor, Shield, Wrench, BarChart3, Clock, ChevronRight
} from "lucide-react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import Countdown from "@/components/Countdown";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import HeroDiagnosis from "@/components/HeroDiagnosis";

export const metadata: Metadata = {
  title: "제이앤지시스템 JNGSYSTEM | 정보통신설비 성능점검 & 유지보수 관리 전문",
  alternates: { canonical: "https://jngsystem.com" },
  description:
    "정보통신공사업법 제37조의2에 따른 성능점검 대행 및 유지보수·관리 위탁. 22년 기업 IT 인프라 유지보수 경험. 연면적 5천㎡ 이상 건축물 2026.7.18 마감.",
  keywords: [
    "정보통신설비성능점검업체",
    "정보통신설비유지보수",
    "정보통신설비성능점검",
    "정보통신설비유지보수위탁",
    "정보통신설비유지보수관리자선임",
    "정보통신설비유지관리",
    "정보통신설비유지보수성능점검",
    "정보통신설비관리점검",
  ],
  openGraph: {
    title: "제이앤지시스템 JNGSYSTEM | 정보통신설비 성능점검 & 유지보수 관리 전문",
    description: "정보통신공사업법 제37조의2에 따른 성능점검 대행 및 유지보수·관리 위탁. 22년 기업 IT 인프라 유지보수 경험. 연면적 5천㎡ 이상 건축물 2026.7.18 마감.",
    url: "https://jngsystem.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "제이앤지시스템 | 정보통신설비 성능점검 & 유지보수 — 2026.7.18 마감",
    description: "정보통신공사업법 제37조의2에 따른 성능점검 대행 및 유지보수·관리 위탁. 미이행 시 최대 300만원 과태료.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": "https://jngsystem.com/#organization",
  name: "제이앤지시스템",
  alternateName: ["주식회사 제이앤지시스템", "JNGSYSTEM", "JNG SYSTEM"],
  legalName: "주식회사 제이앤지시스템",
  url: "https://jngsystem.com",
  logo: {
    "@type": "ImageObject",
    url: "https://jngsystem.com/JNGSYSTEM_2Line_Logo.png",
    width: 800,
    height: 280,
  },
  image: "https://jngsystem.com/opengraph-image",
  telephone: "+82-2-3444-3570",
  email: "sales@jngsystem.co.kr",
  taxID: "211-88-14679",
  vatID: "211-88-14679",
  foundingDate: "2003",
  areaServed: { "@type": "Country", name: "Republic of Korea" },
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressRegion: "서울특별시",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+82-2-3444-3570",
      email: "sales@jngsystem.co.kr",
      contactType: "customer service",
      availableLanguage: ["Korean"],
      areaServed: "KR",
    },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  description:
    "정보통신공사업법 제37조의2에 따른 정보통신설비 성능점검 대행 및 유지보수·관리 위탁 전문 업체. 22년간 기업 IT 인프라(서버·네트워크·보안·PC) 유지보수 경험을 바탕으로 연면적 5,000㎡ 이상 건축물 관리주체의 법적 의무 이행을 지원합니다.",
  slogan: "IT 전문가가 직접 수행하는 정보통신설비 성능점검·유지보수",
  knowsAbout: [
    "정보통신설비 성능점검",
    "정보통신설비 유지보수관리",
    "정보통신공사업법 제37조의2",
    "정보통신공사업법 제37조의3",
    "유지보수 관리자 선임",
    "성능점검표 5년 보존",
    "연면적 5천㎡ 이상 건축물 법정 의무",
  ],
  knowsLanguage: ["ko"],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "과학기술정보통신부 정보통신공사업 등록",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "정보통신설비 성능점검 대행" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "정보통신설비 유지보수·관리 위탁" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: "관리자 선임 간주 처리" },
    },
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://jngsystem.com/#website",
  url: "https://jngsystem.com",
  name: "제이앤지시스템 JNGSYSTEM",
  inLanguage: "ko-KR",
  publisher: { "@id": "https://jngsystem.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://jngsystem.com/faq?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// 홈페이지 하단 FAQ 미리보기 섹션 — AI 답변 엔진 인용 최적화용 FAQPage 스키마
const homeFaqItems = [
  {
    q: "공사업체에 위탁하면 관리자를 선임하지 않아도 되나요?",
    a: "공사업자에게 유지보수·관리를 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주). 단, 위탁계약서 등 위탁 근거 서류를 갖추어야 합니다.",
  },
  {
    q: "성능점검 기록은 얼마나 보존해야 하나요?",
    a: "정보통신설비 성능점검표는 작성일로부터 5년간 보존해야 합니다. 지자체 요청 시 즉시 제출해야 하며, 미제출 시 100만원의 과태료가 부과됩니다.",
  },
  {
    q: "공동주택과 상가가 함께 있는 복합건축물은 어떻게 되나요?",
    a: "복합건축물의 경우 건축물대장의 주용도를 기준으로 판단합니다. 상가 부분이 연면적 기준을 충족하면 해당 부분의 관리주체가 의무를 이행해야 합니다.",
  },
  {
    q: "FM(시설관리) 업체가 관리주체가 될 수 있나요?",
    a: "FM 업체는 건물 소유자·관리자로부터 관리를 위탁받은 경우 관리주체로 볼 수 있습니다. 위탁계약의 범위에 정보통신설비 관리가 포함되어야 합니다.",
  },
];

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqItems.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

// 서비스 3가지
const services = [
  {
    icon: ClipboardList,
    title: "성능점검 대행",
    desc: "33개 법정 의무 대상 설비(+전유부분 1개 선택)에 대한 성능점검을 연 1회 이상 대행합니다. 성능점검표 기록·보존(5년) 및 지자체 제출 지원까지 원스톱 처리.",
    period: "매년 1회 이상",
    color: "var(--color-accent)",
    href: "/service",
  },
  {
    icon: ShieldCheck,
    title: "유지보수·관리 위탁",
    desc: "설비의 외관, 기능, 안전 상태를 반기별 1회 이상 점검하고 점검표를 기록합니다. 관리기준 준수를 책임집니다.",
    period: "반기별 1회 이상",
    color: "var(--color-success)",
    href: "/service",
  },
  {
    icon: UserCheck,
    title: "관리자 선임 간주 처리",
    desc: "공사업자에게 유지보수·관리를 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주). 단, 계약일로부터 30일 이내 지자체 선임 신고는 법적 의무이며(미신고 시 과태료 100만원), 신고 서류 작성부터 제출까지 무상 대행합니다.",
    period: "상시",
    color: "#7C3AED",
    href: "/service",
  },
];

// 과태료
const penalties = [
  { desc: "유지보수·관리기준 미준수", amount: "300만원" },
  { desc: "점검기록 미작성 또는 허위 작성", amount: "300만원" },
  { desc: "점검기록(5년) 미보존", amount: "150만원" },
  { desc: "지자체 요청 시 점검표 미제출", amount: "100만원" },
];

// 22년 IT 경험 항목
const itExperiences = [
  { icon: Server, label: "Windows / Linux 서버", desc: "서버 성능·장애·운영 관리" },
  { icon: Network, label: "네트워크 장비 (L2/L3/L4)", desc: "스위치·라우터·로드밸런서" },
  { icon: Shield, label: "보안 장비", desc: "Firewall, IPS/IDS, VPN" },
  { icon: Monitor, label: "PC·워크스테이션", desc: "클라이언트 장비 관리" },
  { icon: Wrench, label: "OS·소프트웨어 업데이트", desc: "패치 관리 및 버전 통제" },
  { icon: BarChart3, label: "장애 대응·정기점검", desc: "실시간 모니터링 및 보고" },
];

// 차별화 3요소
const differentiators = [
  {
    no: "01",
    title: "운영 구조 이해 기반 점검",
    desc: "기업 IT 시스템은 서버·네트워크·보안·클라이언트가 연결된 운영 구조입니다. 단순 외관 체크리스트가 아닌, 실제 운영 흐름과 장애 경로를 이해한 진단을 제공합니다.",
  },
  {
    no: "02",
    title: "정보통신설비 성능 분석 역량",
    desc: "네트워크·CCTV·출입통제·BEMS 등 정보설비는 IT 시스템의 하위 구조입니다. 22년간의 시스템 성능 분석 경험이 구조적 진단 근거가 됩니다.",
  },
  {
    no: "03",
    title: "문서화·보고 체계 완비",
    desc: "기업 IT 유지보수에서 요구되는 수준의 점검 기록, 이력 관리, 보고서 작성을 정보통신설비 성능점검에도 동일하게 적용합니다.",
  },
];

// 법적 일정
const deadlines = [
  { range: "연면적 3만㎡ 이상", deadline: "2025. 7. 18.", status: "done" },
  { range: "연면적 1만㎡ 이상 ~ 3만㎡ 미만", deadline: "2026. 7. 18.", status: "urgent" },
  { range: "연면적 5천㎡ 이상 ~ 1만㎡ 미만", deadline: "2027. 7. 18.", status: "upcoming" },
];

export default function HomePage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }]} />

      {/* ── 히어로 ── [옵션 1: Dark Overlay] */}
      <section className="text-white relative overflow-hidden">
        {/* 배경 이미지 (WebP, 최적화) — brightness로 이미지 자체를 어둡게 */}
        <Image
          src="/HERO_GPT2.webp"
          alt="정보통신설비 IT 전문 기술자 서버실 현장"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "60% center", filter: "brightness(0.15)" }}
          sizes="100vw"
        />
        {/* 진한 네이비 오버레이 + 오른쪽으로 갈수록 약간 투명 → 실루엣만 보이는 효과 */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(4,13,28,0.92) 0%, rgba(4,13,28,0.88) 45%, rgba(4,13,28,0.78) 70%, rgba(4,13,28,0.68) 100%)"
        }} />
        <div className="relative z-10 container-main py-10 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-[var(--color-warning)] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full mb-6">
            <AlertTriangle size={14} className="shrink-0" />
            2026.7.18 마감 임박 — 연면적 1만~3만㎡ 건축물
          </div>

          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            정보통신설비 성능점검·유지보수,<br />
            <span style={{ color: "#60B0FF" }}>IT 전문가가 직접 수행합니다</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mb-3 max-w-2xl leading-relaxed">
            정보통신공사업법 제37조의2에 따라 연면적 5천㎡ 이상 건축물은 반드시 성능점검 및 유지보수 관리를 이행해야 합니다.
          </p>
          <p className="text-white/70 text-sm mb-6 max-w-xl leading-relaxed">
            저희는 22년간 기업 IT 시스템(서버·네트워크·보안·PC)의 성능·장애·운영을 유지보수해 온 경험을 바탕으로
            정보통신설비 성능점검에서도 구조적 진단 역량을 제공합니다.
          </p>

          {/* ── 1초 진단 툴 ── */}
          <HeroDiagnosis />

          <div className="mb-8">
            <p className="text-white/50 text-sm mb-3 font-inter">연면적 1만~3만㎡ 의무 이행까지 남은 시간</p>
            <Countdown />
            <p className="mt-3 text-xs font-bold" style={{ color: "#FF9B6B" }}>
              ⚠ 미이행 시 최대 300만원 과태료 — 위반 항목 중복 시 합산 부과
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors">
              무료 상담 신청 <ArrowRight size={16} />
            </Link>
            <Link href="/target" className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl border border-white/30 hover:bg-white/10 transition-colors">
              대상건축물 상세 안내
            </Link>
          </div>
        </div>
      </section>

      {/* ── 핵심 수치 배너 ── */}
      <section className="bg-[var(--color-primary)] border-b border-white/10">
        <div className="container-main py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: "22년", label: "IT 인프라 유지보수 경험" },
              { value: "33개", label: "법정 의무 점검 설비" },
              { value: "5년", label: "점검기록 보존 의무" },
              { value: "300만원", label: "미이행 시 최대 과태료" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl sm:text-2xl font-bold font-inter text-white">{value}</div>
                <div className="text-xs text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 제도 안내 (Answer Block) ── */}
      <section className="section-padding">
        <div className="container-main">
          <div className="answer-block" aria-label="summary">
            <p>
              정보통신설비 유지보수·관리 및 성능점검 제도는 연면적 5,000㎡ 이상 건축물의 관리주체가
              반드시 이행해야 하는 법정 의무입니다. 유지보수·관리는 반기별 1회 이상,
              성능점검은 매년 1회 이상 실시하고 성능점검 기록은 5년간 보존해야 합니다.
              공사업자에게 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주).
              제이앤지시스템은 정보통신설비 성능점검업체로서 유지보수관리 위탁부터 관리자 선임 간주까지 일괄 대행합니다.
            </p>
          </div>

          {/* 서비스 카드 */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
            성능점검·유지보수, 어떤 서비스가 필요한가요?
          </h2>
          <p className="mb-12 text-sm" style={{ color: "var(--color-gray-600)" }}>
            법적 의무 이행에 필요한 모든 서비스를 원스톱으로 제공합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, desc, period, color, href }) => (
              <Link
                key={title}
                href={href}
                className="group bg-white rounded-2xl p-6 border border-[var(--color-border)] card-shadow card-shadow-hover transition-all duration-200 block"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: color + "18" }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <div className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 font-inter" style={{ background: color + "15", color }}>
                  {period}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--color-primary)" }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-gray-600)" }}>{desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color }}>
                  자세히 보기 <ChevronRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 22년 경험 차별화 ── */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 좌: 경험 소개 */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>
                <Award size={13} /> 22년 IT 인프라 전문 경험
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                단순 외관 점검이 아닌,<br />
                <span style={{ color: "var(--color-accent)" }}>IT 시스템 구조를 아는 점검</span>
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-gray-600)" }}>
                22년간 기업 IT 시스템(서버·네트워크·보안·PC)의 성능, 장애, 보안, 운영을 유지보수해 온 경험을 바탕으로
                정보통신설비 성능점검에서도 구조적 진단 역량을 제공합니다.
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-gray-600)" }}>
                네트워크, CCTV, 출입통제, BEMS 등 정보설비는 기업 IT 인프라의 하위 구조와 직결됩니다.
                체크리스트 기반의 단순 FM 점검과 달리, 실제 시스템 운영 흐름과 장애 원인을 이해한 진단을 수행합니다.
              </p>

              {/* 경험 영역 그리드 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itExperiences.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-white rounded-xl p-3.5 border border-[var(--color-border)] card-shadow">
                    <Icon size={18} className="mb-2" style={{ color: "var(--color-accent)" }} />
                    <div className="text-xs font-bold mb-0.5" style={{ color: "var(--color-primary)" }}>{label}</div>
                    <div className="text-xs" style={{ color: "var(--color-gray-600)" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 우: 차별화 3요소 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-5" style={{ color: "var(--color-primary)" }}>
                왜 이 업체가 정보설비 점검에 강한가?
              </h3>
              {differentiators.map(({ no, title, desc }) => (
                <div key={no} className="flex gap-4 bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow">
                  <div className="text-2xl font-bold font-inter shrink-0 leading-none pt-0.5" style={{ color: "var(--color-accent-light)" }}>
                    {no}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1.5" style={{ color: "var(--color-primary)" }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-gray-600)" }}>{desc}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-xl p-4 border-l-4 mt-2" style={{ background: "var(--color-accent-light)", borderColor: "var(--color-accent)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-primary)" }}>
                  ※ 저희는 22년간 기업 IT 인프라 유지보수를 수행한 정보통신설비 성능점검 전문 업체입니다.
                  정보통신설비유지보수관리 위탁·성능점검·관리자 선임 간주를 원스톱으로 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 의무 이행 기한 ── */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
            우리 건물의 의무 이행 기한은 언제인가요?
          </h2>
          <p className="mb-10 text-sm" style={{ color: "var(--color-gray-600)" }}>
            시행 유예기한 내에 반드시 유지보수·관리 및 성능점검 체계를 갖추어야 합니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden text-sm">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold">건축물 규모</th>
                  <th className="px-6 py-4 text-left font-semibold">의무 이행 기한</th>
                  <th className="px-6 py-4 text-left font-semibold">의무 내용</th>
                  <th className="px-6 py-4 text-left font-semibold">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {deadlines.map(({ range, deadline, status }) => (
                  <tr key={range} style={{ background: status === "urgent" ? "#fff8f5" : "white" }}
                    className="hover:brightness-[0.98]">
                    <td className="px-6 py-4 font-medium" style={{ color: status === "urgent" ? "var(--color-warning)" : "var(--color-primary)" }}>
                      {range}
                    </td>
                    <td className="px-6 py-4 font-bold font-inter" style={{ color: status === "urgent" ? "var(--color-warning)" : "var(--color-gray-900)" }}>
                      {deadline}
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: "var(--color-gray-600)" }}>
                      유지보수·관리(반기 1회) + 성능점검(연 1회) + 기록보존 5년
                    </td>
                    <td className="px-6 py-4">
                      {status === "done" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                          <CheckCircle2 size={12} /> 시행 중
                        </span>
                      )}
                      {status === "urgent" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                          <AlertTriangle size={12} /> 올해 마감
                        </span>
                      )}
                      {status === "upcoming" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          <Clock size={12} /> 준비 필요
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl px-5 py-4 flex items-start gap-3" style={{ background: "#fff8f5", border: "2px solid var(--color-warning)" }}>
            <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} className="shrink-0 mt-0.5" />
            <p className="text-sm" style={{ color: "var(--color-gray-700)" }}>
              <strong style={{ color: "var(--color-warning)" }}>🚨 연면적 3만㎡ 이상 대형 건축물:</strong>{" "}
              2025년 7월 제도 시행 후 <strong>2026년 7월 18일까지 최초 성능점검 완료</strong>가 의무입니다.
            </p>
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--color-gray-600)" }}>
            ※ 공동주택 및 초·중·고 학교시설은 대상에서 제외됩니다. 복합건축물의 경우 건축물대장 주용도를 기준으로 판단합니다.
          </p>
        </div>
      </section>

      {/* ── 과태료 + CTA ── */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                정보통신설비 미이행 시 과태료는 얼마인가요?
              </h2>
              <p className="mb-6 text-sm" style={{ color: "var(--color-gray-600)" }}>
                관리기준 미준수 시 아래 과태료가 부과되며, 위반 항목이 여러 개인 경우 중복 부과될 수 있습니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden text-sm">
                  <thead>
                    <tr style={{ background: "var(--color-warning)" }} className="text-white">
                      <th className="px-5 py-3 text-left font-semibold">위반 사항</th>
                      <th className="px-5 py-3 text-right font-semibold">과태료</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {penalties.map(({ desc, amount }) => (
                      <tr key={desc} className="hover:bg-orange-50">
                        <td className="px-5 py-3.5" style={{ color: "var(--color-gray-600)" }}>{desc}</td>
                        <td className="px-5 py-3.5 text-right font-bold font-inter whitespace-nowrap" style={{ color: "var(--color-warning)" }}>{amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs" style={{ color: "var(--color-gray-600)" }}>
                ※ 성능점검 기록은 작성일로부터 <strong>5년간 보존</strong>해야 하며, 지자체 요청 시 즉시 제출할 수 있어야 합니다.
              </p>
            </div>

            <div className="rounded-2xl p-5 sm:p-8" style={{ background: "linear-gradient(135deg, #0D2B5E 0%, #1A4A8A 100%)" }}>
              <h3 className="text-xl font-bold text-white mb-3">지금 바로 상담받으세요</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                건물 규모와 현재 설비 현황을 알려주시면<br />전문가가 맞춤 이행 방안을 안내합니다.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "대상 건축물 해당 여부 무료 확인",
                  "의무 이행 기한 및 절차 안내",
                  "성능점검·유지보수 맞춤 견적",
                  "관리자 선임 간주 처리 지원",
                  "법적 서류 작성 및 보존 지원",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 size={14} style={{ color: "#60B0FF" }} /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3.5 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
              >
                무료 상담 신청 <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 성능점검업체 선택 기준 ── */}
      <section className="section-padding">
        <div className="container-main">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-4" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>
            <Award size={13} /> 정보통신설비 성능점검업체 선택 기준
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>
            성능점검업체, 이렇게 선택하세요
          </h2>
          <p className="mb-8 text-sm max-w-2xl leading-relaxed" style={{ color: "var(--color-gray-600)" }}>
            정보통신설비 성능점검은 과기정통부 등록 공사업자·용역업자만 대행할 수 있습니다.
            업체 선정 전 아래 5가지를 반드시 확인하세요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { no: "01", title: "정보통신공사업 등록 여부", desc: "과기정통부 등록 업체만 법정 대행 가능. 등록번호 확인 필수" },
              { no: "02", title: "담당 기술자 등급", desc: "건축물 규모에 맞는 특급·고급·중급·초급 정보통신기술자 보유 여부" },
              { no: "03", title: "IT 설비 실운영 경험", desc: "체크리스트 기반 외관 점검이 아닌, 실제 IT 시스템 운영 경험" },
              { no: "04", title: "점검표 공식 양식 사용", desc: "성능점검표 공식 양식 기록 및 5년 보존·지자체 제출 지원" },
              { no: "05", title: "위탁 계약 범위 명확화", desc: "유지보수·관리 위탁 범위가 계약서에 명시되어야 선임 간주 인정" },
            ].map(({ no, title, desc }) => (
              <div key={no} className="bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow">
                <div className="text-2xl font-bold font-inter mb-2" style={{ color: "var(--color-accent-light)" }}>{no}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: "var(--color-primary)" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-gray-600)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border-l-4" style={{ background: "var(--color-accent-light)", borderColor: "var(--color-accent)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-primary)" }}>
              <strong>제이앤지시스템</strong>은 과기정통부 등록 정보통신공사업자로서, 22년간 기업 IT 인프라(서버·네트워크·보안·PC)를
              직접 운영·유지보수한 기술자가 정보통신설비 성능점검 및 유지보수관리 위탁을 직접 수행합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 제도 핵심 포인트 (법정 메시지) ── */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-2xl font-bold mb-10 text-center" style={{ color: "var(--color-primary)" }}>
            정보통신설비 제도, 핵심만 정리하면?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Clock,
                title: "유지보수·관리 주기",
                body: "반기별 1회 이상 설비 외관·기능·안전 상태를 점검하고 유지보수·관리 점검표를 기록해야 합니다.",
                color: "var(--color-accent)",
              },
              {
                icon: BarChart3,
                title: "성능점검 주기",
                body: "매년 1회 이상 33개 법정 의무 대상 설비(+전유부분 1개 선택)의 성능을 전문 장비로 측정합니다. 성능점검표는 5년간 보존 의무가 있습니다.",
                color: "var(--color-success)",
              },
              {
                icon: UserCheck,
                title: "위탁 시 선임 간주",
                body: "공사업자에게 유지보수·관리를 위탁하면 관리자를 선임한 것으로 봅니다. 선임 면제가 아닌 '선임 간주'입니다.",
                color: "#7C3AED",
              },
              {
                icon: Building2,
                title: "복합건축물 주의",
                body: "공동주택+상가 복합건축물, 다수 임차인 건물, FM 위탁 운영 건물은 관리주체 판단이 복잡합니다. 전문가 확인이 필요합니다.",
                color: "var(--color-warning)",
              },
            ].map(({ icon: Icon, title, body, color }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: color + "15" }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-primary)" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-gray-600)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ 미리보기 ── */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-main">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "var(--color-primary)" }}>
            자주 묻는 질문
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {homeFaqItems.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-5 border border-[var(--color-border)] card-shadow">
                <p className="text-sm font-bold mb-2" style={{ color: "var(--color-primary)" }}>Q. {q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-gray-600)" }}>A. {a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "var(--color-accent)" }}>
              FAQ 전체 보기 <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
