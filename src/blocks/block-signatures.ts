import { BlockSignatures } from "../lib/BlockSignatures"
import signatures38 from "./block-signatures-38.json"

export const blockSignatures = new BlockSignatures(signatures38.sort((a, b) => a.signature > b.signature ? -1 : 1))
