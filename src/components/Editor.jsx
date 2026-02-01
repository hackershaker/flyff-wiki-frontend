import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './Editor.css'

export default function Editor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  const canBold = editor?.can().toggleBold() ?? false
  const canItalic = editor?.can().toggleItalic() ?? false
  const canStrike = editor?.can().toggleStrike() ?? false
  const canUndo = editor?.can().undo() ?? false
  const canRedo = editor?.can().redo() ?? false

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
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          굵게
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!canItalic}
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          기울임
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!canStrike}
          className={editor?.isActive('strike') ? 'is-active' : ''}
        >
          취소선
        </button>
        <span className="editor-toolbar__divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <span className="editor-toolbar__divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'is-active' : ''}
        >
          글머리표
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'is-active' : ''}
        >
          번호
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'is-active' : ''}
        >
          인용
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive('codeBlock') ? 'is-active' : ''}
        >
          코드블록
        </button>
        <span className="editor-toolbar__divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!canUndo}
        >
          실행취소
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!canRedo}
        >
          다시실행
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
