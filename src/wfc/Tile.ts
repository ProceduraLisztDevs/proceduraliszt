import { TileCanvas } from "./TileCanvas"

export interface TileProps<T> {
	status: T | Set<[T, number]> | "header" | "trailer"
	position: number
	canvas: TileCanvas<T>
	prev?: Tile<T>
	next?: Tile<T>
}

export class Tile<T> {
	private prev!: Tile<T>
	private next!: Tile<T>
	private position: number
	private numOptions: number
	private status: T | Set<[T, number]> | "header" | "trailer"
	private canvas: TileCanvas<T>
	private collapsed: boolean

	constructor(props: TileProps<T>) {
		this.status = props.status
		this.position = props.position
		this.canvas = props.canvas
		if (props.status === "header" || props.status === "trailer") {
			this.numOptions = 0
			this.collapsed = false
		} else if (props.status instanceof Set) {
			this.numOptions = props.status.size
			this.collapsed = false
		} else {
			this.numOptions = 1
			this.collapsed = true
		}
		this.prev = props.prev!
		this.next = props.next!
	}

	public setPrev(prev: Tile<T>): void {
		this.prev = prev
	}

	public setNext(next: Tile<T>): void {
		this.next = next
	}

	public getPrev(): Tile<T> {
		return this.prev
	}

	public getNext(): Tile<T> {
		return this.next
	}

	static header<T>(canvas: TileCanvas<T>): Tile<T> {
		return new Tile<T>({
			status: "header",
			position: -1,
			canvas: canvas,
		})
	}

	static trailer<T>(canvas: TileCanvas<T>): Tile<T> {
		return new Tile<T>({
			status: "trailer",
			position: canvas.getSize(),
			canvas: canvas,
		})
	}

	public updateOptions(options?: T[]): number {
		if (options === undefined) {
			if (!(this.status instanceof Set)) return -1
			options = [...(this.status as Set<[T, number]>)].map(
				([option, _weight]) => option,
			)
		}

		const newOptionWeights: [T, number][] = []
		let out = 0

		options.forEach((option: T) => {
			const weight = this.canvas
				.getConstraints()
				.weight(
					this.hypotheticalTile(option),
					this.canvas.getHigherValues(),
				)
			if (weight <= 0) return
			const optionWeightPair: [T, number] = [option, weight]
			newOptionWeights.push(optionWeightPair)
			out++
		})

		if (out === 0) {
			throw new Error("No valid options left")
		} else if (out === 1) {
			this.finishCollapse(newOptionWeights[0][0])
			return 1
		}

		this.status = new Set(newOptionWeights)
		this.numOptions = out

		this.canvas.addTileOption(this)
		return out
	}

	private hypotheticalTile(value: T): Tile<T> {
		const out = new Tile({
			canvas: this.canvas,
			position: this.position,
			status: value,
		})
		out.setPrev(this.prev)
		out.setNext(this.next)
		return out
	}

	private finishCollapse(value: T): void {
		this.status = value
		this.canvas.collapseOne()
		this.collapsed = true
		this.next.updateOptions()
		this.prev.updateOptions()
	}

	public getNumOptions(): number {
		return this.numOptions
	}

	public isActive(): boolean {
		return this.status instanceof Set
	}

	public isCollapsed(): boolean {
		return this.collapsed
	}

	public collapse(): void {
		if (!(this.status instanceof Set)) return
		const options = [...(this.status as Set<[T, number]>)]
		const totalWeight = options.reduce(
			(acc, [_, weight]) => acc + weight,
			0,
		)
		const random = this.canvas.getRandom()
		let randomWeight = random.next() * totalWeight
		let out: T | undefined = undefined
		for (const [option, weight] of options) {
			randomWeight -= weight
			if (randomWeight < 0) {
				out = option
				break
			}
		}
		if (out === undefined) throw new Error("No valid options left")
		this.finishCollapse(out)
	}

	public getValue(): T {
		if (!this.collapsed) throw new Error("Tile not collapsed")
		return this.status as T
	}

	public getPosition(): number {
		return this.position
	}

	public getCanvas(): TileCanvas<T> {
		return this.canvas
	}
}
