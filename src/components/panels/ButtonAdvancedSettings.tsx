import s from "./ButtonAdvancedSettings.module.scss"

import { IconChevronDown } from "@tabler/icons-react"


type Props = {
    expand: boolean
    onClick: () => void
}

export default function ButtonAdvancedSettings({ onClick, expand }: Props) {

    return (
        <div className={s.container} data-expand={expand}>
            <hr />
            <button onClick={onClick}>
                <div className={s.icon}>
                    <IconChevronDown size={14} />
                </div>
                advanced
            </button>
            <hr />
        </div>
    )
}