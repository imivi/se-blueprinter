import { BlockSignatures } from "../lib/BlockSignatures"
// import signatures3x3x3 from "./block-signatures-3x3x3.json"
// import signatures4x4x4 from "./block-signatures-4x4x4.json"
import signatures38 from "./block-signatures-38.json"



export const blockSignatures = {
    // slopes_fast: new BlockSignatures(signatures3x3x3),
    // slopes_full: new BlockSignatures(signatures4x4x4),
    slopes40: new BlockSignatures(signatures38),
} as const
