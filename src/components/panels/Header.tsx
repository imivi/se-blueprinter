import { IconCode } from "@tabler/icons-react"
import s from "./Header.module.scss"
import { BASE_URL } from "../../settings"

export default function Header() {

    return (
        <>
            <header className={s.header}>
                <img src={BASE_URL + "/favicon.svg"} width={32} height={32} />
                Space Engineers Blueprinter
            </header>
            <div className={s.ribbon}>
                <a href="https://github.com/imivi/se-blueprinter" target="_blank">
                    <IconCode size={16} color="white" /> source
                </a>
            </div>
        </>
    )
}