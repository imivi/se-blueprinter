import { IconInfoCircle } from "@tabler/icons-react"
import { Tooltip as ReactTooltip } from "react-tooltip"

type Props = {
    id: string
    text: string
}

export default function Tooltip({ id, text }: Props) {
    return (
        <>
            <IconInfoCircle size={16}
                data-tooltip-id={id}
                data-tooltip-place="bottom"
                data-tooltip-content={text}
                style={{ cursor: "pointer", marginLeft: 3 }}
            />
            <ReactTooltip id={id} style={{ maxWidth: "12rem", zIndex: 10 }} />
        </>
    )
}