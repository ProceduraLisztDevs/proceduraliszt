import { MusicalKey } from "../../music_theory/MusicalKey"
import { Grabber } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { Chordesque } from "../hierarchy/Chordesque"
import { HardConstraint } from "./concepts/Constraint"
import { chordConstraintTypeToName } from "./constraintUtils"

export const ChordInKeyHardConstraintInit = {
	type: "ChordInKeyHardConstraint" as const,
	validByDefault: true as const,
}

export type ChordInKeyHardConstraintIR = typeof ChordInKeyHardConstraintInit
export class ChordInKeyHardConstraint implements HardConstraint<Chordesque> {
	private grabber: Grabber<MusicalKey>
	name = chordConstraintTypeToName.get(
		ChordInKeyHardConstraintInit.type,
	) as string
	constructor(grabber: Grabber<MusicalKey>) {
		this.grabber = grabber
	}

	check(tile: Tile<Chordesque>, higherValues: HigherValues): boolean {
		const chord = tile.getValue().getChord()
		const key = this.grabber(higherValues)
		return key.containsChord(chord)
	}
}
