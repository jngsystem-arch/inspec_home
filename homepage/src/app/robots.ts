import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // 관리자 전용 경로 — 모든 봇에 대해 색인 차단 (이중 방어: admin/layout.tsx noindex + 여기 Disallow)
  const DISALLOW = ["/admin", "/admin/"];
  const bot = (userAgent: string) => ({ userAgent, allow: "/", disallow: DISALLOW });

  return {
    rules: [
      bot("*"),
      // 검색엔진 크롤러
      bot("Googlebot"),
      bot("Bingbot"),
      bot("Yeti"), // Naver
      bot("Daum"), // Daum
      // AI 검색·답변 엔진 크롤러 (GEO/AEO 필수)
      bot("GPTBot"), // OpenAI 학습
      bot("OAI-SearchBot"), // ChatGPT 검색
      bot("ChatGPT-User"), // ChatGPT 사용자 브라우징
      bot("PerplexityBot"), // Perplexity
      bot("Perplexity-User"), // Perplexity 사용자 요청
      bot("ClaudeBot"), // Anthropic Claude
      bot("Claude-Web"),
      bot("anthropic-ai"),
      bot("Google-Extended"), // Gemini / AI 오버뷰
      bot("Applebot"), // Siri / Spotlight
      bot("Applebot-Extended"), // Apple Intelligence
      bot("Amazonbot"), // Alexa / Rufus
      bot("Bytespider"), // ByteDance / Doubao
      bot("CCBot"), // Common Crawl (주요 AI 학습 데이터)
      bot("cohere-ai"),
      bot("Meta-ExternalAgent"), // Meta AI
      bot("Meta-ExternalFetcher"),
      bot("FacebookBot"),
      bot("YouBot"), // You.com
      bot("DuckAssistBot"), // DuckDuckGo AI
      bot("MistralAI-User"), // Mistral Le Chat
      bot("PanguBot"), // Huawei Pangu
      bot("Diffbot"),
    ],
    sitemap: "https://jngsystem.com/sitemap.xml",
    host: "https://jngsystem.com",
  };
}
