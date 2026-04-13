# 정보통신설비 유지보수관리 & 성능점검 홈페이지 프로젝트

## 비즈니스 개요

**업종**: 정보통신설비 유지보수·관리 및 성능점검 대행 (B2B)
**법적 근거**: 정보통신공사업법 제37조의2 ~ 제37조의4 (시행일: 2024.7.19)
**핵심 포지션**: 건축물 관리주체가 법적 의무를 이행할 수 있도록 성능점검 및 유지보수 관리를 대행하는 전문 업체

---

## 핵심 서비스

| 서비스 | 주기 | 설명 |
|--------|------|------|
| **성능점검 대행** | 매년 1회 이상 | 34개 정보통신설비 성능 점검, 점검표 기록·보존(5년) |
| **유지보수·관리 위탁** | 반기별 1회 | 설비 외관·기능·안전 상태 점검, 점검표 기록 |
| **유지보수·관리자 선임** | 상시 | 기술계 정보통신기술자 선임 대행 및 신고 |

---

## 대상 고객 (관리주체)

- 연면적 **5,000㎡ 이상** 건축물의 소유자 또는 관리자
- 제외: 공동주택, 초·중·고 학교시설

### 법적 준수 기한 (핵심 마케팅 포인트)

| 건축물 규모 | 의무 이행 기한 | 상태 |
|------------|--------------|------|
| 연면적 3만㎡ 이상 | **2025.7.18** | 이미 시행 중 |
| 연면적 1만㎡ 이상 ~ 3만㎡ 미만 | **2026.7.18** | ⚠️ 올해 마감 |
| 연면적 5천㎡ 이상 ~ 1만㎡ 미만 | **2027.7.18** | 준비 필요 |

---

## 점검 대상 설비 (34개)

### 통신설비 (8개)
케이블설비, 배관설비, 국선인입설비, 단자함설비, 이동통신구내선로설비, 전화설비, 방송공동수신 안테나시설, 종합유선방송 구내전송선로설비

### 방송설비 (1개)
방송음향설비

### 정보설비 (23개)
네트워크설비, 전자출입(통제)시스템, 원격검침시스템, 주차관제시스템, 주차유도시스템, 무인택배시스템, 비상벨설비, 영상정보처리기기시스템(CCTV), 홈네트워크설비, 빌딩안내시스템(BIS), 전기시계시스템, 통합SI시스템, 시설관리시스템, 건물에너지관리시스템(BEMS), 지능형인원계수시스템, 지능형경계감시시스템, 스마트병원설비, 스마트도난방지시스템, 스마트공장시스템, 스마트도서관시스템, 지능형이상음원시스템, IoT기반 지하공간 안전관리시스템, 디지털사이니지

### 기타설비 (2개)
통신용 전원설비, 통신접지설비

---

## 과태료 (미이행 리스크 — 핵심 CTA 메시지)

| 위반 사항 | 과태료 |
|----------|--------|
| 유지보수·관리기준 미준수 | 300만원 |
| 점검기록 미작성 또는 허위 작성 | 300만원 |
| 점검기록 미보존 | 150만원 |
| 지자체 요청 시 점검기록 미제출 | 100만원 |

---

## 홈페이지 구조 (페이지 구성)

```
/                     → 메인(홈): 서비스 소개, 마감일 카운트다운, CTA
/service              → 서비스 소개: 성능점검·유지보수 상세
/target               → 대상건축물 확인 (연면적 자가진단)
/equipment            → 점검 대상 설비 34개 목록
/process              → 점검 절차 (How-to)
/law                  → 법령 안내 및 과태료
/faq                  → 자주 묻는 질문 (질의응답 사례집 기반)
/contact              → 견적 문의 / 상담 신청
```

---

## 디자인 스타일 가이드

### 컨셉
**"신뢰할 수 있는 전문 파트너"** — 법적 의무 이행을 도와주는 믿음직한 기술 기업 이미지.
깔끔하고 명확한 정보 전달, 전문성과 신뢰감, B2B 의사결정자(건물주·시설관리팀장)를 위한 UI.

