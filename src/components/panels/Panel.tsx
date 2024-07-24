import s from "./Panel.module.scss"

import { CSSProperties, ReactNode } from "react"


type Props = {
    top?: boolean
    right?: boolean
    left?: boolean
    bottom?: boolean
    children: ReactNode
    show?: boolean
    width?: number
}

export default function Panel({ top, right, left, bottom, children, width, show = true }: Props) {

    const baseStyle: CSSProperties = {
        top: top ? 0 : undefined,
        bottom: bottom ? 0 : undefined,
        right: right ? 0 : undefined,
        left: left ? 0 : undefined,
        width,
    }

    return (
        <div className={s.container} data-show={show} style={baseStyle} >
            {children}
        </div>
    )
}