import { useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './docs_view.css'

const STORAGE_KEY = 'docs_edit_content_json'
const DEFAULT_CONTENT = {
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 1 },
			content: [{ type: 'text', text: '문서 제목' }],
		},
		{
			type: 'paragraph',
			content: [{ type: 'text', text: '내용이 없습니다. /edit에서 문서를 작성해 주세요.' }],
		},
	],
}

function extractTitleAndContent(doc) {
	if (!doc || !Array.isArray(doc.content)) {
		return { title: '문서', content: doc ?? DEFAULT_CONTENT }
	}

	const headingIndex = doc.content.findIndex(
		(node) => node.type === 'heading' && node.attrs?.level === 1
	)

	if (headingIndex === -1) {
		return { title: '문서', content: doc }
	}

	const headingNode = doc.content[headingIndex]
	const titleText =
		headingNode?.content?.map((node) => node.text).join('')?.trim() || '문서'

	return {
		title: titleText,
		content: {
			...doc,
			content: [...doc.content.slice(0, headingIndex), ...doc.content.slice(headingIndex + 1)],
		},
	}
}

export default function DocsView() {
	const { content, title } = useMemo(() => {
		let doc = DEFAULT_CONTENT
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				doc = JSON.parse(stored)
			}
		} catch (error) {
			console.warn('Failed to load saved content JSON', error)
		}
		return extractTitleAndContent(doc)
	}, [])

	const editor = useEditor({
		extensions: [StarterKit],
		content,
		editable: false,
		editorProps: {
			attributes: {
				class: 'docs-view__content',
			},
		},
	})

	return (
		<div className="docs-view">
			<div className="docs-view__container">
				<div className="docs-view__header">
					<span className="docs-view__badge">Flyff Wiki</span>
					<h1 className="docs-view__title">{title}</h1>
					<p className="docs-view__desc">읽기 전용 화면입니다.</p>
				</div>
				<EditorContent editor={editor} />
			</div>
		</div>
	)
}
