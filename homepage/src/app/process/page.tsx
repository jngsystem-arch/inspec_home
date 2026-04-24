import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "정보통신설비 성능점검 절차 — 상담부터 점검표 보존까지 6단계",
  description:
    "정보통신설비 성능점검 절차를 안내합니다. 상담 신청 → 현장 조사 → 계약 체결 → 관리점검 실시 → 성능점검 실시 → 점검표 기록·보존까지 6단계.",
  keywords: [
    "정보통신설비성능점검",
    "정보통신설비유지보수",
    "정보통신설비관리점검",
    "정보통신설비유지보수성능점검",
    "성능점검 절차",
    "유지보수 관리 절차",
  ],
  alternates: { canonical: "https://jngsystem.com/process" },
  openGraph: {
    title: "정보통신설비 성능점검 절차 — 상담부터 점검표 보존까지 6단계",
    description: "정보통신설비 성능점검 절차를 안내합니다. 상담 신청 → 현장 조사 → 계약 체결 → 관리점검 실시 → 성능점검 실시 → 점검표 기록·보존까지 6단계.",
    url: "https://jngsystem.com/process",
  },
  twitter: {
    card: "summary_large_image",
    title: "정보통신설비 성능점검 절차 6단계 — 상담부터 점검표 보존까지",
    description: "상담 신청 → 현장 조사 → 계약 → 관리점검 → 성능점검 → 기록 보존. 전 과정 전문가 대행.",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "정보통신설비 성능점검 절차",
  description:
    "정보통신공사업법 제37조의2에 따른 성능점검 대행 서비스 이용 절차",
  totalTime: "P14D",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "상담 신청",
      text: "전화 또는 온라인 상담 신청 양식을 통해 건축물 정보(연면적, 설비 현황)를 알려주세요.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "현장 조사 및 견적",
      text: "전문 기술자가 건축물을 방문하여 설비 현황을 조사하고 맞춤 견적을 제공합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "계약 체결",
      text: "성능점검 대행 계약서 및 유지보수·관리 위탁 계약서를 작성합니다.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "관리점검 실시",
      text: "반기별 1회 이상 설비의 외관·기능·안전 상태를 점검하고 유지보수·관리 점검표를 기록합니다.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "성능점검 실시",
      text: "33개 법정 의무 대상 설비(+전유부분 1개 선택)에 대해 전문 장비를 사용하여 성능점검을 실시합니다.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "점검표 기록·보존 및 제출",
      text: "정보통신설비 성능점검표를 작성하고 5년간 보존합니다. 지자체 요청 시 제출합니다.",
    },
  ],
};

const steps = [
  {
    no: "01",
    title: "상담 신청",
    duration: "당일",
    desc: "전화 또는 온라인 양식으로 건축물 정보를 알려주세요. 연면적, 설비 구성, 현재 관리 상황을 파악합니다.",
    details: ["건축물 기본 정보 수집 (연면적, 용도)", "현재 설비 현황 파악", "법적 의무 대상 여부 1차 확인", "서비스 방향 안내"],
    color: "var(--color-accent)",
  },
  {
    no: "02",
    title: "현장 조사 및 견적",
    duration: "3일 이내",
    desc: "전문 기술자가 직접 방문하여 설치된 정보통신설비를 조사하고 맞춤 견적서를 제공합니다.",
    details: ["33개 법정 의무 설비 보유 현황 확인 (+전유부분 1개 협의)", "설비 도면 및 설치 현황표 검토", "점검 난이도 및 소요 시간 산출", "맞춤 견적서 제공"],
    color: "var(--color-primary-mid)",
  },
  {
    no: "03",
    title: "계약 체결",
    duration: "1일",
    desc: "성능점검 대행 및 유지보수·관리 위탁 계약을 체결합니다. 연간 점검 일정을 협의합니다.",
    details: ["성능점검 대행 계약서 작성", "유지보수·관리 위탁 계약서 작성", "연간 점검 일정 협의", "계약일로부터 30일 이내 지자체 선임 신고 무상 대행 (법적 의무)"],
    color: "#7C3AED",
  },
  {
    no: "04",
    title: "관리점검 실시",
    duration: "반기별 1회",
    desc: "계약 후 반기마다 1회 이상 설비의 외관·기능·안전 상태를 점검합니다. 유지보수·관리 기준에 따라 체계적으로 진행하며 점검표를 기록합니다.",
    details: ["설비 외관·기능 상태 점검", "안전 상태 및 작동 여부 확인", "이상 설비 즉시 관리주체 통보", "유지보수·관리 점검표 기록"],
    color: "#0891B2",
  },
  {
    no: "05",
    title: "성능점검 실시",
    duration: "1~2일",
    desc: "전문 장비를 갖춘 기술자가 33개 법정 의무 대상 설비를 항목별로 점검합니다. 이상 설비는 즉시 보고합니다.",
    details: ["통신설비 8개 항목 점검", "정보설비 23개 항목 점검", "방송·기타설비 3개 항목 점검", "이상 설비 즉시 관리주체 통보"],
    color: "var(--color-success)",
  },
  {
    no: "06",
    title: "점검표 기록·보존",
    duration: "점검 후 즉시",
    desc: "정보통신설비 성능점검표를 작성하여 드립니다. 5년 보존 의무를 이행하고 지자체 제출을 지원합니다.",
    details: ["성능점검표 공식 양식 작성", "전자·서면 기록 관리", "5년 보존 관리 지원", "지자체 제출 서류 준비 지원"],
    color: "var(--color-warning)",
  },
];

export default function ProcessPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }, { name: "점검 절차", path: "/process" }]} />

      {/* 헤더 */}
      <section style={{ background: "linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)" }}>
        <div className="container-main py-12">
          <p className="text-white/60 text-sm mb-2">점검 절차</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">정보통신설비 성능점검 절차</h1>
          <p className="text-white/80 max-w-xl leading-relaxed">
            상담 신청부터 점검표 보존까지 6단계로 진행됩니다. 모든 과정을 전문가가 책임지고 처리합니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="answer-block" aria-label="summary">
            <p>
              정보통신설비 성능점검은 ① 상담 신청 → ② 현장 조사 및 견적 → ③ 계약 체결 → ④ 관리점검 실시 →
              ⑤ 성능점검 실시 → ⑥ 점검표 기록·보존 및 제출의 6단계로 진행됩니다. 전 과정을 전문 공사업자가 대행하며,
              점검 완료 후 성능점검표를 5년간 보존합니다.
            </p>
          </div>

          {/* 스텝 */}
          <div className="space-y-6">
            {steps.map(({ no, title, duration, desc, details, color }) => (
              <div key={no} className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-20 flex sm:flex-col items-center justify-center gap-2 p-5 sm:py-8" style={{ background: color + "10" }}>
                    <span className="text-3xl font-bold font-inter" style={{ color }}>{no}</span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>{title}</h2>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full font-inter" style={{ background: color + "15", color }}>
                        소요 {duration}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-gray-600)" }}>{desc}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-gray-600)" }}>
                          <CheckCircle2 size={14} style={{ color }} className="shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              지금 바로 상담 신청 <ArrowRight size={16} />
            </Link>
            <Link
              href="/service"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 font-bold rounded-xl hover:bg-[var(--color-bg)] transition-colors"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              성능점검·유지보수 서비스 보기 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
