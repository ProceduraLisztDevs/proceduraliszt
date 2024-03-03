import { Note, OctavedNote, OctavedNoteIR } from "../../music_theory/Note"
import { Grabber } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"

export const MelodyInRangeHardConstraintInit = {
	type: "MelodyInRangeHardConstraint" as const,
	lowerNoteIR: { note: Note.C, octave: 5 } as OctavedNoteIR,
	higherNoteIR: { note: Note.C, octave: 6 } as OctavedNoteIR,
	validByDefault: true as const,
}

export type MelodyInRangeHardConstraintIR =
	typeof MelodyInRangeHardConstraintInit

export class MelodyInRangeHardConstraint
	implements HardConstraint<OctavedNote>
{
	private lowerGrabber: Grabber<OctavedNote>
	private upperGrabber: Grabber<OctavedNote>
	name = noteConstraintTypeToName.get(
		MelodyInRangeHardConstraintInit.type,
	)!.name as string
	constructor(
		lowerGrabber: Grabber<OctavedNote>,
		upperGrabber: Grabber<OctavedNote>,
	) {
		this.lowerGrabber = lowerGrabber
		this.upperGrabber = upperGrabber
	}

	check(tile: Tile<OctavedNote>, higherValues: HigherValues): boolean {
		const note = tile.getValue()
		const lower = this.lowerGrabber(higherValues)
		const upper = this.upperGrabber(higherValues)
		return (
			note.toMIDIValue() >= lower.toMIDIValue() &&
			note.toMIDIValue() <= upper.toMIDIValue()
		)
	}
}
