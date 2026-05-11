type Env = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_SERVICE_ROL_KEY?: string;
  WEB3FORMS_ACCESS_KEY?: string;
  WEB3_FORMS_ACCESS_KEY?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

type InquiryTypeCode = "consultation" | "quote_direct" | "quote_auto";

type IncomingInquiry = {
  inquiryType?: InquiryTypeCode;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  companyName?: string;
  buildingName?: string;
  buildingAddress?: string;
  buildingAreaM2?: number | string;
  serviceScope?: string[];
  equipmentList?: string[];
  estimatedAmount?: number | string;
  message?: string;
  sourcePage?: string;
  landingPage?: string;
  referrer?: string;
  firstVisitAt?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
};

type SupabaseInsertResult = Array<{ id: number }>;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const INQUIRY_TYPE_LABEL: Record<InquiryTypeCode, string> = {
  consultation: "상담 신청",
  quote_direct: "견적서 바로 신청",
  quote_auto: "자동 견적 계산 신청",
};

function getSupabaseServiceKey(env: Env): string | undefined {
  return env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROL_KEY;
}

function getWeb3FormsKey(env: Env): string | undefined {
  return env.WEB3FORMS_ACCESS_KEY ?? env.WEB3_FORMS_ACCESS_KEY;
}

function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...(init?.headers ?? {}),
    },
  });
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseNumber(value: number | string | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;

  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function getAreaInfo(areaM2: number | null): { areaRange: string; legalDeadline: string | null } {
  if (!areaM2 || areaM2 <= 0) return { areaRange: "unknown", legalDeadline: null };
  if (areaM2 >= 30000) return { areaRange: "30000_plus", legalDeadline: "2025-07-18" };
  if (areaM2 >= 10000) return { areaRange: "10000_29999", legalDeadline: "2026-07-18" };
  if (areaM2 >= 5000) return { areaRange: "5000_9999", legalDeadline: "2027-07-18" };
  return { areaRange: "under_5000", legalDeadline: null };
}

function extractRegion(address: string): { region: string | null; district: string | null } {
  const parts = address.trim().split(/\s+/).filter(Boolean);

  return {
    region: parts[0] ?? null,
    district: parts[1] ?? null,
  };
}

function validateInquiry(input: IncomingInquiry): string | null {
  if (!input.inquiryType || !(input.inquiryType in INQUIRY_TYPE_LABEL)) {
    return "신청 유형이 올바르지 않습니다.";
  }

  if (!textValue(input.customerName)) return "담당자명을 입력해 주세요.";
  if (!normalizePhone(textValue(input.customerPhone))) return "연락처를 입력해 주세요.";

  return null;
}

async function supabaseInsert<T>(
  env: Env,
  table: string,
  row: Record<string, unknown>,
  select = "",
): Promise<T> {
  const serviceKey = getSupabaseServiceKey(env);

  if (!env.SUPABASE_URL || !serviceKey) {
    throw new Error("Supabase service credentials are not configured.");
  }

  const endpoint = `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${select}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Supabase insert failed: ${response.status} ${message}`);
  }

  return (await response.json()) as T;
}

