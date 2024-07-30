import { BlockSignature } from "../types"


export class BlockSignatures {

    private nameToSignature = new Map<string, string>()
    private signatureToName = new Map<string, string>()

    constructor(signatures: BlockSignature[]) {
        signatures.forEach(block => {
            const name = block.name.toLowerCase()
            const signature = block.signature
            if (this.nameToSignature.has(name))
                throw new Error("Duplicate block name: " + name)
            this.nameToSignature.set(name, signature)
            this.signatureToName.set(signature, name)
        })
    }

    /** Creates a new array with all names and signatures. This is expensive so don't call this too often */
    getSignaturesArray(): BlockSignature[] {
        const signatures: BlockSignature[] = []
        for (const [name, signature] of this.nameToSignature.entries()) {
            signatures.push({ name, signature })
        }
        return signatures
    }

    getBlockName(signature: string): string | undefined {
        return this.signatureToName.get(signature)
    }

    getSignature(name: string): string | undefined {
        return this.nameToSignature.get(name)
    }
}