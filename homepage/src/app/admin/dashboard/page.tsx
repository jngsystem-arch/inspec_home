"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAdminAuth, adminSignOut } from "@/lib/adminAuth";

/**
 * 관리자 대시보드 (/admin/dashboard)
 *
 * 보안:
 * - Supabase Auth 세션 필수 (useAdminAuth) — 세션 없으면 자동으로 /admin/login 이동
 * - inquiries 테이블 RLS로 이중 방어 (authenticated 역할만 SELECT/UPDATE 가능)
 * - 세션 만료·로그아웃 이벤트를 실시간 감지 (onAuthStateChange)
 *
 * 하드코딩 비밀번호 방식("dpdlwjsxm8*") 완전 제거.
 */

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  company: string;
  inquiry_type: string;
  details: string;
  status: string;
  is_archived: boolean;
  created_at: string;
};

export default function AdminDashboardPage() {
  const auth = useAdminAuth();
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const fetchInquiries = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch error:", error);
      setInquiries([]);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth.status === "authenticated") fetchInquiries();
  }, [auth.status, fetchInquiries]);

  const updateStatus = async (id: number, newStatus: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("inquiries")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchInquiries();
    else alert("상태 업데이트에 실패했습니다. 권한을 확인하세요.");
  };

  const toggleArchive = async (id: number, current: boolean) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("inquiries")
      .update({ is_archived: !current })
      .eq("id", id);
    if (!error) fetchInquiries();
    else alert("보관 상태 변경에 실패했습니다.");
  };

  const handleSignOut = async () => {
    await adminSignOut();
    router.replace("/admin/login");
  };

  // 인증 로딩
  if (auth.status === "loading") {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-sm text-[#4B5563]">
          <div className="w-6 h-6 border-2 border-[#E5EAF0] border-t-[#0070F3] rounded-full animate-spin mx-auto mb-3" />
          인증 확인 중...
        </div>
      </div>
    );
  }

  // Supabase 미설정
  if (auth.status === "unavailable") {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6">
        <div className="max-w-md bg-white rounded-2xl p-8 border border-[#E85C0D] text-center">
          <p className="text-[#E85C0D] font-bold mb-2">인증 서비스 미설정</p>
          <p className="text-sm text-[#4B5563]">
            Cloudflare Pages 환경변수에 Supabase URL·Anon Key를 등록한 뒤 재배포하세요.
          </p>
        </div>
      </div>
    );
  }

  // 세션 없음 → useAdminAuth가 자동으로 /admin/login 이동 처리
  if (auth.status !== "authenticated") return null;

  /* ─── 통계 ─── */
  const total = inquiries.length;
  const newCount = inquiries.filter(
    (i) => i.status === "신규 문의" || i.status === "신규",
  ).length;
  const doneCount = inquiries.filter((i) => i.status === "견적 완료").length;
  const archivedCount = inquiries.filter((i) => i.is_archived).length;
  const activeList = inquiries.filter((i) => showArchived || !i.is_archived);

  const kpi = [
    { label: "총 누적 문의", value: total, unit: "건", accent: "#0070F3", light: "#E8F1FF", icon: "📋" },
    { label: "신규 / 대기중", value: newCount, unit: "건", accent: "#E85C0D", light: "#FFF3EC", icon: "🔴" },
    { label: "견적 완료", value: doneCount, unit: "건", accent: "#0E9E6E", light: "#E6F7F2", icon: "✅" },
    { label: "보관 처리", value: archivedCount, unit: "건", accent: "#4B5563", light: "#F0F4F8", icon: "📁" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-[Pretendard,system-ui,sans-serif]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5EAF0]">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Image
              src="/JNGSYSTEM_2Line_Logo.png"
              alt="제이앤지시스템"
              width={130}
              height={44}
              style={{ height: "36px", width: "auto" }}
            />
            <div className="h-5 w-px bg-[#E5EAF0]" />
            <span className="text-sm font-semibold text-[#0D2B5E]">영업 CRM 대시보드</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#4B5563]">
              {auth.session.user.email}
            </span>
            <label className="flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
                className="w-4 h-4 rounded border-[#CBD5E1] accent-[#0070F3]"
              />
              보관 내역 포함
            </label>
            <button
              onClick={fetchInquiries}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#4B5563] border border-[#E5EAF0] rounded-lg bg-white hover:bg-[#F7F9FC] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              새로고침
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm text-[#4B5563] hover:text-[#E85C0D] transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0D2B5E]">고객 문의 현황</h2>
          <p className="text-sm text-[#4B5563] mt-1">
            접수된 상담 문의를 확인하고 견적을 관리합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpi.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-[#E5EAF0] p-5"
              style={{ boxShadow: "0 2px 16px rgba(13,43,94,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#4B5563] tracking-wide">{card.label}</span>
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: card.light }}
                >
                  {card.icon}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-extrabold" style={{ color: card.accent }}>
                  {card.value}
                </span>
                <span className="text-sm text-[#4B5563] mb-0.5 font-medium">{card.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="bg-white rounded-2xl border border-[#E5EAF0] overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(13,43,94,0.06)" }}
        >
          <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#0D2B5E]">문의 내역</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F1FF] text-[#0070F3]">
                {activeList.length}건
              </span>
              {showArchived && archivedCount > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF3EC] text-[#E85C0D]">
                  보관 포함 중
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F7F9FC] border-b border-[#E5EAF0]">
                <tr>
                  {["접수일시", "구분", "고객사·건물명", "담당자", "연락처", "진행 상태", "작업"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-xs font-bold text-[#4B5563] tracking-wide uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F8]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-[#CBD5E1] text-sm">
                      <div className="inline-block w-5 h-5 border-2 border-[#E5EAF0] border-t-[#0070F3] rounded-full animate-spin mb-3" />
                      <p>데이터를 불러오는 중입니다...</p>
                    </td>
                  </tr>
                ) : activeList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-sm text-[#CBD5E1]">
                      {showArchived ? "접수된 문의 건이 없습니다." : "활성 상태의 문의 건이 없습니다."}
                    </td>
                  </tr>
                ) : (
                  activeList.map((inq) => {
                    const isBasic = inq.inquiry_type === "기본 신청";
                    const isDone = inq.status === "견적 완료";

                    return (
                      <tr
                        key={inq.id}
                        className={`transition-colors hover:bg-[#F7F9FC] ${
                          inq.is_archived ? "opacity-40" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5 text-xs text-[#4B5563] whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleString("ko-KR", {
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={
                              isBasic
                                ? { background: "#F0F4F8", color: "#4B5563" }
                                : { background: "#E8F1FF", color: "#0070F3" }
                            }
                          >
                            {isBasic ? "기본" : "상세"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#111827]">
                          {inq.company || <span className="text-[#CBD5E1]">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-[#4B5563]">{inq.name}</td>
                        <td className="px-5 py-3.5 text-[#4B5563] font-mono text-xs">{inq.phone}</td>
                        <td className="px-5 py-3.5">
                          <select
                            value={inq.status === "신규" ? "신규 문의" : inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            className="text-xs font-bold py-1.5 px-3 rounded-full border appearance-none cursor-pointer outline-none transition-colors"
                            style={
                              isDone
                                ? { background: "#E6F7F2", color: "#0E9E6E", borderColor: "#b2e8d8" }
                                : { background: "#FFF3EC", color: "#E85C0D", borderColor: "#fdd0b8" }
                            }
                          >
                            <option value="신규 문의">🔴 신규 문의</option>
                            <option value="견적 완료">✅ 견적 완료</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleArchive(inq.id, inq.is_archived)}
                              title={inq.is_archived ? "복원하기" : "보관(숨기기)"}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5EAF0] bg-white hover:border-[#CBD5E1] hover:bg-[#F7F9FC] transition-colors text-[#CBD5E1] hover:text-[#4B5563]"
                            >
                              {inq.is_archived ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0070F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                  <path d="M3 3v5h5" />
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                                  <circle cx="12" cy="12" r="3" />
                                  <line x1="4" y1="4" x2="20" y2="20" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => router.push(`/admin/quote?id=${inq.id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0070F3] hover:bg-[#1A4A8A] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              견적서 발급
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#F7F9FC] border-t border-[#E5EAF0] flex items-center justify-between">
            <span className="text-xs text-[#CBD5E1]">
              전체 {total}건 중 {activeList.length}건 표시
            </span>
            <a href="/" className="text-xs text-[#4B5563] hover:text-[#0070F3] transition-colors">
              ← 홈페이지로 돌아가기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
