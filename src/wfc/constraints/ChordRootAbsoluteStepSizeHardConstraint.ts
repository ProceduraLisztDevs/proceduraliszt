import { Chord } from "../../music_theory/Chord"
import { noteDistanceAbs } from "../../music_theory/Note"
import { Grabber } from "../Grabber"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { Chordesque } from "../hierarchy/Chordesque"
import { HardConstraint } from "./concepts/Constraint"
import { chordConstraintTypeToName } from "./constraintUtils"

export const ChordRootAbsoluteStepSizeHardConstraintInit = {
	type: "ChordRootAbsoluteStepSizeHardConstraint" as const,
	stepSizes: [1, 2, 3, 4, 5, 6],
	validByDefault: true as const,
}

export type ChordRootAbsoluteStepSizeHardConstraintIR =
	typeof ChordRootAbsoluteStepSizeHardConstraintInit

export class ChordRootAbsoluteStepSizeHardConstraint
	implements HardConstraint<Chordesque>
{
	private grabber: Grabber<number[]>
	name = chordConstraintTypeToName.get(
		ChordRootAbsoluteStepSizeHardConstraintInit.type,
	)!.name as string
	constructor(grabber: Grabber<number[]>) {
		this.grabber = grabber
	}

	check(tile: Tile<Chordesque>, higherValues: HigherValues): boolean {
		const chord = tile.getValue().getChord()
		const prev = tile.getPrev()
		const next = tile.getNext()

		let out = true
		if (prev.isCollapsed())
			out =
				out &&
				this.checkPair(prev.getValue().getChord(), chord, higherValues)
		if (next.isCollapsed())
			out =
				out &&
				this.checkPair(chord, next.getValue().getChord(), higherValues)
		return out
	}

	private checkPair(
		first: Chord,
		second: Chord,
		higherValues: HigherValues,
	): boolean {
		const stepSizeSet = this.grabber(higherValues)
		const firstRoot = first.getRoot()
		const secondRoot = second.getRoot()
		const stepSize = noteDistanceAbs(firstRoot, secondRoot)
		return stepSizeSet.includes(stepSize)
	}
}
