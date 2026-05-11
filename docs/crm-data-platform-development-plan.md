# 고객관리 및 데이터 활용 플랫폼 추가 개발계획

## 1. 목적

현재 홈페이지의 문의 및 견적 신청 기능은 고객 접수를 받는 수준에 머물러 있다. 향후 1년 이상 축적된 고객 데이터를 분석하고 영업 의사결정에 활용하기 위해, 접수 데이터를 구조화된 CRM 데이터로 저장하고 관리자페이지에서 조회, 관리, 분석할 수 있는 기반을 구축한다.

본 계획의 목표는 별도 상시 백엔드 서버를 운영하지 않고, 현재 배포 구조인 Cloudflare Pages와 Supabase를 활용해 다음 기능을 구현하는 것이다.

- 문의 및 견적 신청 데이터 유실 방지
- 고객, 건축물, 서비스 범위, 설비, 예상금액, 유입경로의 컬럼화
- 관리자페이지 CRM 기능 강화
- 월별, 지역별, 연면적별, 서비스별 분석 가능
- 향후 계약 전환율, 견적 발급 이력, 영업 성과 분석 가능

## 2. 권장 아키텍처

### 구현 전제

현재 Next.js 설정은 정적 내보내기(`output: "export"`) 기반이다. 따라서 Next.js API Route를 사용할 수 없으며, 서버리스 API는 Cloudflare Pages의 `/functions` 디렉터리로 구현한다.

예상 파일 구조:

```txt
homepage/
  src/
  public/
  functions/
    api/
      inquiries.ts
      admin/
        inquiries.ts
        analytics/
          summary.ts
```

Cloudflare Pages Functions는 정적 사이트와 같은 배포 단위에서 동작하지만, 브라우저에 노출하면 안 되는 `SUPABASE_SERVICE_ROLE_KEY` 같은 비밀값을 서버 환경변수로 안전하게 사용할 수 있다.

### 현재 구조

```txt
고객 브라우저
  ├─ Supabase 직접 저장
  └─ Web3Forms 직접 전송
```

현재 구조는 브라우저 네트워크 환경, 광고 차단, 보안 솔루션, 외부 API 차단 등에 영향을 받을 수 있다. 또한 접수 실패나 메일 발송 실패의 원인을 추적하기 어렵다.

### 목표 구조

```txt
고객 브라우저
  └─ Cloudflare Pages Function /api/inquiries
       ├─ 입력값 검증 및 정규화
       ├─ Supabase inquiries 저장
       ├─ inquiry_events 로그 저장
       └─ Web3Forms 또는 메일 발송
```

Cloudflare Pages Functions는 별도 서버 운영 없이 서버리스 API 역할을 수행한다. Supabase service role key는 Cloudflare 환경변수에만 저장하고 브라우저에는 노출하지 않는다.

## 3. 개발 범위

### 3.1 Supabase 스키마 정리

기존 `inquiries` 테이블을 분석 가능한 구조로 확장한다. 현재 `details` JSON 문자열에만 의존하는 방식은 장기 분석에 부적합하므로, 핵심 값은 컬럼으로 분리한다.

권장 컬럼:

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `bigserial` | 기본 키 |
| `created_at` | `timestamptz` | 최초 접수일 |
| `updated_at` | `timestamptz` | 최근 수정일 |
| `inquiry_type` | `text` | 상담신청, 견적서 바로 신청, 자동 견적 계산 신청 |
| `status` | `text` | 신규 문의, 상담 중, 견적 완료, 계약 진행, 계약 완료, 보류, 종료 |
| `customer_name` | `text` | 담당자명 |
| `customer_phone` | `text` | 연락처 |
| `customer_email` | `text` | 이메일 |
| `company_name` | `text` | 회사명 |
| `building_name` | `text` | 건물명 |
| `building_address` | `text` | 건물 주소 |
| `region` | `text` | 시/도 또는 주요 지역 |
| `district` | `text` | 시/군/구 |
| `building_area_m2` | `numeric` | 연면적 |
| `area_range` | `text` | 3만 이상, 1만~3만, 5천~1만, 5천 미만 |
| `legal_deadline` | `date` | 법적 의무 이행 기한 |
| `service_scope` | `text[]` | 유지보수관리, 성능점검, 관리자 위탁선임 |
| `equipment_count` | `integer` | 선택 설비 수 |
| `equipment_list` | `text[]` | 선택 설비 목록 |
| `estimated_amount` | `numeric` | 예상 견적금액 |
| `message` | `text` | 고객 문의 내용 |
| `source_page` | `text` | `/contact`, `/estimate` 등 |
| `utm_source` | `text` | 광고/검색 유입 출처 |
| `utm_medium` | `text` | 유입 매체 |
| `utm_campaign` | `text` | 캠페인명 |
| `referrer` | `text` | 이전 페이지 |
| `assigned_to` | `text` | 내부 담당자 |
| `memo` | `text` | 관리자 메모 |
| `quote_issued_at` | `timestamptz` | 견적서 발급일 |
| `contracted_at` | `timestamptz` | 계약 완료일 |
| `raw_payload` | `jsonb` | 원본 접수 데이터 보존 |

