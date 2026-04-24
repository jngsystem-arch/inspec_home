export type ServiceScope = "all" | "manage_inspect" | "inspect_only";

export interface QuoteInput {
  companyName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  buildingAddress?: string;
  buildingTotalArea?: number;
  equipmentChecks?: string[];
  serviceScope: ServiceScope;
  discountRate: number; // 0 ~ 100 (%)
  salesName: string;
  salesPhone: string;
  message?: string;
  originalServiceScope?: string;
}

export interface EquipmentBreakdown {
  name: string;
  category: string;
  personnelValue: number;
}

export interface QuoteOutput {
  docTitle: string;
  laborCost: number;
  overheadCost: number;
  techCost: number;
  calcTotal: number;
  discountApplied: number;
  supplyCost: number;
  taxAmount: number;
  yearTotal: number;
  monthlyTotal: number;
  totalPersonnel: number;
  equipmentBreakdown: EquipmentBreakdown[];
  services: {
    manage: boolean;
    inspect: boolean;
    appoint: boolean;
  };
  engineerGrade: string;
  wageRate: number;
}

export interface IQuoteModel {
  calculate(input: QuoteInput): QuoteOutput;
}

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
  {
    id: "maintenance",
    label: "유지보수관리 대행",
    desc: "반기 1회 관리점검 대행",
  },
  {
    id: "inspection",
    label: "성능점검 대행",
    desc: "연 1회 성능점검 대행",
  },
  {
    id: "manager",
    label: "관리자 위탁선임",
    desc: "선임 간주 처리 및 신고 대행",
  },
];
