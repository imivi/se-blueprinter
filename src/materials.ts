import { DoubleSide, MeshBasicMaterial, MeshStandardMaterial } from "three"

const testBlockMaterial = new MeshStandardMaterial({
    color: "coral",
    side: DoubleSide,
    transparent: true,
    opacity: 0.5,
})

const modelMaterial = new MeshStandardMaterial({
    color: "lightslategray",
    side: DoubleSide,
    transparent: true,
    opacity: 0.5,
})

const perfectOutputBlockMaterial = new MeshStandardMaterial({
    color: "steelblue",
})

const partialOutputBlockMaterial = new MeshStandardMaterial({
    color: "orange",
})

const markerMaterialInside = new MeshBasicMaterial({ color: "green" })
const markerMaterialNear = new MeshBasicMaterial({ color: "orange" })
const markerMaterialOutside = new MeshBasicMaterial({ color: "brown" })


export const materials = {
    test: testBlockMaterial,
    model: modelMaterial,
    perfectMatch: perfectOutputBlockMaterial,
    partialMatch: partialOutputBlockMaterial,
    markerOutside: markerMaterialOutside,
    markerNear: markerMaterialNear,
    markerInside: markerMaterialInside,
}