### 3.2 1년 데이터 수집 필수 컬럼

1년 후 현황 파악을 위해 반드시 수집해야 하는 필드는 다음과 같다. 이 항목들은 대시보드와 CSV 분석의 기준값이 되므로 접수 시점에 최대한 표준화해서 저장한다.

| 분류 | 필수 컬럼 | 목적 |
| --- | --- | --- |
| 유입경로 | `landing_page`, `source_page`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `first_visit_at` | 어떤 경로가 문의와 견적으로 이어지는지 분석 |
| 상태 이력 | `status`, `quote_issued_at`, `contracted_at`, `lost_reason` | 문의 이후 견적/계약 전환 흐름 분석 |
| 건축물 | `building_area_m2`, `area_range`, `legal_deadline`, `region`, `district` | 법정 기한, 규모, 지역별 수요 분석 |
| 서비스 | `service_scope`, `equipment_count`, `equipment_list` | 어떤 서비스와 설비 수요가 많은지 분석 |
| 견적 | `estimated_amount`, `quote_count`, `last_quote_amount` | 평균 견적금액과 견적 전환율 분석 |
| 중복 식별 | `normalized_phone`, `normalized_email`, `dedupe_key`, `customer_hash` | 동일 고객의 반복 문의 묶음 처리 |
| 원본 보존 | `raw_payload` | 향후 컬럼 추가 시 재가공 가능한 원본 데이터 보존 |

### 3.3 코드값 표준

분석 정확도를 위해 내부 저장값은 한국어 자유 텍스트 대신 코드값을 사용하고, 화면에서만 한국어 라벨로 표시한다.

신청유형:

| 코드 | 표시명 |
| --- | --- |
| `consultation` | 상담신청 |
| `quote_direct` | 견적서 바로 신청 |
| `quote_auto` | 자동 견적 계산 신청 |

상태:

| 코드 | 표시명 |
| --- | --- |
| `new` | 신규 문의 |
| `contacting` | 상담 중 |
| `quoted` | 견적 완료 |
| `negotiating` | 계약 진행 |
| `contracted` | 계약 완료 |
| `on_hold` | 보류 |
| `lost` | 종료/실패 |
| `archived` | 보관 |

서비스 범위:

| 코드 | 표시명 |
| --- | --- |
| `inspection` | 성능점검 대행 |
| `maintenance` | 유지보수관리 위탁 |
| `manager` | 유지보수 관리자 위탁선임 |

연면적 구간:

| 코드 | 표시명 | 법정 기한 |
| --- | --- | --- |
| `30000_plus` | 연면적 3만㎡ 이상 | 2025-07-18 |
| `10000_29999` | 연면적 1만㎡ 이상 3만㎡ 미만 | 2026-07-18 |
| `5000_9999` | 연면적 5천㎡ 이상 1만㎡ 미만 | 2027-07-18 |
| `under_5000` | 연면적 5천㎡ 미만 | 대상 여부 확인 필요 |

### 3.4 견적 발급 이력 테이블

문의 1건에서 견적서가 여러 번 수정될 수 있으므로 견적 발급은 `inquiries`의 단일 컬럼이 아니라 별도 `quotes` 테이블로 관리한다.

