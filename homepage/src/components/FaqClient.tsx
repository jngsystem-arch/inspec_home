"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import type { FaqCategory, FaqItem } from "@/data/faq-data";
import { allFaqItems } from "@/data/faq-data";

interface Props {
  categories: FaqCategory[];
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function FaqClient({ categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const categoryTabs = ["전체", ...categories.map((c) => c.shortTitle)];

  // 검색어 기반 유사 제목 추천 (최대 5개)
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allFaqItems
      .filter((item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  // 검색 + 카테고리 필터 결과
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((cat) => activeCategory === "전체" || cat.shortTitle === activeCategory)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            !q ||
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [query, activeCategory, categories]);

  const totalResults = filteredCategories.reduce((s, c) => s + c.items.length, 0);

  function toggleItem(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectSuggestion(item: FaqItem & { categoryId: string }) {
    setQuery(item.q);
    setShowSuggestions(false);
    setActiveCategory("전체");
    // 해당 항목 자동 펼치기
    setOpenItems((prev) => new Set([...prev, item.id]));
    // 약간 지연 후 스크롤
    setTimeout(() => {
      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function clearSearch() {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  // 바깥 클릭 시 제안 닫기
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
      {/* 검색창 */}
      <div className="relative mb-8">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-gray-600)" }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
            placeholder="궁금한 내용을 입력하세요 (예: 관리주체, 과태료, 선임 자격)"
            className="w-full pl-11 pr-10 py-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-border)",
              background: "#fff",
              color: "var(--color-gray-900)",
              boxShadow: "0 2px 8px rgba(13,43,94,0.06)",
            }}
            aria-label="FAQ 검색"
            aria-autocomplete="list"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="검색어 지우기"
            >
              <X size={15} style={{ color: "var(--color-gray-600)" }} />
            </button>
          )}
        </div>

        {/* 유사 질문 드롭다운 */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border z-20 overflow-hidden"
            style={{ borderColor: "var(--color-border)", boxShadow: "0 8px 24px rgba(13,43,94,0.12)" }}
            role="listbox"
            aria-label="유사 질문 목록"
          >
            <div
              className="px-4 py-2 text-xs font-bold border-b"
              style={{ color: "var(--color-gray-600)", borderColor: "var(--color-border)", background: "var(--color-bg)" }}
            >
              유사한 질문
            </div>
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => selectSuggestion(item)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-accent-light)] transition-colors border-b last:border-b-0 flex items-start gap-2"
                style={{ borderColor: "var(--color-border)" }}
                role="option"
                aria-selected={item.q === query}
              >
                <span
                  className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5"
                  style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                >
                  {item.categoryTitle}
                </span>
                <span style={{ color: "var(--color-primary)" }}>{item.q}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="FAQ 카테고리">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              role="tab"
              aria-selected={isActive}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] hover:bg-[var(--color-accent-light)]"
              }`}
              style={isActive ? {} : { color: "var(--color-primary)" }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 검색 결과 요약 */}
      {query.trim() && (
        <p className="text-sm mb-6" style={{ color: "var(--color-gray-600)" }}>
          <span className="font-bold" style={{ color: "var(--color-accent)" }}>
            &ldquo;{query}&rdquo;
          </span>{" "}
          검색 결과{" "}
          <span className="font-bold" style={{ color: "var(--color-primary)" }}>
            {totalResults}건
          </span>
        </p>
      )}

      {/* FAQ 목록 */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
          <Search size={40} className="mx-auto mb-3 opacity-30" style={{ color: "var(--color-gray-600)" }} />
          <p className="font-bold mb-1" style={{ color: "var(--color-primary)" }}>검색 결과가 없습니다</p>
          <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
            다른 키워드로 검색하거나, 하단의 <strong>전문가에게 문의하기</strong>를 이용해 주세요.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map((cat) => (
            <section key={cat.id} id={cat.id} aria-labelledby={`cat-heading-${cat.id}`}>
              <div className="mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                <h2
                  id={`cat-heading-${cat.id}`}
                  className="text-lg font-extrabold mb-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  {cat.title}
                </h2>
                <p className="text-sm" style={{ color: "var(--color-gray-600)" }}>
                  {cat.desc}
                </p>
              </div>

              <div className="space-y-2">
                {cat.items.map((item) => {
                  const isOpen = openItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      id={item.id}
                      className="rounded-xl border overflow-hidden scroll-mt-24 transition-shadow"
                      style={{
                        borderColor: isOpen ? "var(--color-accent)" : "var(--color-border)",
                        boxShadow: isOpen ? "0 2px 12px rgba(0,112,243,0.10)" : undefined,
                      }}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left transition-colors"
                        style={{
                          background: isOpen ? "var(--color-accent-light)" : "#fff",
                        }}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className="shrink-0 font-extrabold text-sm mt-0.5"
                            style={{ color: "var(--color-accent)" }}
                          >
                            Q
                          </span>
                          <span
                            className="text-sm font-semibold leading-relaxed"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {highlight(item.q, query)}
                          </span>
                        </div>
                        <span className="shrink-0 mt-0.5" style={{ color: "var(--color-gray-600)" }}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          className="px-5 py-4 border-t"
                          style={{ borderColor: "var(--color-accent)", background: "#fff" }}
                        >
                          <div className="flex gap-3">
                            <span
                              className="shrink-0 font-extrabold text-sm mt-0.5"
                              style={{ color: "var(--color-warning)" }}
                            >
                              A
                            </span>
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: "var(--color-gray-600)" }}
                            >
                              {highlight(item.a, query)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