### 색상 팔레트

```css
/* Primary - 신뢰·전문성 */
--color-primary:      #0D2B5E;   /* Deep Navy Blue */
--color-primary-mid:  #1A4A8A;   /* Medium Blue */

/* Accent - 기술·활력 */
--color-accent:       #0070F3;   /* Electric Blue */
--color-accent-light: #E8F1FF;   /* Light Blue Tint */

/* 경고/CTA (과태료, 마감일 강조) */
--color-warning:      #E85C0D;   /* Warm Orange */
--color-warning-light:#FFF3EC;

/* 성공/완료 */
--color-success:      #0E9E6E;   /* Teal Green */

/* 중립 */
--color-white:        #FFFFFF;
--color-bg:           #F7F9FC;   /* Off-white 배경 */
--color-gray-100:     #F0F4F8;
--color-gray-300:     #CBD5E1;
--color-gray-600:     #4B5563;
--color-gray-900:     #111827;
```

### 타이포그래피

```css
/* 한글 본문 */
font-family: 'Pretendard', 'Noto Sans KR', sans-serif;

/* 숫자·영문 강조 */
font-family: 'Inter', sans-serif;

/* 폰트 스케일 */
--text-hero:    clamp(2rem, 5vw, 3.5rem);   /* 히어로 제목 */
--text-h1:      clamp(1.75rem, 3vw, 2.5rem);
--text-h2:      clamp(1.375rem, 2vw, 1.875rem);
--text-h3:      1.25rem;
--text-body:    1rem;        /* 16px */
--text-small:   0.875rem;    /* 14px */
--text-caption: 0.75rem;     /* 12px */

/* 행간 */
--leading-tight: 1.3;
--leading-normal: 1.6;
--leading-loose: 1.8;  /* 본문 */
```

### 레이아웃 원칙

- 최대 콘텐츠 폭: `1200px` (container)
- 그리드: 12컬럼, gap `24px`
- 섹션 패딩: `80px 0` (모바일 `48px 0`)
- 카드 border-radius: `12px`
- 버튼 border-radius: `8px`
- 배경: 주로 흰색(`#FFFFFF`) + 구간 구분 시 `#F7F9FC`
- 그림자: `box-shadow: 0 2px 16px rgba(13,43,94,0.08)`

### UI 컴포넌트 스타일

```css
/* 주요 CTA 버튼 (상담 신청) */
.btn-primary {
  background: #0070F3;
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
}

/* 경고 배너 (마감일, 과태료) */
.alert-deadline {
  background: #FFF3EC;
  border-left: 4px solid #E85C0D;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
}

/* 서비스 카드 */
.service-card {
  background: white;
  border: 1px solid #E5EAF0;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 16px rgba(13,43,94,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(13,43,94,0.12);
}
```

### 아이콘 스타일
- **Lucide React** 또는 **Heroicons** 사용 (선형 아이콘)
- 크기: 24px (인라인), 40px (카드), 64px (섹션 아이콘)
- 색상: accent blue 또는 primary navy

### 헤더
- 배경: White, 하단 border `1px solid #E5EAF0`
- sticky (스크롤 시 고정)
- 로고 + 네비게이션 + "상담 신청" CTA 버튼

---

## SEO / GEO 구현 전략 (2026)

출처: DATA/정보통신설비점검 웹사이트를 위한 2026 SEO & GEO 기술 구현 전략 가이드

### 핵심 방향: 전통 SEO → AI 인용 최적화 (GEO/AEO)

1. **SSR (서버 사이드 렌더링) 필수**
   - Next.js App Router 또는 Nuxt.js 사용
   - 핵심 법령 정보, 설비 목록은 HTML에 직접 포함

2. **AI 봇 접근 허용 (robots.txt)**
   ```
   User-agent: GPTBot
   Allow: /
   User-agent: OAI-SearchBot
   Allow: /
   User-agent: PerplexityBot
   Allow: /
   ```

