import { BlockSignatures } from "../lib/BlockSignatures"
import signatures3x3x3 from "./block-signatures-3x3x3.json"
import signatures4x4x4 from "./block-signatures-4x4x4.json"


export const blockSignatures = {
    slopes_fast: new BlockSignatures(signatures3x3x3),
    slopes_full: new BlockSignatures(signatures4x4x4),
} as const
