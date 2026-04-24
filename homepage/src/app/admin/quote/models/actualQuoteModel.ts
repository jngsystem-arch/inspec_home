import { IQuoteModel, QuoteInput, QuoteOutput, EquipmentBreakdown } from "../types";


export const KICA_PERSONNEL_MAP: Record<string, { category: string; value: number }> = {
  // 정보설비
  "네트워크 설비": { category: "정보설비", value: 1.85 },
  "전자출입(통제) 시스템": { category: "정보설비", value: 0.8 },
  "원격검침 시스템": { category: "정보설비", value: 0.5 },
  "주차관제 시스템": { category: "정보설비", value: 2.45 },
  "주차유도 시스템": { category: "정보설비", value: 0.66 },
  "무인택배 시스템": { category: "정보설비", value: 0.3 },
  "비상벨 설비": { category: "정보설비", value: 0.4 },
  "영상정보처리기기 시스템(CCTV)": { category: "정보설비", value: 0.81 },
  "홈네트워크 설비": { category: "정보설비", value: 1.2 },
  "빌딩 안내 시스템(BIS)": { category: "정보설비", value: 0.6 },
  "전기시계시스템": { category: "정보설비", value: 0.2 },
  "통합 SI시스템": { category: "정보설비", value: 1.5 },
  "시설관리시스템": { category: "정보설비", value: 1.2 },
  "건물에너지관리시스템(BEMS)": { category: "정보설비", value: 1.2 },
  "지능형 인원계수 시스템": { category: "정보설비", value: 0.5 },
  "지능형 경계 감시 시스템": { category: "정보설비", value: 0.5 },
  "스마트 병원 설비(의료용 너스콜)": { category: "정보설비", value: 0.5 },
  "스마트 도난방지 시스템": { category: "정보설비", value: 0.5 },
  "스마트 공장 시스템": { category: "정보설비", value: 1.5 },
  "스마트 도서관 시스템": { category: "정보설비", value: 0.6 },
  "지능형 이상음원 시스템": { category: "정보설비", value: 0.5 },
  "IoT기반 지하공간 안전관리 시스템": { category: "정보설비", value: 0.8 },
  "디지털 사이니지": { category: "정보설비", value: 0.5 },

  // 통신설비
  "케이블 설비": { category: "통신설비", value: 0.58 },
  "배관 설비": { category: "통신설비", value: 0.29 },
  "국선인입 설비": { category: "통신설비", value: 0.2 },
  "단자함 설비": { category: "통신설비", value: 0.1 },
  "이동통신 구내선로 설비": { category: "통신설비", value: 0.3 },
  "전화 설비": { category: "통신설비", value: 0.5 },
  "방송 공동수신 안테나 시설": { category: "통신설비", value: 0.4 },
  "종합유선방송 구내 전송선로 설비": { category: "통신설비", value: 0.3 },

  // 방송설비
  "방송 음향 설비": { category: "방송설비", value: 1.0 },

  // 기타설비
  "통신용 전원 설비": { category: "기타설비", value: 0.5 },
  "통신 접지 설비": { category: "기타설비", value: 0.2 },
};

