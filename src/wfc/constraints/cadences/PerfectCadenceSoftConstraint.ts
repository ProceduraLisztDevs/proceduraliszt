import { ConcreteChordQuality } from "../../../music_theory/Chord"
import { GenericCadenceSoftConstraint } from "./GenericCadenceSoftConstraint"
import { Grabber } from "../../Grabber"
import { constantGrabber } from "../../grabbers/constantGrabbers"
import { MusicalKey } from "../../../music_theory/MusicalKey"
import { chordConstraintTypeToName } from "../constraintUtils"

export const PerfectCadenceSoftConstraintInit = {
	type: "PerfectCadenceSoftConstraint" as const,
	bonus: 1,
	validByDefault: true as const,
}

export type PerfectCadenceSoftConstraintIR =
	typeof PerfectCadenceSoftConstraintInit
export class PerfectCadenceSoftConstraint extends GenericCadenceSoftConstraint {
	name = chordConstraintTypeToName.get(
		PerfectCadenceSoftConstraintInit.type,
	) as string
	constructor(bonus: number, keyGrabber: Grabber<MusicalKey>) {
		super(
			bonus,
			constantGrabber(7),
			constantGrabber(0),
			constantGrabber("major" as ConcreteChordQuality),
			constantGrabber("major" as ConcreteChordQuality),
			keyGrabber,
		)
	}
}
