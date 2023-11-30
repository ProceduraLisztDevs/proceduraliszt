import { HigherValues } from "./HigherValues"
import { Tile } from "./Tile"
import {
	SoftConstraint,
	HardConstraint,
	Constraint,
	isHardConstraint,
} from "./constraints/concepts/Constraint"

function partition<T>(array: T[], isValid: (elem: T) => boolean): [T[], T[]] {
	return array.reduce<[T[], T[]]>(
		([pass, fail], elem) => {
			return isValid(elem)
				? [[...pass, elem], fail]
				: [pass, [...fail, elem]]
		},
		[[], []]
	)
}

export class ConstraintSet<T> {
	private softConstraints: SoftConstraint<T>[]
	private hardConstraints: HardConstraint<T>[]

	constructor(constraints?: Constraint<T>[]) {
		[this.softConstraints, this.hardConstraints] = partition(
			constraints ?? [],
			(constraint) => constraint instanceof SoftConstraint
		) as [SoftConstraint<T>[], HardConstraint<T>[]]
	}

	public weight(tile: Tile<T>, higherValues: HigherValues): number {
		if (
			!this.hardConstraints.every((hardConstraint) =>
				hardConstraint.check(tile, higherValues)
			)
		)
			return 0
		let out = 1
		this.softConstraints.forEach((softConstraint) => {
			out += softConstraint.weight(tile, higherValues)
		})
		return out
	}

	public getAllConstraints(): Constraint<T>[] {
		return [...this.softConstraints, ...this.hardConstraints]
	}

	public addConstraint(constraint: Constraint<T>): void {
		if (constraint instanceof SoftConstraint)
			this.softConstraints.push(constraint)
		else if (isHardConstraint(constraint))
			this.hardConstraints.push(constraint)
		else throw new Error(`Unknown constraint: ${constraint}`)
	}

	public addConstraints(constraints: Constraint<T>[]): void {
		constraints.forEach((constraint) => this.addConstraint(constraint))
	}

	public clear(): void {
		this.softConstraints = []
		this.hardConstraints = []
	}

	public removeConstraint(constraint: Constraint<T>): boolean {
		if (constraint instanceof SoftConstraint) {
			const index = this.softConstraints.indexOf(constraint)
			if (index >= 0) {
				this.softConstraints.splice(index, 1)
				return true
			}
		} else if (isHardConstraint(constraint)) {
			const index = this.hardConstraints.indexOf(constraint)
			if (index >= 0) {
				this.hardConstraints.splice(index, 1)
				return true
			}
		} else throw new Error(`Unknown constraint: ${constraint}`)
		return false
	}

	public union(other: ConstraintSet<T>): ConstraintSet<T> {
		const out = new ConstraintSet<T>(
			this.getAllConstraints().filter(
				(constraint) =>
					!other
						.getAllConstraints()
						.some(
							(otherConstraint) =>
								otherConstraint.name === constraint.name
						)
			)
		)
		out.addConstraints(other.getAllConstraints())
		return out
	}
}
