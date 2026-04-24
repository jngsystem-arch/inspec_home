import { useState, useMemo } from "react";
import { IQuoteModel, QuoteInput, QuoteOutput } from "./types";

/**
 * 변경 가능한 모델(의존성 주입)을 받아 상태와 결과를 관리하는 하네스 Hook
 */
export function useQuoteHarness(model: IQuoteModel) {
  // 사용자의 입력 상태 관리
  const [input, setInput] = useState<QuoteInput>({
    companyName: "",
    customerName: "",
    serviceScope: "all",
    maintenanceContractAmount: 3600000, // 기본 360만원
    discountRate: 50, // 기본 50%
    salesName: "박상하 부장",
    salesPhone: "010-2230-0671",
  });

  // 입력값이 바뀔 때나 모델이 스왑될 때마다 자동으로 결과(Output) 재계산
  const output: QuoteOutput = useMemo(() => {
    return model.calculate(input);
  }, [model, input]);

  // 입력 업데이트 편의 함수
  const updateInput = (updates: Partial<QuoteInput>) => {
    setInput((prev) => ({ ...prev, ...updates }));
  };

  return {
    input,
    updateInput,
    output,
  };
}
