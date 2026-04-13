/**
 * 보안 로깅 유틸리티
 * 운영 환경에서 민감 정보를 필터링하고 로그 출력을 제어합니다.
 */

const IS_PROD = process.env.NODE_ENV === 'production';

// 필터링할 키 목록 (이메일, 전화번호 등 민감 정보)
const SENSITIVE_KEYS = ['email', 'phone', 'password', 'pwd', 'token', 'access_token'];

/**
 * 객체 내의 민감 정보를 마스킹 처리합니다.
 */
function maskSensitiveData(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;

  const dataObj = data as Record<string, unknown>;
  const masked = Array.isArray(data) ? [...data] : { ...dataObj };

  for (const key in masked) {
    const value = (masked as Record<string, unknown>)[key];
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      (masked as Record<string, unknown>)[key] = '********';
    } else if (typeof value === 'object' && value !== null) {
      (masked as Record<string, unknown>)[key] = maskSensitiveData(value);
    }
  }

  return masked;
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (IS_PROD) return; // 운영 환경에서는 일반 로그 숨김
    console.log(`[INFO] ${message}`, ...args.map(maskSensitiveData));
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args.map(maskSensitiveData));
  },

  error: (message: string, ...args: unknown[]) => {
    // 에러 발생 시 운영 환경에서도 출력하되, 민감 정보를 마스킹함
    console.error(`[ERROR] ${message}`, ...args.map(maskSensitiveData));
    
    // 필요 시 Sentry 등 외부 로깅 서비스 연동 지점
  }
};

