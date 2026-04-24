"use client";

import { useState } from "react";
import { Send, CheckCircle2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

/* ─────────────────────────────────────────────── */

export const EQUIPMENT_GROUPS = [
  {
    category: "통신설비",
    color: "#1A4A8A",
    items: [
      "케이블 설비",
      "배관 설비",
      "국선인입 설비",
      "단자함 설비",
      "이동통신 구내선로 설비",
      "전화 설비",
      "방송 공동수신 안테나 시설",
      "종합유선방송 구내 전송선로 설비",
    ],
  },
  {
    category: "방송설비",
    color: "#0E9E6E",
    items: ["방송 음향 설비"],
  },
  {
    category: "정보설비",
    color: "#0070F3",
    items: [
      "네트워크 설비",
      "전자출입(통제) 시스템",
      "원격검침 시스템",
      "주차관제 시스템",
      "주차유도 시스템",
      "무인택배 시스템",
      "비상벨 설비",
      "영상정보처리기기 시스템(CCTV)",
      "홈네트워크 설비",
      "빌딩 안내 시스템(BIS)",
      "전기시계시스템",
      "통합 SI시스템",
      "시설관리시스템",
      "건물에너지관리시스템(BEMS)",
      "지능형 인원계수 시스템",
      "지능형 경계 감시 시스템",
      "스마트 병원 설비(의료용 너스콜)",
      "스마트 도난방지 시스템",
      "스마트 공장 시스템",
      "스마트 도서관 시스템",
      "지능형 이상음원 시스템",
      "IoT기반 지하공간 안전관리 시스템",
      "디지털 사이니지",
    ],
  },
  {
    category: "기타설비",
    color: "#E85C0D",
    items: ["통신용 전원 설비", "통신 접지 설비"],
  },
];

export const SERVICE_SCOPE_CONFIG = [
  { id: "maintenance", label: "유지보수관리 대행", desc: "반기 1회 관리점검 대행" },
  { id: "inspection",  label: "성능점검 대행",     desc: "연 1회 성능점검 대행" },
  { id: "manager",     label: "관리자 위탁선임",   desc: "선임 간주 처리 및 신고 대행" },
];

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: {
          address: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
      }) => { open: () => void };
    };
  }
}

/* 연면적 → 의무 구간 자동 판별 */
function getAreaInfo(raw: string) {
  const num = parseInt(raw.replace(/,/g, ""), 10);
  if (!num || isNaN(num)) return null;
  if (num >= 30000) return { range: "연면적 3만㎡ 이상",   deadline: "2025.7.18 시행 중", color: "var(--color-success)", urgent: false };
  if (num >= 10000) return { range: "연면적 1만~3만㎡",    deadline: "2026.7.18 마감",    color: "#E85C0D",              urgent: true  };
  if (num >=  5000) return { range: "연면적 5천~1만㎡",    deadline: "2027.7.18",         color: "var(--color-accent)",  urgent: false };
  return               { range: "연면적 5천㎡ 미만",    deadline: "대상 여부 확인 필요", color: "var(--color-gray-600)", urgent: false };
}

const WEB3FORMS_KEY      = "08ac26e2-da08-4bbd-8871-ca08b59572f0";
const RATE_LIMIT_MS      = 60_000; // 1분
const RATE_LIMIT_BASIC   = "last_submit_time";
const RATE_LIMIT_DETAIL  = "last_submit_time_detail";

/* 공통 유틸: 카카오 주소 검색 */
function openAddressSearch(onComplete: (full: string) => void) {
  if (typeof window !== "undefined" && window.daum) {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.address;
        let extra = "";
        if (data.addressType === "R") {
          if (data.bname)        extra += data.bname;
          if (data.buildingName) extra += extra ? `, ${data.buildingName}` : data.buildingName;
          fullAddress += extra ? ` (${extra})` : "";
        }
        onComplete(fullAddress);
      },
    }).open();
  } else {
    alert("주소 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
  }
}

/* 공통 완료 화면 */
function SubmitSuccess() {
  return (
    <div className="text-center py-10">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "var(--color-accent-light)" }}
      >
        <CheckCircle2 size={32} style={{ color: "var(--color-accent)" }} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
        상담 신청이 완료되었습니다
      </h3>
      <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
        영업일 기준 1일 이내에 담당자가 연락드립니다.
      </p>
    </div>
  );
}

