import {
	RhythmPattern,
	numberOfNotesInRhythmPattern,
} from "../../music_theory/Rhythm"
import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { HardConstraint } from "./concepts/Constraint"

export const MinimumNumberOfNotesHardConstraintInit = {
	type: "RestMaximumLengthHardConstraint" as const,
	minimumNumber: 1,
	validByDefault: true as const,
}

export type MinimumNumberOfNotesHardConstraintIR =
	typeof MinimumNumberOfNotesHardConstraintInit
export class MinimumNumberOfNotesHardConstraint
	implements HardConstraint<RhythmPattern>
{
	name = "Rest Maximum Length"

	private minimumNumber: number

	constructor(minimumNumber: number) {
		this.minimumNumber = minimumNumber
	}

	check(tile: Tile<RhythmPattern>, _higherValues: HigherValues): boolean {
		const rhythmPattern = tile.getValue()
		return numberOfNotesInRhythmPattern(rhythmPattern) >= this.minimumNumber
	}
}
