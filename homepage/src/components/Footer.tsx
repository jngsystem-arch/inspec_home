import Link from "next/link";
import FooterContact from "./FooterContact";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-white mt-auto relative overflow-hidden">
      {/* 배경 이미지 (WebP 압축, brightness 0.13) */}
      <Image
        src="/foot.webp"
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition: "center center", filter: "brightness(0.13)" }}
        sizes="100vw"
      />
      {/* 네이비 오버레이 */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to right, rgba(4,13,28,0.92) 0%, rgba(4,13,28,0.88) 45%, rgba(4,13,28,0.78) 70%, rgba(4,13,28,0.68) 100%)"
      }} />
      <div className="relative z-10 container-main py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 소개 */}
          <div>
            <div className="mb-4 inline-block bg-white rounded-xl px-3 py-2">
              <Image
                src="/JNGSYSTEM_2Line_Logo.png"
                alt="제이앤지시스템 로고"
                width={160}
                height={56}
                style={{ height: "48px", width: "auto" }}
              />
            </div>
            <p className="text-xs text-white/50 mb-2 font-medium">운영사 : 주식회사 제이앤지시스템</p>
            <p className="text-sm text-white/70 leading-relaxed">
              정보통신공사업법 제37조의2에 따른 성능점검 대행 및 유지보수·관리 위탁 전문 업체입니다.
            </p>

            {/* 내부 관리자 전용 진입점 — 눈에 띄지 않게 배치 */}
            <Link
              href="/admin/login"
              prefetch={false}
              rel="nofollow noindex"
              aria-label="관리자"
              tabIndex={-1}
              className="inline-block mt-4 text-[10px] text-white/20 hover:text-white/60 transition-colors select-none"
            >
              ·
            </Link>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-sm font-bold text-white/90 mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">HOME</Link></li>
              <li><Link href="/service" className="hover:text-white transition-colors">서비스 소개</Link></li>
              <li><Link href="/target" className="hover:text-white transition-colors">대상건축물 확인</Link></li>
              <li><Link href="/process" className="hover:text-white transition-colors">점검 절차</Link></li>
              <li><Link href="/law" className="hover:text-white transition-colors">법령 안내</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link></li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-sm font-bold text-white/90 mb-4">연락처</h3>
            <FooterContact />
            <Link
              href="/contact"
              className="mt-4 inline-block px-5 py-2.5 bg-[var(--color-accent)] text-white text-sm font-bold rounded-lg hover:bg-blue-500 transition-colors"
            >
              무료 상담 신청 →
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} 제이앤지시스템 | JNGSYSTEM. All rights reserved.</p>
          <div className="flex items-center gap-4 font-inter">
            <p>사업자등록번호: 211-88-14679 | 과기정통부 정보통신공사업 등록</p>
            <Link href="/privacy" className="hover:text-white/70 transition-colors underline underline-offset-2">
              개인정보 취급방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