/* 공통 스타일 */
const inputClass =
  "w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg " +
  "focus:outline-none focus:ring-2 focus:border-transparent bg-white";
const focusStyle = { "--tw-ring-color": "var(--color-accent)" } as React.CSSProperties;
const labelClass = "block text-sm font-semibold mb-1.5";

/* ─────────────────────────────────────────────── */
/*   기본 상담 신청 폼                               */
/* ─────────────────────────────────────────────── */

type BasicForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  buildingArea: string;
  buildingAddress: string;
  message: string;
};

function BasicContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [form,      setForm]      = useState<BasicForm>({
    name: "", company: "", phone: "", email: "",
    buildingArea: "", buildingAddress: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /* 클라이언트 사이드 Rate Limiting */
      const now  = Date.now();
      const last = localStorage.getItem(RATE_LIMIT_BASIC);
      if (last && now - parseInt(last) < RATE_LIMIT_MS) {
        const sec = Math.ceil((RATE_LIMIT_MS - (now - parseInt(last))) / 1000);
        setError(`${sec}초 후에 다시 시도해주세요. (전송 제한 1분)`);
        setLoading(false);
        return;
      }

      const areaLabel = form.buildingArea
        ? `${form.buildingArea}㎡ (${getAreaInfo(form.buildingArea)?.range ?? "확인 필요"})`
        : "미입력";

      const payload = {
        subject:        `[상담신청] ${form.company} — 정보통신설비 성능점검`,
        from_name:      "제이앤지시스템 홈페이지",
        "신청유형":     "상담신청",
        name:           form.name,
        "회사·건물명":  form.company,
        "연락처":       form.phone,
        email:          form.email,
        "건물 소재지":  form.buildingAddress || "미입력",
        "건물 연면적":  areaLabel,
        "문의 내용":    form.message || "없음",
      };

      /* 1. Supabase CRM 저장 (환경변수 미설정 시 건너뜀) */
      if (supabase) {
        try {
          await supabase.from("inquiries").insert([{
            name:         form.name,
            phone:        form.phone,
            company:      form.company,
            inquiry_type: "상담신청",
            details:      JSON.stringify(payload),
            status:       "신규 문의",
          }]);
        } catch {
          /* Supabase 실패해도 이메일 발송은 계속 진행 */
        }
      }

      /* 2. Web3Forms 이메일 발송 */
      const res  = await fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(RATE_LIMIT_BASIC, Date.now().toString());
        setSubmitted(true);
      } else {
        setError("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <SubmitSuccess />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 담당자명 + 건물명 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            담당자명 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="text" required placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass} style={focusStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            건물명 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="text" required placeholder="○○빌딩"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass} style={focusStyle}
          />
        </div>
      </div>

      {/* 연락처 + 이메일 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            연락처 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="tel" required placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`${inputClass} font-inter`} style={focusStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>이메일</label>
          <input
            type="email" placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`${inputClass} font-inter`} style={focusStyle}
          />
        </div>
      </div>

      {/* 건물 소재지 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          건물 소재지 <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text" required placeholder="주소 찾기 버튼을 눌러주세요"
            value={form.buildingAddress}
            onChange={(e) => setForm({ ...form, buildingAddress: e.target.value })}
            className={inputClass} style={focusStyle}
          />
          <button
            type="button"
            onClick={() => openAddressSearch((full) => setForm((p) => ({ ...p, buildingAddress: full })))}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg border transition-all"
            style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", background: "white" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
          >
            <Search size={14} /> 주소 찾기
          </button>
        </div>
      </div>

      {/* 건물 연면적 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          건물 연면적 <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="text" inputMode="numeric" required placeholder="예: 12,500"
            value={form.buildingArea}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, buildingArea: digits ? parseInt(digits).toLocaleString("ko-KR") : "" });
            }}
            className={`${inputClass} pr-10`} style={focusStyle}
          />
          <span className="absolute right-3 text-sm font-semibold pointer-events-none" style={{ color: "var(--color-gray-600)" }}>
            ㎡
          </span>
        </div>
        {(() => {
          const info = getAreaInfo(form.buildingArea);
          if (!info) return (
            <p className="mt-1.5 text-xs" style={{ color: "var(--color-gray-600)" }}>
              실제 연면적을 숫자로 입력하시면 의무 기한을 즉시 확인할 수 있습니다.
            </p>
          );
          return (
            <div
              className="mt-1.5 flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: `color-mix(in srgb, ${info.color} 10%, white)`, borderLeft: `3px solid ${info.color}` }}
            >
              <span className="font-semibold" style={{ color: info.color }}>→ {info.range}</span>
              <span className="font-bold" style={{ color: info.urgent ? "#E85C0D" : info.color }}>
                의무 기한: {info.deadline}
              </span>
            </div>
          );
        })()}
      </div>

      {/* 문의 내용 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>문의 내용</label>
        <textarea
          rows={4} placeholder="문의하실 내용을 자유롭게 작성해주세요."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`} style={focusStyle}
        />
      </div>

      <p className="text-xs" style={{ color: "var(--color-gray-600)" }}>
        제출하신 정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
      </p>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--color-accent)" }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary-mid)"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-accent)"; }}
      >
        <Send size={16} />
        {loading ? "전송 중..." : "상담 신청하기"}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────── */
/*   견적서 바로 신청 폼 (상세)                       */
/* ─────────────────────────────────────────────── */

type DetailForm = {
  name: string;
  phone: string;
  email: string;
  buildingName: string;
  buildingAddress: string;
  buildingArea: string;
  serviceScope: string[];
  equipment: string[];
  message: string;
};

function DetailContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [form,      setForm]      = useState<DetailForm>({
    name: "", phone: "", email: "",
    buildingName: "", buildingAddress: "", buildingArea: "",
    serviceScope: [], equipment: [], message: "",
  });

  const toggleEquipment = (item: string) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const toggleAll = (items: string[], checked: boolean) => {
    setForm((prev) => {
      const withoutGroup = prev.equipment.filter((e) => !items.includes(e));
      return {
        ...prev,
        equipment: checked ? [...withoutGroup, ...items] : withoutGroup,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /* 관리자 위탁선임 단독 선택 방지 */
      const hasManager      = form.serviceScope.includes("관리자 위탁선임");
      const hasMaintenance  = form.serviceScope.includes("유지보수관리 대행");
      const hasInspection   = form.serviceScope.includes("성능점검 대행");

      if (hasManager && !hasMaintenance && !hasInspection) {
        setError("'관리자 위탁선임'만 단독으로 신청하실 수 없습니다. '유지보수관리 대행' 또는 '성능점검 대행' 중 하나를 함께 선택해주세요.");
        setLoading(false);
        return;
      }

      /* Rate Limiting */
      const now  = Date.now();
      const last = localStorage.getItem(RATE_LIMIT_DETAIL);
      if (last && now - parseInt(last) < RATE_LIMIT_MS) {
        const sec = Math.ceil((RATE_LIMIT_MS - (now - parseInt(last))) / 1000);
        setError(`${sec}초 후에 다시 시도해주세요. (전송 제한 1분)`);
        setLoading(false);
        return;
      }

      const selectedEquipment = form.equipment.length > 0 ? form.equipment.join(", ") : "미선택";
      const areaLabel = form.buildingArea
        ? `${form.buildingArea}㎡ (${getAreaInfo(form.buildingArea)?.range ?? "확인 필요"})`
        : "미입력";

      const payload = {
        subject:             `[견적서신청] ${form.buildingName || form.name} — 정보통신설비 성능점검`,
        from_name:           "제이앤지시스템 홈페이지",
        "신청유형":          "견적서 바로 신청",
        name:                form.name,
        "연락처":            form.phone,
        email:               form.email,
        "건물 상호(명칭)":   form.buildingName,
        "건물 소재지":       form.buildingAddress,
        "건물 연면적":       areaLabel,
        "요청 업무 범위":    form.serviceScope.length > 0 ? form.serviceScope.join(", ") : "미선택",
        "점검 대상 설비":    selectedEquipment,
        "선택 설비 수":      `${form.equipment.length}개`,
        "문의 내용":         form.message || "없음",
      };

      /* 1. Supabase CRM 저장 */
      if (supabase) {
        try {
          await supabase.from("inquiries").insert([{
            name:         form.name,
            phone:        form.phone,
            company:      form.buildingName,
            inquiry_type: "견적서 바로 신청",
            details:      JSON.stringify(payload),
            status:       "신규 문의",
          }]);
        } catch {
          /* Supabase 실패해도 이메일 발송은 계속 진행 */
        }
      }

      /* 2. Web3Forms 이메일 발송 */
      const res  = await fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(RATE_LIMIT_DETAIL, Date.now().toString());
        setSubmitted(true);
      } else {
        setError("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <SubmitSuccess />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 안내 배너 */}
      <div
        className="rounded-lg px-4 py-3 text-sm leading-relaxed"
        style={{
          background: "var(--color-accent-light)",
          color: "var(--color-primary)",
          borderLeft: "3px solid var(--color-accent)",
        }}
      >
        건축물에 설치된 정보통신설비를 선택하시면 보다 정확한 견적과 상담이 가능합니다.
      </div>

      {/* 담당자 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            담당자명 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="text" required placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass} style={focusStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            연락처 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="tel" required placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`${inputClass} font-inter`} style={focusStyle}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>이메일</label>
        <input
          type="email" placeholder="email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`${inputClass} font-inter`} style={focusStyle}
        />
      </div>

      {/* ① 건물 상호(명칭) */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          ① 건물 상호(명칭) <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <input
          type="text" required placeholder="예: 한국정보통신빌딩"
          value={form.buildingName}
          onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
          className={inputClass} style={focusStyle}
        />
      </div>

      {/* ② 소재지 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          ② 건물 소재지 <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text" required placeholder="주소 찾기 버튼을 눌러주세요"
            value={form.buildingAddress}
            onChange={(e) => setForm({ ...form, buildingAddress: e.target.value })}
            className={inputClass} style={focusStyle}
          />
          <button
            type="button"
            onClick={() => openAddressSearch((full) => setForm((p) => ({ ...p, buildingAddress: full })))}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg border transition-all"
            style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", background: "white" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
          >
            <Search size={14} /> 주소 찾기
          </button>
        </div>
      </div>

      {/* ③ 건물 연면적 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          ③ 건물 연면적 <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="text" inputMode="numeric" required placeholder="예: 12,500"
            value={form.buildingArea}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, buildingArea: digits ? parseInt(digits).toLocaleString("ko-KR") : "" });
            }}
            className={`${inputClass} pr-10`} style={focusStyle}
          />
          <span className="absolute right-3 text-sm font-semibold pointer-events-none" style={{ color: "var(--color-gray-600)" }}>
            ㎡
          </span>
        </div>
        {(() => {
          const info = getAreaInfo(form.buildingArea);
          if (!info) return (
            <p className="mt-1.5 text-xs" style={{ color: "var(--color-gray-600)" }}>
              실제 연면적을 숫자로 입력하시면 의무 기한을 즉시 확인할 수 있습니다.
            </p>
          );
          return (
            <div
              className="mt-1.5 flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: `color-mix(in srgb, ${info.color} 10%, white)`, borderLeft: `3px solid ${info.color}` }}
            >
              <span className="font-semibold" style={{ color: info.color }}>→ {info.range}</span>
              <span className="font-bold" style={{ color: info.urgent ? "#E85C0D" : info.color }}>
                의무 기한: {info.deadline}
              </span>
            </div>
          );
        })()}
      </div>

      {/* 요청 업무 범위 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          요청 업무 범위{" "}
          <span className="text-xs font-normal ml-1" style={{ color: "var(--color-gray-600)" }}>
            (중복 선택 가능)
          </span>
        </label>

        {/* 관리자 위탁선임 단독 선택 시 안내 */}
        {form.serviceScope.includes("관리자 위탁선임") &&
         !form.serviceScope.includes("유지보수관리 대행") &&
         !form.serviceScope.includes("성능점검 대행") && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-[var(--color-warning-light)] border border-[var(--color-warning)] text-[var(--color-warning)] text-xs font-semibold animate-pulse">
            ※ &apos;관리자 위탁선임&apos;은 점검 대행(유지보수/성능점검)과 함께 신청 가능합니다.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
          {SERVICE_SCOPE_CONFIG.map((svc) => {
            const checked = form.serviceScope.includes(svc.label);
            return (
              <label
                key={svc.id}
                className="flex flex-col gap-1 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{
                  border: `2px solid ${checked ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: checked ? "var(--color-accent-light)" : "white",
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setForm((prev) => ({
                        ...prev,
                        serviceScope: checked
                          ? prev.serviceScope.filter((s) => s !== svc.label)
                          : [...prev.serviceScope, svc.label],
                      }));
                    }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "var(--color-accent)" }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: checked ? "var(--color-accent)" : "var(--color-primary)" }}
                  >
                    {svc.label}
                  </span>
                </div>
                <span className="text-xs leading-relaxed pl-6" style={{ color: "var(--color-gray-600)" }}>
                  {svc.desc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ④ 점검 대상 설비 선택 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass} style={{ color: "var(--color-primary)", marginBottom: 0 }}>
            ④ 점검 대상 설비 선택{" "}
            <span className="text-xs font-normal ml-1" style={{ color: "var(--color-gray-600)" }}>
              (해당 설비에 모두 체크해주세요)
            </span>
          </label>
          {form.equipment.length > 0 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
            >
              {form.equipment.length}개 선택
            </span>
          )}
        </div>

        <div className="space-y-4 border border-[var(--color-border)] rounded-xl p-4">
          {EQUIPMENT_GROUPS.map((group) => {
            const allChecked  = group.items.every((item) => form.equipment.includes(item));
            const someChecked = group.items.some((item) => form.equipment.includes(item));

            return (
              <div key={group.category}>
                {/* 카테고리 헤더 */}
                <div
                  className="flex items-center gap-2 mb-2 pb-1"
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
                    onClick={() => toggleAll(group.items, !allChecked)}
                    className="ml-auto text-xs underline underline-offset-2"
                    style={{ color: someChecked ? group.color : "var(--color-gray-600)" }}
                  >
                    {allChecked ? "전체 해제" : "전체 선택"}
                  </button>
                </div>

                {/* 설비 체크박스 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {group.items.map((item) => {
                    const checked = form.equipment.includes(item);
                    return (
                      <label
                        key={item}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors"
                        style={{
                          background: checked ? `${group.color}10` : "transparent",
                          border: `1px solid ${checked ? group.color + "40" : "transparent"}`,
                          color: checked ? group.color : "var(--color-gray-600)",
                          fontWeight: checked ? 600 : 400,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEquipment(item)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: group.color }}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {form.equipment.length === 0 && (
          <p className="mt-1.5 text-xs" style={{ color: "var(--color-gray-600)" }}>
            설비를 선택하지 않으셔도 신청 가능합니다. 담당자가 확인 후 안내드립니다.
          </p>
        )}
      </div>

      {/* 문의 내용 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>문의 내용</label>
        <textarea
          rows={3} placeholder="추가로 문의하실 내용을 자유롭게 작성해주세요."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`} style={focusStyle}
        />
      </div>

      <p className="text-xs" style={{ color: "var(--color-gray-600)" }}>
        제출하신 정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
      </p>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--color-accent)" }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-primary-mid)"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-accent)"; }}
      >
        <Send size={16} />
        {loading ? "전송 중..." : "견적서 바로 신청하기"}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────── */
/*   메인 ContactForm (탭 전환)                      */
/* ─────────────────────────────────────────────── */

export default function ContactForm() {
  const [tab, setTab] = useState<"basic" | "detail">("basic");

  return (
    <div>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      {/* 탭 버튼 */}
      <div
        className="flex rounded-xl p-1 mb-6"
        style={{ background: "var(--color-gray-100)" }}
      >
        <button
          type="button"
          onClick={() => setTab("basic")}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
          style={
            tab === "basic"
              ? { background: "white", color: "var(--color-primary)", boxShadow: "0 1px 6px rgba(13,43,94,0.12)" }
              : { color: "var(--color-gray-600)" }
          }
        >
          상담신청
        </button>
        <button
          type="button"
          onClick={() => setTab("detail")}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
          style={
            tab === "detail"
              ? { background: "white", color: "var(--color-primary)", boxShadow: "0 1px 6px rgba(13,43,94,0.12)" }
              : { color: "var(--color-gray-600)" }
          }
        >
          견적서 바로 신청
        </button>
      </div>

      {/* 탭 설명 */}
      <p className="text-xs mb-5" style={{ color: "var(--color-gray-600)" }}>
        {tab === "basic"
          ? "간단한 정보만 남겨주시면 담당자가 연락드립니다."
          : "건물 정보와 점검 설비를 미리 선택하시면 더 빠르고 정확한 견적 상담이 가능합니다."}
      </p>

      {/* 폼 렌더링 */}
      {tab === "basic" ? <BasicContactForm /> : <DetailContactForm />}
    </div>
  );
}
