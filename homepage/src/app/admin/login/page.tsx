"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * 관리자 로그인 페이지 (/admin/login)
 *
 * 보안 설계
 * - Supabase Auth email/password 방식 (하드코딩 비밀번호 절대 금지)
 * - 회원가입 UI 없음 — 관리자 계정은 Supabase 대시보드에서만 생성
 * - 클라이언트 측 요청 속도 제한 (localStorage, 5회 실패 시 60초 쿨다운)
 * - 실패 시 상세 에러 메시지 미노출 (계정 열거 공격 방어)
 * - 이미 로그인된 세션이 있으면 즉시 대시보드로 리다이렉트
 * - /admin/* 전체는 검색엔진·AI 봇 색인 차단 (admin/layout.tsx)
 */

const RATE_LIMIT_KEY = "jng_admin_login_attempts";
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 60_000;

type Attempts = { count: number; firstAt: number };

function readAttempts(): Attempts {
  if (typeof window === "undefined") return { count: 0, firstAt: 0 };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { count: 0, firstAt: 0 };
    const parsed = JSON.parse(raw) as Attempts;
    if (Date.now() - parsed.firstAt > COOLDOWN_MS) return { count: 0, firstAt: 0 };
    return parsed;
  } catch {
    return { count: 0, firstAt: 0 };
  }
}

function writeAttempts(a: Attempts) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(a));
}

function clearAttempts() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RATE_LIMIT_KEY);
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  // 세션 존재 시 대시보드로 리다이렉트
  useEffect(() => {
    setMounted(true);
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/dashboard");
    });
  }, [router]);

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1000) {
          clearAttempts();
          clearInterval(t);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("인증 서비스가 구성되지 않았습니다. 관리자에게 문의하세요.");
      return;
    }

    const attempts = readAttempts();
    if (attempts.count >= MAX_ATTEMPTS) {
      const remain = COOLDOWN_MS - (Date.now() - attempts.firstAt);
      setCooldown(remain);
      setError("너무 많은 시도가 있었습니다. 잠시 후 다시 시도하세요.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (authError) {
      const next: Attempts = {
        count: attempts.count + 1,
        firstAt: attempts.firstAt || Date.now(),
      };
      writeAttempts(next);
      // 상세 에러 미노출 — 이메일 존재 여부 유출 방지
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setPassword("");
      return;
    }

    clearAttempts();
    router.replace("/admin/dashboard");
  };

  if (!mounted) return null;

  const cooldownSec = Math.ceil(cooldown / 1000);
  const isRateLimited = cooldown > 0;

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 font-[Pretendard,system-ui,sans-serif]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/JNGSYSTEM_2Line_Logo.png"
            alt="제이앤지시스템"
            width={160}
            height={56}
            style={{ height: "48px", width: "auto", margin: "0 auto" }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(13,43,94,0.10)] border border-[#E5EAF0] p-8 sm:p-10">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#0D2B5E] mb-1">관리자 로그인</h1>
            <p className="text-sm text-[#4B5563]">
              등록된 관리자 계정으로만 접근할 수 있습니다.
            </p>
          </div>

          {!supabase && (
            <div className="mb-4 rounded-lg border border-[#E85C0D] bg-[#FFF3EC] px-4 py-3 text-sm text-[#E85C0D]">
              ⚠️ Supabase 환경변수가 설정되지 않았습니다.
              <br />
              Cloudflare Pages에 <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>를 등록하세요.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-[#0D2B5E] mb-1.5">
                이메일
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                disabled={loading || isRateLimited || !supabase}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] text-[#111827] text-sm placeholder-[#CBD5E1] focus:outline-none focus:border-[#0070F3] focus:ring-2 focus:ring-[#E8F1FF] transition-all disabled:opacity-60"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-[#0D2B5E] mb-1.5">
                비밀번호
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                disabled={loading || isRateLimited || !supabase}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] text-[#111827] text-sm placeholder-[#CBD5E1] focus:outline-none focus:border-[#0070F3] focus:ring-2 focus:ring-[#E8F1FF] transition-all disabled:opacity-60"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {error && (
              <p className="text-sm text-[#E85C0D] bg-[#FFF3EC] border border-[#FFD7BC] rounded-lg px-3 py-2">
                {error}
                {isRateLimited && <> ({cooldownSec}초 남음)</>}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || isRateLimited || !supabase}
              className="w-full py-3 bg-[#0070F3] hover:bg-[#1A4A8A] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "인증 중..." : isRateLimited ? `잠시 후 재시도 (${cooldownSec}s)` : "로그인"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mt-6 text-xs text-[#CBD5E1]">
          <span>제이앤지시스템 · 내부 관리자 전용</span>
          <Link href="/" className="hover:text-[#0070F3] transition-colors">
            ← 홈페이지
          </Link>
        </div>
      </div>
    </div>
  );
}
