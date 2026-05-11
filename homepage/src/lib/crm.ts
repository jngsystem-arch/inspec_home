export const INQUIRY_TYPE = {
  consultation: "consultation",
  quoteDirect: "quote_direct",
  quoteAuto: "quote_auto",
} as const;

export type InquiryTypeCode = (typeof INQUIRY_TYPE)[keyof typeof INQUIRY_TYPE];

export const INQUIRY_TYPE_LABEL: Record<InquiryTypeCode, string> = {
  consultation: "상담 신청",
  quote_direct: "견적서 바로 신청",
  quote_auto: "자동 견적 계산 신청",
};

export const INQUIRY_STATUS = {
  new: "new",
  contacting: "contacting",
  quoted: "quoted",
  negotiating: "negotiating",
  contracted: "contracted",
  onHold: "on_hold",
  lost: "lost",
  archived: "archived",
} as const;

export type InquiryStatusCode = (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];

export const INQUIRY_STATUS_LABEL: Record<InquiryStatusCode, string> = {
  new: "신규 문의",
  contacting: "상담 중",
  quoted: "견적 완료",
  negotiating: "계약 진행",
  contracted: "계약 완료",
  on_hold: "보류",
  lost: "종료/실패",
  archived: "보관",
};

export const SERVICE_SCOPE = {
  inspection: "inspection",
  maintenance: "maintenance",
  manager: "manager",
} as const;

export type ServiceScopeCode = (typeof SERVICE_SCOPE)[keyof typeof SERVICE_SCOPE];

export const SERVICE_SCOPE_LABEL: Record<ServiceScopeCode, string> = {
  inspection: "성능점검 대행",
  maintenance: "유지보수관리 위탁",
  manager: "유지보수 관리자 선임",
};

export type AreaRangeCode =
  | "30000_plus"
  | "10000_29999"
  | "5000_9999"
  | "under_5000"
  | "unknown";

export type AreaRangeInfo = {
  code: AreaRangeCode;
  label: string;
  legalDeadline: string | null;
};

export function getAreaRange(areaM2: number | null | undefined): AreaRangeInfo {
  if (!areaM2 || areaM2 <= 0) {
    return { code: "unknown", label: "연면적 미확인", legalDeadline: null };
  }

  if (areaM2 >= 30000) {
    return { code: "30000_plus", label: "연면적 3만㎡ 이상", legalDeadline: "2025-07-18" };
  }

  if (areaM2 >= 10000) {
    return { code: "10000_29999", label: "연면적 1만㎡ 이상 3만㎡ 미만", legalDeadline: "2026-07-18" };
  }

  if (areaM2 >= 5000) {
    return { code: "5000_9999", label: "연면적 5천㎡ 이상 1만㎡ 미만", legalDeadline: "2027-07-18" };
  }

  return { code: "under_5000", label: "연면적 5천㎡ 미만", legalDeadline: null };
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseAreaM2(value: string | number | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;

  const digits = value.replace(/[^0-9.]/g, "");
  if (!digits) return null;

  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

export function extractKoreanRegion(address: string): { region: string | null; district: string | null } {
  const parts = address.trim().split(/\s+/).filter(Boolean);

  return {
    region: parts[0] ?? null,
    district: parts[1] ?? null,
  };
}
