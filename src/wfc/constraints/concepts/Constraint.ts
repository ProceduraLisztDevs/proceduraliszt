import { HigherValues } from "../../HigherValues"
import { Tile } from "../../Tile"

export type Constraint<T> = HardConstraint<T> | SoftConstraint<T>

export interface HardConstraint<T> {
	name: string
	check: (tile: Tile<T>, higherValues: HigherValues) => boolean
}

export function isHardConstraint<T>(
	constraint: Constraint<T>,
): constraint is HardConstraint<T> {
	return "check" in constraint
}

export abstract class SoftConstraint<T> {
	abstract name: string
	abstract weight(tile: Tile<T>, higherValues: HigherValues): number
	protected bonus: number

	constructor(bonus: number) {
		this.bonus = bonus
	}
}
