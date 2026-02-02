import { useState } from 'react';
import ToolbarButton from '../components/ToolbarButton';

const DEFAULT_TEST_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '이곳은 에디터 테스트 전용 페이지입니다.' }],
    },
  ],
}

export default function EditorTestPage() {
  const [documentState, setDocumentState] = useState(DEFAULT_TEST_CONTENT)

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <ToolbarButton icon={"bold"} iconType='tiny'></ToolbarButton>
    </div>
  )
}
