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

## 4. 1차 API 전환 권장 범위

첫 전환 대상은 `/contact`의 `견적서 바로 신청하기` 폼이다.

이유:

- 실제 영업 데이터 가치가 가장 높다.
- 서비스 범위, 설비 수, 연면적, 지역 등 분석에 필요한 필드가 많다.
- 관리자페이지와 견적 발급 흐름으로 이어지는 핵심 경로다.

1차 전환에서 할 일:

1. `DetailContactForm`의 기존 Supabase/Web3Forms 직접 호출 제거
2. `/api/inquiries` 호출로 통합
3. UTM/referrer/landing page 수집 추가
4. 접수 성공 시 기존 완료 화면 유지
5. 실패 시 전화번호 포함 안내 표시
6. 운영 배포 후 테스트 접수 1건 생성
7. Supabase `inquiries`, `inquiry_events`에 정상 기록되는지 확인
8. sales 메일 수신 여부 확인

## 5. 검증 순서

1. Supabase SQL Editor에서 마이그레이션 실행
2. Cloudflare Pages 환경변수 등록
3. Function 배포 후 `POST /api/inquiries` 수동 테스트
4. `/contact` 견적서 바로 신청 폼 API 전환
5. 로컬 빌드 확인
6. `main` 푸시
7. Cloudflare Pages 배포 확인
8. 운영 도메인에서 테스트 접수
9. 관리자페이지에서 문의 확인
10. Web3Forms 또는 sales 메일 수신 확인

## 6. 보류할 일

다음 항목은 1차 접수 안정화 후 진행한다.

- 기존 상담신청 폼 전환
- `/estimate` 자동 견적 신청 폼 전환
- 관리자 CRM 목록 UI 개편
- 상세 패널 및 이벤트 타임라인
- 견적 발급 이력 `quotes` 연동
- 분석 대시보드
- 월별 CSV 자동화

## 7. 현재 리스크

- 실제 Supabase 스키마를 아직 직접 확인하지 못했다.
- Cloudflare Pages에 service role 환경변수가 등록되어 있는지 확인되지 않았다.
- Function이 배포되어도 프론트 폼을 전환하기 전까지는 사용되지 않는다.
- 기존 관리자페이지는 아직 한국어 상태값을 기준으로 일부 통계를 계산한다.
- 기존 `DATA` 파일 삭제 표시와 빌드 산출물 미추적 파일이 작업 트리에 남아 있다.
