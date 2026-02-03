import ToolbarButton from './ToolbarButton.jsx'
import ToolbarGroup from './ToolbarGroup.jsx'
import ToolbarLine from './ToolbarLine.jsx'
import {
    headingOptions,
    markOptions,
    tableOptions,
    alignmentOptions,
    mediaOptions,
    blockOptions,
} from '../config/toolbarConfig.js'

const utilityOptions = [...alignmentOptions, ...mediaOptions, ...blockOptions]

export default function Toolbar({ editor, editorState }) {
  if (!editor) {
    return null
  }
  return (
    <section className="border-b py-2 md:pb-3 w-full flex flex-wrap justify-center items-center gap-2">
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
        {utilityOptions.map(({ icon, action, stateKey, text }) => (
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
    </section>
  )
}
