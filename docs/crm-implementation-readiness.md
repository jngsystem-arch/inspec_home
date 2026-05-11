# CRM 개발 착수 전 확인 및 1차 구현 범위

## 1. 현재 확인 결과

### Supabase 접근

- 로컬에는 `homepage/.env.local`이 없다.
- 확인 가능한 환경변수는 `homepage/.env.example`뿐이다.
- 실제 운영 Supabase 테이블/RLS는 현재 로컬에서 직접 조회할 수 없다.
- 따라서 실제 DB 적용 전 Supabase 대시보드 SQL Editor에서 마이그레이션 SQL을 검토 후 실행해야 한다.

### Cloudflare Pages Functions

- 현재 Next.js는 `output: "export"` 정적 내보내기 구조다.
- Next.js API Route가 아니라 Cloudflare Pages Functions의 `/functions` 디렉터리 방식을 사용해야 한다.
- Pages 프로젝트 루트가 `homepage/`라면 Function 위치는 `homepage/functions/api/inquiries.ts`가 맞다.
- 정적 빌드 디렉터리는 `homepage/out`이다.

## 2. 준비된 파일

### 코드값 및 정규화 기준

```txt
homepage/src/lib/crm.ts
```

포함 내용:

- 신청유형 코드
- 상태 코드
- 서비스 범위 코드
- 연면적 구간 계산
- 전화번호/이메일 정규화
- 주소 지역 추출

### Supabase 마이그레이션 초안

```txt
supabase/migrations/20260511_crm_data_platform.sql
```

포함 내용:

- 기존 `inquiries` 테이블 확장
- `inquiry_events` 테이블 추가
- `quotes` 테이블 추가
- 분석용 인덱스 추가
- 관리자용 RLS 정책 추가
- 기존 관리자페이지 호환을 위한 `name`, `phone`, `company`, `status`, `inquiry_type` 유지

### 접수 API 골격

```txt
homepage/functions/api/inquiries.ts
```

포함 내용:

- `POST /api/inquiries`
- 입력값 검증
- 연면적/지역/유입경로 정규화
- Supabase REST API 저장
- `inquiry_events` 기록
- Web3Forms 메일 발송
- 메일 실패 시에도 DB 저장 성공이면 접수 성공 반환
- 확장 컬럼 저장 실패 시 기존 관리자페이지 호환 최소 컬럼으로 1회 재시도

현재 API 계약:

| 필드 | 허용값 |
| --- | --- |
| `inquiryType` | `consultation`, `quote_direct`, `quote_auto` |
| `serviceScope` | `inspection`, `maintenance`, `manager` |
| 성공 기준 | Supabase `inquiries` 저장 성공 |
| 메일 실패 | 접수 실패로 보지 않고 `email_failed` 이벤트로 기록 시도 |

## 3. 개발 전 반드시 필요한 운영 정보

