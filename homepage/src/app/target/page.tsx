import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, HelpCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "정보통신설비 유지보수 대상건축물 — 연면적 5천㎡ 이상 해당 여부 확인",
  description:
    "정보통신설비 유지보수·관리 및 성능점검 대상 건축물을 확인하세요. 연면적 5천㎡ 이상 건축물(공동주택 제외). 규모별 의무 이행 기한 안내.",
  keywords: [
    "정보통신설비유지보수",
    "정보통신설비성능점검",
    "정보통신설비유지관리",
    "연면적 5천㎡ 이상 건축물",
    "정보통신설비 대상건축물",
  ],
  alternates: { canonical: "https://jngsystem.com/target" },
  openGraph: {
    title: "정보통신설비 유지보수 대상건축물 — 연면적 5천㎡ 이상 해당 여부 확인",
    description: "정보통신설비 유지보수·관리 및 성능점검 대상 건축물을 확인하세요. 연면적 5천㎡ 이상 건축물(공동주택 제외). 규모별 의무 이행 기한 안내.",
    url: "https://jngsystem.com/target",
  },
  twitter: {
    card: "summary_large_image",
    title: "우리 건물, 정보통신설비 점검 의무 대상인가요? — 연면적 5천㎡ 이상 확인",
    description: "연면적 5천㎡ 이상 건축물(공동주택 제외)은 의무 대상. 규모별 마감: 1만~3만㎡는 2026.7.18.",
  },
};

const targetBuildings = [
  { type: "업무시설", examples: "오피스, 업무용 빌딩", target: true },
  { type: "판매시설", examples: "백화점, 쇼핑몰, 상가", target: true },
  { type: "의료시설", examples: "병원, 의원, 요양원", target: true },
  { type: "교육연구시설", examples: "대학교, 연구소", target: true },
  { type: "숙박시설", examples: "호텔, 모텔", target: true },
  { type: "문화집회시설", examples: "공연장, 전시장, 도서관", target: true },
  { type: "운수시설", examples: "공항, 기차역, 버스터미널", target: true },
  { type: "운동시설", examples: "체육관, 수영장", target: true },
  { type: "공동주택", examples: "아파트, 연립주택, 다세대", target: false },
  { type: "초·중·고 학교시설", examples: "초등학교, 중학교, 고등학교", target: false },
];

const deadlines = [
  { range: "연면적 3만㎡ 이상", deadline: "2025. 7. 18.", status: "done", badge: "시행 중" },
  { range: "연면적 1만㎡ 이상 ~ 3만㎡ 미만", deadline: "2026. 7. 18.", status: "urgent", badge: "올해 마감" },
  { range: "연면적 5천㎡ 이상 ~ 1만㎡ 미만", deadline: "2027. 7. 18.", status: "upcoming", badge: "준비 필요" },
];

const faqs = [
  {
    q: "연면적 산정 시 지하층, 주차장도 포함되나요?",
    a: "네. 건축물대장에 기재된 연면적 전체(지하층, 주차장 포함)를 기준으로 합니다.",
  },
  {
    q: "같은 부지에 5천㎡ 미만 건물이 여러 개 있으면 합산하나요?",
    a: "정보통신설비가 연결되어 있는 경우에는 합산하며, 연결되지 않은 경우에는 각 건물별로 판단합니다.",
  },
  {
    q: "아파트와 상가가 섞인 주상복합 건물은 어떻게 판단하나요?",
    a: "주상복합 건물은 공동주택(아파트) 면적을 제외한 근린생활시설·오피스텔 등 비공동주택 면적만 별도로 합산하여 대상 여부를 판단합니다. 예를 들어, 전체 연면적이 1만㎡라도 공동주택 면적이 6천㎡이고 상가·오피스 면적이 4천㎡라면, 4천㎡를 기준으로 판단하여 5천㎡ 미만이므로 대상에서 제외됩니다. 비공동주택 부분이 5천㎡ 이상이라면 해당 부분의 관리주체가 의무 대상입니다.",
  },
  {
    q: "신축 예정인 건물도 대상인가요?",
    a: "사용승인 또는 준공인가를 받은 날(완공일)을 기준으로 대상 여부가 결정되며, 유예기간이 적용됩니다.",
  },
];

const targetFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function TargetPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(targetFaqSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }, { name: "대상건축물 확인", path: "/target" }]} />
      {/* 페이지 헤더 */}
      <section style={{ background: "linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)" }}>
        <div className="container-main py-12">
          <p className="text-white/60 text-sm mb-2">대상건축물 확인</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">우리 건물, 점검 의무 대상인가요?</h1>
          <p className="text-white/80 max-w-xl leading-relaxed">
            연면적 5,000㎡ 이상 건축물은 원칙적으로 정보통신설비 유지보수·관리 및 성능점검 의무 대상입니다.
            아래에서 해당 여부를 확인하세요.
          </p>
        </div>
      </section>

      {/* Answer Block */}
      <section className="section-padding">
        <div className="container-main">
          <div className="answer-block" aria-label="summary">
            <p>
              정보통신설비 유지보수·관리 및 성능점검 대상은 「건축법」 제2조제2항에 따른 용도별 건축물 중
              연면적 5,000㎡ 이상인 건축물입니다. 공동주택(아파트·연립·다세대)과 초·중·고 학교시설은 대상에서 제외됩니다.
            </p>
          </div>

          {/* 대상 건축물 유형 표 */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>건축물 용도별 대상 여부</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold">건축물 용도</th>
                  <th className="px-6 py-4 text-left font-semibold">대표 예시</th>
                  <th className="px-6 py-4 text-left font-semibold">대상 여부</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {targetBuildings.map(({ type, examples, target }) => (
                  <tr key={type} className={target ? "hover:bg-[var(--color-bg)]" : "bg-red-50/30 hover:bg-red-50/50"}>
                    <td className="px-6 py-3.5 font-medium" style={{ color: "var(--color-primary)" }}>{type}</td>
                    <td className="px-6 py-3.5" style={{ color: "var(--color-gray-600)" }}>{examples}</td>
                    <td className="px-6 py-3.5">
                      {target ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          <CheckCircle2 size={12} /> 대상
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                          <XCircle size={12} /> 제외
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-10 rounded-xl overflow-hidden border border-red-200">
            <div className="px-5 py-3 flex items-center gap-2 bg-red-50">
              <XCircle size={15} className="text-red-500 shrink-0" />
              <span className="text-sm font-bold text-red-700">제외 대상 건축물 — 연면적과 관계없이 의무 없음</span>
            </div>
            <div className="bg-white px-5 py-4 text-sm space-y-2" style={{ color: "var(--color-gray-600)" }}>
              <p>① <strong>공동주택</strong>(아파트·연립주택·다세대주택) — 「주택법」 적용 대상</p>
              <p>② <strong>초·중·고 학교시설</strong> — 「학교시설사업 촉진법」 적용 대상 (대학교는 대상에 포함)</p>
              <p className="pt-1 text-xs rounded-lg p-3" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                <strong>주상복합(아파트+상가) 특례:</strong> 공동주택 부분의 면적을 제외하고, 근린생활시설·오피스텔 등 비공동주택 면적만 별도 합산하여 5,000㎡ 이상 여부를 판단합니다.
                공동주택 면적을 제외한 부분이 5,000㎡ 이상이면 그 부분의 관리주체가 의무 대상입니다.
              </p>
            </div>
          </div>

          {/* 의무 이행 기한 */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>건축물 규모별 의무 이행 기한</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold">건축물 규모</th>
                  <th className="px-6 py-4 text-left font-semibold">의무 이행 기한</th>
                  <th className="px-6 py-4 text-left font-semibold">의무 내용</th>
                  <th className="px-6 py-4 text-left font-semibold">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {deadlines.map(({ range, deadline, status, badge }) => (
                  <tr
                    key={range}
                    style={{ background: status === "urgent" ? "#fff8f5" : "white" }}
                    className="hover:brightness-[0.98]"
                  >
                    <td className="px-6 py-4 font-semibold" style={{ color: status === "urgent" ? "var(--color-warning)" : "var(--color-primary)" }}>
                      <span className="inline-flex items-center gap-2">
                        {status === "urgent" && <AlertTriangle size={15} style={{ color: "var(--color-warning)" }} className="shrink-0" />}
                        {status === "done" && <CheckCircle2 size={15} style={{ color: "var(--color-success)" }} className="shrink-0" />}
                        {status === "upcoming" && <HelpCircle size={15} style={{ color: "var(--color-accent)" }} className="shrink-0" />}
                        {range}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold font-inter" style={{ color: status === "urgent" ? "var(--color-warning)" : "var(--color-gray-900)" }}>
                      {deadline}
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: "var(--color-gray-600)" }}>
                      유지보수·관리(반기 1회) + 성능점검(연 1회) + 기록보존 5년
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{
                          background: status === "done" ? "#dcfce7" : status === "urgent" ? "#fff3ec" : "#eff6ff",
                          color: status === "done" ? "#15803d" : status === "urgent" ? "var(--color-warning)" : "var(--color-accent)",
                        }}
                      >
                        {badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3만㎡ 이상 긴급 알림 */}
          <div className="mb-10 rounded-xl px-5 py-4 flex items-start gap-3" style={{ background: "#fff8f5", border: "2px solid var(--color-warning)" }}>
            <AlertTriangle size={20} style={{ color: "var(--color-warning)" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--color-warning)" }}>
                🚨 연면적 3만㎡ 이상 대형 건축물 — 2026년 7월 18일까지 최초 성능점검 완료 필수
              </p>
              <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
                2025년 7월부터 제도가 시행된 연면적 3만㎡ 이상 건축물은 <strong>법령상 매년 1회 이상 성능점검</strong> 의무에 따라
                <strong> 2026년 7월 18일까지 최초 성능점검을 완료</strong>해야 합니다.
                현재 4월이므로 약 3개월 남은 시점입니다. 지금 바로 일정을 잡으세요.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>대상 여부 관련 자주 묻는 질문</h2>
          <div className="space-y-4 mb-10">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-5 border border-[var(--color-border)] card-shadow">
                <p className="text-sm font-bold mb-2" style={{ color: "var(--color-primary)" }}>Q. {q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-gray-600)" }}>A. {a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--color-accent-light)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>대상 여부가 불확실하신가요?</h3>
            <p className="text-sm mb-5" style={{ color: "var(--color-gray-600)" }}>
              건물 정보를 알려주시면 전문가가 무료로 대상 여부를 검토해드립니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              무료 대상 여부 확인 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
