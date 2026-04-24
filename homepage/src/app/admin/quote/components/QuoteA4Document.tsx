import Image from "next/image";
import { QuoteInput, QuoteOutput } from "../types";
import styles from "../quote.module.css";

interface Props {
  input: QuoteInput;
  output: QuoteOutput;
}

export default function QuoteA4Document({ input, output }: Props) {
  // 숫자 포맷팅 함수
  const fmt = (num: number) => Math.max(0, Math.round(num)).toLocaleString();

  // 서비스 번호 매기기 로직
  let svcCount = 1;

  // 날짜 기반 동적 견적번호 생성 (J-YYMMDD-01)
  const today = new Date();
  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const quoteNumber = `J-${yy}${mm}${dd}-01`;

  return (
    <div className="print:block w-full flex flex-col items-center">
      {/* PAGE 1: 견적서 메인 */}
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.logoBox}>
            {/* 로고 (홈페이지 로고 이미지 연동) */}
            <div style={{ position: 'relative', width: '180px', height: '40px' }}>
               <Image 
                src="/images/jng_logo.png" 
                alt="JNG System Logo" 
                fill
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                unoptimized
              />
            </div>
          </div>
          <h1>견 적 서</h1>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#6b7280" }}>
            견적번호: {quoteNumber}<br />
            견적일자: {today.toLocaleDateString('ko-KR')}
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.customerInfo}>
            <h2 className={styles.customerSummaryTitle} style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "bold", borderBottom: "2px solid #1e3a8a", paddingBottom: "5px", display: "inline-block" }}>
              수 신 : {input.customerName || "미입력"} 귀하
            </h2>
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse", marginBottom: "20px" }}>
              <tbody>
                <tr><td className={styles.label} style={{ width: '70px', padding: '3px 0', fontWeight: 'bold' }}>건물명</td><td style={{ padding: '3px 0', fontWeight: 'bold' }}>{input.companyName || "미입력"}</td></tr>
                <tr><td className={styles.label} style={{ padding: '3px 0', fontWeight: 'bold' }}>주 소</td><td style={{ padding: '3px 0' }}>{input.buildingAddress || "미입력"}</td></tr>
                <tr><td className={styles.label} style={{ padding: '3px 0', fontWeight: 'bold' }}>연면적</td><td style={{ padding: '3px 0' }}>{input.buildingTotalArea ? input.buildingTotalArea.toLocaleString() + ' ㎡' : "미입력"}</td></tr>
                <tr><td className={styles.label} style={{ padding: '3px 0', fontWeight: 'bold' }}>연락처</td><td style={{ padding: '3px 0' }}>{input.customerPhone || "미입력"}</td></tr>
                <tr><td className={styles.label} style={{ padding: '3px 0', fontWeight: 'bold' }}>이메일</td><td style={{ padding: '3px 0' }}>{input.customerEmail || "미입력"}</td></tr>
              </tbody>
            </table>
            <p style={{ fontSize: "12px", lineHeight: 1.6, color: "#4b5563" }}>
              귀사의 일익 번창하심을 기원합니다.
              <br />
              요청하신 <strong>견적</strong>을 우측의 당사 명의로 제출합니다.
            </p>
          </div>

          <div className={styles.companyInfo}>
            <div className={styles.signature}>
              <Image 
                src="/images/stamp.png" 
                alt="사용인감" 
                width={60}
                height={60}
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </div>
            <table>
              <tbody>
                <tr><td className={styles.label}>상호명</td><td>(주)제이앤지시스템</td></tr>
                <tr><td className={styles.label}>대표자</td><td>박장훈</td></tr>
                <tr><td className={styles.label}>사업자번호</td><td>211-88-14679</td></tr>
                <tr><td className={styles.label}>소재지</td><td>서울특별시 영등포구 경인로 775</td></tr>
                <tr><td className={styles.label}>대표전화</td><td>02-3444-3570</td></tr>
                <tr><td className={styles.label}>영업담당</td><td>{input.salesName}</td></tr>
                <tr><td className={styles.label}>연락처</td><td>{input.salesPhone}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.totalSummary}>
          <div className={styles.totalRow}>
            <span>월 청구 금액 (VAT 포함)</span>
            <div>
              <span className={styles.priceMonth}>₩ {fmt(output.monthlyTotal)}</span>
            </div>
          </div>
          <div className={styles.totalSummaryBottom}>
            <span className={styles.monthlyTagInline}>12개월 분납형 (월 단위 청구)</span>
            <span className={styles.priceYear}>
              연간 총 견적 합계 (VAT 포함) : ₩ {fmt(output.yearTotal)}
            </span>
          </div>
        </div>

        <div className={styles.sectionTitle}>1. 서비스 제공 범위</div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>연번</th>
              <th style={{ width: "35%" }}>역무 항목</th>
              <th style={{ width: "57%" }}>세부 내용</th>
            </tr>
          </thead>
          <tbody>
            {output.services.manage && (
              <tr>
                <td className={styles.center}>{svcCount++}</td>
                <td>정보통신설비 유지보수·관리</td>
                <td>반기 1회 정기 관리점검 실시 및 보고서 생성</td>
              </tr>
            )}
            {output.services.inspect && (
              <tr>
                <td className={styles.center}>{svcCount++}</td>
                <td>정보통신설비 성능점검</td>
                <td>법적 의무 사항 연 1회(또는 반기) 정기 성능점검 실시 및 보고서 생성</td>
              </tr>
            )}
            {output.services.appoint && (
              <tr>
                <td className={styles.center}>{svcCount++}</td>
                <td>관리자 선임 위탁 대행</td>
                <td>해당 등급 정보통신 기술자를 현장 관리자로 지정 신고 대행</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.sectionTitle}>
          2. 대가 산출 요약 (세부 산출 근거는 별첨 현황표 참조)
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: "30%" }}>항목</th>
              <th style={{ width: "20%" }}>기준율</th>
              <th style={{ width: "25%" }}>연간 금액(원)</th>
              <th style={{ width: "25%" }}>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>엔지니어링 직접인건비 ({output.engineerGrade})</td>
              <td className={styles.center}>현황표 기준인원 합계 적용</td>
              <td className={styles.num}>{fmt(output.laborCost)}</td>
              <td rowSpan={2} className={styles.center}>
                협회 대가기준
              </td>
            </tr>
            <tr>
              <td>제경비</td>
              <td className={styles.center}>직접인건비의 110%</td>
              <td className={styles.num}>{fmt(output.overheadCost)}</td>
            </tr>
            <tr>
              <td>기술료</td>
              <td className={styles.center}>(인건비+제경비)의 20%</td>
              <td className={styles.num}>{fmt(output.techCost)}</td>
              <td></td>
            </tr>
            <tr style={{ backgroundColor: "#f9fafb", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", boxShadow: "inset 0 0 0 1000px #f9fafb" }}>
              <td colSpan={2} className={styles.center}>
                <strong>KICA 기준 산출 공급가액 합계</strong>
              </td>
              <td className={styles.num}>
                <strong>{fmt(output.calcTotal)}</strong>
              </td>
              <td></td>
            </tr>
            <tr style={{ color: "#ef4444", fontWeight: 500, backgroundColor: "#fef2f2", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", boxShadow: "inset 0 0 0 1000px #fef2f2" }}>
              <td colSpan={2} className={styles.center}>
                특별 협의 조정액 (-)
              </td>
              <td className={styles.num}>- {fmt(output.discountApplied)}</td>
              <td>J&G 시스템 별도 지원</td>
            </tr>
            <tr>
              <td colSpan={2} className={styles.center} style={{ fontWeight: 700 }}>
                최종 공급가액
              </td>
              <td className={styles.num} style={{ fontWeight: 700 }}>
                {fmt(output.supplyCost)}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={2} className={styles.center}>
                부가가치세
              </td>
              <td className={styles.num}>{fmt(output.taxAmount)}</td>
              <td className={styles.center}>10%</td>
            </tr>
            <tr
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1e3a8a",
                backgroundColor: "#e0f2fe",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                boxShadow: "inset 0 0 0 1000px #e0f2fe"
              }}
            >
              <td colSpan={2} className={styles.center}>
                연간 총 청구액계 (VAT포함)
              </td>
              <td className={styles.num}>{fmt(output.yearTotal)}</td>
              <td className={styles.center}></td>
            </tr>
          </tbody>
        </table>

        <div className={styles.footer}>
          <strong>[계약 및 청구 기준]</strong>
          <br />
          1. 본 견적 금액은 **연간 총 계약 금액을 12개월로 균등 분할**하여 매월 청구하는 방식입니다.
          <br />
          2. 작업 범위 및 추가 요청 사항에 따라 비용 변동이 있을 수 있습니다.
        </div>
      </div>

      {/* PAGE 2: 견적산출용현황표 */}
      <div className={styles.page} style={{ breakBefore: 'page', pageBreakBefore: 'always' }}>
        <div style={{ borderBottom: "3px solid #64748b", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "15px" }}>
          <h1 style={{ color: "#475569", fontSize: "24px", textAlign: "left", margin: 0 }}>
            [별첨] 견적산출용 현황표
          </h1>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#6b7280" }}>
            (주)제이앤지시스템
          </div>
        </div>

        <div style={{ fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
          ■ 본 문서는 시스템에 입력된 고객 현장 설비를 기반으로 정보통신 산업 표준 품셈 지수에 따라 자동 산출된 근거표입니다.
        </div>

        <div className={styles.sectionTitle}>1. 기술자 등급별 기준 노임 단가 (적용)</div>
        <table className={styles.dataTable} style={{ marginBottom: "20px" }}>
          <thead>
            <tr>
              <th style={output.engineerGrade === "특급기술자" ? { backgroundColor: "#e0f2fe" } : {}}>특급기술자(6만㎡↑)</th>
              <th style={output.engineerGrade === "고급기술자" ? { backgroundColor: "#e0f2fe" } : {}}>고급기술자(3만㎡↑)</th>
              <th style={output.engineerGrade === "중급기술자" ? { backgroundColor: "#e0f2fe" } : {}}>중급기술자(1.5만㎡↑)</th>
              <th style={output.engineerGrade === "초급기술자" ? { backgroundColor: "#e0f2fe" } : {}}>초급기술자(0.5만㎡↑)</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.center}>
              <td style={output.engineerGrade === "특급기술자" ? { fontWeight: 'bold', color: '#1e3a8a' } : {}}>343,079 원/인</td>
              <td style={output.engineerGrade === "고급기술자" ? { fontWeight: 'bold', color: '#1e3a8a' } : {}}>{output.engineerGrade === "고급기술자" ? fmt(output.wageRate) : "315,288"} 원/인</td>
              <td style={output.engineerGrade === "중급기술자" ? { fontWeight: 'bold', color: '#1e3a8a' } : {}}>{output.engineerGrade === "중급기술자" ? fmt(output.wageRate) : "283,343"} 원/인</td>
              <td style={output.engineerGrade === "초급기술자" ? { fontWeight: 'bold', color: '#1e3a8a' } : {}}>{output.engineerGrade === "초급기술자" ? fmt(output.wageRate) : "232,042"} 원/인</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.sectionTitle}>2. 현장 보유 설비 내역 및 기준 인원 산출</div>
        <table className={styles.dataTable} style={{ pageBreakInside: 'auto', breakInside: 'auto' }}>
          <thead>
            <tr>
              <th style={{ width: "20%" }}>설비 분류</th>
              <th style={{ width: "40%" }}>상세 수량 내역(예시)</th>
              <th style={{ width: "20%" }}>항목별<br />기준인원(인)</th>
              <th style={{ width: "20%" }}>인원 소계</th>
            </tr>
          </thead>
          <tbody>
             {output.equipmentBreakdown.length > 0 ? (
               output.equipmentBreakdown.map((item, idx) => (
                 <tr key={idx}>
                   <td><strong>[{item.category}]</strong></td>
                   <td>{item.name}</td>
                   <td className={styles.center}>{item.personnelValue.toFixed(2)}</td>
                   <td className={`${styles.center} ${styles.num}`}>{item.personnelValue.toFixed(2)}</td>
                 </tr>
               ))
             ) : (
                <tr>
                  <td className={styles.center}><strong>[설비]</strong></td>
                  <td colSpan={3} className={styles.center}>선택된 설비가 없습니다 (상담 후 확정)</td>
                </tr>
              )}
            <tr style={{ backgroundColor: "#f1f5f9", fontWeight: "bold", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", boxShadow: "inset 0 0 0 1000px #f1f5f9" }}>
              <td colSpan={3} className={styles.center}>
                산출 인원 합계 (직접인건비 산정 기준치) — 연면적: {input.buildingTotalArea ? input.buildingTotalArea.toLocaleString() + '㎡' : '미정'}
              </td>
              <td className={`${styles.center} ${styles.num}`}>{output.totalPersonnel.toFixed(2)} 인</td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: "12px", color: "gray", textAlign: "center", padding: "20px", border: "1px dashed #ccc", marginTop: "40px" }}>
          * 이 페이지(현황표)는 접수된 고객 사이트의 설비 및 연면적 정보에 따라 KICA 엔지니어링 대가 산정 기준을 적용하여 산출된 백데이터 내역서입니다.
        </div>
      </div>
    </div>
  );
}
