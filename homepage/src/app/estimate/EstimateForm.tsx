"use client";

import { useState, useMemo } from "react";
import {
  Calculator, ChevronRight, Printer, Send,
  AlertCircle, CheckCircle2, Building2,
} from "lucide-react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   상수 · 데이터
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** 2026년도 엔지니어링 기술자 노임단가 (원/인) */
const LABOR_RATES = {
  특급: 343079,
  고급: 315288,
  중급: 283343,
  초급: 249574,
} as const;

type GradeKey = keyof typeof LABOR_RATES;

/**
 * 연면적 → 선임기준 등급 · 조정계수
 * 출처: KICA 대가산정 프로그램 (https://ictis.kica.or.kr/maintenance/calc/daega)
 * 5,000㎡ 단위, 1.15 ~ 2.80
 */
const GRADE_TABLE: { min: number; grade: GradeKey; factor: number }[] = [
  { min: 60000, grade: "특급", factor: 2.80 },
  { min: 55000, grade: "고급", factor: 2.65 },
  { min: 50000, grade: "고급", factor: 2.50 },
  { min: 45000, grade: "고급", factor: 2.35 },
  { min: 40000, grade: "고급", factor: 2.20 },
  { min: 35000, grade: "고급", factor: 2.05 },
  { min: 30000, grade: "고급", factor: 1.90 },
  { min: 25000, grade: "중급", factor: 1.75 },
  { min: 20000, grade: "중급", factor: 1.60 },
  { min: 15000, grade: "중급", factor: 1.45 },
  { min: 10000, grade: "초급", factor: 1.30 },
  { min:  5000, grade: "초급", factor: 1.15 },
];

/** 설비별 기준인원 (정보통신설비 유지보수·관리의 대가기준) */
const EQUIPMENT_GROUPS = [
  {
    category: "통신설비",
    color: "#1A4A8A",
    items: [
      { name: "케이블설비",                      personnel: 0.29 },
      { name: "배관설비",                        personnel: 0.58 },
      { name: "국선인입설비",                    personnel: 0.17 },
      { name: "단자함설비",                      personnel: 0.24 },
      { name: "이동통신구내선로설비",            personnel: 0.06 },
      { name: "전화설비",                        personnel: 0.10 },
      { name: "방송 공동수신 안테나 시설",       personnel: 0.89 },
      { name: "종합유선방송 구내전송선로설비",   personnel: 0.52 },
    ],
  },
  {
    category: "방송설비",
    color: "#0E9E6E",
    items: [
      { name: "방송음향설비",                    personnel: 0.50 },
    ],
  },
  {
    category: "정보설비",
    color: "#0070F3",
    items: [
      { name: "네트워크설비",                              personnel: 1.85 },
      { name: "전자출입(통제)시스템",                     personnel: 0.83 },
      { name: "원격검침시스템",                           personnel: 0.52 },
      { name: "주차관제시스템",                           personnel: 2.45 },
      { name: "주차유도시스템",                           personnel: 0.66 },
      { name: "무인택배시스템",                           personnel: 0.77 },
      { name: "비상벨설비",                               personnel: 0.44 },
      { name: "영상정보처리기기 시스템",                  personnel: 0.81 },
      { name: "홈네트워크 설비(전유부분포함)",            personnel: 0.03 },
      { name: "빌딩안내시스템(BIS)",                      personnel: 1.69 },
      { name: "전기시계시스템",                           personnel: 0.46 },
      { name: "통합 SI시스템",                            personnel: 0.46 },
      { name: "시설관리시스템(Facility Management System)", personnel: 0.54 },
      { name: "건물에너지관리시스템(BEMS)",               personnel: 0.76 },
      { name: "지능형 인원계수 시스템",                   personnel: 0.56 },
      { name: "지능형 경계 감시 시스템",                  personnel: 0.80 },
      { name: "스마트 병원 설비(의료용 너스콜)",          personnel: 2.12 },
      { name: "스마트 도난방지 시스템",                   personnel: 0.17 },
      { name: "스마트 공장 시스템",                       personnel: 0.31 },
      { name: "스마트 도서관 시스템",                     personnel: 0.52 },
      { name: "지능형 이상음원 시스템",                   personnel: 0.64 },
      { name: "IoT기반 지하공간 안전관리 시스템",         personnel: 0.13 },
      { name: "디지털 사이니지",                          personnel: 0.56 },
    ],
  },
  {
    category: "기타설비",
    color: "#E85C0D",
    items: [
      { name: "통신용 전원설비",  personnel: 1.66 },
      { name: "통신접지설비",     personnel: 0.12 },
    ],
  },
];

