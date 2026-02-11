import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

/**
 * Reset browser storage for each test run.
 *
 * - 인자: 없음.
 * - 리턴값: void.
 * - 사용 예시: 테스트 시작 전 자동 호출됩니다.
 * - 동작 흐름: localStorage/sessionStorage 비우기.
 * - 주의사항: 테스트 간 상태 누수를 방지하기 위한 초기화입니다.
 */
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})
