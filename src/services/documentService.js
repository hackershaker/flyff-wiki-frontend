const VITE_API_BASE = import.meta.env.VITE_API_BASE ?? ''
const API_BASE = VITE_API_BASE.replace(/\/+$/, '')
const endpoint = API_BASE ? `${API_BASE}/api/documents` : '/api/documents'

export async function getDocuments() {
  const response = await fetch(endpoint, {
    method: 'GET',
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || '문서 목록을 불러오지 못했습니다.')
  }

  return response.json()
}

export async function saveDocument(payload) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || '문서 저장에 실패했습니다.')
  }

  return response.json()
}