권장 컬럼:

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `bigserial` | 기본 키 |
| `inquiry_id` | `bigint` | `inquiries.id` 참조 |
| `quote_number` | `text` | 견적번호 |
| `version` | `integer` | 견적 버전 |
| `status` | `text` | draft, issued, revised, accepted, expired |
| `service_scope` | `text[]` | 견적 서비스 범위 |
| `supply_amount` | `numeric` | 공급가 |
| `vat_amount` | `numeric` | 부가세 |
| `total_amount` | `numeric` | 총액 |
| `issued_at` | `timestamptz` | 발급일 |
| `issued_by` | `text` | 발급자 |
| `pdf_url` | `text` | PDF 저장 경로 |
| `raw_quote_data` | `jsonb` | 견적 계산 원본 |

PDF 보관이 필요해지면 Supabase Storage 또는 Cloudflare R2 중 하나를 선택한다. 초기에는 PDF 저장 없이 견적 데이터만 보존하고, Phase 2 이후 파일 저장을 추가한다.

### 3.5 이벤트 로그 테이블 추가

접수 실패 원인과 관리자 작업 이력을 추적하기 위해 `inquiry_events` 테이블을 추가한다.

예상 이벤트:

- `submitted`
- `validation_failed`
- `saved_to_db`
- `db_save_failed`
- `email_sent`
- `email_failed`
- `status_changed`
- `quote_issued`
- `memo_updated`
- `assigned`

권장 컬럼:

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `bigserial` | 기본 키 |
| `inquiry_id` | `bigint` | `inquiries.id` 참조 |
| `created_at` | `timestamptz` | 이벤트 발생 시각 |
| `event_type` | `text` | 이벤트 유형 |
| `actor_type` | `text` | system, customer, admin |
| `actor_email` | `text` | 관리자 이메일 |
| `message` | `text` | 요약 메시지 |
| `metadata` | `jsonb` | 상세 데이터 |

## 4. Cloudflare Pages Functions API 설계

### 4.1 문의 접수 API

```txt
POST /api/inquiries
```

요청 예시:

```json
{
  "inquiryType": "quote_direct",
  "customerName": "홍길동",
  "customerPhone": "010-0000-0000",
  "customerEmail": "customer@example.com",
  "companyName": "ABC관리",
  "buildingName": "ABC빌딩",
  "buildingAddress": "서울 성동구 아차산로 103",
  "buildingAreaM2": 12500,
  "serviceScope": ["inspection", "maintenance"],
  "equipmentList": ["네트워크설비", "CCTV"],
  "estimatedAmount": 570000,
  "message": "상담 요청",
  "sourcePage": "/contact",
  "utm": {
    "source": "naver",
    "medium": "cpc",
    "campaign": "2026_deadline"
  },
  "referrer": "https://search.naver.com"
}
```

주의: API 입력값은 한국어 표시명이 아니라 코드값을 사용한다. `inquiryType`은 `consultation`, `quote_direct`, `quote_auto`만 허용하고, `serviceScope`는 `inspection`, `maintenance`, `manager`만 사용한다. 한국어 라벨은 서버와 관리자 UI에서 표시용으로 변환한다.

처리 순서:

1. 필수값 검증
2. 연락처, 연면적, 금액 등 숫자 정규화
3. 주소에서 `region`, `district` 추출
4. 연면적 기준으로 `area_range`, `legal_deadline` 계산
5. Supabase `inquiries` 확장 컬럼 저장
6. 확장 컬럼 저장 실패 시 기존 관리자페이지 호환 최소 컬럼으로 1회 재시도
7. DB 저장 성공 후 `inquiry_events`에 `saved_to_db` 기록
8. Web3Forms 또는 대체 메일 발송
9. 메일 결과를 `inquiry_events`에 기록
10. 접수 결과 반환

메일 발송 실패는 고객 접수 실패로 처리하지 않는다. Supabase 저장이 성공하면 고객에게는 접수 완료를 표시하고, 메일 발송 실패는 `inquiry_events`에 `email_failed`로 기록한 뒤 관리자페이지에서 경고 배지로 노출한다.

DB 저장 실패는 고객 접수 실패로 처리한다. 같은 Supabase DB에 저장 실패 이벤트를 남길 수 없으므로, `db_save_failed`는 Cloudflare Function 로그와 긴급 알림(Web3Forms 또는 운영 메일)로 추적한다. DB 저장이 실패했는데 메일만 성공해 고객에게 접수 완료를 보여주는 흐름은 금지한다.

