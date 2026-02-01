import { useRef, useState } from 'react'
import Editor from '../components/Editor'
import './docs_edit.css'

const STORAGE_KEY = 'docs_edit_content_json'
const META_KEY = 'docs_edit_meta'
const DEFAULT_CONTENT = {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: '제목 1' }],
		},
		{
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: '제목 2' }],
		},
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: '제목 3' }],
		},
		{ type: 'paragraph' },
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: '리스트 항목 1' }] }],
				},
				{
					type: 'listItem',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: '리스트 항목 2' }] }],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: '굵은 텍스트', marks: [{ type: 'bold' }] },
				{ type: 'text', text: '와 ' },
				{ type: 'text', text: '기울임', marks: [{ type: 'italic' }] },
				{ type: 'text', text: ' 처리 예시' },
			],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: '코드 인라인 예시', marks: [{ type: 'code' }] }],
		},
		{
			type: 'codeBlock',
			content: [{ type: 'text', text: '코드 블록 예시' }],
		},
		{
			type: 'blockquote',
			content: [{ type: 'paragraph', content: [{ type: 'text', text: '인용문' }] }],
		},
	],
}

export default function DocsEdit() {
	const [initialContent] = useState(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			console.warn('Failed to load saved content JSON', error)
		}
		return DEFAULT_CONTENT
	})
	const [lastSavedAt, setLastSavedAt] = useState(null)
	const currentJsonRef = useRef(initialContent)

	const handleSave = () => {
		const now = new Date()
		localStorage.setItem(STORAGE_KEY, JSON.stringify(currentJsonRef.current))
		localStorage.setItem(META_KEY, JSON.stringify({ updatedAt: now.toISOString() }))
		setLastSavedAt(now)
	}

	const handleEditorChange = (json) => {
		currentJsonRef.current = json
	}

	return (
		<div className="docs-edit">
			<div className="docs-edit__header">
				<h1 className="docs-edit__title">문서 편집</h1>
				<div className="docs-edit__actions">
					{lastSavedAt && (
						<span className="docs-edit__saved-at">
							마지막 저장: {lastSavedAt.toLocaleString('ko-KR')}
						</span>
					)}
					<button
						type="button"
						onClick={handleSave}
						className="docs-edit__save-button"
					>
						문서 저장
					</button>
				</div>
			</div>
			<div className="docs-edit__panel">
				<h3 className="docs-edit__panel-title">에디터</h3>
				<div className="docs-edit__editor-wrapper">
					<Editor initialContent={initialContent} onChange={handleEditorChange} />
				</div>
			</div>
		</div>
	)
}