3. **Schema.org 구조화 데이터 (JSON-LD)**
   - `Organization`: 업체명, 사업자번호, 등록정보
   - `Service`: 성능점검 대행, 유지보수 관리 위탁
   - `FAQPage`: 실제 사용자 질의 답변 구조화
   - `HowTo`: 점검 절차 단계별 마크업

4. **답변 우선(Answer-First) 콘텐츠 구조**
   - 각 페이지 첫 문단에 핵심 답변 40~60단어로 제공
   - 비교 테이블, 체크리스트 형식 활용

5. **핵심 SEO 키워드**
   - 정보통신설비 성능점검
   - 정보통신설비 유지보수
   - 성능점검 대행
   - 정보통신공사업법 제37조의2
   - 유지보수 관리자 선임
   - 연면적 5천㎡ 이상 건축물
   - 과태료 300만원

---

## 기술 스택 권장사항

```
Frontend:  Next.js 15 (App Router, SSR)
Styling:   Tailwind CSS v4
Icons:     Lucide React
Font:      Pretendard (CDN), Inter
Animation: Framer Motion (최소 사용)
Form:      React Hook Form
Analytics: GA4 + AI 트래픽 채널 그룹화
Schema:    JSON-LD (컴포넌트 분리)
```

## 코드 품질 및 안전한 개발 가이드라인 (Strict Code Quality)

**어떤 배포 환경(GitHub Actions, Cloudflare Pages 등)에서도 빌드 오류를 방지하고 유지보수성을 극대화하기 위한 철저한 규칙입니다.**

1. **타입스크립트 엄격성 (TypeScript Strictness)**
   - `any` 타입 사용을 절대 금지합니다. 모든 변수와 함수는 명확한 인터페이스(`interface`)나 타입(`type`)을 가져야 합니다. (`@typescript-eslint/no-explicit-any` 방지)
   - 선언 후 사용되지 않는 변수(`unused vars`)는 코드 리뷰 전 반드시 삭제합니다.

2. **React Hooks 안전 사용 원칙 (Safe Hooks Pattern)**
   - `useEffect`의 의존성 배열(Dependency Array)은 누락 없이 철저하게 관리해야 합니다. (`react-hooks/exhaustive-deps`)
   - 함수가 의존성 배열에 포함될 경우 무한 렌더링 방지를 위해 가급적 `useCallback`으로 감싸고, `useEffect` 외부 또는 상단에 올바른 순서로 선언해야 합니다.
   - `useEffect` 내부에서 동기적으로 상태를 설정(`setState`)하는 것을 삼가고, 데이터 초기화는 렌더링 시점에 직접 부여하거나 불필요한 이펙트를 제거합니다. (`react-hooks/set-state-in-effect` 경고 방지)

3. **Next.js & React 모범 규약 준수**
   - 자체 앱의 라우팅 간 이동에는 HTML 기본 태그인 `<a href="...">`를 절대 사용하지 않고, 반드시 Next.js의 `<Link href="...">`를 사용합니다. (`@next/next/no-html-link-for-pages` 방지)
   - JSX 내부에 작성하는 텍스트 문자열 중 특수문자(작은따옴표 등)는 올바른 HTML 엔티티(`&apos;` 등)로 이스케이프 처리합니다.

4. **빌드 무결성 (Build Integrity)**
   - ESLint 경고나 TypeScript 컴파일 에러를 전역으로 회피(ignore)하는 설정의 사용을 원칙적으로 금지합니다. 오류는 발생한 원인을 수정하여 해결합니다.

## 시큐어 코딩 및 웹 보안 가이드라인 (Secure Coding Guidelines)

**불특정 다수의 방문자가 유입되는 마케팅 홈페이지의 특성상, 정보 유출 및 웹 해킹을 방지하기 위한 안전 수칙입니다.**

1. **상시 의존성(라이브러리) 취약점 점검**
   - 개발 중 수시로 `npm audit` 명령어를 실행하여 외부 오픈소스의 보안 취약점(CVE)을 스캔합니다.
   - High 등급 이상의 취약점(예: Next.js DoS 취약점 등) 발견 시 `npm audit fix`를 통해 버전 업그레이드 및 보안 패치를 즉시 반영해야 합니다.

