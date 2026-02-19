# 프론트엔드 사용법

## 빠른 시작
1. 패키지 설치
```bash
npm install
```

2. 로컬 백엔드 연결로 개발 서버 실행
```bash
npm run dev
```

3. MSW 모드로 개발 서버 실행
```bash
npm run dev:msw
```

## 환경 변수 구성
- 기본 파일: `frontend/.env.example`
- 로컬 백엔드 개발: `frontend/.env.development`
- MSW 개발: `frontend/.env.msw`
- 프로덕션 빌드: `frontend/.env.production`

### 주요 변수
- `VITE_ENABLE_MSW`: `true`일 때만 MSW가 동작합니다. (DEV 환경에서만 적용)
- `VITE_API_BASE`: API 베이스 URL입니다. 비워두면 같은 오리진(`/api`)을 사용합니다.

### 모드별 동작
- 로컬 백엔드: `VITE_ENABLE_MSW=false`, `VITE_API_BASE=http://localhost:8080`
- MSW: `VITE_ENABLE_MSW=true`, `VITE_API_BASE=`
- 프로덕션: `VITE_ENABLE_MSW=false`, `VITE_API_BASE=https://api.example.com`

## 스크립트
- `npm run dev`: 기본 개발 서버 (Vite)
- `npm run dev:msw`: MSW 모드 개발 서버 (`--mode msw`)
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 미리보기
- `npm run test`: 테스트 실행
- `npm run test:watch`: 테스트 감시 모드

## 의존성 추가 규칙
- npm 설치 시 권한 문제가 흔히 발생합니다.
- 의존성은 `frontend/package.json`에 추가하고, 사용자에게 `npm install` 실행을 요청합니다.

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
     - 파일: `flyff-wiki-frontend/src/pages/docs_edit.tsx`
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
     - 파일: `flyff-wiki-frontend/src/components/Editor.tsx`
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

### msw 페이지 이동 시 리로드
- 저장된 문서가 홈 화면으로 이동 시 메모리가 초기화 되는 문제점
- react router 도입으로 데이터 유지하기로 결정

### 테스트에서 `basename` 오류 발생
- 증상: `Home` 테스트 실행 시 `Cannot destructure property 'basename' of 'React...useContext(...)' as it is null` 에러.
- 원인: `Link` 같은 라우터 컴포넌트는 “지금 어디 페이지인지” 정보를 `Router`가 제공해줘야 동작합니다.
  테스트에서는 브라우저가 없고, `Router`도 따로 감싸주지 않으면 `Link`가 참고할 값이 `null`이 되어 위 에러가 발생합니다.
- 해결(가장 쉬운 방법):
  1) 테스트 렌더링을 `MemoryRouter`로 감싼다. (메모리 기반의 가짜 라우터)
     - 파일: `frontend/src/pages/home.test.tsx`
     - 수정 예시:
       ```tsx
       import { MemoryRouter } from 'react-router-dom'

       render(
         <MemoryRouter>
           <Home />
         </MemoryRouter>
       )
       ```
  2) 이 방법은 `Link`, `useNavigate`, `useParams` 등을 사용하는 컴포넌트 테스트에도 동일하게 적용된다.
     - 즉, “라우터 훅/컴포넌트를 쓰는 테스트는 Router로 감싸기”가 기본 규칙입니다.



# 리액트 설계: 확장·변경에 강한 구조 체크리스트

## 🧠 설계 기준

- “왜 이 코드가 바뀔까?” 기준으로 파일/역할 분리

- UI 변경 이유 ≠ 로직 변경 이유 ≠ API 변경 이유

- 한 파일에 변경 이유 2개 이상이면 쪼갠다

## 📦 폴더 / 구조

- 기능(Feature) 단위로 폴더 구성

- pages / features / shared 계층 구분

- 기능 삭제 시 폴더 하나로 제거 가능해야 함

## 🧩 컴포넌트 설계

- 컴포넌트는 UI만 담당

- 비즈니스 규칙은 컴포넌트 밖으로

- 100줄 넘어가면 분리 신호

props는 명확한 타입 계약을 가짐

## 🪝 Hooks

- 데이터/상태 로직은 custom hook으로 격리

- hook은 UI를 몰라야 함 (JSX ❌)

- 한 hook은 하나의 책임

## 🧠 상태 관리

- 상태는 가장 낮은 공통 부모에 둔다

- 전역 상태는 최후의 수단

- “이 상태를 누가 쓰나?” 먼저 질문

## 🌐 API / 외부 의존성

- API 호출은 전용 레이어에서만

- 컴포넌트에서 axios/fetch 직접 호출 ❌

- API 변경 시 한 파일만 수정이 목표

## 📜 타입 설계 (TSX 기준)

- props / state / API 응답 타입 명시

- 컴포넌트 타입 = 사용 설명서

- any는 설계 실패 신호

## 🔁 확장 대비

- 다국어 / 테마 / 권한 추가를 가정

- 문자열, 조건 분기 하드코딩 최소화

- config / enum / map 활용

## ⚙️ 리팩터링 친화성

- 이름이 역할을 설명해야 함

- export 최소화 (필요한 것만)

- public / private 경계 명확히

## 🚫 흔한 안티패턴

- 거대한 Page 컴포넌트

- store에 모든 상태 몰아넣기

- useEffect에 비즈니스 로직 작성

- props drilling을 이유 없이 방치

## ✅ 잘 설계된 구조의 특징

- UI 교체해도 로직 유지

- API 바뀌어도 컴포넌트 무사
 
- 기능 추가가 “복사 → 수정”이 아님

- 새 기능 추가 시 기존 코드 수정 최소

## 🧾 한 줄 요약

리액트 설계의 핵심은 “변경을 국소화하는 구조”다.
