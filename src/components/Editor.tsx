import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { useEffect, useState } from 'react'
import './Editor.css'
import Toolbar from './Toolbar'

/**
 * 위키 문서 편집기 컴포넌트.
 *
 * 사용 예:
 * `<Editor textSize="16px" initialContent={content} onChange={setContent} />`
 *
 * @param {Object} props
 * @param {import('@tiptap/react').JSONContent} [props.initialContent]
 * 초기 콘텐츠(JSON).
 * - 예: `{ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] }`
 * @param {(value: import('@tiptap/react').JSONContent) => void} [props.onChange]
 * 콘텐츠 변경 시 호출되는 콜백.
 * - TipTap editor의 `getJSON()` 결과를 전달합니다.
 * @param {string} [props.textSize='14px']
 * 본문 글자 크기. CSS 길이 단위를 사용합니다.
 * - 예: `12px`, `1rem`, `16px`
 *
 * @returns {JSX.Element}
 */
export default function Editor({ initialContent, onChange, textSize = '14px' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  const [activeFormats, setActiveFormats] = useState({
    isBold: false,
    isItalic: false,
    isStrike: false,
    isCode: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    isCodeBlock: false,
    isAlignLeft: false,
    isAlignCenter: false,
    isAlignRight: false,
    isAlignJustify: false,
    isLink: false,
    isImage: false,
    isInTable: false,
  })

  useEffect(() => {
    if (!editor) {
      return
    }
    const updateFormats = () => {
      setActiveFormats({
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isStrike: editor.isActive('strike'),
        isCode: editor.isActive('code'),
        isHeading1: editor.isActive('heading', { level: 1 }),
        isHeading2: editor.isActive('heading', { level: 2 }),
        isHeading3: editor.isActive('heading', { level: 3 }),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isBlockquote: editor.isActive('blockquote'),
        isCodeBlock: editor.isActive('codeBlock'),
        isAlignLeft: editor.isActive({ textAlign: 'left' }),
        isAlignCenter: editor.isActive({ textAlign: 'center' }),
        isAlignRight: editor.isActive({ textAlign: 'right' }),
        isAlignJustify: editor.isActive({ textAlign: 'justify' }),
        isLink: editor.isActive('link'),
        isImage: editor.isActive('image'),
        isInTable: editor.isActive('table'),
      })
    }

    updateFormats()

    editor.on('transaction', updateFormats)
    editor.on('selectionUpdate', updateFormats)

    return () => {
      editor.off('transaction', updateFormats)
      editor.off('selectionUpdate', updateFormats)
    }
  }, [editor])

  useEffect(() => {
    if (!editor || !initialContent) {
      return
    }
    editor.commands.setContent(initialContent, false)
  }, [editor, initialContent])

  useEffect(() => {
    if (!editor) {
      return
    }
    onChange?.(editor.getJSON())
  }, [editor, onChange])

  return (
    <div className="editor-root" style={{ '--editor-font-size': textSize }}>
      <Toolbar editor={editor} editorState={activeFormats} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