Cloudflare Pages 환경변수:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
WEB3FORMS_ACCESS_KEY
```

기존 관리자 로그인용 공개 환경변수:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 절대 브라우저 코드에 넣지 않는다.
- `WEB3FORMS_ACCESS_KEY`도 가능하면 Cloudflare Function 환경변수로만 둔다.
- 기존 폼에 하드코딩된 Web3Forms 키는 Function 전환 후 제거한다.
- `SUPABASE_ANON_KEY` 또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 API fallback으로 쓰는 방식은 전환기 임시 장치다.
- 안정화 후에는 고객 접수 저장을 `SUPABASE_SERVICE_ROLE_KEY` 기준으로 고정하고, `anon_insert` 정책과 anon key fallback을 제거한다.

## 4. 현재 API 전환 상태

최근 커밋 기준으로 고객 접수 폼 3개는 모두 `/api/inquiries` 호출 경로로 통합되었다.

| 경로 | 상태 | 비고 |
| --- | --- | --- |
| `/contact` 상담 신청 | 전환 완료 | API 저장 성공 시 완료 화면 표시 |
| `/contact` 견적서 바로 신청 | 전환 완료 | UTM/referrer/landing page 수집 |
| `/estimate` 자동 견적 신청 | 전환 완료 | `sourcePage: "/estimate"` 저장 |

접수 성공 판단은 Web3Forms 메일 수신이 아니라 Supabase 저장 성공이다. 메일이 실패해도 DB 저장이 성공하면 고객에게는 접수 완료를 보여준다.

남은 안정화 작업:

1. 운영 Cloudflare Pages 환경변수 확인
2. Supabase SQL Editor에서 마이그레이션 적용 여부 확인
3. 운영 도메인에서 세 폼 각각 테스트 접수
4. `inquiries` 저장, `inquiry_events` 기록, 관리자페이지 표시 확인
5. Web3Forms 메일 수신 및 실패 이벤트 표시 확인
6. 안정화 후 anon key fallback 제거

## 5. 검증 순서

1. Supabase SQL Editor에서 마이그레이션 실행
2. Cloudflare Pages 환경변수 등록
3. Function 배포 후 `POST /api/inquiries` 수동 테스트
4. `/contact` 상담 신청, `/contact` 견적서 바로 신청, `/estimate` 자동 견적 신청 테스트
5. 관리자페이지에서 세 문의가 모두 표시되는지 확인
6. `inquiry_events`에 `saved_to_db`, `email_sent` 또는 `email_failed`가 남는지 확인
7. Web3Forms 또는 sales 메일 수신 확인
8. 로컬 빌드 및 수정 파일 lint 확인
9. `main` 푸시
10. Cloudflare Pages 배포 확인

수동 API 테스트 예시:

```json
{
  "inquiryType": "quote_direct",
  "customerName": "테스트",
  "customerPhone": "010-0000-0000",
  "customerEmail": "test@example.com",
  "buildingName": "테스트빌딩",
  "buildingAddress": "서울 성동구 아차산로 103",
  "buildingAreaM2": "12,500",
  "serviceScope": ["inspection", "maintenance"],
  "equipmentList": ["네트워크 설비", "영상정보처리기기 시스템(CCTV)"],
  "sourcePage": "/contact"
}
```

## 6. 보류할 일

다음 항목은 1차 접수 안정화 후 진행한다.

- 관리자 CRM 목록 UI 개편
- 상세 패널 및 이벤트 타임라인
- 견적 발급 이력 `quotes` 연동
- 분석 대시보드
- 월별 CSV 자동화
- 상태 변경 시 `inquiry_events` 기록
- `customer_hash` 생성 및 중복 의심 표시
- DB 저장 실패 시 Web3Forms 긴급 알림 또는 Cloudflare 로그 기반 알림

## 7. 현재 리스크

- 실제 Supabase 스키마를 아직 직접 확인하지 못했다.
- Cloudflare Pages에 service role 환경변수가 등록되어 있는지 확인되지 않았다.
- 기존 관리자페이지는 아직 한국어 상태값을 기준으로 일부 통계를 계산한다.
- 기존 `DATA` 파일 삭제 표시와 빌드 산출물 미추적 파일이 작업 트리에 남아 있다.
- DB 자체 저장이 실패하면 같은 DB의 `inquiry_events`에는 실패 이벤트를 남길 수 없다.
- 검증 실패 요청은 현재 문의 레코드가 생성되지 않으므로 별도 실패 로그 저장소 또는 Cloudflare 로그 정책이 필요하다.
- `/estimate`는 현재 최소 유입값으로 `sourcePage`만 저장하므로, 광고 분석까지 하려면 `/contact`와 동일한 attribution 수집을 추가해야 한다.

## 8. 리스크 해결 방침

| 리스크 | 해결 방침 |
| --- | --- |
| service role 누락 | 운영 배포 전 `SUPABASE_SERVICE_ROLE_KEY` 필수 확인. 누락 시 접수 안정화 완료로 보지 않는다. |
| 스키마 미적용 | API의 최소 컬럼 fallback으로 단기 유실을 줄이고, 마이그레이션 적용 후 확장 컬럼 저장을 정상 경로로 고정한다. |
| DB 저장 실패 추적 불가 | 같은 Supabase에 기록할 수 없으므로 `console.error` + Cloudflare 로그 확인, 필요 시 Web3Forms 긴급 알림을 별도 구현한다. |
| 메일 실패 미노출 | `email_failed` 이벤트를 관리자 목록 배지로 노출한다. |
| 상태값 혼재 | 단기적으로 `status` 라벨과 `status_code`를 병행하고, 관리자 UI는 Phase 4에서 `status_code` 기준으로 전환한다. |
| anon fallback 잔존 | 운영 테스트 통과 후 API에서 anon key fallback 제거, Supabase `anon_insert` 정책 제거. |