응답 예시:

```json
{
  "success": true,
  "inquiryId": 1234,
  "emailSent": true,
  "dbFallbackUsed": false
}
```

### 4.2 관리자용 API

초기에는 관리자페이지가 Supabase 클라이언트로 직접 조회해도 된다. 다만 service role 기반의 서버 처리나 복잡한 분석 쿼리가 필요해지면 아래 API를 추가한다.

```txt
GET /api/admin/inquiries
PATCH /api/admin/inquiries/:id
POST /api/admin/inquiries/:id/events
GET /api/admin/analytics/summary
```

관리자 상태 변경, 메모 추가, 담당자 배정, 견적 발급은 화면에서 직접 `inquiries`만 수정하지 않고 반드시 `inquiry_events`에도 이력을 남긴다. Phase 4부터는 관리자 변경 작업을 API로 모아 상태 변경과 이벤트 기록을 한 트랜잭션처럼 다룬다.

## 5. 프론트엔드 변경 계획

대상 폼:

- `/contact` 상담 신청
- `/contact` 견적서 바로 신청
- `/estimate` 자동 견적 신청

변경 전:

```txt
브라우저에서 Supabase 직접 저장
브라우저에서 Web3Forms 직접 전송
```

변경 후:

```txt
브라우저에서 /api/inquiries 호출
서버리스 API가 Supabase 저장 및 메일 발송 처리
```

현재 전환 상태:

| 폼 | API 전환 | 유입경로 수집 |
| --- | --- | --- |
| `/contact` 상담 신청 | 완료 | `landing_page`, `referrer`, UTM 수집 |
| `/contact` 견적서 바로 신청 | 완료 | `landing_page`, `referrer`, UTM 수집 |
| `/estimate` 자동 견적 신청 | 완료 | 현재 `source_page`만 저장, attribution 확장 필요 |

추가 수집값:

- `source_page`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

브라우저에서는 접수 성공 여부만 표시하고, 저장 및 메일 발송의 세부 실패는 서버 이벤트 로그에 남긴다.

### 5.1 데이터 정규화 규칙

프론트와 서버에서 동일한 정규화 규칙을 사용한다. 최종 기준은 서버 함수의 정규화 결과다.

- 전화번호: 숫자만 추출한 `normalized_phone` 저장
- 이메일: 소문자 변환 후 `normalized_email` 저장
- 연면적: 콤마, 공백, 단위 제거 후 숫자 저장
- 금액: 원 단위 숫자 저장
- 주소: 원본 주소 보존, 시/도와 시/군/구는 별도 추출
- 서비스 범위: 코드값 배열로 저장
- 설비 목록: 설비 코드와 표시명을 분리해 저장
- 중복 식별: `phone + building_name + yyyy-mm` 기반 `dedupe_key` 생성

### 5.2 유입경로 수집 방식

첫 방문 시 `landing_page`, `utm_*`, `referrer`, `first_visit_at`을 sessionStorage 또는 localStorage에 저장한다. 문의 제출 시 현재 페이지의 `source_page`와 함께 API로 전달한다.

필수 수집값:

- 최초 랜딩 페이지
- 제출 페이지
- 이전 referrer
- UTM 5종
- 첫 방문 시간

## 6. 관리자페이지 CRM 개선 계획

관리자 CRM은 업무용 도구이므로 마케팅 랜딩 페이지처럼 장식적인 구성을 피하고, 정보 밀도와 반복 작업 효율을 우선한다. 화면은 넓은 테이블, 빠른 필터, 상태 배지, 우측 상세 패널 중심으로 설계한다.

### 6.1 목록 개선

관리자 대시보드 목록에 다음 컬럼을 추가한다.

- 접수일
- 신청유형
- 상태
- 고객명
- 연락처
- 회사/건물명
- 지역
- 연면적
- 서비스 범위
- 설비 수
- 예상금액
- 담당자
- 견적 발급 여부

### 6.2 필터 및 검색

필터:

- 기간
- 신청유형
- 상태
- 지역
- 연면적 구간
- 서비스 범위
- 설비 수
- 견적 발급 여부
- 계약 여부

검색:

- 고객명
- 연락처
- 회사명
- 건물명
- 주소

### 6.3 상세 화면

