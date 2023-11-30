export class Random {
	private seed: number

	constructor(seed?: number) {
		this.seed = seed || Math.random()
	}

	next(): number {
		const x = Math.sin(this.seed++) * 10000
		return x - Math.floor(x)
	}

	nextInt(n: number): number {
		if (n <= 0) {
			throw new Error("Invalid argument: n must be a positive integer.")
		}

		const max = Math.floor(4294967296 / n) * n // 2^32
		let randomNumber: number

		do {
			randomNumber = this.next() * 4294967296 // 2^32
		} while (randomNumber >= max)

		return Math.floor(randomNumber / (4294967296 / n))
	}
}
