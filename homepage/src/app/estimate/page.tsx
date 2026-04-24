import type { Metadata } from "next";
import EstimateForm from "./EstimateForm";

export const metadata: Metadata = {
  title: "무료 견적 계산 | 정보통신설비 유지보수·관리 — 제이앤지시스템",
  description:
    "연면적과 보유 설비를 입력하면 KICA 대가산정 기준에 따라 유지보수·관리 및 성능점검 대가를 즉시 자동 계산합니다. 제이앤지시스템에 무료 견적을 신청하세요.",
  keywords: [
    "정보통신설비 견적",
    "유지보수 견적",
    "성능점검 견적",
    "대가산정",
    "KICA 대가산정",
  ],
  alternates: { canonical: "https://jngsystem.com/estimate" },
  openGraph: {
    title: "무료 견적 계산 | 정보통신설비 유지보수·관리 — 제이앤지시스템",
    description: "연면적과 보유 설비를 입력하면 KICA 대가산정 기준에 따라 유지보수·관리 및 성능점검 대가를 즉시 자동 계산합니다.",
    url: "https://jngsystem.com/estimate",
  },
  twitter: {
    card: "summary_large_image",
    title: "정보통신설비 유지보수·성능점검 무료 견적 계산 — KICA 기준 자동산출",
    description: "연면적·설비 선택만 하면 KICA 대가산정 기준으로 즉시 계산. 직접인건비·제경비·기술료·VAT 항목별 내역 제공.",
  },
};

export default function EstimatePage() {
  return (
    <main>
      {/* ── 히어로 ── */}
      <section
        className="text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, " +
            "linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, " +
            "linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)",
        }}
      >
        <div className="container-main">
          <p className="text-sm font-semibold mb-3 uppercase tracking-widest opacity-70">
            Free Estimate
          </p>
          <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
            무료 견적 자동 계산
          </h1>
          <p className="text-base leading-relaxed opacity-85 max-w-xl mb-6">
            연면적과 보유 설비를 선택하시면 <strong>KICA 대가산정 기준</strong>에 따라
            유지보수·관리 및 성능점검 대가를 즉시 산출합니다.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              "직접인건비 · 제경비 · 기술료 · 부가가치세 항목별 내역",
              "만원 단위 절사 자동 적용",
              "견적서 즉시 출력 (PDF 저장)",
            ].map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 안내 배너 ── */}
      <div style={{ background: "var(--color-warning-light)", borderBottom: "1px solid #E85C0D30" }}>
        <div className="container-main py-3">
          <p className="text-sm" style={{ color: "#E85C0D" }}>
            <strong>※ 관리자 위탁선임 대가</strong>는 기술자 등급·근무형태에 따라 별도 산정되며,
            견적 신청 후 담당자가 안내드립니다.
          </p>
        </div>
      </div>

      {/* ── 본문 ── */}
      <section className="py-12 md:py-16" style={{ background: "var(--color-bg)" }}>
        <div className="container-main">
          <EstimateForm />
        </div>
      </section>

      {/* ── 하단 신뢰 지표 ── */}
      <section className="py-10 border-t border-[var(--color-border)]" style={{ background: "white" }}>
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
            {[
              {
                icon: "📋",
                title: "KICA 공식 기준",
                desc: "한국정보통신공사협회 대가산정 프로그램과 동일한 계산 공식 적용",
              },
              {
                icon: "🔒",
                title: "승인 후 발송",
                desc: "담당자가 견적을 검토·확인한 후 공식 견적서를 이메일로 발송",
              },
              {
                icon: "💬",
                title: "당일 회신",
                desc: "영업일 기준 1일 이내 담당자가 연락드립니다. 02-3444-3570",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="text-2xl">{item.icon}</div>
                <div className="font-bold" style={{ color: "var(--color-primary)" }}>{item.title}</div>
                <div style={{ color: "var(--color-gray-600)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
