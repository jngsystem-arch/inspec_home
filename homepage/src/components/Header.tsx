"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/service", label: "서비스 소개" },
  { href: "/target", label: "대상건축물" },
  { href: "/equipment", label: "점검설비" },
  { href: "/process", label: "점검절차" },
  { href: "/law", label: "법령안내" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyPhone() {
    navigator.clipboard.writeText("02-3444-3570").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/JNGSYSTEM_2Line_Logo.png"
              alt="제이앤지시스템 로고"
              width={160}
              height={56}
              style={{ height: "44px", width: "auto" }}
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
                    : "text-[var(--color-gray-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + 모바일 메뉴 */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyPhone}
              className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--color-gray-600)] hover:text-[var(--color-primary)] relative"
              title="클릭하면 번호가 복사됩니다"
            >
              <Phone size={15} />
              <span className="font-inter">02-3444-3570</span>
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  복사됨!
                </span>
              )}
            </button>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[var(--color-accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-primary-mid)] transition-colors"
            >
              무료 상담 신청
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[var(--color-gray-600)]"
              aria-label="메뉴"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-white">
          <div className="container-main py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]"
                    : "text-[var(--color-gray-600)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-2.5 bg-[var(--color-accent)] text-white text-sm font-bold rounded-lg text-center"
            >
              무료 상담 신청
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}
