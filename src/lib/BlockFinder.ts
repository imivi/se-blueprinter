import { BlockSignatures } from "./BlockSignatures"
import { BlockSignature, ReplacementPolicy } from "../types"
import { BasicSearchEngine, BlockSearchEngine } from "./BlockSearchEngine"



export class BlockFinder {

    constructor(private readonly searchEngine: BlockSearchEngine) { }

    setBlocks(newCollection: BlockSignature[]) {
        this.searchEngine.setCollection(newCollection)
    }

    findBestMatch(input: string, signatures: BlockSignatures, disabledBlocks: Set<string>, replacementPolicy: ReplacementPolicy): BlockSignature | null {

        // If the regular cube block is the only block selected,
        // the raycast offset pattern is [0] and the signature is either "0" or "1"
        if (input === "1") {
            return {
                name: "blockfu",
                signature: input,
            }
        }

        const perfectMatch = signatures.getBlockName(input)

        if (perfectMatch) {
            const perfectMatchName = perfectMatch.slice(0, -2)
            if (!disabledBlocks.has(perfectMatchName)) {
                return {
                    name: perfectMatch,
                    signature: input,
                }
            }
            else if (replacementPolicy === "empty")
                return null
        }

        return this.searchEngine.search(input)
    }
}





const basicSearchEngine = new BasicSearchEngine()
export const blockFinder = new BlockFinder(basicSearchEngine)
