import { useMemo, useRef, useState } from 'react'
import Editor from '../components/Editor'
import './docs_edit.css'
import { saveDocument } from '../services/documentService.js'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'docs_edit_content_json'
const META_KEY = 'docs_edit_meta'
const HISTORY_KEY = 'docs_edit_history'
const EDITOR_ID_KEY = 'docs_edit_editor_id'
const DEFAULT_EDITOR_ID = 'guest'
const CATEGORY_OPTIONS = [
	{ value: 'jobs', label: '직업' },
	{ value: 'items', label: '아이템' },
	{ value: 'monsters', label: '몬스터' },
	{ value: 'quests', label: '퀘스트' },
	{ value: 'maps', label: '지역' },
	{ value: 'systems', label: '시스템' },
]
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

/**
 * Resolve the editor identifier from local storage, falling back to a default ID.
 *
 * @returns {string}
 * The editor ID to store in history entries.
 * @example
 * const editorId = resolveEditorId()
 */
const resolveEditorId = () => {
	try {
		const stored = localStorage.getItem(EDITOR_ID_KEY)
		return stored?.trim() || DEFAULT_EDITOR_ID
	} catch (error) {
		console.warn('Failed to read editor id from local storage', error)
		return DEFAULT_EDITOR_ID
	}
}

/**
 * Append a history entry to local storage so the history page can render it.
 *
 * @param {{ id: string, title: string, editorId: string, editedAt: string }} entry
 * The history entry to record.
 * @returns {void}
 * This function updates local storage as a side effect.
 * @example
 * appendHistoryEntry({ id: '2025-01-01', title: '문서', editorId: 'guest', editedAt: '2025-01-01T00:00:00Z' })
 */
const appendHistoryEntry = (entry) => {
	try {
		const stored = localStorage.getItem(HISTORY_KEY)
		const parsed = stored ? JSON.parse(stored) : []
		const nextEntries = Array.isArray(parsed) ? [entry, ...parsed] : [entry]
		localStorage.setItem(HISTORY_KEY, JSON.stringify(nextEntries))
	} catch (error) {
		console.warn('Failed to append history entry', error)
	}
}

export default function DocsEdit() {
	// Extract an initial title from the stored content (first H1) or fall back.
	const initialTitle = useMemo(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (!stored) {
				return '제목 1'
			}
			const doc = JSON.parse(stored)
			if (!doc || !Array.isArray(doc.content)) {
				return '제목 1'
			}
			const headingNode = doc.content.find(
				(node) => node.type === 'heading' && node.attrs?.level === 1
			)
			const titleText = headingNode?.content?.map((node) => node.text).join('').trim()
			return titleText || '제목 1'
		} catch (error) {
			console.warn('Failed to parse title from stored content', error)
			return '제목 1'
		}
	}, [])

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
	const [title, setTitle] = useState(initialTitle)
	const [category, setCategory] = useState(() => {
		try {
			const metaRaw = localStorage.getItem(META_KEY)
			if (!metaRaw) {
				return CATEGORY_OPTIONS[0]?.value ?? 'jobs'
			}
			const meta = JSON.parse(metaRaw)
			return meta?.category ?? CATEGORY_OPTIONS[0]?.value ?? 'jobs'
		} catch (error) {
			console.warn('Failed to parse stored category', error)
			return CATEGORY_OPTIONS[0]?.value ?? 'jobs'
		}
	})
	const [lastSavedAt, setLastSavedAt] = useState(null)
	const [isSaving, setIsSaving] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const currentJsonRef = useRef(initialContent)
	// React Router 이동 함수: 저장 성공 후 문서 뷰 페이지로 전환하기 위해 사용합니다.
	const navigate = useNavigate()

	/**
	 * Build a new JSON document that includes the current title as the first H1.
	 *
	 * - If an H1 exists, it will be replaced with the new title.
	 * - If none exists, the H1 will be inserted at the top.
	 *
	 * @param {import('@tiptap/react').JSONContent} doc
	 * The current editor document JSON.
	 * @param {string} nextTitle
	 * The title text to apply to the document.
	 * @returns {import('@tiptap/react').JSONContent}
	 * The updated document JSON including the title heading.
	 */
	const applyTitleToDocument = (doc, nextTitle) => {
		const safeTitle = (nextTitle || '').trim() || '제목 1'
		const headingNode = {
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: safeTitle }],
		}

		if (!doc || !Array.isArray(doc.content)) {
			return { type: 'doc', content: [headingNode] }
		}

		const headingIndex = doc.content.findIndex(
			(node) => node.type === 'heading' && node.attrs?.level === 1
		)

		if (headingIndex === -1) {
			return {
				...doc,
				content: [headingNode, ...doc.content],
			}
		}

		return {
			...doc,
			content: [
				...doc.content.slice(0, headingIndex),
				headingNode,
				...doc.content.slice(headingIndex + 1),
			],
		}
	}

	const handleSave = async () => {
		if (isSaving) {
			return
		}
		setIsSaving(true)
		setStatusMessage('')

		try {
			const contentWithTitle = applyTitleToDocument(currentJsonRef.current, title)
			const payload = {
				// Send the explicit title field to the backend for list views and indexing.
				title: title?.trim() || '제목 1',
				// Send the selected category for filtering and list views.
				category,
				content: contentWithTitle,
			}
			const result = await saveDocument(payload)
			const savedAt = result?.savedAt ? new Date(result.savedAt) : new Date()
			localStorage.setItem(STORAGE_KEY, JSON.stringify(contentWithTitle))
			localStorage.setItem(
				META_KEY,
				JSON.stringify({ updatedAt: savedAt.toISOString(), category })
			)
			setLastSavedAt(savedAt)
			setStatusMessage('문서를 저장했습니다.')
			// 저장 이력을 history 페이지에서 사용할 수 있도록 로컬 스토리지에 누적합니다.
			appendHistoryEntry({
				id: result?.id ? String(result.id) : savedAt.toISOString(),
				title: title?.trim() || '제목 1',
				editorId: resolveEditorId(),
				editedAt: savedAt.toISOString(),
			})
			// 저장 완료 후 즉시 읽기 전용 뷰로 이동하여, 방금 저장한 내용이 반영된 화면을 보여줍니다.
			navigate('/view')
		} catch (error) {
			console.error('문서 저장 실패', error)
			setStatusMessage('문서 저장에 실패했습니다. 다시 시도해 주세요.')
		} finally {
			setIsSaving(false)
		}
	}

	const handleEditorChange = (json) => {
		currentJsonRef.current = json
	}

	return (
		<div className="docs-edit">
			<div className="docs-edit__header">
				<div className="docs-edit__title-group">
					<h1 className="docs-edit__title">문서 편집</h1>
					<label className="docs-edit__title-label" htmlFor="doc-title-input">
						문서 제목
					</label>
					<input
						id="doc-title-input"
						className="docs-edit__title-input"
						type="text"
						value={title}
						placeholder="문서 제목을 입력하세요"
						onChange={(event) => setTitle(event.target.value)}
					/>
					<label className="docs-edit__title-label" htmlFor="doc-category-select">
						문서 카테고리
					</label>
					<select
						id="doc-category-select"
						className="docs-edit__category-select"
						value={category}
						onChange={(event) => setCategory(event.target.value)}
					>
						{CATEGORY_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
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
						disabled={isSaving}
					>
						{isSaving ? '저장 중…' : '문서 저장'}
					</button>
				</div>
				{statusMessage && (
					<p className="docs-edit__status" role="status">
						{statusMessage}
					</p>
				)}
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