문의 상세 화면에 다음 기능을 추가한다.

- 접수 원문 확인
- 상태 변경
- 담당자 배정
- 관리자 메모
- 견적서 발급 이력
- 이벤트 로그 타임라인
- 고객 연락 기록

### 6.4 견적 발급 연동

관리자 견적서 발급 시 다음 값을 저장한다.

- `quote_issued_at`
- `estimated_amount`
- `status = 견적 완료`
- `inquiry_events.event_type = quote_issued`

### 6.5 CRM 화면 디자인안

#### 전체 레이아웃

```txt
┌──────────────────────────────────────────────────────────────┐
│ 상단 바: 로고 / 현재 메뉴 / 빠른 검색 / 관리자 계정           │
├───────────────┬──────────────────────────────────────────────┤
│ 좌측 메뉴     │ CRM 대시보드                                  │
│ - 문의 관리   │ ┌ KPI Strip ────────────────────────────────┐ │
│ - 견적 관리   │ │ 신규 문의 | 상담 중 | 견적 완료 | 계약 완료 │ │
│ - 분석        │ └───────────────────────────────────────────┘ │
│ - 설정        │ 필터 바                                       │
│               │ 데이터 테이블                                │
│               │ 우측 상세 패널 또는 상세 drawer              │
└───────────────┴──────────────────────────────────────────────┘
```

#### 디자인 원칙

- 배경: `#F7F9FC`
- 본문 영역: 흰색 또는 아주 옅은 회색 구획
- 테이블 행 높이: 48~56px
- 카드 radius: 8px 이하
- 상태는 색상 배지로 빠르게 구분
- 숫자 지표는 Inter, 한글 설명은 Pretendard
- 한 화면에서 가장 중요한 것은 “오늘 처리해야 할 문의”다.

#### 상태 색상

| 상태 | 색상 | 용도 |
| --- | --- | --- |
| 신규 문의 | `#0070F3` | 즉시 확인 필요 |
| 상담 중 | `#1A4A8A` | 진행 중 |
| 견적 완료 | `#0E9E6E` | 견적 발급됨 |
| 계약 진행 | `#7C3AED` | 협의 중 |
| 계약 완료 | `#0E9E6E` | 성공 |
| 보류 | `#64748B` | 대기 |
| 종료/실패 | `#E85C0D` | 후속 조치 종료 |

#### 문의 목록 테이블

기본 컬럼:

```txt
접수일 | 상태 | 신청유형 | 고객명 | 회사/건물명 | 지역 | 연면적 | 서비스 | 설비수 | 예상금액 | 유입 | 담당자 | 액션
```

행 클릭 시 우측 상세 패널을 연다. 상세 패널에는 고객 정보, 건물 정보, 요청 서비스, 메모, 이벤트 타임라인, 견적 이력을 탭으로 배치한다.

#### 상세 패널 탭

- `개요`: 고객/건축물/서비스 요약
- `상담 메모`: 관리자 메모와 연락 기록
- `견적`: 견적 발급 이력, 최신 견적금액, PDF 링크
- `이벤트`: 접수, DB 저장, 메일 발송, 상태 변경 로그
- `원본`: raw payload 확인

#### 필터 바

필터는 항상 테이블 상단에 고정한다.

- 기간
- 상태
- 신청유형
- 지역
- 연면적 구간
- 서비스 범위
- 담당자
- 유입경로
- 견적 발급 여부

모바일에서는 필터를 drawer로 접고, 데스크톱에서는 한 줄 + 추가 필터 메뉴로 구성한다.

#### 주요 액션

- 상태 변경
- 담당자 배정
- 메모 추가
- 견적서 발급
- CSV 다운로드
- 아카이브

위험한 액션은 즉시 실행하지 않고 확인 모달을 둔다. CSV 다운로드는 관리자 권한 확인 후 실행한다.

## 7. 분석 대시보드 계획

분석 대시보드는 “현황 파악”과 “의사결정”을 분리한다. 첫 화면은 과도한 차트보다 KPI, 추이, 병목을 우선한다.

### 7.1 핵심 지표

- 월별 문의 수
- 월별 견적 신청 수
- 상담신청 대비 견적 발급률
- 견적 발급 대비 계약 전환율
- 평균 예상 견적금액
- 총 예상 견적금액
- 상태별 건수
- 담당자별 처리 건수

