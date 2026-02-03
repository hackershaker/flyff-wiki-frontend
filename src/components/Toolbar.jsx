import {
  alignmentOptions,
  blockOptions,
  headingOptions,
  historyOptions,
  markOptions,
  mediaOptions,
  tableOptions,
} from '../config/toolbarConfig.js'
import ToolbarButton from './ToolbarButton.jsx'
import ToolbarGroup from './ToolbarGroup.jsx'
import ToolbarLine from './ToolbarLine.jsx'

/**
 * 에디터 툴바 컴포넌트.
 *
 * 사용 예:
 * `<Toolbar editor={editor} editorState={activeFormats} />`
 *
 * @param {Object} props
 * @param {import('@tiptap/react').Editor} props.editor
 * TipTap editor 인스턴스. 없으면 렌더링하지 않습니다.
 * @param {Record<string, boolean>} props.editorState
 * 활성 상태 맵. 각 버튼의 활성 표시를 위해 사용합니다.
 *
 * @returns {JSX.Element | null}
 */
export default function Toolbar({ editor, editorState }) {
  if (!editor) {
    return null
  }
  return (
    <section className="py-2 md:pb-3 w-full flex flex-wrap justify-center items-center gap-2">
      <ToolbarGroup>
        {headingOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={stateKey}
            icon={icon}
            iconType="node"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
      <ToolbarGroup>
        {historyOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={stateKey}
            icon={icon}
            iconType="node"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
      <ToolbarGroup>
        {markOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={stateKey}
            icon={icon}
            iconType="marks"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
      <ToolbarGroup>
        {tableOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={stateKey + icon}
            icon={icon}
            iconType="node"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
      <ToolbarGroup>
        {alignmentOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={stateKey + icon}
            icon={icon}
            iconType="node"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
      <ToolbarGroup>
        {mediaOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={`${stateKey}-${icon}`}
            icon={icon}
            iconType="node"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
      <ToolbarGroup>
        {blockOptions.map(({ icon, action, stateKey, text }) => (
          <ToolbarButton
            key={stateKey + icon}
            icon={icon}
            iconType="node"
            active={Boolean(editorState?.[stateKey])}
            aria-label={text}
            tooltip={text}
            onClick={() => action(editor)}
          />
        ))}
      </ToolbarGroup>
      <ToolbarLine />
    </section>
  )
}
