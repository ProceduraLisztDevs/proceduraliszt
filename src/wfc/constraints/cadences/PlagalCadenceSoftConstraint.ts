import { ConcreteChordQuality } from "../../../music_theory/Chord"
import { MusicalKey } from "../../../music_theory/MusicalKey"
import { Grabber } from "../../Grabber"
import { constantGrabber } from "../../grabbers/constantGrabbers"
import { chordConstraintTypeToName } from "../constraintUtils"
import { GenericCadenceSoftConstraint } from "./GenericCadenceSoftConstraint"

export const PlagalCadenceSoftConstraintInit = {
	type: "PlagalCadenceSoftConstraint" as const,
	bonus: 1,
	validByDefault: true as const,
}

export type PlagalCadenceSoftConstraintIR =
	typeof PlagalCadenceSoftConstraintInit
export class PlagalCadenceSoftConstraint extends GenericCadenceSoftConstraint {
	name = chordConstraintTypeToName.get(
		PlagalCadenceSoftConstraintInit.type,
	) as string
	constructor(bonus: number, keyGrabber: Grabber<MusicalKey>) {
		super(
			bonus,
			constantGrabber(5),
			constantGrabber(0),
			constantGrabber("major" as ConcreteChordQuality),
			constantGrabber("major" as ConcreteChordQuality),
			keyGrabber,
		)
	}
}
