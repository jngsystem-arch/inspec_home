import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "정보통신설비 유지보수·관리 법령 — 관리기준·선임·과태료 안내",
  description:
    "정보통신설비 유지보수·관리 및 성능점검 관련 법령 안내. 유지보수·관리 반기별 1회, 성능점검 매년 1회, 기록 5년 보존, 선임 간주, 과태료 300만원.",
  keywords: [
    "정보통신설비유지보수관리기준",
    "정보통신설비유지보수선임",
    "정보통신설비유지보수관리자선임",
    "정보통신설비관리점검",
    "정보통신공사업법 제37조의2",
    "과태료 300만원",
    "유지보수 관리자 선임",
  ],
  alternates: { canonical: "https://jngsystem.com/law" },
  openGraph: {
    title: "정보통신설비 유지보수·관리 법령 — 관리기준·선임·과태료 안내",
    description: "정보통신설비 유지보수·관리 및 성능점검 관련 법령 안내. 유지보수·관리 반기별 1회, 성능점검 매년 1회, 기록 5년 보존, 선임 간주, 과태료 300만원.",
    url: "https://jngsystem.com/law",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "정보통신설비 성능점검 의무화 법적 근거는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "정보통신공사업법 제37조의2에 따라 연면적 5,000㎡ 이상 건축물의 관리주체는 정보통신설비를 반기별 1회 이상 유지보수·관리하고, 매년 1회 이상 성능점검을 실시해야 합니다. 2024년 7월 19일 시행되었습니다.",
      },
    },
    {
      "@type": "Question",
      name: "성능점검 미이행 시 과태료는 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "유지보수·관리기준 미준수 시 300만원, 점검기록 미작성·허위 작성 시 300만원, 점검기록(5년) 미보존 시 150만원, 지자체 요청 시 미제출 시 100만원의 과태료가 부과됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "공사업자에게 위탁하면 관리자 선임 의무가 면제되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "면제가 아닙니다. 공사업자에게 유지보수·관리를 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주). 위탁계약서에 유지보수·관리 위탁 내용이 명확히 포함되어야 선임 간주 효과가 인정됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "성능점검 대행은 어떤 업체가 할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "과학기술정보통신부에 등록된 정보통신공사업자 또는 정보통신용역업자만 성능점검을 대행할 수 있습니다. (정보통신공사업법 시행규칙 제8조~제11조)",
      },
    },
  ],
};

const laws = [
  { name: "정보통신공사업법 제37조의2", desc: "유지보수·관리 의무 — 반기별 1회 이상, 관리자 선임 기준, 위탁 가능" },
  { name: "정보통신공사업법 제37조의3", desc: "성능점검 의무 — 매년 1회 이상, 성능점검표 5년 보존, 지자체 제출" },
  { name: "정보통신공사업법 제37조의4", desc: "과태료 부과 기준 (최대 300만원)" },
  { name: "정보통신공사업법 시행령 제37조의2", desc: "대상 건축물 범위, 연면적 기준" },
  { name: "정보통신공사업법 시행령 제37조의3", desc: "관리자 선임 자격 기준 (연면적 규모별 기술자 등급)" },
  { name: "정보통신공사업법 시행규칙 제8조~제11조", desc: "성능점검 대행자 요건, 점검 절차, 점검표 양식" },
  { name: "정보통신설비 유지보수·관리기준 (고시)", desc: "구체적 점검 항목, 방법, 기준 — 과기정통부 고시" },
];

const obligations = [
  {
    title: "계획 수립 및 구비 서류",
    color: "var(--color-accent)",
    items: [
      "매년 점검 대상설비에 대한 유지보수·관리 및 성능점검 계획 수립",
      "정보통신설비 준공도면 구비 (신축 건축물)",
      "정보통신공사 설치 현황표 구비 (신축 건축물, 기존 건물은 구비 간주)",
      "정보통신설비 설치 현황표 작성·비치 및 현행화",
    ],
  },
  {
    title: "유지보수·관리 의무",
    color: "var(--color-success)",
    items: [
      "건축물 규모별 선임기준에 맞춰 관리자 선임 (또는 위탁 시 선임 간주)",
      "반기별 1회 이상 설비 외관·기능·안전 상태 점검",
      "유지보수·관리 점검표를 반기별 1회 이상 기록",
      "위탁은 정보통신공사업자에게만 가능 (FM·용역업자 불가)",
    ],
  },
  {
    title: "성능점검 의무",
    color: "#7C3AED",
    items: [
      "매년 1회 이상 33개 법정 의무 설비 성능점검 실시 (전유부분 1개 선택)",
      "정보통신설비 성능점검표 기록 및 5년 보존",
      "지자체 요청 시 성능점검표 즉시 제출",
      "공사업자 또는 용역업자에게 대행 위탁 가능",
    ],
  },
];