const EQUIPMENT_MAP: Record<string, number> = Object.fromEntries(
  EQUIPMENT_GROUPS.flatMap(g => g.items.map(i => [i.name, i.personnel]))
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   유틸 함수
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function parseArea(raw: string): number {
  return parseInt(raw.replace(/,/g, ""), 10) || 0;
}

function getGradeInfo(area: number) {
  if (area < 5000) return null;
  return GRADE_TABLE.find(r => area >= r.min) ?? null;
}

type QuoteResult = {
  grade: GradeKey;
  rate: number;
  factor: number;
  totalPers: number;
  labor: number;
  overhead: number;
  tech: number;
  vat: number;
  total: number;
};

/**
 * 대가 산정 공식 (KICA 기준)
 * 직접인건비 = 노임단가 × 기준인원합계 × 조정계수
 * 제경비     = 직접인건비 × 110%
 * 기술료     = (직접인건비 + 제경비) × 20%
 * 부가가치세 = (직접인건비 + 제경비 + 기술료) × 10%
 * 합계       = 직접인건비 + 제경비 + 기술료 + VAT (만원단위절사)
 */
function calcQuote(area: number, equipment: string[]): QuoteResult | null {
  const gi = getGradeInfo(area);
  if (!gi || equipment.length === 0) return null;

  const totalPers =
    Math.round(equipment.reduce((s, n) => s + (EQUIPMENT_MAP[n] ?? 0), 0) * 100) / 100;

  const rate     = LABOR_RATES[gi.grade];
  const labor    = Math.round(rate * totalPers * gi.factor);
  const overhead = Math.round(labor * 1.10);
  const tech     = Math.round((labor + overhead) * 0.20);
  const vat      = Math.round((labor + overhead + tech) * 0.10);
  const total    = Math.floor((labor + overhead + tech + vat) / 10000) * 10000;

  return { grade: gi.grade, rate, factor: gi.factor, totalPers, labor, overhead, tech, vat, total };
}

function fmt(n: number): string { return n.toLocaleString("ko-KR"); }

// ⚠️ Web3Forms 무료플랜은 등록 이메일로 발송됩니다.
// 견적 신청 전용 이메일 수신을 원하시면 web3forms.com에서 sales@jngsystem.co.kr로 키를 재발급 받으세요.
const WEB3FORMS_KEY = "08ac26e2-da08-4bbd-8871-ca08b59572f0";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   메인 컴포넌트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function EstimateForm() {
  const [buildingName,    setBuildingName]    = useState("");
  const [buildingAddress, setBuildingAddress] = useState("");
  const [buildingArea,    setBuildingArea]    = useState("");
  const [companyName,     setCompanyName]     = useState("");
  const [contactName,     setContactName]     = useState("");
  const [phone,           setPhone]           = useState("");
  const [email,           setEmail]           = useState("");
  const [equipment,       setEquipment]       = useState<string[]>([]);
  const [message,         setMessage]         = useState("");
  const [submitted,       setSubmitted]       = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

  const area      = useMemo(() => parseArea(buildingArea), [buildingArea]);
  const gradeInfo = useMemo(() => getGradeInfo(area), [area]);
  const quote     = useMemo(() => calcQuote(area, equipment), [area, equipment]);

  const toggleEq = (name: string) =>
    setEquipment(prev =>
      prev.includes(name) ? prev.filter(e => e !== name) : [...prev, name]
    );

  const toggleAll = (names: string[], on: boolean) =>
    setEquipment(prev => {
      const without = prev.filter(e => !names.includes(e));
      return on ? [...without, ...names] : without;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[견적신청] ${buildingName || "건물명미입력"} / ${fmt(area)}㎡ / 예상 ${fmt(quote.total)}원`,
          from_name: "제이앤지시스템 홈페이지",
          "신청유형": "자동 견적 계산 신청",
          "■ 건물명": buildingName || "미입력",
          "■ 소재지": buildingAddress || "미입력",
          "■ 연면적": `${fmt(area)}㎡`,
          "■ 선임기준": `${quote.grade}기술자 / 조정계수 ${quote.factor} / 단가 ${fmt(quote.rate)}원`,
          "■ 기준인원 합계": `${quote.totalPers}인 (${equipment.length}개 설비)`,
          "■ 회사명": companyName || "미입력",
          "■ 담당자명": contactName,
          "■ 연락처": phone,
          "■ 이메일(견적발송)": email,
          "━ 견적 내역 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━": "─",
          "① 직접인건비": `${fmt(quote.labor)}원`,
          "② 직접경비": "해당없음 (0원)",
          "③ 제경비 (110%)": `${fmt(quote.overhead)}원`,
          "④ 기술료 (20%)": `${fmt(quote.tech)}원`,
          "⑤ 부가가치세 (10%)": `${fmt(quote.vat)}원`,
          "【합계 VAT포함·만원절사】": `${fmt(quote.total)}원`,
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━": "─",
          "▶ 선택 설비 목록": equipment.join(", ") || "미선택",
          "▶ 문의사항": message || "없음",
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "var(--color-accent-light)" }}
        >
          <CheckCircle2 size={40} style={{ color: "var(--color-accent)" }} />
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--color-primary)" }}>
          견적 신청이 완료되었습니다
        </h3>
        <p className="text-base mb-1" style={{ color: "var(--color-gray-600)" }}>
          담당자가 견적서를 검토 후 이메일로 발송드립니다.
        </p>
        <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
          영업일 기준 1일 이내 연락드립니다. (대표번호: 02-3444-3570)
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent bg-white";
  const labelCls = "block text-sm font-semibold mb-1.5";

  return (
    <>
      {/* 인쇄용 견적서 — 화면: hidden / 인쇄: block */}
      {quote && (
        <PrintableQuote
          quote={quote} area={area}
          buildingName={buildingName} buildingAddress={buildingAddress}
          contactName={contactName} companyName={companyName}
          phone={phone} email={email} equipment={equipment}
        />
      )}

      {/* 화면 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start print:hidden">

        {/* ── 좌측: 입력 폼 ── */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ① 건물 정보 */}
          <section>
            <SectionTitle num="①" title="건물 정보" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                    건물명 (상호) <Req />
                  </label>
                  <input
                    type="text" required placeholder="예: 한국정보통신빌딩"
                    value={buildingName} onChange={e => setBuildingName(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                    회사명 <Req />
                  </label>
                  <input
                    type="text" required placeholder="귀사 회사명"
                    value={companyName} onChange={e => setCompanyName(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                  건물 소재지 <Req />
                </label>
                <input
                  type="text" required placeholder="예: 서울특별시 강남구 ○○로 00"
                  value={buildingAddress} onChange={e => setBuildingAddress(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* 연면적 입력 */}
              <div>
                <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                  건물 연면적 <Req />
                  <span className="text-xs font-normal ml-2" style={{ color: "var(--color-gray-600)" }}>
                    건축물대장 기준 (㎡)
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text" inputMode="numeric" required
                    placeholder="예: 35,000"
                    value={buildingArea}
                    onChange={e => {
                      const d = e.target.value.replace(/[^0-9]/g, "");
                      setBuildingArea(d ? parseInt(d).toLocaleString("ko-KR") : "");
                    }}
                    className={`${inputCls} pr-10`}
                  />
                  <span
                    className="absolute right-3 text-sm font-semibold pointer-events-none"
                    style={{ color: "var(--color-gray-600)" }}
                  >
                    ㎡
                  </span>
                </div>

                {/* 선임기준 자동 표시 */}
                {gradeInfo && (
                  <div
                    className="mt-2 flex flex-wrap gap-3 px-3 py-2.5 rounded-lg text-xs"
                    style={{
                      background: "var(--color-accent-light)",
                      borderLeft: "3px solid var(--color-accent)",
                    }}
                  >
                    <span className="font-bold" style={{ color: "var(--color-accent)" }}>
                      선임기준: {gradeInfo.grade}기술자
                    </span>
                    <span style={{ color: "var(--color-primary)" }}>
                      조정계수: {gradeInfo.factor}
                    </span>
                    <span style={{ color: "var(--color-gray-600)" }}>
                      단가: {fmt(LABOR_RATES[gradeInfo.grade])}원/인
                    </span>
                  </div>
                )}
                {area > 0 && area < 5000 && (
                  <p
                    className="mt-2 text-xs flex items-center gap-1"
                    style={{ color: "#E85C0D" }}
                  >
                    <AlertCircle size={12} />
                    연면적 5,000㎡ 미만은 의무 적용 대상이 아닙니다.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ② 설비 선택 */}
          <section>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
                  ② 점검 대상 설비 선택
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-gray-600)" }}>
                  건축물에 설치된 설비에 모두 체크해주세요
                </p>
              </div>
              {equipment.length > 0 && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                >
                  {equipment.length}개 선택
                </span>
              )}
            </div>

            <div className="space-y-5 border border-[var(--color-border)] rounded-xl p-4">
              {EQUIPMENT_GROUPS.map(group => {
                const names = group.items.map(i => i.name);
                const allOn  = names.every(n => equipment.includes(n));
                const someOn = names.some(n => equipment.includes(n));
                return (
                  <div key={group.category}>
                    <div
                      className="flex items-center gap-2 mb-2.5 pb-1.5"
                      style={{ borderBottom: `2px solid ${group.color}20` }}
                    >
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: `${group.color}15`, color: group.color }}
                      >
                        {group.category}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-gray-600)" }}>
                        {group.items.length}개
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAll(names, !allOn)}
                        className="ml-auto text-xs underline underline-offset-2"
                        style={{ color: someOn ? group.color : "var(--color-gray-600)" }}
                      >
                        {allOn ? "전체 해제" : "전체 선택"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {group.items.map(item => {
                        const on = equipment.includes(item.name);
                        return (
                          <label
                            key={item.name}
                            className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-all"
                            style={{
                              background: on ? `${group.color}10` : "transparent",
                              border: `1px solid ${on ? group.color + "40" : "transparent"}`,
                              color: on ? group.color : "var(--color-gray-600)",
                              fontWeight: on ? 600 : 400,
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox" checked={on}
                                onChange={() => toggleEq(item.name)}
                                className="w-4 h-4 rounded"
                                style={{ accentColor: group.color }}
                              />
                              <span>{item.name}</span>
                            </div>
                            <span className="text-xs opacity-50 font-mono tabular-nums">
                              {item.personnel}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ③ 담당자 정보 */}
          <section>
            <SectionTitle num="③" title="담당자 정보" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                    담당자명 <Req />
                  </label>
                  <input
                    type="text" required placeholder="홍길동"
                    value={contactName} onChange={e => setContactName(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                    연락처 <Req />
                  </label>
                  <input
                    type="tel" required placeholder="010-0000-0000"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className={`${inputCls} font-inter`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                  이메일 <Req />
                  <span className="text-xs font-normal ml-1" style={{ color: "var(--color-gray-600)" }}>
                    (견적서 발송 주소)
                  </span>
                </label>
                <input
                  type="email" required placeholder="email@company.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={`${inputCls} font-inter`}
                />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--color-primary)" }}>
                  추가 문의사항
                </label>
                <textarea
                  rows={3}
                  placeholder="추가로 문의하실 내용을 자유롭게 작성해주세요."
                  value={message} onChange={e => setMessage(e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </section>

          <p className="text-xs" style={{ color: "var(--color-gray-600)" }}>
            제출하신 정보는 견적 및 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !quote}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white font-bold rounded-xl text-base transition-all disabled:cursor-not-allowed"
            style={{
              background: quote ? "var(--color-accent)" : "var(--color-gray-300)",
            }}
            onMouseEnter={e => {
              if (quote && !loading) e.currentTarget.style.background = "var(--color-primary-mid)";
            }}
            onMouseLeave={e => {
              if (quote) e.currentTarget.style.background = "var(--color-accent)";
            }}
          >
            <Send size={18} />
            {loading
              ? "전송 중..."
              : !gradeInfo
              ? "연면적을 입력해주세요"
              : equipment.length === 0
              ? "설비를 1개 이상 선택해주세요"
              : `견적 신청하기 — ${fmt(quote?.total ?? 0)}원 (VAT 포함)`}
          </button>
        </form>

        {/* ── 우측: 실시간 견적 패널 ── */}
        <div className="lg:sticky lg:top-20">
          <QuotePanel
            quote={quote} gradeInfo={gradeInfo} area={area}
            buildingName={buildingName} equipment={equipment}
          />
        </div>
      </div>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   서브 컴포넌트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function Req() {
  return <span style={{ color: "var(--color-warning)" }}>*</span>;
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <h3
      className="text-base font-bold mb-4 pb-2 border-b border-[var(--color-border)]"
      style={{ color: "var(--color-primary)" }}
    >
      {num} {title}
    </h3>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   견적 패널 (우측 sticky)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function QuotePanel({
  quote, gradeInfo, area, buildingName, equipment,
}: {
  quote: QuoteResult | null;
  gradeInfo: ReturnType<typeof getGradeInfo>;
  area: number;
  buildingName: string;
  equipment: string[];
}) {
  const rows: { label: string; value: number; note: string }[] = quote
    ? [
        {
          label: "① 직접인건비",
          value: quote.labor,
          note: `${quote.grade} ${fmt(quote.rate)}원 × ${quote.totalPers}인 × ${quote.factor}`,
        },
        { label: "② 직접경비", value: 0, note: "해당없음" },
        { label: "③ 제경비 (110%)", value: quote.overhead, note: "① × 110%" },
        { label: "④ 기술료 (20%)", value: quote.tech, note: "(①+③) × 20%" },
        { label: "⑤ 부가가치세 (10%)", value: quote.vat, note: "(①+③+④) × 10%" },
      ]
    : [];

  return (
    <div
      className="rounded-2xl border-2 overflow-hidden"
      style={{ borderColor: quote ? "var(--color-accent)" : "var(--color-border)" }}
    >
      {/* 패널 헤더 */}
      <div
        className="px-5 py-4 flex items-center gap-2"
        style={{ background: quote ? "var(--color-accent)" : "var(--color-gray-100)" }}
      >
        <Calculator size={18} style={{ color: quote ? "white" : "var(--color-gray-600)" }} />
        <span
          className="font-bold text-sm"
          style={{ color: quote ? "white" : "var(--color-gray-600)" }}
        >
          실시간 대가 계산
        </span>
        {quote && (
          <span className="ml-auto text-xs text-white opacity-80">KICA 기준 자동 산출</span>
        )}
      </div>

      <div className="p-5 bg-white space-y-4">

        {/* 빈 상태 */}
        {!gradeInfo && (
          <div className="text-center py-10">
            <Building2 size={40} className="mx-auto mb-3" style={{ color: "var(--color-gray-300)" }} />
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-gray-600)" }}>
              연면적을 입력하시면<br />대가가 자동으로 계산됩니다
            </p>
          </div>
        )}

        {/* 등급 확인됨 · 설비 미선택 */}
        {gradeInfo && !quote && (
          <div className="space-y-3">
            <div
              className="px-3 py-3 rounded-lg text-xs space-y-1"
              style={{ background: "var(--color-accent-light)" }}
            >
              <div className="font-bold" style={{ color: "var(--color-accent)" }}>
                선임기준: {gradeInfo.grade}기술자
              </div>
              <div style={{ color: "var(--color-primary)" }}>
                조정계수: {gradeInfo.factor} &nbsp;·&nbsp; 단가: {fmt(LABOR_RATES[gradeInfo.grade])}원/인
              </div>
            </div>
            <p className="text-center text-sm py-4" style={{ color: "var(--color-gray-600)" }}>
              설비를 선택하시면 견적금액이 산출됩니다
            </p>
          </div>
        )}

        {/* 견적 결과 */}
        {quote && (
          <>
            {/* 건물 요약 */}
            <div className="text-xs space-y-1.5 pb-3 border-b border-[var(--color-border)]">
              {buildingName && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-gray-600)" }}>건물명</span>
                  <span className="font-semibold" style={{ color: "var(--color-primary)" }}>{buildingName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: "var(--color-gray-600)" }}>연면적</span>
                <span className="font-semibold">{fmt(area)}㎡</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-gray-600)" }}>선임기준</span>
                <span className="font-semibold">{quote.grade}기술자 / 조정계수 {quote.factor}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-gray-600)" }}>기준인원 합계</span>
                <span className="font-semibold">{quote.totalPers}인 ({equipment.length}개 설비)</span>
              </div>
            </div>

            {/* 산출 내역 */}
            <div className="space-y-1.5">
              {rows.map(row => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-2 py-1.5 border-b border-dashed border-[var(--color-border)]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold" style={{ color: "var(--color-gray-900)" }}>
                      {row.label}
                    </div>
                    <div className="text-xs leading-tight" style={{ color: "var(--color-gray-600)" }}>
                      {row.note}
                    </div>
                  </div>
                  <div
                    className="text-xs font-bold text-right shrink-0"
                    style={{ color: row.value === 0 ? "var(--color-gray-300)" : "var(--color-primary)" }}
                  >
                    {row.value === 0 ? "—" : `${fmt(row.value)}원`}
                  </div>
                </div>
              ))}
            </div>

            {/* 합계 박스 */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "var(--color-primary)" }}
            >
              <div className="text-white">
                <div className="text-xs opacity-70">합계 (VAT 포함 · 만원 단위 절사)</div>
                <div className="font-bold text-xl">
                  {fmt(quote.total)}
                  <span className="text-sm font-normal ml-1">원</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-white opacity-50" />
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "var(--color-gray-600)" }}>
              ※ KICA 대가산정 기준 예상 금액이며, 실제 계약금액과 차이가 있을 수 있습니다.
            </p>

            {/* 인쇄/PDF 저장 버튼 */}
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--color-accent-light)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <Printer size={15} /> 견적서 출력 / PDF 저장
            </button>
          </>
        )}

        {/* 관리자 선임 안내 */}
        <div
          className="rounded-lg px-3 py-2.5 text-xs space-y-0.5"
          style={{ background: "var(--color-gray-100)" }}
        >
          <div className="font-semibold" style={{ color: "var(--color-primary)" }}>
            관리자 위탁선임 대가
          </div>
          <div style={{ color: "var(--color-gray-600)" }}>
            기술자 등급·근무형태에 따라 별도 산정 — 신청 후 담당자가 안내드립니다.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   인쇄용 견적서 (화면: hidden / 인쇄: block)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PrintableQuote({
  quote, area, buildingName, buildingAddress,
  contactName, companyName, phone, email, equipment,
}: {
  quote: QuoteResult;
  area: number;
  buildingName: string;
  buildingAddress: string;
  contactName: string;
  companyName: string;
  phone: string;
  email: string;
  equipment: string[];
}) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const td = (opts: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #555",
    padding: "5px 8px",
    ...opts,
  });

  return (
    <div
      className="hidden print:block"
      style={{ fontFamily: "'Malgun Gothic', '맑은 고딕', serif", fontSize: "10pt", color: "#111", margin: "0 auto", maxWidth: "700px" }}
    >
      {/* 제목 */}
      <div style={{ textAlign: "center", borderBottom: "3px double #111", paddingBottom: "10px", marginBottom: "14px" }}>
        <div style={{ fontSize: "8pt", marginBottom: "4px", color: "#444" }}>
          정보통신설비 유지보수·관리 및 성능점검 전문기업
        </div>
        <div style={{ fontSize: "18pt", fontWeight: "bold", letterSpacing: "0.15em" }}>
          유지보수·관리 및 성능점검 견적서
        </div>
        <div style={{ fontSize: "8.5pt", marginTop: "4px", color: "#555" }}>
          제이앤지시스템 &nbsp;|&nbsp; Tel. 02-3444-3570 &nbsp;|&nbsp; jngsystem.com
        </div>
      </div>

      {/* 건물·담당자 정보 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "9pt" }}>
        <tbody>
          <tr>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold", width: "18%" }}>건물명</td>
            <td style={{ ...td(), width: "32%" }}>{buildingName || "—"}</td>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold", width: "18%" }}>연면적</td>
            <td style={{ ...td() }}>{fmt(area)}㎡</td>
          </tr>
          <tr>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold" }}>소재지</td>
            <td colSpan={3} style={{ ...td() }}>{buildingAddress || "—"}</td>
          </tr>
          <tr>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold" }}>담당자</td>
            <td style={{ ...td() }}>{companyName} &nbsp; {contactName}</td>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold" }}>연락처</td>
            <td style={{ ...td() }}>{phone}</td>
          </tr>
          <tr>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold" }}>견적일자</td>
            <td style={{ ...td() }}>{today}</td>
            <td style={{ ...td(), background: "#e8eef8", fontWeight: "bold" }}>이메일</td>
            <td style={{ ...td() }}>{email}</td>
          </tr>
        </tbody>
      </table>

      {/* 견적 내역 테이블 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "9.5pt" }}>
        <thead>
          <tr style={{ background: "#cdd9f0" }}>
            <th style={{ ...td(), textAlign: "left", width: "45%" }}>항목</th>
            <th style={{ ...td(), textAlign: "center", width: "8%" }}>단위</th>
            <th style={{ ...td(), textAlign: "center", width: "12%" }}>수량</th>
            <th style={{ ...td(), textAlign: "right", width: "15%" }}>단가</th>
            <th style={{ ...td(), textAlign: "right", width: "20%" }}>금액 (원)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td()}>
              1. 직접인건비
              <div style={{ fontSize: "8pt", color: "#555", marginTop: "2px" }}>
                {quote.grade}기술자 &nbsp; 기준인원 {quote.totalPers}인 &nbsp; 조정계수 {quote.factor}
              </div>
            </td>
            <td style={{ ...td(), textAlign: "center" }}>인</td>
            <td style={{ ...td(), textAlign: "center" }}>{quote.totalPers}</td>
            <td style={{ ...td(), textAlign: "right" }}>{fmt(quote.rate)}</td>
            <td style={{ ...td(), textAlign: "right" }}>{fmt(quote.labor)}</td>
          </tr>
          <tr>
            <td style={td()}>2. 직접경비</td>
            <td style={{ ...td(), textAlign: "center" }}>식</td>
            <td style={{ ...td(), textAlign: "center" }}>—</td>
            <td style={{ ...td(), textAlign: "right" }}>—</td>
            <td style={{ ...td(), textAlign: "right" }}>—</td>
          </tr>
          <tr>
            <td style={td()}>3. 제경비 &nbsp; (① × 110%)</td>
            <td style={{ ...td(), textAlign: "center" }}>식</td>
            <td style={{ ...td(), textAlign: "center" }}>1</td>
            <td style={{ ...td(), textAlign: "right" }}>110%</td>
            <td style={{ ...td(), textAlign: "right" }}>{fmt(quote.overhead)}</td>
          </tr>
          <tr>
            <td style={td()}>4. 기술료 &nbsp; ((①+③) × 20%)</td>
            <td style={{ ...td(), textAlign: "center" }}>식</td>
            <td style={{ ...td(), textAlign: "center" }}>1</td>
            <td style={{ ...td(), textAlign: "right" }}>20%</td>
            <td style={{ ...td(), textAlign: "right" }}>{fmt(quote.tech)}</td>
          </tr>
          <tr>
            <td style={td()}>5. 부가가치세 &nbsp; ((①+③+④) × 10%)</td>
            <td style={{ ...td(), textAlign: "center" }}>식</td>
            <td style={{ ...td(), textAlign: "center" }}>1</td>
            <td style={{ ...td(), textAlign: "right" }}>10%</td>
            <td style={{ ...td(), textAlign: "right" }}>{fmt(quote.vat)}</td>
          </tr>
          <tr style={{ background: "#cdd9f0" }}>
            <td
              colSpan={4}
              style={{ ...td(), fontWeight: "bold", textAlign: "right", fontSize: "10.5pt", border: "2px solid #444" }}
            >
              합 계 &nbsp; (VAT 포함 · 만원 단위 절사)
            </td>
            <td
              style={{ ...td(), fontWeight: "bold", textAlign: "right", fontSize: "13pt", border: "2px solid #444" }}
            >
              {fmt(quote.total)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 선택 설비 목록 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "8.5pt" }}>
        <tbody>
          <tr>
            <td
              style={{ ...td(), background: "#e8eef8", fontWeight: "bold", width: "20%", verticalAlign: "top" }}
            >
              점검 대상 설비<br />
              <span style={{ fontWeight: "normal", color: "#555" }}>({equipment.length}개)</span>
            </td>
            <td style={{ ...td(), lineHeight: "1.9" }}>
              {equipment.join(", ") || "—"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 비고 */}
      <div
        style={{
          fontSize: "8pt", color: "#555", lineHeight: "2.0",
          borderTop: "1px solid #aaa", paddingTop: "8px", marginTop: "4px",
        }}
      >
        <strong style={{ color: "#111" }}>비 고</strong>
        <ol style={{ margin: "4px 0 0 16px", padding: 0 }}>
          <li>직접인건비는 2026년도 엔지니어링기술자 노임단가표를 적용합니다.</li>
          <li>본 견적은 KICA(한국정보통신공사협회) 대가산정 프로그램 기준에 따라 산출되었습니다.</li>
          <li>관리주체의 요구에 의해 업무범위가 변경될 경우, 당사자 간 합의하여 대가를 다시 산정할 수 있습니다.</li>
          <li>관리자 위탁선임 대가는 기술자 등급 및 근무형태에 따라 별도 협의 후 결정합니다.</li>
          <li>정보통신공사업 「유지관리기준」 및 「엔지니어링산업진흥법」 규정에 따른 기준 단가를 적용합니다.</li>
        </ol>
      </div>
    </div>
  );
}
