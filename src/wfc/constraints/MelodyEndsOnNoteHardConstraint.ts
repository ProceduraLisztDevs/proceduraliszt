import { OctavedNote, Note } from "../../music_theory/Note"
import { Grabber } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"
import { NoteGrabberIR } from "../Grabber"

export const MelodyEndsOnNoteHardConstraintInit = {
	type: "MelodyEndsOnNoteHardConstraint" as const,
	noteGrabber: "RootOfChordGrabber" as NoteGrabberIR,
	validByDefault: true as const,
}

export type MelodyEndsOnNoteHardConstraintIR =
	typeof MelodyEndsOnNoteHardConstraintInit

export class MelodyEndsOnNoteHardConstraint
	implements HardConstraint<OctavedNote>
{
	private grabber: Grabber<Note>
	name = noteConstraintTypeToName.get(
		MelodyEndsOnNoteHardConstraintInit.type,
	)!.name as string
	constructor(grabber: Grabber<Note>) {
		this.grabber = grabber
	}

	check(tile: Tile<OctavedNote>, higherValues: HigherValues): boolean {
		if (tile.getPosition() != tile.getCanvas().getSize() - 1) return true
		const note = tile.getValue()
		const startNote = this.grabber(higherValues)
		return note.getNote() == startNote
	}
}
