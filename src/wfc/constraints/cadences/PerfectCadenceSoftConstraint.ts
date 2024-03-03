import { ConcreteChordQuality } from "../../../music_theory/Chord"
import { GenericCadenceSoftConstraint } from "./GenericCadenceSoftConstraint"
import { Grabber } from "../../Grabber"
import { MusicalKey } from "../../../music_theory/MusicalKey"
import { chordConstraintTypeToName } from "../constraintUtils"
import { constantConcreteChordQualityGrabber, constantNumberGrabber } from "../../grabbers/constantGrabbers"

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
	)!.name as string
	constructor(bonus: number, keyGrabber: Grabber<MusicalKey>) {
		super(
			bonus,
			constantNumberGrabber(7),
			constantNumberGrabber(0),
			constantConcreteChordQualityGrabber("major" as ConcreteChordQuality),
			constantConcreteChordQualityGrabber("major" as ConcreteChordQuality),
			keyGrabber,
		)
	}
}
