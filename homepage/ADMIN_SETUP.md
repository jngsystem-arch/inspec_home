# 관리자 페이지 설정 가이드

## 개요

- `/admin/login` — 관리자 로그인 (Supabase Auth)
- `/admin/dashboard` — 상담 신청 목록·상태 관리
- `/admin/quote` — KICA 대가산정 견적서 발급(PDF)
- 푸터 회사 로고 아래 작은 점(`·`)이 숨겨진 관리자 진입점입니다.

## 보안 설계 (요약)

| 계층 | 방어 수단 |
|------|-----------|
| 1. 인증 | Supabase Auth 이메일·비밀번호 (하드코딩 비밀번호 제거) |
| 2. 권한 | Supabase Row Level Security (RLS) — `authenticated` 역할만 SELECT/UPDATE |
| 3. 색인 차단 | `/admin/*` 전 페이지 `<meta name="robots" content="noindex, nofollow">` |
| 4. 크롤 차단 | `robots.txt` 모든 UA에 `Disallow: /admin`, `/admin/` |
| 5. 속도 제한 | 로그인 5회 실패 시 60초 쿨다운 (클라이언트 localStorage) |
| 6. 에러 은닉 | 로그인 실패 시 상세 사유 미노출 (계정 열거 공격 방어) |
| 7. 회원가입 차단 | 사이트에서 계정 생성 UI 없음 — 관리자가 Supabase 대시보드에서만 생성 |

Cloudflare Pages가 과거에 거부했던 하드코딩 비밀번호 패턴은 완전히 제거되었습니다.

---

## 1단계 · Cloudflare Pages 환경변수 등록

대시보드 → Workers & Pages → 프로젝트 → **Settings** → **Environment variables**:

```
NEXT_PUBLIC_SUPABASE_URL      = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
```

Production + Preview 모두 설정 후 **Retry deployment**.

> `NEXT_PUBLIC_` 접두어는 브라우저에 노출되지만 anon key는 공개 가능한 값입니다.
> 실제 데이터 보호는 **RLS 정책**이 담당합니다(아래 2단계).

---

## 2단계 · Supabase 데이터베이스 · RLS 정책

### 2-1. `inquiries` 테이블 스키마 (이미 존재 시 생략)

Supabase 대시보드 → **Table Editor** → **New table**:

```sql
create table public.inquiries (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  name          text not null,
  phone         text not null,
  company       text,
  inquiry_type  text default '기본 신청',
  details       text,           -- JSON 문자열
  status        text default '신규 문의',
  is_archived   boolean default false
);
```

### 2-2. RLS 활성화 (⚠️ 필수)

SQL Editor에서 실행:

```sql
-- RLS 활성화
alter table public.inquiries enable row level security;

-- 기존 정책 정리
drop policy if exists "anon_insert" on public.inquiries;
drop policy if exists "auth_select" on public.inquiries;
drop policy if exists "auth_update" on public.inquiries;

-- 상담 폼은 익명 사용자가 INSERT만 가능
create policy "anon_insert"
  on public.inquiries for insert
  to anon
  with check (true);

-- 관리자(로그인된 사용자)만 SELECT 가능
create policy "auth_select"
  on public.inquiries for select
  to authenticated
  using (true);

-- 관리자만 UPDATE 가능 (상태 변경 · 보관)
create policy "auth_update"
  on public.inquiries for update
  to authenticated
  using (true)
  with check (true);

-- DELETE 권한은 아무에게도 부여하지 않음 (데이터 무결성 보호)
```

> ⚠️ 이 정책이 없으면 **URL만 알아도 누구나 문의 데이터를 조회할 수 있습니다.** 반드시 적용하세요.

### 2-3. (선택) 검증

```sql
-- anon 키로 SELECT 시도 — 반드시 빈 배열 또는 에러가 반환되어야 함
select * from public.inquiries;
```

---

## 3단계 · 관리자 계정 생성

### Supabase 대시보드 → **Authentication** → **Users** → **Add user** → **Create new user**

| 필드 | 값 |
|------|----|
| Email | `admin@jngsystem.co.kr` (원하는 주소) |
| Password | **강력한 비밀번호**(영문 대소문자·숫자·기호 12자+) |
| Auto Confirm User | ✅ 체크 |

> 절대 사이트에서 회원가입 UI를 만들지 마세요 — 관리자 계정은 대시보드에서만 생성해야 합니다.

### 비밀번호 분실 시

Supabase 대시보드 → Users → 해당 계정 → **Send password recovery** 또는 **Reset password**.

### 추가 보안 (권장)

- **Authentication > Providers > Email**에서 `Confirm email: true` 설정
- **Authentication > Settings**에서 `Site URL`을 `https://jngsystem.com`로 고정
- **Redirect URLs**에 `https://jngsystem.com/admin/**`만 허용
- 프로덕션 DB는 `Auth > Settings`에서 **Enable 2FA** 활성화

---

## 4단계 · 접속 테스트

1. 배포된 `https://jngsystem.com` 방문
2. 푸터 회사 로고 바로 아래의 희미한 `·` 클릭 → `/admin/login` 진입
3. 이메일·비밀번호 입력
4. `/admin/dashboard`로 자동 이동되어 문의 목록이 표시되면 정상

### 동작 확인 체크리스트

- [ ] `/admin/dashboard`에 직접 URL 입력 시, 세션이 없으면 자동으로 `/admin/login`으로 이동
- [ ] 로그인 후 문의 목록이 조회됨
- [ ] "🔴 신규 문의" → "✅ 견적 완료" 상태 변경 가능
- [ ] 보관(숨기기) 아이콘 정상 동작
- [ ] "견적서 발급" 버튼으로 `/admin/quote?id=X` 이동 → KICA 자동 견적 생성 → PDF 인쇄 가능
- [ ] 로그아웃 후 `/admin/dashboard` 재방문 시 `/admin/login`으로 리다이렉트
- [ ] 5회 연속 로그인 실패 시 60초 쿨다운 표시

---

## 문제 해결

| 증상 | 원인 · 해결 |
|------|-------------|
| 로그인 페이지에서 "인증 서비스가 구성되지 않았습니다" 경고 | Cloudflare Pages 환경변수 미등록 → 1단계 재확인 · 재배포 |
| 로그인은 되는데 대시보드 목록이 비어 있음 | RLS `auth_select` 정책 미적용 → 2-2 SQL 재실행 |
| "이메일 또는 비밀번호가 올바르지 않습니다" 반복 | 계정 미생성 또는 비밀번호 오입력 → 3단계에서 계정 생성 · 비밀번호 재설정 |
| 상태 업데이트 실패 경고 | RLS `auth_update` 정책 미적용 |
| 누군가 `/admin/*`에 무단 접근 시도 | 세션 없으면 자동으로 로그인 페이지로 이동 + RLS로 데이터 차단 → 추가 대응 불필요 |

---

## 변경 이력

- 2026-04 · 하드코딩 비밀번호(`dpdlwjsxm8*`) 방식 완전 제거, Supabase Auth 전환
- `/admin/*` 경로 robots Disallow + noindex 메타 적용
- 푸터 숨겨진 진입점 유지 (회사 로고 아래 작은 `·`)
