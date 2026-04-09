import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "개인정보 취급방침 | 제이앤지시스템 JNGSYSTEM",
  description: "제이앤지시스템(주식회사 제이앤지시스템)의 개인정보 취급방침입니다.",
  alternates: { canonical: "https://jngsystem.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* 헤더 */}
      <section style={{ background: "linear-gradient(rgba(59,130,246,0.13) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(59,130,246,0.13) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)" }}>
        <div className="container-main py-12">
          <p className="text-white/60 text-sm mb-2">법적 고지</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">개인정보 취급방침</h1>
          <p className="text-white/80 max-w-2xl leading-relaxed">
            주식회사 제이앤지시스템(이하 &ldquo;회사&rdquo;)은 이용자의 개인정보를 중요하게 여기며,
            「개인정보 보호법」 및 관련 법령을 준수합니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-3xl">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 space-y-10 text-sm leading-relaxed" style={{ color: "var(--color-gray-600)" }}>

            {/* 1. 수집 항목 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                1. 수집하는 개인정보 항목 및 수집 방법
              </h2>
              <p className="mb-3">회사는 상담 신청 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full border border-[var(--color-border)] rounded-lg text-sm overflow-hidden">
                  <thead>
                    <tr className="bg-[var(--color-bg)]">
                      <th className="px-4 py-3 text-left font-semibold border-b border-[var(--color-border)]" style={{ color: "var(--color-primary)" }}>구분</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-[var(--color-border)]" style={{ color: "var(--color-primary)" }}>수집 항목</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-[var(--color-border)]" style={{ color: "var(--color-primary)" }}>수집 방법</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="px-4 py-3 font-medium">필수</td>
                      <td className="px-4 py-3">성명, 연락처(전화번호), 이메일, 건물명·소재지, 연면적</td>
                      <td className="px-4 py-3">홈페이지 상담 신청 폼</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">선택</td>
                      <td className="px-4 py-3">문의 내용</td>
                      <td className="px-4 py-3">홈페이지 상담 신청 폼</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. 수집 목적 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                2. 개인정보의 수집 및 이용 목적
              </h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>상담 신청 접수 및 회신</li>
                <li>서비스 견적 안내 및 계약 진행</li>
                <li>법정 의무 이행 및 분쟁 해결</li>
              </ul>
            </div>

            {/* 3. 보유 기간 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                3. 개인정보의 보유 및 이용 기간
              </h2>
              <p className="mb-3">
                수집된 개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기합니다.
                단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border border-[var(--color-border)] rounded-lg text-sm overflow-hidden">
                  <thead>
                    <tr className="bg-[var(--color-bg)]">
                      <th className="px-4 py-3 text-left font-semibold border-b border-[var(--color-border)]" style={{ color: "var(--color-primary)" }}>근거 법령</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-[var(--color-border)]" style={{ color: "var(--color-primary)" }}>보존 항목</th>
                      <th className="px-4 py-3 text-left font-semibold border-b border-[var(--color-border)]" style={{ color: "var(--color-primary)" }}>보존 기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="px-4 py-3">전자상거래 등에서의 소비자 보호에 관한 법률</td>
                      <td className="px-4 py-3">계약·청약철회 기록</td>
                      <td className="px-4 py-3">5년</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">통신비밀보호법</td>
                      <td className="px-4 py-3">로그인 기록</td>
                      <td className="px-4 py-3">3개월</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. 제3자 제공 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                4. 개인정보의 제3자 제공
              </h2>
              <p>
                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의거하거나 수사 목적으로
                법령에 정해진 절차와 방법에 따라 수사기관이 요구하는 경우에는 예외로 합니다.
              </p>
            </div>

            {/* 5. 파기 절차 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                5. 개인정보의 파기 절차 및 방법
              </h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>파기 절차:</strong> 목적 달성 후 별도 DB에 이전 보관 후 내부 방침에 따라 파기</li>
                <li><strong>전자파일:</strong> 복원 불가능한 기술적 방법으로 삭제</li>
                <li><strong>종이 문서:</strong> 분쇄기로 분쇄 또는 소각</li>
              </ul>
            </div>

            {/* 6. 이용자 권리 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                6. 이용자의 권리·의무 및 행사 방법
              </h2>
              <p className="mb-3">이용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>개인정보 열람 요구</li>
                <li>오류 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리 정지 요구</li>
              </ul>
              <p className="mt-3">
                권리 행사는 아래 개인정보 관리 책임자에게 서면, 이메일, 전화로 연락하시면 지체 없이 조치하겠습니다.
              </p>
            </div>

            {/* 7. 관리 책임자 */}
            <div className="rounded-xl border-2 p-6" style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-light)" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                7. 개인정보 관리 책임자
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="space-y-2">
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-2.5 pr-4 font-semibold w-24" style={{ color: "var(--color-primary)" }}>책임자</td>
                      <td className="py-2.5">박장훈</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-2.5 pr-4 font-semibold" style={{ color: "var(--color-primary)" }}>전화</td>
                      <td className="py-2.5 font-inter">02-3444-3570</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold" style={{ color: "var(--color-primary)" }}>이메일</td>
                      <td className="py-2.5">
                        <a href="mailto:jhpark@jngsystem.co.kr" className="hover:underline" style={{ color: "var(--color-accent)" }}>
                          jhpark@jngsystem.co.kr
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs" style={{ color: "var(--color-gray-600)" }}>
                개인정보 침해에 관한 신고·상담은 개인정보보호위원회(privacy.go.kr, 국번없이 182) 또는
                한국인터넷진흥원 개인정보침해신고센터(privacy.kisa.or.kr, 국번없이 118)에 문의하실 수 있습니다.
              </p>
            </div>

            {/* 시행일 */}
            <div className="text-xs pt-4 border-t border-[var(--color-border)]" style={{ color: "var(--color-gray-600)" }}>
              <p>시행일: 2026년 1월 1일</p>
              <p className="mt-1">본 방침은 법령 변경 또는 회사 정책 변경 시 사전 공지 후 개정됩니다.</p>
            </div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
}
