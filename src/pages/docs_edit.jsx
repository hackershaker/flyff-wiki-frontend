import { useMemo, useState } from 'react'
import Editor from '../components/Editor'

const PANEL_HEIGHT = 520
const previewBoxStyle = {
	border: '1px solid #eee',
	borderRadius: 6,
	background: '#fafafa',
	height: PANEL_HEIGHT,
	overflowY: 'auto',
	padding: 12,
	boxSizing: 'border-box',
}
const editorWrapperStyle = {
	height: PANEL_HEIGHT,
	overflow: 'hidden',
}

const DEFAULT_CONTENT = `# 제목 1
## 제목 2
### 제목 3

- 리스트 항목 1
- 리스트 항목 2

**굵은 텍스트**와 *기울임* 처리 예시

[링크 텍스트](https://example.com)

\`코드 인라인\` 및
\`\`\`
코드 블록 예시
\`\`\`

> 인용문
`

function renderPreviewMarkdown(rawText) {
	const escapeHtml = (value) =>
		value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;')

	const lines = rawText.split('\n')
	let inList = false
	const rendered = lines
		.map((line) => {
			if (!line.trim()) {
				if (inList) {
					inList = false
					return '</ul>'
				}
				return ''
			}

			const listMatch = line.match(/^\s*[-+*]\s+(.*)$/)
			if (listMatch) {
				const text = escapeHtml(listMatch[1])
				if (!inList) {
					inList = true
					return `<ul><li>${text}</li>`
				}
				return `<li>${text}</li>`
			}

			if (inList) {
				inList = false
				return `</ul>${renderLine(line)}`
			}

			return renderLine(line)
		})
		.join('')

	if (inList) {
		return `${rendered}</ul>`
	}

	return rendered

	function renderLine(line) {
		const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
		if (headingMatch) {
			const level = headingMatch[1].length
			const text = escapeHtml(headingMatch[2])
			return `<h${level}>${text}</h${level}>`
		}
		return `<p>${escapeHtml(line)}</p>`
	}
}

export default function DocsEdit() {
	const [content, setContent] = useState(DEFAULT_CONTENT)
	const [lastSavedAt, setLastSavedAt] = useState(null)
	const previewHtml = useMemo(() => renderPreviewMarkdown(content), [content])

	const handleSave = () => {
		localStorage.setItem('docs_edit_content', content)
		setLastSavedAt(new Date())
	}

	return (
		<div style={{ padding: 20, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
				<h1 style={{ margin: 0 }}>문서 편집</h1>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					{lastSavedAt && (
						<span style={{ fontSize: 12, color: '#666' }}>
							마지막 저장: {lastSavedAt.toLocaleString('ko-KR')}
						</span>
					)}
					<button
						type="button"
						onClick={handleSave}
						style={{
							padding: '8px 14px',
							borderRadius: 6,
							border: '1px solid #2f6fed',
							background: '#2f6fed',
							color: '#fff',
							cursor: 'pointer',
						}}
					>
						문서 저장
					</button>
				</div>
			</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
					gap: 16,
					alignItems: 'start',
				}}
			>
				<div style={{ minWidth: 0 }}>
					<h3 style={{ marginTop: 0 }}>에디터</h3>
					<div style={editorWrapperStyle}>
						<Editor initialContent={content} onChangeText={setContent} />
					</div>
				</div>
				<div style={{ minWidth: 0 }}>
					<h3 style={{ marginTop: 0 }}>프리뷰</h3>
					<div style={previewBoxStyle}>
						<div
							style={{
								color: '#1f2328',
								overflowWrap: 'anywhere',
								wordBreak: 'break-word',
								textAlign: 'left',
							}}
							dangerouslySetInnerHTML={{ __html: previewHtml }}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