### 7.2 고객/건축물 분석

- 지역별 문의 분포
- 연면적 구간별 문의 분포
- 법적 마감 기한별 문의 분포
- 건물 규모별 평균 견적금액
- 서비스 범위별 문의 비중
- 설비 수별 견적 분포

### 7.3 마케팅 분석

- 유입경로별 문의 수
- UTM 캠페인별 전환 수
- 검색/광고/직접 방문 비교
- 문의 페이지별 성과

### 7.4 분석 대시보드 디자인안

#### 화면 구조

```txt
┌──────────────────────────────────────────────────────────────┐
│ 분석 기간 선택: 최근 30일 / 이번 달 / 분기 / 올해 / 사용자 지정 │
├──────────────────────────────────────────────────────────────┤
│ KPI: 문의수 | 견적수 | 견적전환율 | 계약수 | 계약전환율 | 예상매출 │
├──────────────────────────────┬───────────────────────────────┤
│ 월별 문의/견적 추이           │ 상태별 파이프라인               │
├──────────────────────────────┼───────────────────────────────┤
│ 지역별 문의 분포              │ 연면적 구간별 분포              │
├──────────────────────────────┼───────────────────────────────┤
│ 서비스 범위별 수요            │ 유입경로별 성과                 │
└──────────────────────────────┴───────────────────────────────┘
```

#### KPI 카드

KPI 카드는 6개 이하로 유지한다.

- 전체 문의
- 견적 발급
- 견적 전환율
- 계약 완료
- 계약 전환율
- 예상 견적 총액

각 카드에는 전월 대비 증감률을 작게 표시한다. 색상은 상승/하락을 기계적으로 좋고 나쁨으로 판단하지 않고, 계약/매출 지표에만 성공 색상을 사용한다.

#### 차트 구성

- 월별 추이: 라인 차트
- 상태별 파이프라인: 가로 막대
- 지역별 문의: 순위형 막대
- 연면적 구간: 도넛 또는 막대
- 서비스 범위: 누적 막대
- 유입경로: 테이블 + 전환율

운영자가 정확한 숫자를 확인해야 하므로 모든 차트에는 hover tooltip과 하단 데이터 테이블 링크를 제공한다.

#### 데이터 없음 상태

초기 운영 기간에는 데이터가 적을 수 있다. 빈 차트 대신 다음 정보를 보여준다.

- “선택한 기간에 데이터가 없습니다.”
- 마지막 접수일
- 필터 초기화 버튼

#### 다운로드

분석 화면 우측 상단에 `CSV 다운로드` 버튼을 둔다. 다운로드 범위는 현재 필터 조건과 동일해야 한다.

## 8. 보안 및 권한 정책

### 8.1 환경변수

