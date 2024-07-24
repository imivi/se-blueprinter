import s from "./Uploader.module.scss"

import { useLoadGltf } from "../hooks/useLoadGltf"
import { useRef, useState } from "react"
import { useGltfStore } from "../stores/useGltfStore"
import { useBlueprintFieldsStore } from "../stores/useBlueprintFieldsStore"
import { useScanOutputStore } from "../stores/useScanOutputStore"
import { IconChevronRight } from "@tabler/icons-react"
import { useSettingsStore } from "../stores/useSettingsStore"
import ClickAwayListener from "react-click-away-listener"
import { samples } from "../settings"
import Spinner from "./Spinner"




export type Sample = {
    label: string
    url: string
    imageUrl: string
}

const samplesData: Sample[] = Object.entries(samples).map(([label, filename]) => ({
    label,
    url: import.meta.env.BASE_URL + "/samples/" + filename + ".glb",
    imageUrl: import.meta.env.BASE_URL + "/samples/" + filename + ".jpg",
}))


export default function Uploader() {

    const { setGltfUrl, setGltfFilename } = useGltfStore()

    const { loadGltf } = useLoadGltf()

    const setCubeGridDisplayName = useBlueprintFieldsStore(store => store.setCubeGridDisplayName)

    const setScanOutput = useScanOutputStore(store => store.setScanOutput)
    const setSettingsModified = useSettingsStore(store => store.setSettingsModified)

    const fileInputRef = useRef<HTMLInputElement>(null)

    function onFileUpload() {
        const files = fileInputRef.current!.files

        if (!files || files?.length === 0)
            return

        const gltfFile = files[0]

        const url = URL.createObjectURL(gltfFile)

        const name = removeExtension(gltfFile.name)
        setCubeGridDisplayName(name)
        setGltfFilename(name)
        setGltfUrl(url)
        loadGltf(url)
    }

    function loadSampleGltf(sample: Sample) {
        setScanOutput(null)
        setSettingsModified(true)
        setCubeGridDisplayName(sample.label)
        setGltfFilename(sample.label)
        loadGltf(sample.url)
        setShowSampleMenu(false)
    }

    const [showSampleMenu, setShowSampleMenu] = useState(false)

    return (
        <div className={s.container}>

            <input type="file" onChange={onFileUpload} accept=".glb" ref={fileInputRef} />

            <div className={s.samples}>
                <button className={s.btn_show_samples} onClick={() => setShowSampleMenu(!showSampleMenu)}>
                    {/* <IconCubePlus size={16} />  */}
                    Load example
                    <IconChevronRight size={16} />
                </button>
                {
                    showSampleMenu &&
                    <SamplesMenu
                        onClose={() => setShowSampleMenu(false)}
                        onSampleSelect={(sample) => loadSampleGltf(sample)}
                    />
                }
            </div>

        </div>
    )
}


function removeExtension(filename: string): string {
    if (!filename.includes("."))
        return filename

    return filename.split(".").slice(0, -1).join(".")
}



type MenuProps = {
    onClose: () => void
    onSampleSelect: (sample: Sample) => void
}

function SamplesMenu({ onClose, onSampleSelect }: MenuProps) {

    function handleClick() {
        onClose()
    }

    return (
        <ClickAwayListener onClickAway={handleClick}>
            <div className={s.sample_menu} >
                {/* <div className={s.bg} onClick={onClose} /> */}
                <ul>
                    {
                        samplesData.map(sample => (
                            <li key={sample.label} onClick={() => onSampleSelect(sample)}>
                                <img src={sample.imageUrl} alt="" />
                                <label>{sample.label}</label>
                                <div className={s.spinner}>
                                    <Spinner size={32} color="white" />
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </ClickAwayListener>
    )
}