2. **백엔드(Supabase) 접근 최소화 및 RLS 적용**
   - 프론트엔드(브라우저)에서 데이터베이스를 직접 호출하기 때문에, Supabase의 Anon Key가 소스코드를 통해 노출됩니다.
   - 따라서 누군가 Key를 알아내더라도 고객 연락처를 빼가지 못하도록, Supabase 대시보드에서 해당 테이블(`inquiries`)에 대해 **쓰기(INSERT) 권한만 열고 읽기(SELECT) 권한은 철벽 방어하는 RLS(Row Level Security)** 정책을 반드시 켜두어야 합니다.

3. **HTTP 보안 헤더 강제 (Cloudflare Pages 방식)**
   - 클릭재킹(버튼 속임수), XSS(위조 스크립트 실행) 등 웹 공격을 막기 위해 `public/_headers` 파일을 구성하여 브라우저에 보안 정책을 주입합니다.
   - 적용 헤더: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` 등

4. **소스코드 내 인증 정보 하드코딩 절대 금지**
   - 소스코드 문자열 안에 직접 패스워드나 중요 토큰을 써넣는 것을 금지합니다.
   - 현재 관리자 기능이 분리되어 1차적으로 해결되었으나, 불가피하게 필요할 경우 Cloudflare 환경변수(Environment Variables) 기능을 통해 플랫폼 단위에서 암호화하여 불러와야 합니다.

---

## 주요 섹션별 콘텐츠 메시지

### 히어로 섹션
- **헤드라인**: "정보통신설비 의무 점검, 전문가에게 맡기세요"
- **서브**: "2026.7.18 마감 임박 — 연면적 1만~3만㎡ 건축물 관리주체"
- **CTA**: 무료 상담 신청 / 대상 건축물 확인하기

### 신뢰 지표 섹션
- 과기정통부 등록 정보통신공사업자 / 용역업자 자격
- 담당 기술자 경력·자격증
- 누적 점검 건수, 고객사 수

### FAQ (질의응답 사례집 기반 주요 Q)
- 우리 건물이 대상인지 모르겠어요 → 연면적 5,000㎡ 기준 안내
- 직접 관리자를 선임하면 되나요? → 위탁 vs 직접 선임 비교
- 성능점검과 유지보수·관리는 무엇이 다른가요?
- 과태료는 언제, 얼마나 부과되나요?
- 점검기록은 어떻게 보존해야 하나요?

---

## 배포 파이프라인

### 구성
- **버전 관리**: Git (GitHub) — `uuhiuuhi/CLAUDE_HOMEPAGE`
- **배포 플랫폼**: Cloudflare Pages (GitHub 연동 자동 배포)
- **브랜치**: `main` → push 시 Cloudflare Pages가 자동 빌드·배포
- **운영 도메인**: `jngsystem.com`

### 작업 완료 후 표준 절차
1. 변경 파일만 `git add` (민감 파일 제외)
2. `git commit` (한국어 메시지, 변경 내용 명확히)
3. `git push origin main` → Cloudflare Pages 자동 배포 시작
4. 배포 확인: `dash.cloudflare.com` → Workers & Pages → Deployments

### 주의사항
- Vercel 미사용 — `vercel` CLI 또는 대시보드 불필요
- GitHub Actions 워크플로(Jekyll용)는 무시 — Next.js 배포와 무관
- Next.js 빌드 루트: `homepage/` 디렉터리

---

## 파일 구조 참고

```
DATA/
├── 정보통신설비점검 제도안내.pdf           ← 법령·제도 근거
├── 정보통신설비_유지보수관리제도_질의응답_사례집.pdf  ← FAQ 콘텐츠 원본
├── 정보통신설비점검 설명회.pdf             ← 추가 서비스 내용
├── 정보통신설비점검 제안서.pptx            ← 회사 서비스 제안 내용
└── 정보통신설비점검 웹사이트를 위한 2026 SEO & GEO 기술 구현 전략 가이드.pdf
```