Cloudflare Pages에 다음 환경변수를 등록한다.

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
WEB3FORMS_ACCESS_KEY
```

브라우저에 노출되는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 관리자 인증용으로만 사용하고, 고객 접수 저장은 서버리스 API에서 service role key로 처리한다.

`SUPABASE_SERVICE_ROLE_KEY`는 운영 접수 안정화의 필수 조건이다. 전환기에는 API가 `SUPABASE_ANON_KEY` 또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 저장을 재시도할 수 있지만, 이는 기존 `anon_insert` 정책이 남아 있을 때만 동작하는 임시 안전장치다. 운영 검증이 끝나면 anon key fallback과 Supabase `anon_insert` 정책을 제거한다.

### 8.2 Supabase RLS

권장 정책:

- `anon`: `inquiries` 직접 읽기/수정 금지
- `anon`: 가능하면 직접 INSERT도 금지하고 `/api/inquiries`만 허용
- `authenticated`: 관리자만 SELECT/UPDATE 가능
- `service_role`: Cloudflare Function에서만 사용

### 8.3 개인정보 관리

- 고객 연락처와 이메일은 관리자 인증 후에만 조회 가능
- 다운로드 기능은 관리자 전용
- 이벤트 로그에는 민감정보를 최소화
- 불필요한 원본 payload 장기 보존 정책 검토

### 8.4 개인정보 보존 및 파기 정책

1년 데이터 분석 목적과 개인정보 보호를 함께 고려해 보존 기준을 정한다.

권장 기준:

- 접수 원본 및 연락처: 내부 영업관리 목적상 3년 보존 후 검토
- 계약 완료 고객: 계약 및 세무/분쟁 대응 기준에 따라 별도 보존
- 실패/종료 고객: 1년 후 마케팅 활용 필요성이 낮으면 비식별화 검토
- 분석용 집계 데이터: 개인정보 제거 후 장기 보존 가능
- CSV 다운로드 파일: 관리자 개인 PC 장기 보관 금지, 필요 시 재다운로드 원칙

삭제 요청 대응:

- 고객 요청 시 `customer_name`, `customer_phone`, `customer_email` 등 식별자를 삭제 또는 마스킹
- 분석용 `region`, `area_range`, `service_scope`, `estimated_amount`는 비식별 상태로 보존 가능

### 8.5 실패 추적 정책

접수 API는 실패를 숨기지 않는다. 다만 실패 유형에 따라 기록 위치가 다르다.

| 실패 유형 | 고객 응답 | 기록 위치 | 비고 |
| --- | --- | --- | --- |
| 검증 실패 | 400 실패 | Cloudflare Function 로그 | 문의 레코드가 없으므로 `inquiry_events`에 남기지 않는다. 필요 시 별도 `intake_failures` 테이블을 추가한다. |
| DB 저장 실패 | 500 실패 | Cloudflare Function 로그 + 긴급 알림 | 같은 DB에 `db_save_failed`를 기록할 수 없으므로 운영 로그와 메일 알림으로 추적한다. |
| 확장 컬럼 저장 실패, 최소 컬럼 저장 성공 | 성공 | `inquiry_events.saved_to_db` + `metadata.dbFallbackUsed=true` | 마이그레이션 누락 기간의 유실 방지 장치다. |
| 메일 발송 실패 | 성공 | `inquiry_events.email_failed` | DB 저장이 성공했으므로 고객 접수는 완료로 처리한다. |
| 중복 의심 | 성공 | `inquiry_events.duplicate_detected` | `dedupe_key` 또는 `customer_hash` 기반으로 Phase 4에서 구현한다. |

DB 저장이 성공하고 메일만 실패한 경우 고객에게는 접수 완료를 표시한다. 관리자 목록에는 “메일 실패” 배지를 노출해 수동 연락이 가능하게 한다.

DB 저장이 실패한 경우에는 고객에게 완료 화면을 보여주지 않는다. 유실 방지를 위해 실패 메시지에는 대표번호를 표시하고, 운영자에게는 긴급 알림을 보내는 구현을 추가한다.

## 9. 구현 단계

### Phase 1. 스키마 확장 및 마이그레이션

- `inquiries` 컬럼 확장
- `inquiry_events` 테이블 추가
- `quotes` 테이블 추가
- 상태 코드, 신청유형 코드, 서비스 코드 정의
- 기존 `details` JSON에서 가능한 값 일부 마이그레이션
- 관리자페이지 기존 조회가 깨지지 않도록 호환 처리

완료 기준:

- 기존 문의 목록이 정상 조회된다.
- 신규 컬럼에 데이터가 저장될 준비가 끝난다.

### Phase 2. Cloudflare Pages Function 추가

- `/functions/api/inquiries.ts` 구현
- `POST /api/inquiries` 구현
- 입력 검증 및 정규화
- Supabase 저장
- 확장 컬럼 저장 실패 시 최소 컬럼 저장 fallback
- 이벤트 로그 저장
- Web3Forms 전송
- DB 저장 실패 시 Cloudflare 로그 및 긴급 알림

완료 기준:

- 세 폼 중 하나에서 API 호출로 문의가 저장된다.
- 메일 발송 성공/실패가 이벤트 로그에 남는다.
- service role key 누락 상태를 운영 완료로 보지 않는다.

### Phase 3. 프론트 폼 전송 경로 통합

- `/contact` 상담 신청을 `/api/inquiries` 호출로 변경
- `/contact` 견적서 바로 신청을 `/api/inquiries` 호출로 변경
- `/estimate` 자동 견적 신청을 `/api/inquiries` 호출로 변경
- `/contact` UTM/referrer 수집 추가
- `/estimate` attribution 수집 보강

완료 기준:

- 모든 고객 접수가 관리자페이지에 남는다.
- Web3Forms 실패 시에도 DB 접수는 남는다.
- DB 저장 실패 시 완료 화면을 보여주지 않는다.

### Phase 4. 관리자 CRM 기능 강화

- 목록 컬럼 확장
- 필터 및 검색 추가
- `status_code` 기준 상태 변경 개선
- 관리자 메모 추가
- 담당자 배정 추가
- 견적 발급 이력 저장
- 메일 발송 실패 배지 표시
- 상세 패널 및 이벤트 타임라인 추가
- 상태 변경, 메모, 담당자 배정, 견적 발급 시 `inquiry_events` 기록

완료 기준:

- 문의 접수부터 견적 발급까지 상태 추적이 가능하다.
- 관리자 화면의 통계와 필터는 한국어 `status`가 아니라 `status_code` 기준으로 동작한다.

### Phase 5. 분석 대시보드

- 월별 문의/견적 추이
- 지역별, 연면적별, 서비스별 통계
- 유입경로별 성과
- CSV/Excel 다운로드

완료 기준:

- 1년치 데이터를 월별/지역별/서비스별로 분석할 수 있다.

## 10. 우선순위

1. 상태 코드, 신청유형 코드, 서비스 코드 확정
2. Supabase 스키마 확장
3. `inquiry_events`, `quotes` 테이블 추가
4. `/api/inquiries` 서버리스 접수 API
5. 세 폼의 API 전송 통합 검증
6. service role key 운영 확인 및 anon fallback 제거
7. DB 저장 실패 긴급 알림 구현
8. 관리자 목록 컬럼 및 필터 개선
9. 견적 발급 이력 저장
10. 이벤트 로그 타임라인
11. 분석 대시보드

## 10.1 1년 데이터 수집을 위한 최소 출시 범위

초기 버전에서 반드시 포함해야 할 항목은 다음이다.

1. 모든 문의/견적 접수의 DB 저장
2. 유입경로 저장
3. 상태 변경 이력 저장
4. 견적 발급 이력 저장
5. 지역, 연면적 구간, 서비스 범위 표준화
6. 중복 고객 식별값 저장
7. 월별 CSV 내보내기
8. 접수 실패 긴급 알림 및 메일 실패 로그 저장
9. 관리자 UI의 `status_code` 기준 전환
10. anon insert/fallback 제거

이 범위를 먼저 완성해야 1년 후 데이터를 신뢰할 수 있다. 분석 대시보드는 이 데이터가 안정적으로 쌓이기 시작한 뒤 확장한다.

## 10.2 월별 운영 리포트 항목

매월 말 다음 지표를 CSV 또는 관리자 대시보드에서 확인한다.

- 총 문의 수
- 견적 신청 수
- 견적 발급 수
- 계약 진행 수
- 계약 완료 수
- 견적 전환율
- 계약 전환율
- 지역별 문의 TOP 10
- 연면적 구간별 문의 수
- 서비스 범위별 문의 수
- 유입경로별 문의 수
- 메일 발송 실패 수
- DB 저장 실패 수
- 중복 의심 문의 수
- fallback 저장 사용 수

## 11. 운영 체크리스트

- Cloudflare Pages 환경변수 등록 여부 확인
- `SUPABASE_SERVICE_ROLE_KEY` 등록 여부 확인
- Supabase RLS 정책 확인
- Supabase `anon_insert` 제거 여부 확인
- Web3Forms 키 정상 여부 확인
- 고객 접수 테스트
- 관리자페이지 조회 테스트
- 메일 수신 테스트
- 이벤트 로그 기록 확인
- DB 저장 실패 긴급 알림 테스트
- 배포 후 실제 운영 도메인 확인
- 월별 CSV 백업 확인
- 개인정보 다운로드 권한 확인
- 메일 발송 실패 배지 확인
- 중복 문의 탐지 여부 확인

## 12. 기대 효과

- 고객 문의 유실 가능성 감소
- 관리자페이지에서 모든 접수 이력 확인 가능
- 견적 발급 및 상담 상태 추적 가능
- 1년 후 영업 데이터 분석 가능
- 지역, 규모, 서비스 범위별 수요 파악 가능
- 광고/검색 유입 성과 측정 가능
- 향후 CRM, 마케팅 자동화, 계약관리 기능 확장 가능
