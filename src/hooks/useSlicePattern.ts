import { SLICE_PATTERNS } from "../settings";
import { useSettingsStore } from "../stores/useSettingsStore";

export function useSlicePattern() {

    const pattern = useSettingsStore(store => store.slicePattern)
    return SLICE_PATTERNS[pattern]
}