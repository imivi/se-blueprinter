import { ReactNode } from "react"
import s from "./BinaryRadio.module.scss"


type Props = {
    firstChecked: boolean
    onCheckedFirst: () => void
    onCheckedSecond: () => void
    labels: [ReactNode, ReactNode]
}

export default function BinaryRadio({ firstChecked, onCheckedFirst, onCheckedSecond, labels }: Props) {

    return (
        <div className={s.container}>

            <label data-active={firstChecked}>
                <input
                    type="radio"
                    checked={firstChecked}
                    onChange={onCheckedFirst}
                />
                {labels[0]}
            </label>

            <label data-active={!firstChecked}>
                <input
                    type="radio"
                    checked={!firstChecked}
                    onChange={onCheckedSecond}
                />
                {labels[1]}
            </label>

        </div>
    )
}