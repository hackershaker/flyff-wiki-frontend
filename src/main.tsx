import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const THEME_STORAGE_KEY = 'flyff-wiki-theme'
const HISTORY_STORAGE_KEY = 'docs_edit_history'
const HISTORY_RESET_KEY = 'docs_edit_history_reset_id'

/**
 * Resolve whether MSW should be enabled for this session.
 *
 * - Arguments: none.
 * - Returns: boolean indicating if the MSW worker should start.
 * - Usage example: set `VITE_ENABLE_MSW=true` in `.env.msw`, then run `npm run dev:msw`.
 * - Flow: read the env value -> normalize to lowercase -> compare against "true".
 * - Notes: even if this returns true, MSW still only runs in `DEV` to avoid production leakage.
 */
function resolveMswEnabled() {
  const raw = import.meta.env.VITE_ENABLE_MSW ?? 'false'
  return raw.toString().trim().toLowerCase() === 'true'
}

// Cache the decision so we do not parse env vars multiple times.
const IS_MSW_ENABLED = resolveMswEnabled()

/**
 * Reset local history storage when the dev server restarts in MSW mode.
 *
 * - 인자: 없음.
 * - 리턴값: void.
 * - 사용 예시: 앱 부트스트랩 직전에 호출합니다.
 * - 동작 흐름: MSW 활성/DEV 확인 -> 서버 ID 비교 -> 히스토리 초기화 -> 최신 ID 저장.
 * - 주의사항: 이 동작은 개발 편의용이며 프로덕션에서는 실행되지 않습니다.
 * - 참고사항: `__DEV_SERVER_ID__`는 Vite가 주입하는 빌드 타임 상수입니다.
 */
function resetHistoryOnServerRestart() {
  if (!import.meta.env.DEV || !IS_MSW_ENABLED) {
    return
  }

  // eslint-disable-next-line no-undef
  const serverId = typeof __DEV_SERVER_ID__ !== 'undefined' ? __DEV_SERVER_ID__ : ''
  if (!serverId) {
    return
  }

  const storedId = localStorage.getItem(HISTORY_RESET_KEY)
  if (storedId === serverId) {
    return
  }

  localStorage.removeItem(HISTORY_STORAGE_KEY)
  localStorage.setItem(HISTORY_RESET_KEY, serverId)
}

/**
 * Apply the initial theme early to avoid a flash between light/dark modes.
 *
 * - Uses stored preference when available.
 * - Falls back to system preference.
 */
function applyInitialTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.dataset.theme = stored
    return
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light'
}

async function enableMocking() {
  /**
   * Start the MSW worker for local development when explicitly enabled.
   *
   * - Arguments: none.
   * - Returns: a Promise from `worker.start()` when MSW is enabled, otherwise `undefined`.
   * - Usage example: `VITE_ENABLE_MSW=true npm run dev:msw`.
   * - Flow: check `DEV` flag -> check MSW flag -> lazy-load worker -> start worker.
   * - Caution: MSW is intentionally disabled in production builds.
   */
  if (!import.meta.env.DEV || !IS_MSW_ENABLED) {
    return
  }

  const { worker } = await import('./mocks/browser')

  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

async function bootstrap() {
  // Ensure the theme is set before React renders the UI.
  applyInitialTheme()
  resetHistoryOnServerRestart()
  await enableMocking()

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()
