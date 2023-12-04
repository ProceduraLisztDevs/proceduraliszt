export type MelodyStep = "ascend" | "descend" | "stagnate" | "wildcard"

export type MelodyShape = MelodyStep[]

export const serializeMelodyShape = (melodyShape: MelodyShape): string =>
    melodyShape.map(step => {
        switch (step) {
            case "ascend": return "a"
            case "descend": return "d"
            case "stagnate": return "s"
            case "wildcard": return "w"
        }
    }).join("")

export const deserializeMelodyShape = (serializedMelodyShape: string): MelodyShape =>
    serializedMelodyShape.split("").map(char => {
        switch (char) {
            case "a": return "ascend"
            case "d": return "descend"
            case "s": return "stagnate"
            case "w": return "wildcard"
            default: throw new Error(`Invalid melody shape character: ${char}`)
        }
    })
