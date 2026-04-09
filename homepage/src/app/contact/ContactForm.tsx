"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

/* ───────────────────────────────────────────────
   기본 신청 폼 타입
─────────────────────────────────────────────── */
type BasicForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  buildingArea: string;
  buildingType: string;
  message: string;
};

/* ───────────────────────────────────────────────
   상세 상담 신청 폼 타입
─────────────────────────────────────────────── */
type DetailForm = {
  name: string;
  phone: string;
  email: string;
  buildingName: string;    // ① 건물 상호(명칭)
  buildingAddress: string; // ② 소재지
  serviceScope: string[];  // 요청 업무 범위
  equipment: string[];     // ③ 점검 대상 설비 (복수 선택)
  message: string;
};

/* ───────────────────────────────────────────────
   요청 업무 범위 옵션
─────────────────────────────────────────────── */
const SERVICE_SCOPE = [
  {
    id: "maintenance",
    label: "유지보수·관리 위탁",
    desc: "반기 1회 설비 점검 및 관리자 위탁",
  },
  {
    id: "inspection",
    label: "성능점검 대행",
    desc: "연 1회 33개 법정 의무 설비 성능점검 대행",
  },
  {
    id: "manager",
    label: "관리자 위탁선임",
    desc: "정보통신기술자 선임 신고 대행",
  },
];

/* ───────────────────────────────────────────────
   공통 옵션
─────────────────────────────────────────────── */
const areaOptions = [
  "연면적 3만㎡ 이상",
  "연면적 1만㎡ 이상 ~ 3만㎡ 미만",
  "연면적 5천㎡ 이상 ~ 1만㎡ 미만",
  "연면적 5천㎡ 미만 (대상 여부 확인 필요)",
];

const typeOptions = [
  "업무시설 (오피스, 빌딩)",
  "판매시설 (쇼핑몰, 상가)",
  "의료시설 (병원)",
  "교육연구시설 (대학교, 연구소)",
  "숙박시설 (호텔)",
  "문화집회시설",
  "운수시설",
  "기타",
];

/* ───────────────────────────────────────────────
   34개 점검 대상 설비 — 33개 법정 의무 + 전유부분 1개 선택 (대상현황표 기준)
─────────────────────────────────────────────── */
const EQUIPMENT_GROUPS = [
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

const WEB3FORMS_KEY = "08ac26e2-da08-4bbd-8871-ca08b59572f0";

/* ───────────────────────────────────────────────
   공통 완료 화면
─────────────────────────────────────────────── */
function SubmitSuccess() {
  return (
    <div className="text-center py-10">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "var(--color-accent-light)" }}
      >
        <CheckCircle2 size={32} style={{ color: "var(--color-accent)" }} />
      </div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--color-primary)" }}
      >
        상담 신청이 완료되었습니다
      </h3>
      <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
        영업일 기준 1일 이내에 담당자가 연락드립니다.
      </p>
    </div>
  );
}

