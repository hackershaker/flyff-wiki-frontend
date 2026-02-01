# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 문서 포맷을 어떻게 지원할 것인가?
Canonical - markdown 포맷으로 고정
에디터 프리뷰, 문서 읽기는 html로 


## 트러블슈팅
### `/edit` 진입 시 CPU 사용량 급증
- 증상: `/edit` 페이지에 들어가면 CPU 사용량이 지속적으로 높아지고, 타이핑 시 더 심해짐.
- 원인:
  - TipTap `onUpdate`에서 매 입력마다 JSON을 `state`에 저장하여 전체 컴포넌트 리렌더가 반복됨.
  - 툴바 버튼에서 `can().chain().focus()`를 렌더링 중 반복 호출하여 불필요한 작업이 발생함.
- 해결:
  1) JSON 저장을 `state`가 아닌 `ref`로 이동하여 렌더를 막음.
     - 파일: `flyff-wiki-frontend/src/pages/docs_edit.jsx`
     - 문제 코드:
       ```jsx
       const [currentJson, setCurrentJson] = useState(initialContent)

       const handleEditorChange = (json) => {
         setCurrentJson(json)
       }
       ```
     - 수정 코드:
       ```jsx
       const currentJsonRef = useRef(initialContent)

       const handleEditorChange = (json) => {
         currentJsonRef.current = json
       }
       ```
  2) 툴바의 `can()` 체크에서 `focus()` 호출을 제거하고, 클릭 시점에만 `focus()` 수행.
     - 파일: `flyff-wiki-frontend/src/components/Editor.jsx`
     - 문제 코드:
       ```jsx
       <button
         type="button"
         onClick={() => editor?.chain().focus().toggleBold().run()}
         disabled={!editor?.can().chain().focus().toggleBold().run()}
       >
         굵게
       </button>
       ```
     - 수정 코드:
       ```jsx
       const canBold = editor?.can().toggleBold() ?? false

       <button
         type="button"
         onClick={() => editor?.chain().focus().toggleBold().run()}
         disabled={!canBold}
       >
         굵게
       </button>
       ```
- 참고: 추가로 CPU가 높다면 `onUpdate`를 디바운스(200~300ms)하거나 확장/히스토리 옵션을 최소화하는 방식으로 추가 최적화 가능.