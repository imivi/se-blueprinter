import { Pattern } from "./types"

export const BASE_URL = import.meta.env.BASE_URL

export const SLICE_PATTERNS: Record<Pattern, number[]> = {
    cubes: [0],
    slopes: [-0.4, -0.1, 0.1, 0.4],
}

export const maxVisibleMarkers = 999 // Only show markers for up to N blocks

export const CLOSENESS_THRESHOLD = 1 / 1000

export const samples = {
    "Cuboid": "model_cuboid",
    "Octagon": "model_octagon",
    "Curve": "model_curve",
    "Slope 1": "model_slopes_basic",
    "Slope 2": "model_slopes_adv",
    "Slope 3": "model_slopes_tower",
}
