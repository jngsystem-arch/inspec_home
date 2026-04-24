import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList, ShieldCheck, UserCheck, CheckCircle2,
  ArrowRight, Server, Network, Shield, Monitor,
  Wrench, BarChart3, AlertCircle
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "정보통신설비 성능점검 대행 & 유지보수관리 위탁 서비스",
  description:
    "정보통신설비 성능점검 대행(매년 1회 이상), 유지보수·관리 위탁(반기별 1회 이상), 관리자 선임 간주 처리. 22년 IT 인프라 경험 기반 구조적 진단.",
  keywords: [
    "정보통신설비유지보수위탁",
    "정보통신설비유지보수",
    "정보통신설비성능점검",
    "정보통신설비유지보수성능점검",
    "정보통신설비유지보수관리자선임",
    "정보통신설비유지관리",
    "성능점검 대행",
    "유지보수 관리 위탁",
  ],
  alternates: { canonical: "https://jngsystem.com/service" },
  openGraph: {
    title: "서비스 소개 — 정보통신설비 성능점검 대행 & 유지보수관리 위탁",
    description: "정보통신설비 성능점검 대행(매년 1회 이상), 유지보수·관리 위탁(반기별 1회 이상), 관리자 선임 간주 처리. 22년 IT 인프라 경험 기반 구조적 진단.",
    url: "https://jngsystem.com/service",
  },
  twitter: {
    card: "summary_large_image",
    title: "정보통신설비 성능점검 대행 & 유지보수관리 위탁 — 제이앤지시스템",
    description: "성능점검 대행(연 1회), 유지보수·관리 위탁(반기 1회), 관리자 선임 간주 처리. 22년 IT 인프라 경험 기반.",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  provider: {
    "@type": "Organization",
    name: "제이앤지시스템 JNGSYSTEM",
    foundingDate: "2003",
  },
  serviceType: "정보통신설비 유지보수 및 성능점검",
  areaServed: "KR",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "정보통신설비 관리 서비스",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "성능점검 대행",
          description:
            "33개 법정 의무 대상 설비(+전유부분 1개 선택) 성능점검 대행, 성능점검표 기록·보존(5년), 매년 1회 이상 실시. 22년 IT 인프라 운영 경험 기반 구조적 진단.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "유지보수·관리 위탁",
          description:
            "설비 외관·기능·안전 상태 점검, 반기별 1회 이상 유지보수·관리 점검표 기록",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "관리자 선임 간주 처리",
          description:
            "공사업자 위탁 시 관리자 선임 간주 처리, 선임 신고 대행, 인정교육 이수 확인",
        },
      },
    ],
  },
};

const itBackground = [
  { icon: Server, label: "Windows / Linux 서버", detail: "서버 성능 분석·장애 대응·운영 관리" },
  { icon: Network, label: "네트워크 (L2/L3/L4)", detail: "스위치·라우터·로드밸런서 운영" },
  { icon: Shield, label: "보안 장비", detail: "Firewall, IPS/IDS, VPN 구성·관리" },
  { icon: Monitor, label: "PC·워크스테이션", detail: "클라이언트 장비 유지보수" },
  { icon: Wrench, label: "OS·소프트웨어 패치", detail: "업데이트 관리 및 버전 통제" },
  { icon: BarChart3, label: "장애 대응·정기점검", detail: "실시간 모니터링, 문서화·보고" },
];

