import { MusicalKey } from "../../music_theory/MusicalKey"
import { OctavedNote } from "../../music_theory/Note"
import { Grabber } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { noteConstraintTypeToName } from "./constraintUtils"

export const MelodyInKeyHardConstraintInit = {
	type: "MelodyInKeyHardConstraint" as const,
	validByDefault: true as const,
}

export type MelodyInKeyHardConstraintIR = typeof MelodyInKeyHardConstraintInit

export class MelodyInKeyHardConstraint {
	private grabber: Grabber<MusicalKey>
	name = noteConstraintTypeToName.get(
		MelodyInKeyHardConstraintInit.type,
	) as string
	constructor(grabber: Grabber<MusicalKey>) {
		this.grabber = grabber
	}

	check(tile: Tile<OctavedNote>, higherValues: HigherValues): boolean {
		const note = tile.getValue()
		const key = this.grabber(higherValues)
		return key.containsNote(note.getNote())
	}
}
