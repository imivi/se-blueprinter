import s from "./Controls.module.scss"

import { IconArrowUp } from "@tabler/icons-react"
import { lazy, Suspense, useState } from "react"
import { ViewSettings } from "./ViewSettings"
import Uploader from "../Uploader"
import { BlockSignature, Direction, Pattern, ScanOutput } from "../../types"
import { MeshBT } from "../../lib/MeshBT"
import SliceSettings from "./SliceSettings"
import { useBlueprintFieldsStore } from "../../stores/useBlueprintFieldsStore"
import { useSettingsStore } from "../../stores/useSettingsStore"
import Panel from "./Panel"
import DebugPanel from "./DebugPanel"
import Header from "./Header"
import BlockSelector from "./BlockSelector"
import { useDebug } from "../../hooks/useDebug"
import ButtonAdvancedSettings from "./ButtonAdvancedSettings"
import BinaryRadio from "./BinaryRadio"
import Tooltip from "./Tooltip"

const CreateBlueprintButtons = lazy(() => import("./CreateBlueprintButtons"))


const patternOptions: { name: Pattern, label: string }[] = [
    { name: "basic", label: "Cube only (fastest)" },
    { name: "slopes_fast", label: "Slopes (fast)" },
    { name: "slopes_full", label: "Slopes (best)" },
]


type Props = {
    scanOutput: ScanOutput | null
    meshes: MeshBT[]
    sampleSignatures: BlockSignature[]
    onScan: () => void
}