const services = [
  {
    icon: ClipboardList,
    title: "성능점검 대행",
    subtitle: "매년 1회 이상",
    color: "var(--color-accent)",
    summary:
      "정보통신설비 성능점검은 33개 법정 의무 대상 설비(전유부분 홈네트워크 1개 선택 제외)의 운전·운용에 필요한 성능을 전문 장비로 측정하는 법정 점검입니다. 공사업자 또는 용역업자가 대행할 수 있습니다.",
    points: [
      "통신설비 8개, 방송설비 1개, 정보설비 23개, 기타설비 2개 전 설비 점검",
      "정보통신설비 성능점검표 작성 — 공식 양식 기준",
      "점검기록 5년 보존 및 지자체 제출 지원",
      "불량 설비 조치 사항 관리주체 즉시 통보",
      "점검 완료 후 결과 보고서 제공",
    ],
    highlight: "22년간 기업 IT 시스템(서버·네트워크·보안·PC)의 성능·장애·보안을 분석해 온 경험이 정보통신설비 성능점검의 구조적 진단 근거가 됩니다.",
  },
  {
    icon: ShieldCheck,
    title: "유지보수·관리 위탁",
    subtitle: "반기별 1회 이상",
    color: "var(--color-success)",
    summary:
      "정보통신설비의 기능을 유지하고 이용자의 편의와 안전을 확보하기 위한 일상적 보수·관리 서비스입니다. 반기별 1회 이상 점검표를 기록해야 합니다.",
    points: [
      "설비 외관, 기능 및 안전 상태 반기별 1회 이상 점검",
      "정보통신설비 유지보수·관리 점검표 기록 및 관리",
      "이상 설비 즉시 보고 및 조치 안내",
      "연간 유지보수 계획 수립 지원",
      "법정 관리기준 준수 보장",
    ],
    highlight: "장기 IT 인프라 운영을 통해 축적된 정기점검·문서화·보고 체계를 유지보수·관리에도 그대로 적용합니다.",
  },
  {
    icon: UserCheck,
    title: "관리자 선임 간주 처리",
    subtitle: "상시",
    color: "#7C3AED",
    summary:
      "공사업자에게 유지보수·관리를 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주). 선임 면제가 아니라 위탁 계약에 의해 선임 의무가 충족되는 구조입니다. 단, 계약일로부터 30일 이내에 관할 지자체에 선임 신고서를 반드시 제출해야 합니다(미신고 시 과태료 100만원).",
    points: [
      "연면적 규모별 선임 자격 기준 검토 (특급·고급·중급·초급 기술자)",
      "유지보수·관리자 인정교육(20시간) 이수 여부 확인",
      "계약 즉시 선임 신고 서류 작성·제출 무상 대행 (30일 이내 법적 의무)",
      "보조관리자 선임 컨설팅",
      "겸직 가능 여부(타 설비 안전관리자) 검토",
    ],
    highlight: "선임 간주 처리 요건 및 위탁계약 범위를 정확히 확인하여 과태료 리스크를 최소화합니다.",
  },
];

const comparison = [
  { item: "법적 근거", inspection: "정보통신공사업법 제37조의3", maintenance: "정보통신공사업법 제37조의2" },
  { item: "점검 주기", inspection: "매년 1회 이상", maintenance: "반기별 1회 이상 (연 최소 2회)" },
  { item: "실시 주체", inspection: "공사업자·용역업자 대행 가능", maintenance: "선임된 관리자 또는 위탁업체" },
  { item: "위탁 시 효과", inspection: "성능점검 의무 이행 인정", maintenance: "관리자를 선임한 것으로 봄(선임 간주)" },
  { item: "기록 보존", inspection: "성능점검표 5년", maintenance: "유지보수·관리 점검표 (별도 보존 의무)" },
  { item: "미이행 과태료", inspection: "300만원", maintenance: "300만원" },
];

