import { useMemo } from "react"
import { Vector3 } from "three"
import { useSettingsStore } from "../stores/useSettingsStore"
import { Direction } from "../types"


export function useRaycastDirection() {

    const raycastDirectionOption = useSettingsStore(store => store.raycastDirectionOption)
    const raycastDirection = useMemo(() => getRaycastVector(raycastDirectionOption), [raycastDirectionOption])

    return raycastDirection
}

function getRaycastVector(direction: Direction): Vector3 {
    const directions: Record<Direction, Vector3> = {
        Backward: new Vector3(0, 0, -1),
        Down: new Vector3(0, -1, 0),
        Forward: new Vector3(0, 0, 1),
        Left: new Vector3(-1, 0, 0),
        Right: new Vector3(1, 0, 0),
        Up: new Vector3(0, 1, 0),
    }
    return directions[direction].normalize()
}