export const actualQuoteModel: IQuoteModel = {
  calculate: (input: QuoteInput): QuoteOutput => {
    // 0. 연면적에 따른 기술 등급 및 노임단가 결정 (정보통신 엔지니어링 표준 공식 기준)
    const area = input.buildingTotalArea || 0;
    let engineerGrade = "초급기술자";
    let wageRate = 232042;

    if (area >= 60000) {
      engineerGrade = "특급기술자";
      wageRate = 343079;
    } else if (area >= 30000) {
      engineerGrade = "고급기술자";
      wageRate = 315288;
    } else if (area >= 15000) {
      engineerGrade = "중급기술자";
      wageRate = 283343;
    } else if (area >= 5000) {
      engineerGrade = "초급기술자";
      wageRate = 232042;
    } else {
      engineerGrade = "초급기술자";
      wageRate = 232042;
    }

    // 1. 서비스 범위별 타이틀 및 서비스 항목 표시 스위치
    let docTitle = "정보통신설비 유지보수·성능점검 및 선임 대행";
    const services = { manage: true, inspect: true, appoint: true };
    
    if (input.serviceScope === "manage_inspect") {
      docTitle = "정보통신설비 유지보수 및 성능점검";
      services.appoint = false;
    } else if (input.serviceScope === "inspect_only") {
      docTitle = "정보통신설비 성능점검 (단독)";
      services.manage = false;
      services.appoint = false;
    }

    // 2. 입력된 점검 대상 설비를 기반으로 기준 인원(totalPersonnel) 산출
    let totalPersonnel = 0;
    const equipmentBreakdown: EquipmentBreakdown[] = [];

    const selectedEquipments = input.equipmentChecks || [];
    selectedEquipments.forEach((eqName) => {
      const mapping = KICA_PERSONNEL_MAP[eqName];
      if (mapping) {
        // 성능점검 단독일 경우 품셈이 보통 더 적으나, 간소화를 위해 공통 적용 혹은 배수 적용
        const val = services.manage ? mapping.value : mapping.value * 0.5;
        totalPersonnel += val;
        equipmentBreakdown.push({
          name: eqName,
          category: mapping.category,
          personnelValue: val,
        });
      } else {
        // 매핑에 없는 항목인 경우 기본값 0.5 적용
        const val = services.manage ? 0.5 : 0.25;
        totalPersonnel += val;
        equipmentBreakdown.push({
          name: eqName,
          category: "기타설비",
          personnelValue: val,
        });
      }
    });

    // 만약 선택된 설비가 아예 없는데, 연면적이 크다면 기본값 부여 (보정 계수)
    if (totalPersonnel === 0 && input.buildingTotalArea) {
      if (input.buildingTotalArea >= 60000) totalPersonnel = 4.0;
      else if (input.buildingTotalArea >= 30000) totalPersonnel = 3.0;
      else if (input.buildingTotalArea >= 15000) totalPersonnel = 2.0;
      else if (input.buildingTotalArea >= 5000) totalPersonnel = 1.0;
      else totalPersonnel = 0.5;
    }

    // 3. KICA 대가산정 공식 적용
    totalPersonnel = Math.round(totalPersonnel * 100) / 100; // 소수점 2자리 반올림
    const laborCost = Math.floor(totalPersonnel * wageRate); // 직접인건비
    const overheadCost = Math.floor(laborCost * 1.1); // 제경비: 직접인건비의 110%
    const techCost = Math.floor((laborCost + overheadCost) * 0.2); // 기술료: (인건비+제경비)의 20%
    const calcTotal = laborCost + overheadCost + techCost; // 산출 공급가액 합계
    
    // 4. 네고(할인) 및 세금, 최종 금액 역산 로직
    // 기본적으로 입력된 할인율(%) 적용
    const discountRate = Math.min(Math.max(input.discountRate || 0, 0), 100);
    const initialDiscount = Math.floor(calcTotal * (discountRate / 100));
    const initialSupplyCost = calcTotal - initialDiscount;
    const initialTax = Math.floor(initialSupplyCost * 0.1);
    const initialYearTotal = initialSupplyCost + initialTax;
    const initialMonthlyTotal = Math.floor(initialYearTotal / 12);

    // 요구사항: 월 청구금액이 천 단위까지 절삭되어 만 원 단위로만 나오도록 처리
    // 예: 153,400원 -> 150,000원
    const monthlyTotal = Math.floor(initialMonthlyTotal / 10000) * 10000;

    // 절삭된 월 청구금액을 기준으로 연간 총액 및 공급가액/부가세 다시 역산
    const yearTotal = monthlyTotal * 12;
    const supplyCost = Math.round(yearTotal / 1.1); // 부가세 10% 제외 원금
    const taxAmount = yearTotal - supplyCost;
    const discountApplied = calcTotal - supplyCost; // 실제 적용된 최종 할인액

    return {
      docTitle,
      laborCost,
      overheadCost,
      techCost,
      calcTotal,
      discountApplied,
      supplyCost,
      taxAmount,
      yearTotal,
      monthlyTotal,
      totalPersonnel,
      equipmentBreakdown,
      services,
      engineerGrade,
      wageRate,
    };
  },
};
