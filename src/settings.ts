import { Pattern } from "./types"

export const BASE_URL = import.meta.env.BASE_URL

export const SLICE_PATTERNS: Record<Pattern, number[]> = {
    basic: [0],
    slopes_fast: [-0.35, 0, 0.35],
    slopes_full: [-0.4, -0.05, 0.05, 0.4],
}

export const maxVisibleMarkers = 999 // Only show markers for up to N blocks

export const showTestCubes = true

export const CLOSENESS_THRESHOLD = 1 / 1000

export const samples = {
    "Cuboid": "model_cuboid",
    "Octagon": "model_octagon",
    "Curve": "model_curve",
    "Slope 1": "model_slopes_basic",
    "Slope 2": "model_slopes_adv",
    "Slope 3": "model_slopes_tower",
}
