import s from "./Spinner.module.scss"
import { IconLoader } from "@tabler/icons-react";

type Props = {
    size: number
    color?: string
}

export default function Spinner({ size, color = "black" }: Props) {

    return (
        <div className={s.spinner}>
            <IconLoader size={size} color={color} />
        </div>
    )
}
