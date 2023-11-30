import { OctavedNote } from "../../music_theory/Note"
import { Tile } from "../Tile"
import { SoftConstraint } from "./concepts/Constraint"
import { noteConstraintTypeToName } from "./constraintUtils"

export const DescendingMelodySoftConstraintInit = {
	type: "DescendingMelodySoftConstraint" as const,
	bonus: 1,
	validByDefault: true as const,
}

export type DescendingMelodySoftConstraintIR =
	typeof DescendingMelodySoftConstraintInit

export class DescendingMelodySoftConstraint extends SoftConstraint<OctavedNote> {
	name = noteConstraintTypeToName.get(
		DescendingMelodySoftConstraintInit.type,
	) as string

	constructor(bonus: number) {
		super(bonus)
	}

	weight(tile: Tile<OctavedNote>): number {
		const note = tile.getValue()
		const prev = tile.getPrev()
		const next = tile.getNext()

		let out = 0

		if (prev.isCollapsed() && this.isDescending(prev.getValue(), note))
			out += this.bonus
		if (next.isCollapsed() && this.isDescending(note, next.getValue()))
			out += this.bonus

		return out
	}

	private isDescending(first: OctavedNote, second: OctavedNote): boolean {
		return first.toMIDIValue() > second.toMIDIValue()
	}
}
