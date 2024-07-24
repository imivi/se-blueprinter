import s from "./Loader.module.scss"
import Spinner from "./Spinner";


export default function Loader() {

    return (
        <div className={s.loader}>
            <Spinner size={20} /> Loading...
        </div>
    )
}
