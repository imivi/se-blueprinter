import { expect, test } from "vitest"
import { generate17digitsID, getBlockOrientation, getBlockSignature } from "./misc";
import { Direction, Point } from "../types";
import { Vector3 } from "three";


test("convert points into block signature", () => {
    const position = new Vector3(0, 0, 0)
    const points: Point[] = [
        { inside: true, near: true, position },
        { inside: true, near: false, position },
        { inside: false, near: true, position },
        { inside: false, near: false, position },
    ]

    expect(getBlockSignature(points)).toBe("1110")
})


test("getBlockOrientation", () => {
    const testData: Record<string, [Direction, Direction]> = {
        LargeHeavyArmorBlock: ["Forward", "Up"],
        LargeHeavyArmorBlockFU: ["Forward", "Up"],
        LargeHeavyArmorBlockBL: ["Backward", "Left"],
    }

    for (const [name, directions] of Object.entries(testData)) {
        expect(getBlockOrientation(name)).toMatchObject(directions)
    }
})


test("generate random 17-digit ID", () => {
    const id = generate17digitsID()
    expect(id).toHaveLength(17)
})