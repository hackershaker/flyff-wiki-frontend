/**
 * 에디터 툴바에서 사용하는 아이콘/옵션 구성 모음.
 * 각 옵션 배열은 Toolbar.jsx에서 그룹으로 렌더링됩니다.
 */
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
  Unlink,
  Code2,
  Minus,
  CornerDownLeft,
} from 'lucide-react'

/**
 * 에디터의 활성 상태 키 목록.
 * Editor.jsx의 `activeFormats`와 1:1로 대응됩니다.
 *
 * 추가 방법:
 * 1) Editor.jsx에서 editor.isActive(...)로 상태를 계산
 * 2) 해당 키를 이 타입에 추가
 * 3) 옵션 배열의 stateKey에 동일한 값을 지정
 *
 * @typedef {'isHeading1' | 'isHeading2' | 'isHeading3' | 'isBold' | 'isItalic' | 'isStrike' |
 *   'isCode' | 'isBulletList' | 'isOrderedList' | 'isBlockquote' | 'isCodeBlock' | 'isInTable' |
 *   'isAlignLeft' | 'isAlignCenter' | 'isAlignRight' | 'isAlignJustify' | 'isLink' | 'isImage' |
 *   'isUndo' | 'isRedo' | 'isHorizontalRule' | 'isHardBreak'} ActiveStateKey
 */

/**
 * @typedef {import('@tiptap/react').Editor} Editor
 */

/**
 * 툴바 버튼 하나를 구성하는 설정 객체.
 *
 * 필수 필드:
 * - icon: 아이콘 키 (ICON_COMPONENTS의 키)
 * - action: 클릭 시 실행되는 TipTap 명령
 * - stateKey: 활성 상태 키 (Editor.jsx에서 계산되는 값)
 * - text: 버튼 툴팁/aria-label 텍스트
 *
 * @typedef {Object} ToolbarConfig
 * @property {keyof typeof icons} icon
 * @property {(editor: Editor) => void} action
 * @property {ActiveStateKey} stateKey
 * @property {string} text
 */

/**
 * 아이콘 키와 lucide-react 컴포넌트를 매핑합니다.
 *
 * 추가 방법:
 * 1) lucide-react에서 아이콘 import
 * 2) ICON_COMPONENTS에 키 등록
 * 3) 옵션 배열에서 해당 키 사용
 *
 * @type {Record<string, import('react').ComponentType<{ className?: string }>>}
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
  unlink: Unlink,
  codeInline: Code2,
  horizontalRule: Minus,
  hardBreak: CornerDownLeft,
}

/**
 * 아이콘 레지스트리.
 * @type {typeof ICON_COMPONENTS}
 */
export const icons = ICON_COMPONENTS
export { ICON_COMPONENTS }

/**
 * 제목(Heading) 관련 옵션.
 *
 * 예:
 * { icon: 'heading2', action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(), stateKey: 'isHeading2', text: '제목2' }
 *
 * @type {ToolbarConfig[]}
 */
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

/**
 * 텍스트 마크(굵게/기울임 등) 옵션.
 *
 * 예:
 * { icon: 'bold', action: (editor) => editor.chain().focus().toggleBold().run(), stateKey: 'isBold', text: '굵게' }
 *
 * @type {ToolbarConfig[]}
 */
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
  {
    icon: 'codeInline',
    action: (editor) => editor.chain().focus().toggleCode().run(),
    stateKey: 'isCode',
    text: '인라인 코드',
  },
]

/**
 * 표(Table) 관련 옵션.
 *
 * 주의:
 * - 표 조작 명령은 selection이 table 안에 있을 때만 동작합니다.
 * - stateKey는 공통으로 'isInTable'을 사용해 활성 표시를 맞춥니다.
 *
 * @type {ToolbarConfig[]}
 */
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
    icon: 'tableRowsSplit',
    action: (editor) => editor.chain().focus().addRowAfter().run(),
    stateKey: 'isInTable',
    text: '행 추가',
  },
  {
    icon: 'tableColumnsSplit',
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
    stateKey: 'isInTable',
    text: '열 추가',
  },
  {
    icon: 'tableColumnsSplit',
    action: (editor) => editor.chain().focus().deleteColumn().run(),
    stateKey: 'isInTable',
    text: '열 삭제',
  },
  {
    icon: 'tableRowsSplit',
    action: (editor) => editor.chain().focus().deleteRow().run(),
    stateKey: 'isInTable',
    text: '행 삭제',
  },
  {
    icon: 'table',
    action: (editor) => editor.chain().focus().deleteTable().run(),
    stateKey: 'isInTable',
    text: '표 삭제',
  },
  {
    icon: 'tableRowsSplit',
    action: (editor) => editor.chain().focus().toggleHeaderRow().run(),
    stateKey: 'isInTable',
    text: '헤더 행',
  },
  {
    icon: 'tableColumnsSplit',
    action: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
    stateKey: 'isInTable',
    text: '헤더 열',
  },
]

/**
 * 블록 수준 옵션(목록/인용/코드블록 등).
 *
 * 예:
 * { icon: 'blockquote', action: (editor) => editor.chain().focus().toggleBlockquote().run(), stateKey: 'isBlockquote', text: '인용' }
 *
 * @type {ToolbarConfig[]}
 */
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
  {
    icon: 'codeBlock',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    stateKey: 'isCodeBlock',
    text: '코드 블록',
  },
  {
    icon: 'horizontalRule',
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    stateKey: 'isHorizontalRule',
    text: '구분선',
  },
  {
    icon: 'hardBreak',
    action: (editor) => editor.chain().focus().setHardBreak().run(),
    stateKey: 'isHardBreak',
    text: '줄바꿈',
  },
]

/**
 * 정렬(TextAlign) 옵션.
 *
 * 주의:
 * - TextAlign extension의 types 설정을 Editor.jsx에서 관리합니다.
 *
 * @type {ToolbarConfig[]}
 */
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

/**
 * 미디어/링크 관련 옵션.
 *
 * 참고:
 * - URL 입력은 window.prompt를 사용 중입니다. 필요시 별도 모달로 대체하세요.
 *
 * @type {ToolbarConfig[]}
 */
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
  {
    icon: 'unlink',
    action: (editor) => editor.chain().focus().unsetLink().run(),
    stateKey: 'isLink',
    text: '링크 해제',
  },
]

// 추가 옵션은 여기서 그룹화하고 export 하여 에디터 툴바에 재사용하세요.
// 예: export const customOptions = [ { icon, action, stateKey, text } ]

/**
 * 편집 히스토리(Undo/Redo) 옵션.
 *
 * 참고:
 * - StarterKit에 history가 포함되어 있어야 동작합니다.
 *
 * @type {ToolbarConfig[]}
 */
export const historyOptions = [
  {
    icon: 'undo',
    action: (editor) => editor.chain().focus().undo().run(),
    stateKey: 'isUndo',
    text: '되돌리기',
  },
  {
    icon: 'redo',
    action: (editor) => editor.chain().focus().redo().run(),
    stateKey: 'isRedo',
    text: '다시 실행',
  },
]
