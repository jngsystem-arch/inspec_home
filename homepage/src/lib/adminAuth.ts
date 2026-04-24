"use client";

/**
 * 관리자 인증 유틸리티 (Supabase Auth)
 *
 * ⚠️ 보안 원칙
 * - 하드코딩 비밀번호 사용 금지 (과거 "dpdlwjsxm8*" 같은 방식 제거)
 * - Supabase Auth email/password 방식으로만 인증
 * - 관리자 계정은 반드시 Supabase 대시보드(Authentication > Users)에서 직접 생성
 *   (회원가입 UI 절대 노출 금지)
 * - inquiries 테이블은 RLS 활성화:
 *     · anon 역할: INSERT만 허용 (상담 신청용)
 *     · authenticated 역할: SELECT/UPDATE 허용 (관리자 대시보드용)
 *   → 인증 없이 어드민 URL에 직접 접근해도 데이터가 반환되지 않음(이중 방어)
 * - 액세스 토큰은 Supabase 클라이언트가 localStorage에서 관리·자동 갱신
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type AdminAuthState =
  | { status: "loading"; session: null }
  | { status: "authenticated"; session: Session }
  | { status: "unauthenticated"; session: null }
  | { status: "unavailable"; session: null }; // Supabase 환경변수 미설정

/**
 * 관리자 페이지용 인증 가드 훅
 *
 * @param redirectOnFail "/admin/login"으로 자동 리다이렉트할지 여부
 */
export function useAdminAuth(redirectOnFail = true): AdminAuthState {
  const router = useRouter();
  const [state, setState] = useState<AdminAuthState>({
    status: "loading",
    session: null,
  });

  useEffect(() => {
    // Supabase 환경변수 미설정 시
    if (!supabase) {
      setState({ status: "unavailable", session: null });
      return;
    }

    let active = true;

    // 초기 세션 체크
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setState({ status: "authenticated", session: data.session });
      } else {
        setState({ status: "unauthenticated", session: null });
        if (redirectOnFail) router.replace("/admin/login");
      }
    });

    // 세션 변경 구독 (로그아웃·토큰 만료 감지)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) {
        setState({ status: "authenticated", session });
      } else {
        setState({ status: "unauthenticated", session: null });
        if (redirectOnFail) router.replace("/admin/login");
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [redirectOnFail, router]);

  return state;
}

/** 관리자 로그아웃 */
export async function adminSignOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