/* ───────────────────────────────────────────────
   기본 신청 폼
─────────────────────────────────────────────── */
function BasicContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<BasicForm>({
    name: "",
    company: "",
    phone: "",
    email: "",
    buildingArea: "",
    buildingType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[기본신청] 상담신청 정보통신설비점검-${form.company}`,
          from_name: "제이앤지시스템 홈페이지",
          "신청유형": "기본 신청",
          name: form.name,
          "회사·건물명": form.company,
          "연락처": form.phone,
          email: form.email,
          "건축물 연면적": form.buildingArea || "미선택",
          "건축물 용도": form.buildingType || "미선택",
          "문의 내용": form.message || "없음",
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

  if (submitted) return <SubmitSuccess />;

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white";
  const focusStyle = { "--tw-ring-color": "var(--color-accent)" } as React.CSSProperties;
  const labelClass = "block text-sm font-semibold mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            담당자명 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            style={focusStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            회사/건물명 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="○○빌딩"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
            style={focusStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            연락처 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`${inputClass} font-inter`}
            style={focusStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            이메일
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`${inputClass} font-inter`}
            style={focusStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            건축물 연면적
          </label>
          <select
            value={form.buildingArea}
            onChange={(e) => setForm({ ...form, buildingArea: e.target.value })}
            className={inputClass}
            style={focusStyle}
          >
            <option value="">선택해주세요</option>
            {areaOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            건축물 용도
          </label>
          <select
            value={form.buildingType}
            onChange={(e) => setForm({ ...form, buildingType: e.target.value })}
            className={inputClass}
            style={focusStyle}
          >
            <option value="">선택해주세요</option>
            {typeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          문의 내용
        </label>
        <textarea
          rows={4}
          placeholder="문의하실 내용을 자유롭게 작성해주세요."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          style={focusStyle}
        />
      </div>

      <p className="text-xs" style={{ color: "var(--color-gray-600)" }}>
        제출하신 정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
      </p>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--color-accent)" }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--color-primary-mid)";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--color-accent)";
        }}
      >
        <Send size={16} /> {loading ? "전송 중..." : "상담 신청하기"}
      </button>
    </form>
  );
}

/* ───────────────────────────────────────────────
   상세 상담 신청 폼
─────────────────────────────────────────────── */
function DetailContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<DetailForm>({
    name: "",
    phone: "",
    email: "",
    buildingName: "",
    buildingAddress: "",
    serviceScope: [],
    equipment: [],
    message: "",
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
      const selectedEquipment =
        form.equipment.length > 0 ? form.equipment.join(", ") : "미선택";
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[상세신청] 상담신청 정보통신설비점검-${form.buildingName || form.name}`,
          from_name: "제이앤지시스템 홈페이지",
          "신청유형": "상세 상담 신청",
          name: form.name,
          "연락처": form.phone,
          email: form.email,
          "건물 상호(명칭)": form.buildingName,
          "건물 소재지": form.buildingAddress,
          "요청 업무 범위": form.serviceScope.length > 0 ? form.serviceScope.join(", ") : "미선택",
          "점검 대상 설비": selectedEquipment,
          "선택 설비 수": `${form.equipment.length}개`,
          "문의 내용": form.message || "없음",
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

  if (submitted) return <SubmitSuccess />;

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white";
  const focusStyle = { "--tw-ring-color": "var(--color-accent)" } as React.CSSProperties;
  const labelClass = "block text-sm font-semibold mb-1.5";

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
            type="text"
            required
            placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            style={focusStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--color-primary)" }}>
            연락처 <span style={{ color: "var(--color-warning)" }}>*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`${inputClass} font-inter`}
            style={focusStyle}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          이메일
        </label>
        <input
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`${inputClass} font-inter`}
          style={focusStyle}
        />
      </div>

      {/* ① 건물 상호(명칭) */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          ① 건물 상호(명칭) <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <input
          type="text"
          required
          placeholder="예: 한국정보통신빌딩"
          value={form.buildingName}
          onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
          className={inputClass}
          style={focusStyle}
        />
      </div>

      {/* ② 소재지 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          ② 건물 소재지 <span style={{ color: "var(--color-warning)" }}>*</span>
        </label>
        <input
          type="text"
          required
          placeholder="예: 서울특별시 강남구 ○○로 00"
          value={form.buildingAddress}
          onChange={(e) => setForm({ ...form, buildingAddress: e.target.value })}
          className={inputClass}
          style={focusStyle}
        />
      </div>

      {/* 요청 업무 범위 */}
      <div>
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          요청 업무 범위{" "}
          <span className="text-xs font-normal ml-1" style={{ color: "var(--color-gray-600)" }}>
            (중복 선택 가능)
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
          {SERVICE_SCOPE.map((svc) => {
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
                <span
                  className="text-xs leading-relaxed pl-6"
                  style={{ color: "var(--color-gray-600)" }}
                >
                  {svc.desc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ③ 점검 대상 설비 선택 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass} style={{ color: "var(--color-primary)", marginBottom: 0 }}>
            ③ 점검 대상 설비 선택{" "}
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
            const allChecked = group.items.every((item) =>
              form.equipment.includes(item)
            );
            const someChecked = group.items.some((item) =>
              form.equipment.includes(item)
            );

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
        <label className={labelClass} style={{ color: "var(--color-primary)" }}>
          문의 내용
        </label>
        <textarea
          rows={3}
          placeholder="추가로 문의하실 내용을 자유롭게 작성해주세요."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          style={focusStyle}
        />
      </div>

      <p className="text-xs" style={{ color: "var(--color-gray-600)" }}>
        제출하신 정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다.
      </p>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--color-accent)" }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--color-primary-mid)";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--color-accent)";
        }}
      >
        <Send size={16} /> {loading ? "전송 중..." : "상세 상담 신청하기"}
      </button>
    </form>
  );
}

/* ───────────────────────────────────────────────
   메인 ContactForm (탭 전환)
─────────────────────────────────────────────── */
export default function ContactForm() {
  const [tab, setTab] = useState<"basic" | "detail">("basic");

  return (
    <div>
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
              ? {
                  background: "white",
                  color: "var(--color-primary)",
                  boxShadow: "0 1px 6px rgba(13,43,94,0.12)",
                }
              : { color: "var(--color-gray-600)" }
          }
        >
          기본 신청
        </button>
        <button
          type="button"
          onClick={() => setTab("detail")}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
          style={
            tab === "detail"
              ? {
                  background: "white",
                  color: "var(--color-primary)",
                  boxShadow: "0 1px 6px rgba(13,43,94,0.12)",
                }
              : { color: "var(--color-gray-600)" }
          }
        >
          상세 상담 신청
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
