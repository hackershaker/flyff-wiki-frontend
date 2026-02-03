import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import './Editor.css'
import Toolbar from './Toolbar.jsx'

export default function Editor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  const [activeFormats, setActiveFormats] = useState({
    isBold: false,
    isItalic: false,
    isStrike: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    isCodeBlock: false,
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
        isHeading1: editor.isActive('heading', { level: 1 }),
        isHeading2: editor.isActive('heading', { level: 2 }),
        isHeading3: editor.isActive('heading', { level: 3 }),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isBlockquote: editor.isActive('blockquote'),
        isCodeBlock: editor.isActive('codeBlock'),
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
      <Toolbar editor={editor} editorState={activeFormats} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