export function Controls({ scanOutput, onScan, meshes, sampleSignatures }: Props) {

    const raycastDirectionOption = useSettingsStore(store => store.raycastDirectionOption)
    const setRaycastDirectionOption = useSettingsStore(store => store.setRaycastDirectionOption)

    // const multiScan = useSettingsStore(store => store.multiScan)
    // const setMultiScan = useSettingsStore(store => store.setMultiScan)

    const hollow = useSettingsStore(store => store.hollow)
    const setHollow = useSettingsStore(store => store.setHollow)

    const blocksUntilHollow = useSettingsStore(store => store.blocksUntilHollow)
    const setBlocksUntilHollow = useSettingsStore(store => store.setBlocksUntilHollow)

    const slicePattern = useSettingsStore(store => store.slicePattern)
    const setSlicePattern = useSettingsStore(store => store.setSlicePattern)

    const replacementPolicy = useSettingsStore(store => store.replacementPolicy)
    const setReplacementPolicy = useSettingsStore(store => store.setReplacementPolicy)

    const disabledBlocks = useSettingsStore(store => store.disabledBlocks)

    const fields = useBlueprintFieldsStore()

    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

    const showControls = meshes.length > 0

    const debug = useDebug()

    return (
        <>
            <Panel top left width={450}>

                <Header />

                <Suspense fallback={null}>
                    <Uploader />
                </Suspense>

                {!showControls && <p><IconArrowUp size={16} /> Upload a 3D model in .glb format (binary GLTF)</p>}

                <div className={s.all_controls}>

                    <SliceSettings show={showControls}>

                        <label>Grid size</label>
                        <BinaryRadio
                            labels={["Large", "Small"]}
                            firstChecked={fields.gridSize === "Large"}
                            onCheckedFirst={() => fields.setGridSize("Large")}
                            onCheckedSecond={() => fields.setGridSize("Small")}
                        />

                        <label>Armor type</label>
                        <BinaryRadio
                            labels={["Heavy", "Light"]}
                            firstChecked={fields.armorType === "Heavy"}
                            onCheckedFirst={() => fields.setArmorType("Heavy")}
                            onCheckedSecond={() => fields.setArmorType("Light")}
                        />

                        <label>Grid type</label>
                        <BinaryRadio
                            labels={["Station", "Ship"]}
                            firstChecked={fields.staticGrid}
                            onCheckedFirst={() => fields.setStaticGrid(true)}
                            onCheckedSecond={() => fields.setStaticGrid(false)}
                        />

                        <label htmlFor="cubeGridDisplayName">Blueprint name</label>
                        <input
                            id="cubeGridDisplayName"
                            type="text"
                            placeholder="blueprint"
                            value={fields.cubeGridDisplayName}
                            onChange={(e) => fields.setCubeGridDisplayName(e.target.value)}
                        />

                        <label htmlFor="playerDisplayName">Player name</label>
                        <input
                            id="playerDisplayName"
                            type="text"
                            value={fields.playerDisplayName}
                            onChange={(e) => fields.setPlayerDisplayName(e.target.value)}
                            placeholder="(none)"
                        />


                        <label htmlFor="ownerSteamId">Your steam ID</label>
                        <input id="ownerSteamId" type="text" value={fields.ownerSteamId} onChange={(e) => fields.setOwnserSteamId(e.target.value)} />

                        <label htmlFor="checkbox-hollow">Hollow</label>
                        <label className={s.pointer}>
                            <input
                                type="checkbox"
                                id="checkbox-hollow"
                                checked={hollow}
                                onChange={(e) => setHollow(e.target.checked)}
                            />
                            enabled
                        </label>


                        {
                            hollow &&
                            <>
                                <label htmlFor="input-wall-thickness">
                                    Wall thickness
                                    <Tooltip
                                        id="tooltip-hollow"
                                        text="Size of the walls measured in blocks (not meters)"
                                    />
                                </label>

                                <label>
                                    <input
                                        style={{ width: 50 }}
                                        type="number"
                                        disabled={!hollow}
                                        min={1}
                                        value={blocksUntilHollow}
                                        onChange={(e) => setBlocksUntilHollow(e.target.valueAsNumber)}
                                    />&nbsp;blocks
                                </label>
                            </>
                        }

                        <label>Scan mode</label>
                        <select value={slicePattern} onChange={(e) => { e.preventDefault(); setSlicePattern(e.target.value as typeof slicePattern) }}>
                            {patternOptions.map(option => <option key={option.name} value={option.name}>{option.label}</option>)}
                        </select>

                    </SliceSettings>

                    {
                        showControls &&
                        <ButtonAdvancedSettings
                            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                            expand={showAdvancedSettings}
                        />
                    }

                    <SliceSettings show={showAdvancedSettings}>
                        <label>
                            Raycast direction
                            <Tooltip
                                id="tooltip-raycast-direction"
                                text="If the generated blocks are not accurate, try changing this setting."
                            />
                        </label>
                        <select value={raycastDirectionOption} onChange={(e) => { e.preventDefault(); setRaycastDirectionOption(e.target.value as unknown as Direction) }}>
                            <option value="Up">Up</option>
                            <option value="Down">Down</option>
                            <option value="Forward">Forward</option>
                            <option value="Backward">Backward</option>
                            <option value="Right">Right</option>
                            <option value="Left">Left</option>
                        </select>

                        <label htmlFor="entity-id">
                            Entity ID
                            <Tooltip
                                id="tooltip-entity-id"
                                text="ID of the blueprint. Enter the ID of an existing blueprint if you want to replace it in-game."
                            />
                        </label>
                        <input id="entity-id" type="text" value={fields.entityId ?? ""} onChange={(e) => fields.setEntityId(e.target.value)} placeholder="(random)" />

                        {/* <label>
                            Check for mesh overlap
                            <Tooltip
                                id="tooltip-multi-scan"
                                text="If a block intersects multiple meshes, all meshes will contribute toward the shape of that block (default: off)"
                            />
                        </label>
                        <label className={s.pointer}>
                            <input type="checkbox" checked={multiScan} onChange={(e) => setMultiScan(e.target.checked)} />
                            enabled
                        </label> */}

                    </SliceSettings>

                    {showAdvancedSettings && <BlockSelector />}

                    <SliceSettings show={showAdvancedSettings && disabledBlocks.size > 0}>
                        <label>Replace disabled blocks with...</label>
                        <BinaryRadio
                            labels={["empty space", "similar blocks"]}
                            firstChecked={replacementPolicy === "empty"}
                            onCheckedFirst={() => setReplacementPolicy("empty")}
                            onCheckedSecond={() => setReplacementPolicy("next best")}
                        />
                    </SliceSettings>

                </div>

                {
                    showControls &&
                    <Suspense fallback={null}>
                        <CreateBlueprintButtons
                            onScan={onScan}
                            scanOutput={scanOutput}
                        />
                    </Suspense>
                }

            </Panel>

            <Panel show={!!scanOutput} top right>
                <ViewSettings scanOutput={scanOutput} />
            </Panel>

            {
                debug &&
                <DebugPanel
                    sampleSignatures={sampleSignatures}
                    meshes={meshes}
                    scanOutput={scanOutput}
                />
            }

        </ >
    )
}

