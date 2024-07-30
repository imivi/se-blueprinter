import { expect, test } from "vitest"
import { generate17digitsID, getBlockOrientation, getBlockSignature } from "./misc";
import { Direction } from "../types";
import { Vector3 } from "three";
import { Point } from "./Point";


test("convert points into block signature", () => {
    const position = new Vector3(0, 0, 0)
    const points: Point[] = [
        new Point(position, true, true),
        new Point(position, true, false),
        new Point(position, false, true),
        new Point(position, false, false),
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