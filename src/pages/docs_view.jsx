import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function WikiEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello Wiki</p>",
  })

  return <EditorContent editor={editor} />
}
