import { Triangle, Vector3 } from "three";
import { test } from "vitest";

function testTriangle() {

    const triangle = new Triangle(
        new Vector3(0.5, -0.5, 0.5),
        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(0.5, -0.5, -0.5),
    )

    const point = new Vector3(0.05, -0.4, 0.4)

    const closestPoint = triangle.closestPointToPoint(point, new Vector3())

    console.log("closestPoint:", closestPoint)

    const distance = closestPoint.distanceTo(point)
    console.log("Distance:", distance)
}

test("test triangle", () => {

    testTriangle()
})