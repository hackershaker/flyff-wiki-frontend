/**
 * 툴바 버튼 그룹 컨테이너.
 *
 * 사용 예:
 * `<ToolbarGroup>{buttons}</ToolbarGroup>`
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * 그룹 내부에 배치할 버튼들.
 *
 * @returns {JSX.Element}
 */
export default function ToolbarGroup({ children }) {
  return (
    <article className="flex flex-wrap items-center">
      {children}
    </article>
  )
}
