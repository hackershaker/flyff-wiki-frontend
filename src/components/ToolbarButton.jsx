import { BadgeAlert } from 'lucide-react'
import { ICON_COMPONENTS } from '../config/toolbarConfig.js'
import './ToolbarButton.css'

const SIZE_CLASS_MAP = {
    sm: 'toolbar-button--size-sm',
    md: 'toolbar-button--size-md',
    lg: 'toolbar-button--size-lg',
    xl: 'toolbar-button--size-xl',
}

const SHAPE_CLASS_MAP = {
    pill: 'toolbar-button--shape-pill',
    round: 'toolbar-button--shape-rounded',
    square: 'toolbar-button--shape-square',
    circle: 'toolbar-button--shape-circle',
}

export default function ToolbarButton({
    icon,
    iconType = 'marks',
    active = false,
    size,
    shape = 'pill',
    children,
    buttonSize = 'md',
    ...props
}) {
    const resolvedSize = size ?? buttonSize
    const sizeClass = SIZE_CLASS_MAP[resolvedSize] ?? SIZE_CLASS_MAP.md
    const shapeClass = SHAPE_CLASS_MAP[shape] ?? SHAPE_CLASS_MAP.pill

    // Assemble the button's class list based on the requested size, shape, and state.
    const buttonClassName = [
        'toolbar-button',
        sizeClass,
        shapeClass,
        active ? 'toolbar-button--active' : '',
    ]
        .filter(Boolean)
        .join(' ')

    const IconComponent = ICON_COMPONENTS[icon] ?? null
    const iconClassName = `toolbar-button__icon toolbar-button__icon--${iconType}`

    // Prefer an explicit icon, fall back to provided children, and show an alert icon as a last resort.
    const content = IconComponent ? (
        <IconComponent className={iconClassName} aria-hidden="true" />
    ) : children ? (
        children
    ) : (
        <BadgeAlert className={iconClassName} aria-hidden="true" />
    )

    return (
        <button type="button" className={buttonClassName} {...props}>
            {content}
        </button>
    )
}
