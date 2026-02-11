import Editor from '../components/Editor'
import ToolbarButton from '../components/ToolbarButton'
import ToolbarGroup from '../components/ToolbarGroup'
import ToolbarLine from '../components/ToolbarLine'
import { headingOptions, markOptions } from '../config/toolbarConfig'

const demoHeadingOptions = headingOptions.slice(0, 3)

export default function EditorTestPage() {
  return (
    <main
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <section
        style={{
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #e5e5e5',
          background: '#fafafa',
        }}
      >
        <h2 style={{ marginBottom: '8px' }}>ToolbarButton 단독 확인</h2>
        <ToolbarGroup>
          <ToolbarButton icon="bold" iconType="marks" shape="pill" active buttonSize="md" />
          <ToolbarButton icon="italic" iconType="marks" shape="round" buttonSize="lg" />
          <ToolbarButton icon="strike" iconType="marks" shape="square" buttonSize="sm" />
          <ToolbarButton icon="heading1" iconType="node" shape="circle" buttonSize="xl" />
        </ToolbarGroup>
      </section>
      <section
        style={{
          padding: '16px',
          borderRadius: '10px',
          border: '1px dashed #d1d5db',
        }}
      >
        <h2 style={{ marginBottom: '8px' }}>ToolbarGroup · ToolbarLine 미리보기</h2>
        <ToolbarGroup>
          {demoHeadingOptions.map((option) => (
            <ToolbarButton
              key={option.stateKey}
              icon={option.icon}
              iconType="node"
              active
              aria-label={option.text}
              onClick={() => console.log(`clicked ${option.text}`)}
            />
          ))}
        </ToolbarGroup>
        <ToolbarLine />
        <ToolbarGroup>
          {markOptions.map((option) => (
            <ToolbarButton
              key={option.stateKey}
              icon={option.icon}
              iconType="marks"
              aria-label={option.text}
              onClick={() => console.log(`clicked ${option.text}`)}
            />
          ))}
        </ToolbarGroup>
      </section>
      <section
        style={{
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #d1d5db',
          background: '#fff',
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>Toolbar + Editor 통합</h2>
        <Editor />
      </section>
    </main>
  )
}
