import { QuoteInput, ServiceScope, EQUIPMENT_GROUPS, SERVICE_SCOPE_CONFIG } from "../types";

interface Props {
  input: QuoteInput;
  onChange: (updates: Partial<QuoteInput>) => void;
}

export default function QuoteControlPanel({ input, onChange }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-blue-600 box-border print:hidden w-full">
      {input.companyName && (
        <div className="mb-4 bg-green-50 px-4 py-2 border border-green-200 rounded-lg text-sm text-green-700 font-semibold flex items-center gap-2">
          <span>✅</span>
          고객 문의 DB 연동 완료: {input.customerName} 고객님의 견적 데이터가 자동 기입되었습니다.
        </div>
      )}
      <h3 className="mt-0 text-xl font-bold text-blue-900 mb-6">
        [관리자 전용] 견적서 생성 및 조정 대시보드
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            고객사(건물명)
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50"
            value={input.companyName || ""}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="예: ○○빌딩"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            고객 담당자 성함
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50"
            value={input.customerName || ""}
            onChange={(e) => onChange({ customerName: e.target.value })}
            placeholder="홍길동"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            연락처
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50"
            value={input.customerPhone || ""}
            onChange={(e) => onChange({ customerPhone: e.target.value })}
            placeholder="010-0000-0000"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            이메일
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50"
            value={input.customerEmail || ""}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            placeholder="example@email.com"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            건물 주소
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50"
            value={input.buildingAddress || ""}
            onChange={(e) => onChange({ buildingAddress: e.target.value })}
            placeholder="서울특별시..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            건물 연면적 (㎡)
          </label>
          <div className="relative">
            <input
              type="number"
              className="p-2 pr-8 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50 w-full"
              value={input.buildingTotalArea || 0}
              onChange={(e) => onChange({ buildingTotalArea: parseInt(e.target.value) || 0 })}
            />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">㎡</span>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            고객 선택 서비스 범위
          </label>
          <div className="p-2 border border-gray-200 rounded-md text-xs bg-gray-50 text-gray-600 min-h-[38px] flex items-center">
            {input.originalServiceScope || "미선택"}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-2">
            대상 설비 조정 (견적가 실시간 반영)
          </label>
          <div className="space-y-6 border border-gray-200 rounded-xl p-4 bg-white">
            {EQUIPMENT_GROUPS.map((group) => {
              const items = group.items;
              const current = input.equipmentChecks || [];
              const allChecked = items.every(it => current.includes(it));
              const someChecked = items.some(it => current.includes(it));

              const toggleCategory = () => {
                if (allChecked) {
                  // 전체 해제
                  onChange({ equipmentChecks: current.filter(it => !items.includes(it)) });
                } else {
                  // 전체 선택 (기존 선택된 타 카테고리 항목은 유지)
                  const withoutGroup = current.filter(it => !items.includes(it));
                  onChange({ equipmentChecks: [...withoutGroup, ...items] });
                }
              };

              return (
                <div key={group.category}>
                  {/* 카테고리 헤더 */}
                  <div 
                    className="flex items-center gap-2 mb-3 pb-1 border-b" 
                    style={{ borderBottomColor: `${group.color}30` }}
                  >
                    <span 
                      className="text-[11px] font-bold px-2 py-0.5 rounded"
                      style={{ background: `${group.color}15`, color: group.color }}
                    >
                      {group.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{items.length}개</span>
                    <button
                      type="button"
                      className="ml-auto text-[10px] underline underline-offset-2 font-medium"
                      style={{ color: someChecked ? group.color : "#9ca3af" }}
                      onClick={toggleCategory}
                    >
                      {allChecked ? "전체 해제" : "전체 선택"}
                    </button>
                  </div>

                  {/* 설비 체크박스 그리드 (2단) */}
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item) => {
                      const isChecked = current.includes(item);
                      return (
                        <label 
                          key={item} 
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-[11px] transition-all border ${
                            isChecked 
                              ? 'font-semibold' 
                              : 'text-gray-600 border-transparent hover:bg-gray-50'
                          }`}
                          style={{
                            background: isChecked ? `${group.color}10` : "transparent",
                            borderColor: isChecked ? `${group.color}40` : "transparent",
                            color: isChecked ? group.color : undefined
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                onChange({ equipmentChecks: current.filter(it => it !== item) });
                              } else {
                                onChange({ equipmentChecks: [...current, item] });
                              }
                            }}
                            className="w-3.5 h-3.5 rounded border-gray-300 transition-colors"
                            style={{ accentColor: group.color }}
                          />
                          {item}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-2">
            서비스 범위 최종 선택 (견적가 연동)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SERVICE_SCOPE_CONFIG.map((svc) => {
              // 현재 serviceScope 키를 바탕으로 체크 상태 판별
              let isChecked = false;
              if (svc.id === "maintenance") {
                isChecked = input.serviceScope === "all" || input.serviceScope === "manage_inspect";
              } else if (svc.id === "inspection") {
                isChecked = true; // 현재 모든 모드에서 성능점검은 포함됨
              } else if (svc.id === "manager") {
                isChecked = input.serviceScope === "all";
              }

              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => {
                    // 클릭 시 로직: 조합에 따라 키 결정
                    // 1. 현재 어떤 것들이 켜져 있는지 확인
                    const isM = input.serviceScope === "all" || input.serviceScope === "manage_inspect";
                    const isA = input.serviceScope === "all";
                    
                    let nextM = isM;
                    let nextA = isA;

                    if (svc.id === "maintenance") nextM = !isM;
                    if (svc.id === "manager") nextA = !isA;
                    // inspection은 현재 필수이므로 토글 제외 (혹은 필요시 추가)

                    if (nextM && nextA) onChange({ serviceScope: "all" });
                    else if (nextM && !nextA) onChange({ serviceScope: "manage_inspect" });
                    else if (!nextM && !nextA) onChange({ serviceScope: "inspect_only" });
                    else if (!nextM && nextA) onChange({ serviceScope: "all" }); // 선임이 있으면 보통 전체
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    isChecked 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-white text-gray-400 opacity-60'
                  }`}
                >
                  <span className="text-[11px] font-bold leading-tight">{svc.label}</span>
                  <span className="text-[9px] mt-0.5 opacity-80">{svc.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            정보통신설비의 유지보수·관리자 위탁 (원/연간)
          </label>
          <div className="relative">
            <input
              type="number"
              className="p-2 pr-10 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-blue-50 w-full"
              value={input.maintenanceContractAmount ?? 0}
              min="0"
              step="10000"
              onChange={(e) =>
                onChange({ maintenanceContractAmount: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
            <span className="absolute right-3 top-2 text-gray-400 text-xs">원</span>
          </div>
          {(input.maintenanceContractAmount ?? 0) > 0 && (
            <p className="mt-1 text-[10px] text-blue-600">
              ※ 할인 미적용 · 최종 공급가액 이후 별도 가산 · 월 {Math.round((input.maintenanceContractAmount ?? 0) / 12).toLocaleString()}원 (VAT 별도)
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            협의 조정액 (할인율 %)
          </label>
          <div className="relative">
            <input
              type="number"
              className="p-2 pr-8 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 w-full"
              value={input.discountRate}
              min="0"
              max="100"
              step="1"
              onChange={(e) =>
                onChange({ discountRate: parseFloat(e.target.value) || 0 })
              }
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="font-medium text-xs text-gray-500 mb-1">
          고객 문의 상세 내용
        </label>
        <textarea
          rows={2}
          className="w-full p-2 border border-gray-200 rounded-md text-sm bg-gray-50 outline-none focus:border-blue-300"
          value={input.message || ""}
          readOnly
          placeholder="문의 내용이 없습니다."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            영업 담당자
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
            value={input.salesName}
            onChange={(e) => onChange({ salesName: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-xs text-gray-500 mb-1">
            영업 연락처
          </label>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500"
            value={input.salesPhone}
            onChange={(e) => onChange({ salesPhone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
