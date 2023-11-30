export function zip<A>(a: A[]): [A][]
export function zip<A, B>(a: A[], b: B[]): [A, B][]

export function zip(...arrays: unknown[][]): unknown[][] {
	const maxLength = Math.max(...arrays.map((arr) => arr.length))
	return Array.from({ length: maxLength }).map((_, i) =>
		arrays.map((arr) => arr[i]),
	)
}

export const arrayEquals = <T>(a: T[], b: T[]) => {
	return a.length === b.length && a.every((v, i) => v === b[i])
}
