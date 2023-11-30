import { OctavedNote } from "../../music_theory/Note"
import { Grabber } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"
import { MelodyShape } from "./concepts/MelodyShape"
import { noteConstraintTypeToName } from "./constraintUtils"

export const MelodyShapeHardConstraintInit = {
	type: "MelodyShapeHardConstraint" as const,
	shape: [] as MelodyShape,
	validByDefault: true as const,
}

export type MelodyShapeHardConstraintIR = typeof MelodyShapeHardConstraintInit

export class MelodyShapeHardConstraint implements HardConstraint<OctavedNote> {
	private grabber: Grabber<MelodyShape>
	name = noteConstraintTypeToName.get(
		MelodyShapeHardConstraintInit.type,
	) as string
	constructor(grabber: Grabber<MelodyShape>) {
		this.grabber = grabber
	}

	private checkPair(
		pos: number,
		first: OctavedNote,
		second: OctavedNote,
		shape: MelodyShape,
	): boolean {
		if (pos >= shape.length) throw new Error("Melody shape not long enough")
		const step = shape[pos]
		const stepSize = second.toMIDIValue() - first.toMIDIValue()

		switch (step) {
			case "ascend":
				return stepSize > 0
			case "descend":
				return stepSize < 0
			case "stagnate":
				return stepSize == 0
			case "wildcard":
				return true
			default:
				throw new Error("Invalid melody shape step")
		}
	}

	check(tile: Tile<OctavedNote>, higherValues: HigherValues): boolean {
		const note = tile.getValue()
		const pos = tile.getPosition()
		const prev = tile.getPrev()
		const next = tile.getNext()

		const shape = this.grabber(higherValues)

		let out = true
		if (prev.isCollapsed())
			out = out && this.checkPair(pos - 1, prev.getValue(), note, shape)
		if (next.isCollapsed())
			out = out && this.checkPair(pos, note, next.getValue(), shape)
		return out
	}
}
