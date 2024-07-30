import { expect, test } from "vitest";
import { getCornerEdgeCenterPatternOffsets } from "./get-pattern-offsets";



test("Get offsets for pattern [-0.4, -0.05, 0.05, 0.4]", () => {

    const pattern = [-0.4, -0.05, 0.05, 0.4]
    const offsets = getCornerEdgeCenterPatternOffsets(pattern)

    // console.log(offsets)
    expect(offsets.length).toBe(8 + 24 + 6)

})

test("Get offsets for pattern [-0.3, 0, 0.3]", () => {

    const pattern = [-0.3, 0, 0.3]
    const offsets = getCornerEdgeCenterPatternOffsets(pattern)

    expect(offsets.length).toBe(8 + 12 + 6)

    // console.log(offsets)
})