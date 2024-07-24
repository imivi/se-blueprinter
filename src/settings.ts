import { Pattern } from "./types"

export const SLICE_PATTERNS: Record<Pattern, number[]> = {
    basic: [0],
    slopes_fast: [-0.35, 0, 0.35],
    slopes_full: [-0.4, -0.05, 0.05, 0.4],
}

export const maxVisibleMarkers = 999 // Only show markers for up to N blocks

export const showTestCubes = true

export const CLOSENESS_THRESHOLD = 1 / 1000

export type Sample = {
    url: string
    name: string
    imageUrl: string
}

export const samples: Sample[] = [
    { name: "Cuboid", url: "/samples/model_cuboid.glb", imageUrl: "/samples/model_cuboid.jpg" },
    { name: "Octagon", url: "/samples/model_octagon.glb", imageUrl: "/samples/model_octagon.jpg" },
    { name: "Curve", url: "/samples/model_curve.glb", imageUrl: "/samples/model_curve.jpg" },
    { name: "Slope 1", url: "/samples/model_slopes_basic.glb", imageUrl: "/samples/model_slopes_basic.jpg" },
    { name: "Slope 2", url: "/samples/model_slopes_adv.glb", imageUrl: "/samples/model_slopes_adv.jpg" },
    { name: "Slope 3", url: "/samples/model_slopes_tower.glb", imageUrl: "/samples/model_slopes_tower.jpg" },
]