const selectionRows = [
  {
    grade: "특급 기술자",
    desc: "정보통신기술자 특급 이상",
    scope: "연면적 6만㎡(60,000㎡) 이상",
  },
  {
    grade: "고급 기술자 (고급 이상)",
    desc: "정보통신기술자 고급 이상",
    scope: "연면적 3만㎡(30,000㎡) 이상 ~ 6만㎡(60,000㎡) 미만",
  },
  {
    grade: "중급 기술자 (중급 이상)",
    desc: "정보통신기술자 중급 이상",
    scope: "연면적 1만 5천㎡(15,000㎡) 이상 ~ 3만㎡(30,000㎡) 미만",
  },
  {
    grade: "초급 기술자 (초급 이상)",
    desc: "정보통신기술자 초급 이상",
    scope: "연면적 5천㎡(5,000㎡) 이상 ~ 1만 5천㎡(15,000㎡) 미만",
  },
];

const penalties = [
  { violation: "유지보수·관리기준을 준수하지 아니한 경우", amount: "300만원", law: "법 제37조의4" },
  { violation: "점검기록을 작성하지 아니하거나 거짓으로 작성한 경우", amount: "300만원", law: "법 제37조의4" },
  { violation: "점검기록(5년)을 보존하지 아니한 경우", amount: "150만원", law: "법 제37조의4" },
  { violation: "유지보수·관리자 선임 신고를 하지 아니한 경우 (30일 이내 신고 불이행)", amount: "100만원", law: "법 제37조의4" },
  { violation: "지자체 요청 시 점검기록을 제출하지 아니한 경우", amount: "100만원", law: "법 제37조의4" },
];

