import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
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
  Table,
  TableColumnsSplit,
  TableRowsSplit,
  Image,
  Link,
} from 'lucide-react'

/**
 * @typedef {'isHeading1' | 'isHeading2' | 'isHeading3' | 'isBold' | 'isItalic' | 'isStrike' |
 *   'isBulletList' | 'isOrderedList' | 'isBlockquote' | 'isCodeBlock' | 'isInTable' |
 *   'isAlignLeft' | 'isAlignCenter' | 'isAlignRight' | 'isAlignJustify' | 'isLink' | 'isImage'} ActiveStateKey
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
  table: Table,
  tableRowsSplit: TableRowsSplit,
  tableColumnsSplit: TableColumnsSplit,
  alignLeft: AlignLeft,
  alignCenter: AlignCenter,
  alignRight: AlignRight,
  alignJustify: AlignJustify,
  image: Image,
  link: Link,
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

export const tableOptions = [
  {
    icon: 'table',
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertTable({
          rows: 3,
          cols: 3,
          withHeaderRow: true,
        })
        .run(),
    stateKey: 'isInTable',
    text: '표 삽입',
  },
  {
    icon: 'tableColumnsSplit',
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
    stateKey: 'isInTable',
    text: '열 추가',
  },
  {
    icon: 'tableRowsSplit',
    action: (editor) => editor.chain().focus().addRowAfter().run(),
    stateKey: 'isInTable',
    text: '행 추가',
  },
]

export const blockOptions = [
  {
    icon: 'bulletList',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    stateKey: 'isBulletList',
    text: '글머리표',
  },
  {
    icon: 'orderedList',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    stateKey: 'isOrderedList',
    text: '번호',
  },
  {
    icon: 'blockquote',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    stateKey: 'isBlockquote',
    text: '인용',
  },
]

export const alignmentOptions = [
  {
    icon: 'alignLeft',
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    stateKey: 'isAlignLeft',
    text: '왼쪽 정렬',
  },
  {
    icon: 'alignCenter',
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    stateKey: 'isAlignCenter',
    text: '가운데 정렬',
  },
  {
    icon: 'alignRight',
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    stateKey: 'isAlignRight',
    text: '오른쪽 정렬',
  },
  {
    icon: 'alignJustify',
    action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
    stateKey: 'isAlignJustify',
    text: '양쪽 정렬',
  },
]

export const mediaOptions = [
  {
    icon: 'image',
    action: (editor) => {
      const src = window.prompt('표시할 이미지 URL을 입력하세요')
      if (!src) {
        return
      }
      editor.chain().focus().setImage({ src }).run()
    },
    stateKey: 'isImage',
    text: '이미지 삽입',
  },
  {
    icon: 'link',
    action: (editor) => {
      const href = window.prompt('연결할 URL을 입력하세요')
      if (!href) {
        return
      }
      editor.chain().focus().setLink({ href }).run()
    },
    stateKey: 'isLink',
    text: '하이퍼링크',
  },
]

// 추가 옵션은 여기서 그룹화하고 export 하여 에디터 툴바에 재사용하세요.
