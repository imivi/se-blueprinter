import { BASE_URL } from "../../settings"
import { useSettingsStore } from "../../stores/useSettingsStore"
import Spinner from "../Spinner"
import s from "./BlockSelector.module.scss"

type Block = {
    name: string
    img: string
}

const blocks: Block[] = [
    { img: "block.png", name: "block" },
    { img: "corner.png", name: "corner" },
    { img: "slope.png", name: "slope" },
    { img: "inv_corner.png", name: "invcorner" },
    { img: "corner_square.png", name: "cornersquare" },
    { img: "corner_square_inv.png", name: "cornersquareinv" },
    { img: "slope_211_base.png", name: "slope211base" },
    { img: "slope_211_tip.png", name: "slope211tip" },
    { img: "inv_corner_211_base.png", name: "invcorner211base" },
    { img: "inv_corner_211_tip.png", name: "invcorner211tip" },
    { img: "corner_211_base.png", name: "corner211base" },
    { img: "corner_211_tip.png", name: "corner211tip" },
    { img: "half.png", name: "half" },
    { img: "half_slope.png", name: "halfslope" },
    { img: "half_corner.png", name: "halfcorner" },
    { img: "half_slope_corner.png", name: "halfslopecorner" },
    { img: "half_slope_corner_inv.png", name: "halfslopecornerinv" },
    { img: "half_sloped_corner.png", name: "halfslopedcorner" },
    { img: "half_sloped_corner_base.png", name: "halfslopedcornerbase" },
    { img: "half_slope_inv.png", name: "halfslopeinv" },

    { img: "round_corner.png", name: "roundcorner" },
    { img: "round_slope.png", name: "roundslope" },

    // UNSUPPORTED
    // { img: "round_inv_corner.png", name: "roundinvcorner" },

    // { img: "sloped_corner.png", name: "slopedcorner" },
    // { img: "sloped_corner_base.png", name: "slopedcornerbase" },
    // { img: "sloped_corner_tip.png", name: "slopedcornertip" },
]

export default function BlockSelector() {

    const disabledBlocks = useSettingsStore(store => store.disabledBlocks)
    const toggleBlockDisabled = useSettingsStore(store => store.toggleBlockDisabled)

    return (
        <div className={s.container}>
            {/* <p>Blocks enabled</p> */}
            <ul>
                {
                    blocks.map(block => (
                        <li
                            key={block.name}
                            data-disabled={disabledBlocks.has(block.name)}
                            onClick={() => toggleBlockDisabled(block.name)}
                        >
                            <img src={BASE_URL + "/blocks/" + block.img} alt="" />
                            <div className={s.spinner}><Spinner size={20} color="white" /></div>
                        </li>
                    ))
                }
            </ul>
            {/* <pre>{JSON.stringify([...disabledBlocks], null, 4)}</pre> */}
        </div>
    )
}