export default function LawPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }, { name: "법령 안내", path: "/law" }]} />

      {/* 헤더 */}
      <section style={{ background: "linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)" }}>
        <div className="container-main py-12">
          <p className="text-white/60 text-sm mb-2">법령 안내</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">관련 법령 및 의무사항</h1>
          <p className="text-white/80 max-w-xl leading-relaxed">
            정보통신공사업법 제37조의2에 따른 유지보수·관리(반기별 1회 이상)와 성능점검(매년 1회 이상) 의무를 상세히 안내합니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="answer-block" aria-label="summary">
            <p>
              정보통신공사업법 제37조의2는 2024년 7월 19일 시행되었습니다. 연면적 5,000㎡ 이상 건축물의 관리주체는
              반기별 1회 이상 유지보수·관리를, 매년 1회 이상 성능점검을 실시해야 합니다.
              성능점검 기록은 5년간 보존해야 하며, 공사업자에게 위탁하면 관리자를 선임한 것으로 봅니다(선임 간주).
            </p>
          </div>

          {/* 핵심 제도 포인트 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "유지보수·관리 주기", value: "반기별 1회 이상", sub: "연 최소 2회", color: "var(--color-accent)" },
              { label: "성능점검 주기", value: "매년 1회 이상", sub: "연 최소 1회", color: "var(--color-success)" },
              { label: "점검기록 보존", value: "5년", sub: "성능점검표 기준", color: "#7C3AED" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow text-center">
                <div className="text-2xl font-bold font-inter mb-1" style={{ color }}>{value}</div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-primary)" }}>{label}</div>
                <div className="text-xs" style={{ color: "var(--color-gray-600)" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* 선임 간주 주의 박스 */}
          <div className="mb-10 rounded-2xl border border-blue-200 overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: "var(--color-accent-light)" }}>
              <Info size={16} style={{ color: "var(--color-accent)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>선임 간주 vs 선임 면제 — 반드시 구분해야 합니다</span>
            </div>
            <div className="bg-white p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl p-4 border border-red-200" style={{ background: "#fff5f5" }}>
                  <div className="font-bold mb-2 text-red-700">✗ 잘못된 이해: 선임 면제</div>
                  <p style={{ color: "var(--color-gray-600)" }}>
                    &ldquo;공사업자에게 위탁하면 관리자를 선임하지 않아도 된다&rdquo;
                    — 이는 잘못된 표현입니다.
                  </p>
                </div>
                <div className="rounded-xl p-4 border border-green-200" style={{ background: "#f0fdf4" }}>
                  <div className="font-bold mb-2 text-green-700">✓ 정확한 표현: 선임 간주</div>
                  <p style={{ color: "var(--color-gray-600)" }}>
                    &ldquo;공사업자에게 유지보수·관리를 위탁하면 관리자를 선임한 것으로 본다&rdquo;
                    — 위탁에 의해 선임 의무가 충족된 것으로 처리됩니다.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--color-gray-600)" }}>
                ※ 위탁계약서에 유지보수·관리 위탁 범위가 명확히 포함되어야 선임 간주 효과가 인정됩니다.
              </p>
              <div className="mt-3 rounded-lg px-4 py-3 text-xs" style={{ background: "#fff8f5", border: "1px solid var(--color-warning)" }}>
                <strong style={{ color: "var(--color-warning)" }}>⚠ 선임 간주 ≠ 신고 면제:</strong>{" "}
                <span style={{ color: "var(--color-gray-600)" }}>
                  위탁 계약 후에도 <strong>위탁업체 소속 담당 기술자를 해당 건축물의 관리자로 지정하여 30일 이내에 관할 지자체에 선임 신고서를 반드시 제출</strong>해야 합니다.
                  신고를 누락하면 <strong>과태료 100만원</strong>이 부과됩니다. 제이앤지시스템은 이 신고 절차 전체를 무상으로 대행합니다.
                </span>
              </div>
            </div>
          </div>

          {/* 유지보수 vs 성능점검 자격 차이 */}
          <div className="mb-10 rounded-2xl border border-[var(--color-success)] overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: "var(--color-success)" + "12" }}>
              <Info size={16} style={{ color: "var(--color-success)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--color-success)" }}>유지보수·관리 위탁 vs 성능점검 대행 — 자격 요건이 다릅니다</span>
            </div>
            <div className="bg-white p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                <div className="rounded-xl p-4 border border-green-200" style={{ background: "#f0fdf4" }}>
                  <div className="font-bold mb-1" style={{ color: "var(--color-success)" }}>유지보수·관리 위탁</div>
                  <p style={{ color: "var(--color-gray-600)" }}>
                    <strong>정보통신공사업자</strong>에게만 위탁 가능합니다.
                    FM·시설관리 업체나 용역업자는 해당 자격이 없어 위탁 계약 효력이 인정되지 않습니다.
                  </p>
                </div>
                <div className="rounded-xl p-4 border border-purple-200" style={{ background: "#faf5ff" }}>
                  <div className="font-bold mb-1" style={{ color: "#7C3AED" }}>성능점검 대행</div>
                  <p style={{ color: "var(--color-gray-600)" }}>
                    <strong>정보통신공사업자 또는 정보통신용역업자</strong> 모두 대행 가능합니다.
                    단, 용역업자는 성능점검만 가능하고 유지보수·관리 위탁은 불가합니다.
                  </p>
                </div>
              </div>
              <div className="rounded-xl p-4 mb-3" style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)" }}>
                <p className="text-sm" style={{ color: "var(--color-primary)" }}>
                  <strong>제이앤지시스템</strong>은 정보통신공사업 면허를 보유하고 있어 <strong>유지보수·관리 위탁과 성능점검 대행을 별도 계약 없이 한 번에</strong> 수행합니다.
                  FM 업체나 용역업자를 통해 유지보수·관리를 위탁한 경우 선임 간주 효과가 발생하지 않아 과태료 대상이 될 수 있습니다.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--color-warning-light)", border: "1px solid var(--color-warning)" }}>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--color-warning)" }}>⚠ 법적 의무: 선임 신고 30일 이내 필수</p>
                <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
                  위탁 계약 후 <strong>선임일(계약일)로부터 30일 이내</strong>에 관할 지자체에 선임 신고서를 제출해야 하는 것은 <strong>법적 의무</strong>입니다 (미신고 시 과태료 100만원).
                  계약 후 선임 신고, 변경 신고 등 복잡한 행정 절차 전체를 <strong>제이앤지시스템이 무상으로 대행</strong>해 드립니다.
                </p>
              </div>
            </div>
          </div>

          {/* 관련 법령 */}
          <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--color-primary)" }}>관련 법령 목록</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold w-2/5">법령</th>
                  <th className="px-6 py-4 text-left font-semibold">주요 내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {laws.map(({ name, desc }) => (
                  <tr key={name} className="hover:bg-[var(--color-bg)]">
                    <td className="px-6 py-3.5 font-semibold" style={{ color: "var(--color-primary)" }}>{name}</td>
                    <td className="px-6 py-3.5" style={{ color: "var(--color-gray-600)" }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 관리주체 의무사항 */}
          <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--color-primary)" }}>관리주체 의무사항</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {obligations.map(({ title, color, items }) => (
              <div key={title} className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden">
                <div className="px-5 py-3" style={{ background: color + "12" }}>
                  <h3 className="text-sm font-bold" style={{ color }}>{title}</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-gray-600)" }}>
                        <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 유지보수관리기준 주요 점검 항목 */}
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>
            정보통신설비 유지보수관리기준 주요 점검 항목
          </h2>
          <p className="mb-5 text-sm" style={{ color: "var(--color-gray-600)" }}>
            과기정통부 고시 「정보통신설비 유지보수·관리기준」에 따라 반기별 1회 이상 아래 3개 영역을 점검하고 점검표에 기록해야 합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                title: "외관 점검",
                color: "var(--color-accent)",
                items: [
                  "설비 본체 외관 손상·변형·오염 여부",
                  "케이블 및 배선 상태 (단선·피복 손상 여부)",
                  "단자함·배관 등 설치 상태 및 고정 여부",
                  "라벨·표시 부착 상태",
                  "설비 설치 환경 (먼지·습도·온도) 확인",
                ],
              },
              {
                title: "기능 점검",
                color: "var(--color-success)",
                items: [
                  "설비 전원 투입 및 정상 기동 여부",
                  "통신·방송·정보 신호 정상 전달 여부",
                  "시스템 연동 동작 정상 여부 (출입통제·CCTV 등)",
                  "설비 제어반·표시등 정상 작동 확인",
                  "이상 경보 발생 여부 확인",
                ],
              },
              {
                title: "안전 상태 점검",
                color: "#7C3AED",
                items: [
                  "접지 상태 및 접지 저항값 이상 여부",
                  "통신용 전원설비 전압·전류 정상 여부",
                  "소방·방재 관련 설비 연계 상태",
                  "보호 커버·잠금장치 상태",
                  "설비 주변 안전 통로 확보 여부",
                ],
              },
            ].map(({ title, color, items }) => (
              <div key={title} className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden">
                <div className="px-5 py-3" style={{ background: color + "12" }}>
                  <h3 className="text-sm font-bold" style={{ color }}>{title}</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-gray-600)" }}>
                        <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-10 rounded-xl p-4" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-gray-600)" }}>
              ※ 점검 결과는 「정보통신설비 유지보수·관리 점검표」 공식 양식에 기록하고, 이상 발견 시 관리주체에게 즉시 통보해야 합니다.
              점검표 미작성 또는 허위 작성 시 <strong>과태료 300만원</strong>이 부과됩니다.
            </p>
          </div>

          {/* 유지보수 관리자 선임 자격 기준 */}
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>
            정보통신설비 유지보수 관리자 선임 자격 기준
          </h2>
          <p className="mb-5 text-sm" style={{ color: "var(--color-gray-600)" }}>
            정보통신공사업법 시행령 제37조의2에 따라 건축물 규모별로 선임해야 하는 기술자 등급이 다릅니다.
            공사업자에게 위탁하면 해당 기준을 갖춘 기술자를 보유한 업체가 선임 간주를 처리합니다.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold">기술자 등급</th>
                  <th className="px-6 py-4 text-left font-semibold">자격 기준</th>
                  <th className="px-6 py-4 text-left font-semibold">적용 범위</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {selectionRows.map(({ grade, desc, scope }) => (
                  <tr key={grade} className="hover:bg-[var(--color-bg)]">
                    <td className="px-6 py-3.5 font-semibold" style={{ color: "var(--color-primary)" }}>{grade}</td>
                    <td className="px-6 py-3.5" style={{ color: "var(--color-gray-600)" }}>{desc}</td>
                    <td className="px-6 py-3.5 text-xs" style={{ color: "var(--color-gray-600)" }}>{scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow">
              <h3 className="text-sm font-bold mb-3" style={{ color: "var(--color-primary)" }}>직접 선임 시 유의사항</h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--color-gray-600)" }}>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-accent)]" />건축물 규모에 맞는 등급의 기술자 선임 필수</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-accent)]" /><strong>선임 전</strong> 20시간 이상의 인정교육 이수 필수 (이수 후 선임 가능)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-accent)]" />지자체에 선임 신고 서류 제출</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-accent)]" />관리자 변경 시 즉시 재신고</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[var(--color-border)] card-shadow">
              <h3 className="text-sm font-bold mb-3" style={{ color: "var(--color-primary)" }}>공사업자 위탁 시 선임 간주 요건</h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--color-gray-600)" }}>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-success)]" />정보통신공사업 등록 업체에 위탁계약 체결</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-success)]" />위탁계약서에 유지보수·관리 범위 명시</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-success)]" />업체 소속 기술자가 해당 등급 기준 충족</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-[var(--color-success)]" />위탁 계약 기간 동안 선임 간주 효과 유지</li>
              </ul>
            </div>
          </div>

          {/* 과태료 */}
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>과태료 부과 기준</h2>
          <div className="alert-deadline mb-5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={15} style={{ color: "var(--color-warning)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--color-warning)" }}>위반 항목별 중복 부과 가능</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
              위반 사항이 여러 개인 경우 항목별로 과태료가 합산 부과됩니다. 관리기준 미준수 + 기록 미작성 동시 발생 시 최대 600만원.
            </p>
          </div>
          <div className="overflow-x-auto mb-10">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold">위반 사항</th>
                  <th className="px-6 py-4 text-left font-semibold w-28">과태료</th>
                  <th className="px-6 py-4 text-left font-semibold w-32">근거 조항</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {penalties.map(({ violation, amount, law }) => (
                  <tr key={violation} className="hover:bg-[var(--color-bg)]">
                    <td className="px-6 py-4" style={{ color: "var(--color-gray-600)" }}>{violation}</td>
                    <td className="px-6 py-4 font-bold font-inter" style={{ color: "var(--color-warning)" }}>{amount}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "var(--color-gray-600)" }}>{law}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 유예기한 요약 */}
          <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--color-primary)" }}>시행 유예기한</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-primary)] text-white">
                  <th className="px-6 py-4 text-left font-semibold">건축물 규모</th>
                  <th className="px-6 py-4 text-left font-semibold">의무 이행 기한</th>
                  <th className="px-6 py-4 text-left font-semibold">의무 내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {[
                  { range: "연면적 3만㎡ 이상", deadline: "2025. 7. 18.", note: "유지보수·관리(반기 1회) + 성능점검(연 1회) + 기록보존 5년", urgent: true },
                  { range: "연면적 1만㎡ 이상 ~ 3만㎡ 미만", deadline: "2026. 7. 18.", note: "동일 의무 이행 — 올해 마감", urgent: true },
                  { range: "연면적 5천㎡ 이상 ~ 1만㎡ 미만", deadline: "2027. 7. 18.", note: "동일 의무 이행 — 사전 준비 권장" },
                ].map(({ range, deadline, note, urgent }) => (
                  <tr key={range} style={{ background: urgent ? "#fff8f5" : "white" }} className="hover:brightness-[0.98]">
                    <td className="px-6 py-4 font-medium" style={{ color: urgent ? "var(--color-warning)" : "var(--color-primary)" }}>{range}</td>
                    <td className="px-6 py-4 font-bold font-inter" style={{ color: urgent ? "var(--color-warning)" : "var(--color-gray-900)" }}>{deadline}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "var(--color-gray-600)" }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl px-5 py-4 flex items-start gap-3" style={{ background: "#fff8f5", border: "2px solid var(--color-warning)" }}>
            <AlertTriangle size={20} style={{ color: "var(--color-warning)" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--color-warning)" }}>
                🚨 연면적 3만㎡ 이상 대형 건축물 — 올해 7월 18일까지 최초 성능점검 완료 필수
              </p>
              <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
                2025년 7월 18일부터 제도가 시행된 3만㎡ 이상 건축물은 <strong>법령상 &apos;매년 1회 이상&apos; 성능점검</strong> 의무에 따라
                <strong> 2026년 7월 18일까지 최초 성능점검을 완료</strong>해야 합니다. 현재 2026년 4월이므로 약 3개월밖에 남지 않았습니다.
                점검 일정 확보가 늦어질수록 성수기 대기 시간이 길어질 수 있으니 지금 바로 상담하세요.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors">
              의무 이행 상담 신청 <ArrowRight size={16} />
            </Link>
            <Link href="/service" className="inline-flex items-center gap-2 px-6 py-3 border-2 font-bold rounded-xl hover:bg-[var(--color-bg)] transition-colors" style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
              유지보수 위탁 서비스 보기 <ArrowRight size={16} />
            </Link>
            <Link href="/faq" className="inline-flex items-center gap-2 px-6 py-3 border-2 font-bold rounded-xl hover:bg-[var(--color-bg)] transition-colors" style={{ borderColor: "var(--color-gray-300)", color: "var(--color-gray-600)" }}>
              실무 Q&A 확인 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
