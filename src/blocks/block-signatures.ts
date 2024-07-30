import { BlockSignatures } from "../lib/BlockSignatures"
import signatures38 from "./block-signatures-38.json"


export const blockSignatures = {
    slopes40: new BlockSignatures(signatures38.sort((a, b) => a.signature > b.signature ? -1 : 1)),
} as const
