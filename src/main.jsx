import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const THEME_STORAGE_KEY = 'flyff-wiki-theme'

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
  if (!import.meta.env.DEV) {
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
