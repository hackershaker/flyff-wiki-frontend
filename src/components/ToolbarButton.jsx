import { cva } from 'class-variance-authority'
import {
    Bold,
    Code,
    Italic,
    List,
    ListOrdered,
    Quote,
    RotateCcw,
    RotateCw,
    Strikethrough,
    Type,
} from 'lucide-react'

// cva를 사용해 버튼의 사이즈·배경 상태 조합을 미리 정의해 놓습니다.
const variants = cva(
    'w-[35px] h-[35px] flex items-center justify-center rounded-full transition-colors duration-150',
    {
        variants: {
            iconType: {
                tiny: 'w-[12px] h-[12px]',
                node: 'w-[22px] h-[22px]',
                marks: 'w-[18px] h-[18px]',
                image: 'w-[20px] h-[20px]',
            },
            active: {
                true: 'bg-gray-200 shadow-inner',
                false: 'bg-white hover:bg-gray-100',
            },
        },
    }
)

// Lucide icon 컴포넌트를 에디터 키와 연결합니다.
const ICON_COMPONENTS = {
    bold: Bold,
    italic: Italic,
    strike: Strikethrough,
    heading1: Type,
    heading2: Type,
    heading3: Type,
    bulletList: List,
    orderedList: ListOrdered,
    blockquote: Quote,
    codeBlock: Code,
    undo: RotateCcw,
    redo: RotateCw,
}

export default function ToolbarButton({
    icon,
    iconType = 'marks',
    active = false,
    children,
    iconSize,
    iconColor,
    ...props
}) {
    const IconComponent = ICON_COMPONENTS[icon] ?? null

    return (
        <button
            className={variants({ iconType, active })}
            type="button"
            {...props}
        >
            {IconComponent ? (
                <IconComponent className={variants({ iconType })} />
            ) : (
                children
            )}
            {children}
        </button>
    )
}
