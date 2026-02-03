import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  RotateCcw,
  RotateCw,
} from 'lucide-react'

/**
 * @typedef {'isHeading1' | 'isHeading2' | 'isHeading3' | 'isBold' | 'isItalic' | 'isStrike' |
 *   'isBulletList' | 'isOrderedList' | 'isBlockquote' | 'isCodeBlock'} ActiveStateKey
 */

/**
 * @typedef {import('@tiptap/react').Editor} Editor
 */

/**
 * @typedef {Object} ToolbarConfig
 * @property {keyof typeof icons} icon
 * @property {(editor: Editor) => void} action
 * @property {ActiveStateKey} stateKey
 * @property {string} text
 */

const ICON_COMPONENTS = {
  bold: Bold,
  italic: Italic,
  strike: Strikethrough,
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  bulletList: List,
  orderedList: ListOrdered,
  blockquote: Quote,
  codeBlock: Code,
  undo: RotateCcw,
  redo: RotateCw,
}

export const icons = ICON_COMPONENTS
export { ICON_COMPONENTS }

export const headingOptions = [
  {
    icon: 'heading1',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    stateKey: 'isHeading1',
    text: '제목1',
  },
  {
    icon: 'heading2',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    stateKey: 'isHeading2',
    text: '제목2',
  },
  {
    icon: 'heading3',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    stateKey: 'isHeading3',
    text: '제목3',
  },
]

export const markOptions = [
  {
    icon: 'bold',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    stateKey: 'isBold',
    text: '굵게',
  },
  {
    icon: 'italic',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    stateKey: 'isItalic',
    text: '기울임',
  },
  {
    icon: 'strike',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    stateKey: 'isStrike',
    text: '취소선',
  },
]

// 추가 옵션은 여기서 그룹화하고 export 하여 에디터 툴바에 재사용하세요.
