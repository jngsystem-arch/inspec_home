import { IQuoteModel, QuoteInput, QuoteOutput } from "../types";

export const mockQuoteModel: IQuoteModel = {
  calculate: (input: QuoteInput): QuoteOutput => {
    // 테스트용 고정 데이터 반환
    const baseLabor = 1000000;
    const baseOverhead = 1000000;
    const baseTech = 500000;
    const calcTotal = baseLabor + baseOverhead + baseTech; // 2,500,000
    
    // 할인이 아무리 커도 음수가 되지 않도록 가드
    const rate = Math.min(Math.max(input.discountRate || 0, 0), 100);
    const appliedDiscount = Math.floor(calcTotal * (rate / 100));
    const supplyCost = calcTotal - appliedDiscount;
    const taxAmount = Math.floor(supplyCost * 0.1);
    const yearTotal = supplyCost + taxAmount;
    
    return {
      docTitle: "[테스트] 교차검증용 가상 견적서",
      laborCost: baseLabor,
      overheadCost: baseOverhead,
      techCost: baseTech,
      calcTotal: calcTotal,
      discountApplied: appliedDiscount,
      supplyCost: supplyCost,
      taxAmount: taxAmount,
      yearTotal: yearTotal,
      monthlyTotal: Math.floor(yearTotal / 12),
      services: {
        manage: true,
        inspect: true,
        appoint: true,
      },
      totalPersonnel: 0,
      equipmentBreakdown: [],
      engineerGrade: "중급기술자 (테스트)",
      wageRate: 283343,
    };
  },
};