export default function ServicePage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }, { name: "서비스 소개", path: "/service" }]} />

      {/* 헤더 */}
      <section style={{ background: "linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)" }}>
        <div className="container-main py-12">
          <p className="text-white/60 text-sm mb-2">서비스 소개</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">정보통신설비 성능점검 대행 & 유지보수관리 위탁</h1>
          <p className="text-white/80 max-w-2xl leading-relaxed">
            정보통신공사업법 제37조의2에 따른 법적 의무를 이행할 수 있도록, 22년간 기업 IT 인프라 유지보수 경험을 바탕으로
            성능점검 대행 및 유지보수·관리 위탁 서비스를 제공합니다.
          </p>
        </div>
      </section>

      {/* Answer Block */}
      <section className="section-padding">
        <div className="container-main">
          <div className="answer-block" aria-label="summary">
            <p>
              정보통신설비 성능점검 대행은 33개 법정 의무 대상 설비(+전유부분 1개 선택)의 성능을 매년 1회 이상 전문 업체가 대신 점검하는 서비스입니다.
              유지보수·관리 위탁은 반기별 1회 이상 설비 상태를 점검·기록하는 서비스입니다.
              공사업자에게 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주). 단, 계약일로부터 30일 이내 지자체 선임 신고는 법적 의무입니다(미신고 시 과태료 100만원).
            </p>
          </div>

          {/* IT 배경 강점 배너 */}
          <div className="mb-10 rounded-2xl overflow-hidden border border-[var(--color-border)] card-shadow">
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: "var(--color-primary)" }}>
              <Server size={18} className="text-white" />
              <span className="text-white font-bold text-sm">22년 기업 IT 인프라 유지보수 경험 — 정보설비 점검의 구조적 근거</span>
            </div>
            <div className="bg-white p-6">
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-gray-600)" }}>
                저희는 22년간 기업 IT 시스템(서버·네트워크·보안·PC)의 성능, 장애, 보안, 운영을 유지보수해 온 경험을 바탕으로
                정보통신설비 성능점검에서도 구조적 진단 역량을 제공합니다.
                단순 FM/시설관리형 외관 점검이 아닌, 실제 IT 운영 구조를 이해한 점검을 수행합니다.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {itBackground.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="text-center p-3 rounded-xl" style={{ background: "var(--color-bg)" }}>
                    <Icon size={20} className="mx-auto mb-1.5" style={{ color: "var(--color-accent)" }} />
                    <div className="text-xs font-bold mb-0.5" style={{ color: "var(--color-primary)" }}>{label}</div>
                    <div className="text-xs" style={{ color: "var(--color-gray-600)" }}>{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 서비스 카드 상세 */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>서비스 상세</h2>
          <div className="space-y-6">
            {services.map(({ icon: Icon, title, subtitle, color, summary, points, highlight }) => (
              <div key={title} className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + "15" }}>
                      <Icon size={28} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{title}</h3>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full font-inter" style={{ background: color + "15", color }}>
                          {subtitle}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-gray-600)" }} aria-label="definition">{summary}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {points.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-gray-600)" }}>
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-start gap-2 rounded-lg p-3.5" style={{ background: color + "0D" }}>
                        <AlertCircle size={15} className="mt-0.5 shrink-0" style={{ color }} />
                        <p className="text-xs leading-relaxed" style={{ color: "var(--color-primary)" }}>{highlight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 비교 테이블 */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-main">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
            성능점검 vs 유지보수·관리 비교
          </h2>
          <p className="mb-6 text-sm" style={{ color: "var(--color-gray-600)" }}>
            두 서비스는 각각 별도로 의무 이행해야 하며, 위탁 시 효과가 다릅니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-5 py-3.5 text-left font-semibold w-1/4">구분</th>
                  <th className="px-5 py-3.5 text-left font-semibold">성능점검</th>
                  <th className="px-5 py-3.5 text-left font-semibold">유지보수·관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {comparison.map(({ item, inspection, maintenance }) => (
                  <tr key={item} className="hover:bg-[var(--color-bg)]">
                    <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--color-primary)" }}>{item}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-gray-600)" }}>{inspection}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-gray-600)" }}>{maintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg p-4" style={{ background: "var(--color-warning-light)" }}>
            <AlertCircle size={15} className="mt-0.5 shrink-0" style={{ color: "var(--color-warning)" }} />
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-gray-600)" }}>
              <strong style={{ color: "var(--color-warning)" }}>선임 간주 주의:</strong>{" "}
              공사업자에게 위탁하면 &ldquo;선임 면제&rdquo;가 아니라 &ldquo;선임한 것으로 본다(선임 간주)&rdquo;입니다.
              위탁 계약서에 유지보수·관리 위탁 내용이 명확히 포함되어야 선임 간주 효과가 인정됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 직접 선임 vs 위탁 비교 */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
            직접 선임 vs 공사업자 위탁 — 무엇이 유리한가?
          </h2>
          <p className="mb-6 text-sm" style={{ color: "var(--color-gray-600)" }}>
            정보통신설비유지보수 관리는 직접 기술자를 선임하거나, 공사업자에게 위탁하는 방법이 있습니다.
            위탁 시 선임 간주 처리로 별도 채용 없이 법적 의무를 이행할 수 있습니다.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-5 py-3.5 text-left font-semibold w-1/4">비교 항목</th>
                  <th className="px-5 py-3.5 text-left font-semibold">직접 선임</th>
                  <th className="px-5 py-3.5 text-left font-semibold">공사업자 위탁 (선임 간주)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {[
                  { item: "선임 의무", direct: "기술계 기술자 직접 채용 또는 지정", outsource: "위탁계약 체결만으로 선임 간주 처리" },
                  { item: "비용 구조", direct: "기술자 인건비 전액 (상시 고용 또는 겸직)", outsource: "연간 위탁 계약비용 (규모별 협의)" },
                  { item: "법적 리스크", direct: "내부 관리 소홀 시 과태료 직접 부담", outsource: "업체가 점검 기준 준수 책임" },
                  { item: "인정교육 이수", direct: "선임자 직접 관리 (취임 후 1년 내 20시간)", outsource: "업체 소속 기술자가 이수·관리" },
                  { item: "추천 대상", direct: "자체 IT 인력이 충분한 대규모 시설", outsource: "전문 인력 확보가 어려운 일반 건축물" },
                ].map(({ item, direct, outsource }) => (
                  <tr key={item} className="hover:bg-[var(--color-bg)]">
                    <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--color-primary)" }}>{item}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--color-gray-600)" }}>{direct}</td>
                    <td className="px-5 py-3.5 font-medium" style={{ color: "var(--color-success)" }}>{outsource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-3 mt-10" style={{ color: "var(--color-primary)" }}>
            유지보수관리자 선임 자격 기준 요약
          </h2>
          <p className="mb-5 text-sm" style={{ color: "var(--color-gray-600)" }}>
            정보통신공사업법 시행령 제37조의2에 따라 건축물 규모별로 선임 기술자 등급이 다릅니다.
            공사업자에게 위탁 시, 해당 등급 기술자를 보유한 업체와 계약하면 선임 간주 요건을 충족합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { grade: "특급 기술자", color: "var(--color-warning)", scope: "연면적 6만㎡ 이상", desc: "정보통신기술자 특급 이상 보유자 선임" },
              { grade: "고급 기술자 (고급 이상)", color: "var(--color-accent)", scope: "3만㎡ 이상 ~ 6만㎡ 미만", desc: "정보통신기술자 고급 이상 보유자 선임" },
              { grade: "중급 기술자 (중급 이상)", color: "var(--color-success)", scope: "1만 5천㎡ 이상 ~ 3만㎡ 미만", desc: "정보통신기술자 중급 이상 보유자 선임" },
              { grade: "초급 기술자 (초급 이상)", color: "#7C3AED", scope: "5천㎡ 이상 ~ 1만 5천㎡ 미만", desc: "정보통신기술자 초급 이상 보유자 선임" },
            ].map(({ grade, color, scope, desc }) => (
              <div key={grade} className="bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow text-center">
                <div className="text-sm font-bold mb-1" style={{ color }}>{grade}</div>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--color-primary)" }}>{scope}</div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-gray-600)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-primary)" }}>
              ※ 근거: 정보통신공사업법 시행령 제37조의2. 공사업자 위탁 시 해당 등급 기술자를 보유한 업체와 계약하면 선임 간주 요건이 충족됩니다.
              <Link href="/law" className="ml-2 underline font-bold" style={{ color: "var(--color-accent)" }}>법령 안내 보기 →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-main text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>서비스 도입을 검토 중이신가요?</h2>
          <p className="mb-6 text-sm" style={{ color: "var(--color-gray-600)" }}>건물 규모에 맞는 최적의 서비스 방안을 안내해드립니다.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors">
            무료 상담 신청 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
