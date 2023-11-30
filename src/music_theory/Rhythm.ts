import { Random } from "../util/Random"

type RhythmUnit = {
	duration: number
	type: "note" | "rest"
}

export type RhythmPattern = RhythmUnit[]

export function durationOfRhythmPattern(pattern: RhythmPattern) {
	return pattern.reduce((sum, unit) => sum + unit.duration, 0)
}

export function numberOfNotesInRhythmPattern(pattern: RhythmPattern) {
	return pattern.filter((unit) => unit.type == "note").length
}

function abstractPatternsForLength(length: number) {
	if (length < 0) throw new Error("Pattern can't have negative length")

	const out: number[][] = []
	if (length == 0) out.push([])

	for (let i = 1; i <= length; i++) {
		const subResults = abstractPatternsForLength(length - i)
		for (const subResult of subResults) {
			subResult.push(i)
			out.push(subResult)
		}
	}
	return out
}

export interface RhythmPatternOptions {
	minimumNumberOfUnits?: number
	onlyStartOnNote: boolean
	minimumNumberOfNotes: number
	maximumRestLength: number
}

export function generateRhythmPatterns(
	length: number,
	{
		minimumNumberOfUnits = 1,
		onlyStartOnNote,
		minimumNumberOfNotes,
		maximumRestLength,
	}: RhythmPatternOptions,
) {
	const abstractPatterns = abstractPatternsForLength(length).filter(
		(pattern) => pattern.length >= minimumNumberOfUnits,
	)
	return abstractPatterns.flatMap((abstractPattern) =>
		allRhythmicCombinations({
			prefix: [],
			abstractPattern,
			onlyStartOnNote,
			minimumNumberOfNotes,
			maximumRestLength,
		}),
	)
}

export function getRandomRhythmPattern(
	length: number,
	options: RhythmPatternOptions,
	random: Random,
) {
	const patterns = generateRhythmPatterns(length, options)
	if (patterns.length == 0) throw new Error("No possible patterns")
	return patterns[random.nextInt(patterns.length)]
}

interface RhytmicCombinationOptions {
	prefix: RhythmPattern
	abstractPattern: number[]
	onlyStartOnNote: boolean
	minimumNumberOfNotes: number
	maximumRestLength: number
}

function allRhythmicCombinations({
	prefix,
	abstractPattern,
	onlyStartOnNote,
	minimumNumberOfNotes,
	maximumRestLength,
}: RhytmicCombinationOptions) {
	if (minimumNumberOfNotes > abstractPattern.length) return []
	if (abstractPattern.length == 0) return [prefix]
	const out: RhythmPattern[] = []
	const unitLength = abstractPattern[0]
	const restOfPattern = abstractPattern.slice(1)

	const prefixPlusNote = [
		...prefix,
		{ duration: unitLength, type: "note" } as RhythmUnit,
	]
	out.push(
		...allRhythmicCombinations({
			prefix: prefixPlusNote,
			abstractPattern: restOfPattern,
			onlyStartOnNote: false,
			minimumNumberOfNotes: minimumNumberOfNotes - 1,
			maximumRestLength,
		}),
	)

	if (!onlyStartOnNote && unitLength <= maximumRestLength) {
		const prefixPlusRest = [
			...prefix,
			{ duration: unitLength, type: "rest" } as RhythmUnit,
		]
		out.push(
			...allRhythmicCombinations({
				prefix: prefixPlusRest,
				abstractPattern: restOfPattern,
				onlyStartOnNote: true,
				minimumNumberOfNotes,
				maximumRestLength,
			}),
		)
	}

	return out
}
