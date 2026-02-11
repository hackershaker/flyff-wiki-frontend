import { BadgeAlert } from 'lucide-react'
import { ICON_COMPONENTS } from '../config/toolbarConfig'
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

/**
 * 툴바 버튼 컴포넌트.
 *
 * 사용 예:
 * `<ToolbarButton icon="bold" tooltip="굵게" active={isBold} onClick={onBold} />`
 *
 * @param {Object} props
 * @param {keyof typeof import('../config/toolbarConfig').ICON_COMPONENTS} props.icon
 * 렌더링할 아이콘 키. 없으면 children을 우선 사용하고, 없으면 경고 아이콘을 표시합니다.
 * @param {'node' | 'marks'} [props.iconType='marks']
 * 아이콘 스타일 분류. 아이콘 색상/크기에 활용됩니다.
 * @param {boolean} [props.active=false]
 * 활성 상태 여부. true면 활성 스타일을 적용합니다.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size]
 * 버튼 크기. 지정하지 않으면 buttonSize를 따릅니다.
 * @param {'pill' | 'round' | 'square' | 'circle'} [props.shape='pill']
 * 버튼 모양.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.buttonSize='md']
 * 기본 버튼 크기. size가 없을 때 사용합니다.
 * @param {string} [props.tooltip]
 * 툴팁 텍스트. 지정하면 data-tooltip로 노출됩니다.
 * @param {import('react').ReactNode} [props.children]
 * 아이콘 대신 렌더링할 커스텀 콘텐츠.
 * 그 외 button 기본 속성(onClick, disabled 등)은 그대로 전달됩니다.
 *
 * @returns {JSX.Element}
 */
export default function ToolbarButton({
    icon,
    iconType = 'marks',
    active = false,
    size,
    shape = 'pill',
    children,
    buttonSize = 'md',
    tooltip,
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

    const tooltipProps = tooltip ? { 'data-tooltip': tooltip } : {}

    return (
        <button
            type="button"
            className={buttonClassName}
            {...tooltipProps}
            {...props}
        >
            {content}
        </button>
    )
}
