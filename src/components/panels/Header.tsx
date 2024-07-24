import { IconCode } from "@tabler/icons-react"
import s from "./Header.module.scss"

export default function Header() {

    return (
        <>
            <header className={s.header}>
                <img src="/favicon.svg" width={32} height={32} />
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