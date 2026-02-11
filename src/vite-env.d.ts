/// <reference types="vite/client" />

/**
 * Vite environment variables used in the frontend.
 *
 * - 인자: 없음 (환경 변수 선언용).
 * - 리턴값: 없음.
 * - 사용 예시: `import.meta.env.VITE_API_BASE`.
 * - 동작 흐름: Vite가 빌드 시 주입한 값을 타입으로 명시합니다.
 * - 주의사항: 실제 값은 런타임 환경에 따라 달라집니다.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
  readonly VITE_ENABLE_MSW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Dev server identifier injected by Vite config.
 *
 * - 인자: 없음 (글로벌 상수 선언).
 * - 리턴값: 없음.
 * - 사용 예시: `__DEV_SERVER_ID__`로 dev 서버 재시작 여부를 판별합니다.
 * - 주의사항: 빌드 시점에 문자열로 주입됩니다.
 */
declare const __DEV_SERVER_ID__: string
