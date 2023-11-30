import { InfiniteArray } from "./InfiniteArray"

export class OptionsPerCell<T> {
	cells: InfiniteArray<T[]>
	allOptions: T[]

	constructor(allOptions: T[], map?: InfiniteArray<T[]>) {
		this.cells = map ?? new InfiniteArray<T[]>()
		this.allOptions = allOptions
	}

	public reset(): void {
		this.cells.clear()
	}

	public setOptions(position: number, options: T[]): void {
		this.cells.set(position, options)
	}

	public setValue(position: number, value: T): void {
		this.cells.set(position, [value])
	}

	public getOptions(position: number): T[] {
		const options = this.cells.get(position)
		if (options === undefined || options.length === 0) {
			return this.allOptions
		}
		return options
	}

	public getAllOptions(): T[] {
		return this.allOptions
	}

	public union(other: OptionsPerCell<T>): OptionsPerCell<T> {
		const newAllOptions = [...this.allOptions, ...other.allOptions]

		const newOptionsPerCell = new OptionsPerCell<T>(newAllOptions)

		for (const [position, options] of this.cells.entries()) {
			newOptionsPerCell.setOptions(position, options)
		}
		for (const [position, options] of other.cells.entries()) {
			newOptionsPerCell.setOptions(position, options)
		}

		return newOptionsPerCell
	}
}
