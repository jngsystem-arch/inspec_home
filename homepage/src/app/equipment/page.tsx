import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "정보통신설비 성능점검 대상 34개 설비 전체 목록",
  description:
    "정보통신설비 성능점검 대상 34개 설비 전체 목록. 통신설비 8개, 방송설비 1개, 정보설비 23개(CCTV·네트워크·홈네트워크·BEMS 등), 기타설비 2개.",
  keywords: [
    "정보통신설비성능점검",
    "정보통신설비",
    "정보통신설비관리점검",
    "정보통신설비유지보수성능점검",
    "점검 대상 설비",
    "정보통신설비 34개",
  ],
  alternates: { canonical: "https://jngsystem.com/equipment" },
  openGraph: {
    title: "정보통신설비 성능점검 대상 34개 설비 전체 목록",
    description: "정보통신설비 성능점검 대상 34개 설비 전체 목록. 통신설비 8개, 방송설비 1개, 정보설비 23개(CCTV·네트워크·홈네트워크·BEMS 등), 기타설비 2개.",
    url: "https://jngsystem.com/equipment",
  },
};

const categories = [
  {
    name: "통신설비",
    count: 8,
    color: "var(--color-accent)",
    items: [
      { no: 1, name: "케이블설비", desc: "구내 통신을 위한 UTP/광케이블 배선 설비" },
      { no: 2, name: "배관설비", desc: "케이블 보호를 위한 전선관·덕트 배관" },
      { no: 3, name: "국선인입설비", desc: "통신사업자 회선을 건물 내로 인입하는 설비" },
      { no: 4, name: "단자함설비", desc: "통신 회선을 분배·접속하는 단자함" },
      { no: 5, name: "이동통신구내선로설비", desc: "건물 내 이동통신 서비스를 위한 중계 설비" },
      { no: 6, name: "전화설비", desc: "구내 전화교환기(PABX) 및 구내 배선" },
      { no: 7, name: "방송공동수신 안테나시설", desc: "지상파·위성방송 공동수신 안테나 설비" },
      { no: 8, name: "종합유선방송 구내전송선로설비", desc: "케이블TV 구내 전송을 위한 동축 또는 광케이블 설비" },
    ],
  },
  {
    name: "방송설비",
    count: 1,
    color: "var(--color-success)",
    items: [
      { no: 9, name: "방송음향설비", desc: "건물 내 비상방송·업무방송·배경음악 시스템" },
    ],
  },
  {
    name: "정보설비",
    count: 23,
    color: "#7C3AED",
    items: [
      { no: 10, name: "네트워크설비", desc: "LAN 스위치, 라우터, 무선AP 등 구내 네트워크 장비" },
      { no: 11, name: "전자출입(통제)시스템", desc: "출입카드, 지문인식 등 출입 통제 설비" },
      { no: 12, name: "원격검침시스템", desc: "전기·가스·수도 원격 검침 설비" },
      { no: 13, name: "주차관제시스템", desc: "번호판 인식, 차단기, 요금 정산 등 주차 관리 설비" },
      { no: 14, name: "주차유도시스템", desc: "빈 주차 공간을 안내하는 센서·표시 설비" },
      { no: 15, name: "무인택배시스템", desc: "무인 택배함 및 관련 IT 설비" },
      { no: 16, name: "비상벨설비", desc: "비상상황 알림을 위한 경보 설비" },
      { no: 17, name: "영상정보처리기기시스템(CCTV)", desc: "보안·감시를 위한 카메라, NVR/DVR, 모니터 시스템" },
      { no: 18, name: "홈네트워크설비", desc: "세대별 월패드, 공용 서버, 게이트웨이 등" },
      { no: 19, name: "빌딩안내시스템(BIS)", desc: "키오스크, 안내 디스플레이 등 건물 안내 설비" },
      { no: 20, name: "전기시계시스템", desc: "건물 전체 시각 동기화 시계 설비" },
      { no: 21, name: "통합SI시스템", desc: "여러 설비를 통합 관제하는 시스템 통합 플랫폼" },
      { no: 22, name: "시설관리시스템", desc: "건물 설비를 통합 관리하는 FM 시스템" },
      { no: 23, name: "건물에너지관리시스템(BEMS)", desc: "에너지 사용 모니터링 및 최적화 관리 시스템" },
      { no: 24, name: "지능형 인원계수 시스템", desc: "출입구 인원 수를 자동으로 계수하는 설비" },
      { no: 25, name: "지능형 경계 감시 시스템", desc: "AI 기반 침입·이상 감지 보안 시스템" },
      { no: 26, name: "스마트 병원 설비", desc: "의료기관 특화 스마트 정보통신 설비" },
      { no: 27, name: "스마트 도난방지 시스템", desc: "태그·센서 기반 도난 방지 설비" },
      { no: 28, name: "스마트 공장 시스템", desc: "제조업 스마트팩토리 통신 설비" },
      { no: 29, name: "스마트 도서관 시스템", desc: "RFID 기반 도서 관리·대출 시스템" },
      { no: 30, name: "지능형 이상음원 시스템", desc: "비명·폭발음 등 이상 소리 감지 시스템" },
      { no: 31, name: "IoT기반 지하공간 안전관리 시스템", desc: "지하 공간 침수·가스 등 위험 감지 IoT 설비" },
      { no: 32, name: "디지털 사이니지", desc: "광고·안내 목적의 디지털 디스플레이 설비" },
    ],
  },
  {
    name: "기타설비",
    count: 2,
    color: "var(--color-warning)",
    items: [
      { no: 33, name: "통신용 전원설비", desc: "통신 장비 전용 UPS, 분전반 등 전원 공급 설비" },
      { no: 34, name: "통신접지설비", desc: "통신 설비 과전압·낙뢰 보호를 위한 접지 설비" },
    ],
  },
];

const equipmentListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "정보통신설비 성능점검 대상 34개 설비 목록",
  description:
    "정보통신공사업법 제37조의3에 따른 성능점검 대상 정보통신설비 34개 전체 목록",
  numberOfItems: 34,
  itemListElement: categories.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "ListItem",
      position: item.no,
      name: item.name,
      description: item.desc,
    }))
  ),
};

export default function EquipmentPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(equipmentListSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "홈", path: "/" }, { name: "점검 대상 설비 34개", path: "/equipment" }]} />
      {/* 페이지 헤더 */}
      <section style={{ background: "linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)" }}>
        <div className="container-main py-12">
          <p className="text-white/60 text-sm mb-2">점검 대상 설비</p>
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">정보통신설비 성능점검 대상 34개 설비</h1>
          <p className="text-white/80 max-w-xl leading-relaxed">
            통신설비 8개, 방송설비 1개, 정보설비 23개, 기타설비 2개로 구성된 34개 정보통신설비 전체를 점검합니다.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="answer-block" aria-label="summary">
            <p>
              정보통신설비 성능점검 대상은 통신설비 8개(케이블·배관·국선인입·단자함·이동통신구내선로·전화·방송공동수신안테나·종합유선방송구내전송선로),
              방송설비 1개(방송음향), 정보설비 23개(네트워크·CCTV·홈네트워크·BEMS 등), 기타설비 2개(통신용전원·통신접지)를 포함한 총 34개 설비입니다.
            </p>
          </div>

          {/* 법정 의무 / 선택 구분 안내 */}
          <div className="mb-6 rounded-xl px-4 py-3 text-sm flex items-start gap-2" style={{ background: "var(--color-accent-light)", border: "1px solid var(--color-accent)" }}>
            <span className="shrink-0 mt-0.5">ℹ️</span>
            <p style={{ color: "var(--color-primary)" }}>
              34개 설비 중 <strong>33개는 법정 의무 점검 대상</strong>이며, <strong>홈네트워크 이용자 설비(전유부분: 세대 내부 월패드 등) 1종</strong>은 관리주체가 자율적으로 판단하는 선택(권장) 사항입니다.
              전유부분 점검 여부는 계약 전 반드시 협의하시기 바랍니다.
            </p>
          </div>

          {/* 카테고리 요약 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {categories.map(({ name, count, color }) => (
              <div key={name} className="bg-white rounded-xl p-4 text-center border border-[var(--color-border)] card-shadow">
                <div className="text-2xl font-bold font-inter mb-1" style={{ color }}>{count}개</div>
                <div className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>{name}</div>
              </div>
            ))}
          </div>

          {/* 설비 테이블 (카테고리별) */}
          <div className="space-y-8">
            {categories.map(({ name, count, color, items }) => (
              <div key={name}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 rounded-full" style={{ background: color }} />
                  <h2 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{name}</h2>
                  <span className="text-sm font-inter font-bold px-2.5 py-0.5 rounded-full" style={{ background: color + "15", color }}>
                    {count}개
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-2xl border border-[var(--color-border)] card-shadow text-sm overflow-hidden">
                    <thead>
                      <tr style={{ background: color + "12" }}>
                        <th className="px-5 py-3 text-left font-semibold w-12" style={{ color }}>No.</th>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color }}>설비명</th>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color }}>설명</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {items.map(({ no, name: itemName, desc }) => (
                        <tr key={no} className="hover:bg-[var(--color-bg)]">
                          <td className="px-5 py-3 font-inter font-bold text-center" style={{ color }}>{no}</td>
                          <td className="px-5 py-3 font-semibold" style={{ color: "var(--color-primary)" }}>{itemName}</td>
                          <td className="px-5 py-3" style={{ color: "var(--color-gray-600)" }}>{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
            >
              점검 상담 신청 <ArrowRight size={16} />
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 font-bold rounded-xl hover:bg-[var(--color-bg)] transition-colors"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              점검 절차 확인하기 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
