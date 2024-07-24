import s from "./SliceSettings.module.scss"

import { ReactNode } from "react"


type Props = {
    children: ReactNode
    show: boolean, title?: string
}

export default function SliceSettings({ children, show }: Props) {

    return (
        <div className={s.container} data-show={show}>
            <div className={s.content}>
                {children}
            </div>
        </div>
    )
}