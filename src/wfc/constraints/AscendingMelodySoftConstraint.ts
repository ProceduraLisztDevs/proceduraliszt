import { OctavedNote } from "../../music_theory/Note"
import { Tile } from "../Tile"
import { SoftConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"

export const AscendingMelodySoftConstraintInit = {
	type: "AscendingMelodySoftConstraint" as const,
	bonus: 1,
	validByDefault: true as const,
}

export type AscendingMelodySoftConstraintIR =
	typeof AscendingMelodySoftConstraintInit
export class AscendingMelodySoftConstraint extends SoftConstraint<OctavedNote> {
	name = noteConstraintTypeToName.get(
		AscendingMelodySoftConstraintInit.type,
	) as string

	constructor(bonus: number) {
		super(bonus)
	}

	weight(tile: Tile<OctavedNote>): number {
		const note = tile.getValue()
		const prev = tile.getPrev()
		const next = tile.getNext()

		let out = 0

		if (prev.isCollapsed() && this.isAscending(prev.getValue(), note))
			out += this.bonus
		if (next.isCollapsed() && this.isAscending(note, next.getValue()))
			out += this.bonus

		return out
	}

	private isAscending(first: OctavedNote, second: OctavedNote): boolean {
		return first.toMIDIValue() < second.toMIDIValue()
	}
}
