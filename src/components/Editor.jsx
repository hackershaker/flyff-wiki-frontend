import { useEffect, useState } from 'react'
import './Editor.css'

export default function Editor({ initialContent = '', onChangeText }) {
  const [value, setValue] = useState(initialContent)

  useEffect(() => {
    setValue(initialContent)
  }, [initialContent])

  const handleChange = (event) => {
    const text = event.target.value
    setValue(text)
    onChangeText?.(text)
  }

  return (
    <div className="editor-root">
      <textarea
        className="editor-textarea"
        value={value}
        onChange={handleChange}
        placeholder="Markdown 형식으로 내용을 적어주세요."
      />
    </div>
  )
}
