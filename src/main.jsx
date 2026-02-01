import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import("./mocks/browser")

  // worker.start()는 프로미스를 반환하므로 완료될 때까지 기다립니다.
  return worker.start({
    onUnhandledRequest: 'bypass', // 매칭되지 않는 요청은 그냥 실제 서버로 보냄
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
