import { OctavedNote, Note } from "../../music_theory/Note"
import { Grabber, NoteGrabberIR } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"

export const MelodyStartsOnNoteHardConstraintInit = {
	type: "MelodyStartsOnNoteHardConstraint" as const,
	noteGrabber: "RootOfChordGrabber" as NoteGrabberIR,
	validByDefault: true as const,
}

export type MelodyStartsOnNoteHardConstraintIR =
	typeof MelodyStartsOnNoteHardConstraintInit

export class MelodyStartsOnNoteHardConstraint
	implements HardConstraint<OctavedNote>
{
	name = noteConstraintTypeToName.get(
		MelodyStartsOnNoteHardConstraintInit.type,
	) as string
	constructor(private grabber: Grabber<Note>) {}

	check(tile: Tile<OctavedNote>, higherValues: HigherValues): boolean {
		if (tile.getPosition() != 0) return true
		const note = tile.getValue()
		const startNote = this.grabber(higherValues)
		return note.getNote() == startNote
	}
}
