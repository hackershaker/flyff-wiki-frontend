import {
    BadgeAlert,
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
import './ToolbarButton.css'

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
    buttonSize = 'md',
    ...props
}) {

    const IconComponent = ICON_COMPONENTS[icon] ?? null

    return (
        <button>
            {IconComponent ? <IconComponent /> : <BadgeAlert />}
        </button>
    )
}
