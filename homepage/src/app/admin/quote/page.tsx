"use client";

import { useState, useEffect, Suspense } from "react";
import { actualQuoteModel } from "./models/actualQuoteModel";
import { useQuoteHarness } from "./useQuoteHarness";
import QuoteControlPanel from "./components/QuoteControlPanel";
import QuoteA4Document from "./components/QuoteA4Document";
import styles from "./quote.module.css";

import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/adminAuth";

function QuotePageContent() {
  // Supabase Auth 가드 — 세션 없으면 자동으로 /admin/login 이동
  const auth = useAdminAuth();
  const isLocked = auth.status !== "authenticated";

  const { input, updateInput, output } = useQuoteHarness(actualQuoteModel);
  const searchParams = useSearchParams();
  const router = useRouter();
  const inquiryId = searchParams.get("id");

  // PDF 다운로드 이벤트 핸들러
  const handlePdfDownload = async () => {
    // URL에 inquiryId가 있으면 데이터베이스의 상태를 "견적 완료"로 자동 변경
    if (inquiryId) {
      try {
        await supabase
          .from("inquiries")
          .update({ status: "견적 완료" })
          .eq("id", inquiryId);
      } catch (err) {
        console.error("상태 업데이트 실패:", err);
      }
    }
    // 브라우저의 인쇄 창 호출 (인쇄 대상이 PDF로 유도됨)
    window.print();
  };

  // 엑셀(CSV) 다운로드 핸들러
  const handleExcelDownload = () => {
    const maintenanceAmt = input.maintenanceContractAmount || 0;
    const combinedSupplyCost = output.supplyCost + maintenanceAmt;
    const combinedTaxAmount = Math.round(combinedSupplyCost * 0.1);
    const combinedYearTotal = combinedSupplyCost + combinedTaxAmount;
    const combinedMonthlyTotal = Math.floor(combinedYearTotal / 12 / 10000) * 10000;

    const fmt = (n: number) => Math.max(0, Math.round(n)).toLocaleString('ko-KR');
    const today = new Date().toLocaleDateString('ko-KR');

    const rows: string[][] = [
      ['[견적서]', `작성일: ${today}`],
      [],
      ['▶ 고객 정보'],
      ['고객사(건물명)', input.companyName || ''],
      ['담당자', input.customerName || ''],
      ['연락처', input.customerPhone || ''],
      ['이메일', input.customerEmail || ''],
      ['건물 주소', input.buildingAddress || ''],
      ['연면적', `${(input.buildingTotalArea || 0).toLocaleString('ko-KR')} ㎡`],
      [],
      ['▶ 대가 산출 요약'],
      ['항목', '연간 금액(원)', '비고'],
      [`엔지니어링 직접인건비 (${output.engineerGrade})`, fmt(output.laborCost), '협회 대가기준'],
      ['제경비', fmt(output.overheadCost), '직접인건비의 110%'],
      ['기술료', fmt(output.techCost), '(인건비+제경비)의 20%'],
      ['KICA 기준 산출 공급가액 합계', fmt(output.calcTotal), ''],
      ['특별 협의 조정액 (-)', `-${fmt(output.discountApplied)}`, 'J&G 시스템 별도 지원'],
      ['최종 공급가액', fmt(output.supplyCost), ''],
      ['정보통신설비의 유지보수·관리자 위탁 선임료', fmt(maintenanceAmt), '비상주 (할인 미적용)'],
      ['부가가치세', fmt(combinedTaxAmount), '10%'],
      ['연간 총 청구액계 (VAT포함)', fmt(combinedYearTotal), ''],
      [],
      ['▶ 월 청구 금액'],
      ['월 청구액 (VAT포함)', fmt(maintenanceAmt > 0 ? combinedMonthlyTotal : output.monthlyTotal), '12개월 분납형'],
      [],
      ['▶ 영업 담당'],
      ['영업 담당자', input.salesName],
      ['영업 연락처', input.salesPhone],
    ];

    const csv = rows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const bom = '\uFEFF'; // UTF-8 BOM (한글 깨짐 방지)
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.download = `견적서_${input.companyName || '미입력'}_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // URL 파라미터로 ID가 넘어왔을 경우 DB에서 데이터 불러오기
  useEffect(() => {
    if (inquiryId && !isLocked) {
      loadInquiryData(inquiryId);
    }
  }, [inquiryId, isLocked]);

  const loadInquiryData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .eq("id", id)
        .single();
      
      if (data && data.details) {
        const payload = JSON.parse(data.details);
        
        // 설비 파싱 (ex: "네트워크 설비, 방송 음향 설비")
        const eqStr = payload["점검 대상 설비"] || "";
        const initEq = eqStr !== "미선택" ? eqStr.split(", ") : [];

        // 연면적에서 숫자만 추출 (괄호 안의 범위 설명 숫자가 섞이지 않도록 첫 번째 숫자 뭉치만 사용)
        const rawArea = payload["건축물 연면적"] || payload["건물 연면적"] || "0";
        const areaMatch = rawArea.match(/[0-9,]+/);
        const totalAreaNum = areaMatch ? parseInt(areaMatch[0].replace(/,/g, "")) : 0;

        // 서비스 범위 매핑 (1. 전체 / 2. 점검 위주 / 3. 성능점검 단독)
        const scopeStr = payload["요청 업무 범위"] || payload["문의 내용"] || "";
        const hasMaintenance = scopeStr.includes("유지보수관리 대행") || scopeStr.includes("관리점검");
        const hasInspection = scopeStr.includes("성능점검");
        const hasManager = scopeStr.includes("관리자 위탁선임") || scopeStr.includes("선임");

        let mappedScope: any = "manage_inspect"; // 기본값을 '점검 위주'로 변경
        
        if (hasMaintenance && hasInspection && hasManager) {
          mappedScope = "all"; // 1. 전체
        } else if (hasMaintenance && hasInspection) {
          mappedScope = "manage_inspect"; // 2. 점검 위주
        } else if (hasInspection && !hasMaintenance) {
          mappedScope = "inspect_only"; // 3. 성능점검 단독
        } else if (hasMaintenance && !hasInspection) {
          mappedScope = "manage_inspect"; // 유지보수만 있으면 점검 위주로
        } else if (hasManager) {
          mappedScope = "all"; // 선임이 포함되면 보통 전체 서비스
        }

        updateInput({
          companyName: payload["회사·건물명"] || payload["건물 상호(명칭)"] || data.company || "",
          customerName: payload.name || data.name || "",
          customerPhone: payload["연락처"] || data.phone || "",
          customerEmail: payload.email || "",
          buildingAddress: payload["건물 소재지"] || "",
          buildingTotalArea: totalAreaNum,
          equipmentChecks: initEq,
          serviceScope: mappedScope,
          message: payload["문의 내용"] || "",
          originalServiceScope: scopeStr || "미선택",
          salesName: "박상하 부장",
          salesPhone: "010-2230-0671",
        });
      }
    } catch (e) {
      console.error("데이터 로딩 중 오류 발생:", e);
    }
  };

  // 인증 로딩 / 미인증 → useAdminAuth가 /admin/login으로 리다이렉트 처리
  if (auth.status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-sm text-gray-600">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          인증 확인 중...
        </div>
      </div>
    );
  }

  if (auth.status === "unavailable") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md bg-white rounded-xl p-8 border-2 border-orange-500 text-center">
          <p className="text-orange-600 font-bold mb-2">인증 서비스 미설정</p>
          <p className="text-sm text-gray-600">
            Cloudflare Pages 환경변수에 Supabase URL·Anon Key를 등록한 뒤 재배포하세요.
          </p>
        </div>
      </div>
    );
  }

  if (isLocked) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.splitWrapper}>
        {/* 1. 좌측 조정 패널 (입력부) */}
        <div className={styles.leftPanel}>
          <div className="flex flex-col gap-6">
            <QuoteControlPanel input={input} onChange={updateInput} />
            
            {/* 액션 버튼 바 */}
            <div className="flex flex-col gap-3 print:hidden">
              <button
                onClick={handlePdfDownload}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
              >
                📄 PDF 파일 다운로드 (저장)
              </button>
              <button
                onClick={handleExcelDownload}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
              >
                📊 엑셀로 다운로드 (CSV)
              </button>
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-all opacity-80 hover:opacity-100"
              >
                ⬅ 대시보드 돌아가기
              </button>
            </div>
          </div>
        </div>

        {/* 2. 우측 견적서 프리뷰 (출력부) */}
        <div className={styles.rightPanel}>
          <QuoteA4Document input={input} output={output} />
        </div>
      </div>
    </div>
  );
}

export default function AdminQuotePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <QuotePageContent />
    </Suspense>
  );
}
