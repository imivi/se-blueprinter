import { lazy, Suspense } from "react"


const Scene = lazy(() => import("./components/Scene"))


export default function App() {

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Scene />
        </Suspense>
    )
}