async function sendEmail(env: Env, payload: Record<string, unknown>): Promise<boolean> {
  const web3FormsKey = getWeb3FormsKey(env);
  if (!web3FormsKey) return false;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3FormsKey,
        ...payload,
      }),
    });
    const data = (await response.json()) as { success?: boolean };
    return response.ok && data.success === true;
  } catch {
    return false;
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  let input: IncomingInquiry;

  try {
    input = (await context.request.json()) as IncomingInquiry;
  } catch {
    return json({ success: false, error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const validationError = validateInquiry(input);
  if (validationError) {
    return json({ success: false, error: validationError }, { status: 400 });
  }

  const customerName = textValue(input.customerName);
  const customerPhone = textValue(input.customerPhone);
  const customerEmail = textValue(input.customerEmail);
  const companyName = textValue(input.companyName);
  const buildingName = textValue(input.buildingName);
  const buildingAddress = textValue(input.buildingAddress);
  const buildingAreaM2 = parseNumber(input.buildingAreaM2);
  const estimatedAmount = parseNumber(input.estimatedAmount);
  const areaInfo = getAreaInfo(buildingAreaM2);
  const regionInfo = extractRegion(buildingAddress);
  const inquiryTypeCode = input.inquiryType ?? "consultation";
  const inquiryTypeLabel = INQUIRY_TYPE_LABEL[inquiryTypeCode];
  const normalizedPhone = normalizePhone(customerPhone);
  const normalizedEmail = normalizeEmail(customerEmail);
  const now = new Date();
  const yyyyMm = now.toISOString().slice(0, 7);
  const dedupeKey = [normalizedPhone, buildingName || companyName, yyyyMm]
    .filter(Boolean)
    .join("|");

  const emailPayload: Record<string, unknown> = {
    subject: `[${inquiryTypeLabel}] ${buildingName || companyName || customerName}`,
    from_name: "제이앤지시스템 홈페이지",
    "신청유형": inquiryTypeLabel,
    "담당자명": customerName,
    "연락처": customerPhone,
    "이메일": customerEmail,
    "회사명": companyName,
    "건물명": buildingName,
    "건물소재지": buildingAddress,
    "연면적": buildingAreaM2,
    "서비스범위": input.serviceScope?.join(", ") ?? "",
    "선택설비수": input.equipmentList?.length ?? 0,
    "선택설비목록": input.equipmentList?.join(", ") ?? "",
    "예상금액": estimatedAmount,
    "문의내용": textValue(input.message),
    "유입페이지": input.sourcePage,
    "랜딩페이지": input.landingPage,
    "유입경로": input.referrer,
  };

  const inquiryRow: Record<string, unknown> = {
    name: customerName,
    phone: customerPhone,
    company: buildingName || companyName,
    inquiry_type: inquiryTypeLabel,
    inquiry_type_code: inquiryTypeCode,
    details: JSON.stringify(emailPayload),
    status: "신규 문의",
    status_code: "new",
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail || null,
    normalized_phone: normalizedPhone || null,
    normalized_email: normalizedEmail || null,
    company_name: companyName || null,
    building_name: buildingName || null,
    building_address: buildingAddress || null,
    region: regionInfo.region,
    district: regionInfo.district,
    building_area_m2: buildingAreaM2,
    area_range: areaInfo.areaRange,
    legal_deadline: areaInfo.legalDeadline,
    service_scope: input.serviceScope ?? [],
    equipment_count: input.equipmentList?.length ?? 0,
    equipment_list: input.equipmentList ?? [],
    estimated_amount: estimatedAmount,
    message: textValue(input.message) || null,
    source_page: textValue(input.sourcePage) || null,
    landing_page: textValue(input.landingPage) || null,
    referrer: textValue(input.referrer) || null,
    first_visit_at: textValue(input.firstVisitAt) || null,
    utm_source: textValue(input.utm?.source) || null,
    utm_medium: textValue(input.utm?.medium) || null,
    utm_campaign: textValue(input.utm?.campaign) || null,
    utm_term: textValue(input.utm?.term) || null,
    utm_content: textValue(input.utm?.content) || null,
    dedupe_key: dedupeKey || null,
    raw_payload: input,
  };

  let inquiryId: number | null = null;

  try {
    const inserted = await supabaseInsert<SupabaseInsertResult>(
      context.env,
      "inquiries",
      inquiryRow,
      "?select=id",
    );
    inquiryId = inserted[0]?.id ?? null;
  } catch (error) {
    return json(
      {
        success: false,
        error: "접수 저장에 실패했습니다.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }

  await supabaseInsert(context.env, "inquiry_events", {
    inquiry_id: inquiryId,
    event_type: "saved_to_db",
    actor_type: "system",
    message: "문의가 CRM에 저장되었습니다.",
    metadata: { inquiryTypeCode },
  }).catch(() => undefined);

  const emailSent = await sendEmail(context.env, emailPayload);

  await supabaseInsert(context.env, "inquiry_events", {
    inquiry_id: inquiryId,
    event_type: emailSent ? "email_sent" : "email_failed",
    actor_type: "system",
    message: emailSent ? "알림 메일이 발송되었습니다." : "알림 메일 발송에 실패했습니다.",
    metadata: { provider: "web3forms" },
  }).catch(() => undefined);

  return json({
    success: true,
    inquiryId,
    emailSent,
  });
}

export async function onRequest(): Promise<Response> {
  return json({ success: false, error: "Method not allowed" }, { status: 405 });
}
