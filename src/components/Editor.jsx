import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import './Editor.css'

const ICON_PATHS = {
  bold: 'M6 4h5a3 3 0 100 6H9v2h3a3 3 0 110 6H6V4zm3 4h2a1 1 0 100-2H9zm2 4H9v2h2a1 1 0 100-2z',
  italic: 'M10 6h4L9 18H5l5-12zm6 0h4l-5 12h-4l5-12z',
  strike: 'M5 12h14M12 5l-4 14M16 5l-4 14',
  heading1: 'M6 6h2v12H6zm6 0h4a2 2 0 010 4h-2v3h2a2 2 0 110 4h-4V6z',
  heading2:
    'M6 6h2v12H6zm8 0h4a2 2 0 010 4h-2v2h2a2 2 0 110 4h-4a2 2 0 010-4h4a1 1 0 000-2h-2v-2h2a2 2 0 010-4h-4V6z',
  heading3:
    'M6 6h2v12H6zm8 6h-3v-2h3a1 1 0 100-2h-3V6h3a1 1 0 100-2H6v12h8a2 2 0 110-4H8V6h6v2z',
  bulletList:
    'M6 6h10M6 12h10M6 18h10M3 6h1M3 12h1M3 18h1',
  orderedList:
    'M6 6h10M6 12h10M6 18h10M4 6h1.5v1H4V6zm0 5.5h1.5l.75-.75V10H4v1.5zm0 4.5h1.5v-.5H4V16z',
  blockquote:
    'M7 6h2v4H7zm4 0h2v8h-2zm-4 4h2v8H7zm4 0h2v8h-2z',
  codeBlock: 'M8 7h8v10H8z M10 9h4 M10 13h4',
}

const TOOLTIP_TEXT = {
  bold: '굵게',
  italic: '기울임',
  strike: '취소선',
  heading1: '제목 1',
  heading2: '제목 2',
  heading3: '제목 3',
  bulletList: '글머리표',
  orderedList: '번호',
  blockquote: '인용',
  codeBlock: '코드 블록',
  undo: '실행 취소',
  redo: '다시 실행',
}

function SvgIcon({ name }) {
  return (
    <svg
      className="editor-toolbar__icon"
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default function Editor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    strike: false,
    heading1: false,
    heading2: false,
    heading3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
  })

  const canBold = editor?.can().toggleBold() ?? false
  const canItalic = editor?.can().toggleItalic() ?? false
  const canStrike = editor?.can().toggleStrike() ?? false
  const canUndo = editor?.can().undo() ?? false
  const canRedo = editor?.can().redo() ?? false

  useEffect(() => {
    if (!editor) {
      return
    }
    const updateFormats = () => {
      setActiveFormats({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        strike: editor.isActive('strike'),
        heading1: editor.isActive('heading', { level: 1 }),
        heading2: editor.isActive('heading', { level: 2 }),
        heading3: editor.isActive('heading', { level: 3 }),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        blockquote: editor.isActive('blockquote'),
        codeBlock: editor.isActive('codeBlock'),
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
    <div className="editor-root">
      <div className="editor-toolbar" role="toolbar" aria-label="편집 도구">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!canBold}
          className={activeFormats.bold ? 'is-active' : ''}
          aria-label="굵게"
          data-tooltip={TOOLTIP_TEXT.bold}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M4 3a1 1 0 0 1 1-1h6a4.5 4.5 0 0 1 3.274 7.587A4.75 4.75 0 0 1 11.25 18H5a1 1 0 0 1-1-1V3Zm2.5 5.5v-4H11a2 2 0 1 1 0 4H6.5Zm0 2.5v4.5h4.75a2.25 2.25 0 0 0 0-4.5H6.5Z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!canItalic}
          className={activeFormats.italic ? 'is-active' : ''}
          aria-label="기울임"
          data-tooltip={TOOLTIP_TEXT.italic}
        >
          <SvgIcon name="italic" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!canStrike}
          className={activeFormats.strike ? 'is-active' : ''}
          aria-label="취소선"
          data-tooltip={TOOLTIP_TEXT.strike}
        >
          <SvgIcon name="strike" />
        </button>
        <span className="editor-toolbar__divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={activeFormats.heading1 ? 'is-active' : ''}
          aria-label="H1"
          data-tooltip={TOOLTIP_TEXT.heading1}
        >
          <SvgIcon name="heading1" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={activeFormats.heading2 ? 'is-active' : ''}
          aria-label="H2"
          data-tooltip={TOOLTIP_TEXT.heading2}
        >
          <SvgIcon name="heading2" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={activeFormats.heading3 ? 'is-active' : ''}
          aria-label="H3"
          data-tooltip={TOOLTIP_TEXT.heading3}
        >
          <SvgIcon name="heading3" />
        </button>
        <span className="editor-toolbar__divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={activeFormats.bulletList ? 'is-active' : ''}
          aria-label="글머리표"
          data-tooltip={TOOLTIP_TEXT.bulletList}
        >
          <SvgIcon name="bulletList" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={activeFormats.orderedList ? 'is-active' : ''}
          aria-label="번호"
          data-tooltip={TOOLTIP_TEXT.orderedList}
        >
          <SvgIcon name="orderedList" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={activeFormats.blockquote ? 'is-active' : ''}
          aria-label="인용"
          data-tooltip={TOOLTIP_TEXT.blockquote}
        >
          <SvgIcon name="blockquote" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={activeFormats.codeBlock ? 'is-active' : ''}
          aria-label="코드블록"
          data-tooltip={TOOLTIP_TEXT.codeBlock}
        >
          <SvgIcon name="codeBlock" />
        </button>
        <span className="editor-toolbar__divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!canUndo}
          data-tooltip={TOOLTIP_TEXT.undo}
        >
          실행취소
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!canRedo}
          data-tooltip={TOOLTIP_TEXT.redo}
        >
          다시실행
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
