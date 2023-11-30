import { arrayEquals } from "../util/utils"
import { Chordesque, ChordesqueIR } from "../wfc/hierarchy/Chordesque"
import { Note, relativeNote } from "./Note"
import { NoteSet } from "./NoteSet"

export type ConcreteChordQuality =
	| "major"
	| "minor"
	| "diminished"
	| "augmented"
export type ChordQuality = ConcreteChordQuality | null
export type ChordIR = {
	root: Note
	quality: ChordQuality
}

export const isChordIR = (obj: ChordesqueIR): obj is ChordIR => {
	return typeof obj == "object"
}

export function stringToChordIR(chordString: string) {
	if (!["A", "B", "C", "D", "E", "F", "G"].includes(chordString[0]))
		return undefined

	const endOfRoot = chordString[1] == "#" ? 2 : 1
	const root = chordString.slice(0, endOfRoot) as Note
	const quality = chordString.slice(endOfRoot)

	if (["", "m", "°", "+"].includes(quality))
		return { root: root, quality: notationToQuality(quality)! }

	return undefined
}

export function chordIRToString(chordIR: ChordIR) {
	return `${chordIR.root}${qualityToNotation(chordIR.quality)}`
}

function notationToQuality(notation: string): ChordQuality | undefined {
	switch (notation) {
		case "":
			return "major"
		case "m":
			return "minor"
		case "°":
			return "diminished"
		case "+":
			return "augmented"
		default:
			return undefined
	}
}

function qualityToNotation(quality: ChordQuality): string {
	switch (quality) {
		case "major":
			return ""
		case "minor":
			return "m"
		case "diminished":
			return "°"
		case "augmented":
			return "+"
		default:
			throw new Error("Invalid chord quality")
	}
}

export class Chord extends NoteSet implements Chordesque {
	protected third: Note
	protected fifth: Note
	protected extensions?: Note[]

	constructor(root: Note, noteValues: number[]) {
		super(root, noteValues)
		this.third = relativeNote(root, noteValues[1])
		this.fifth = relativeNote(root, noteValues[2])
		this.extensions = noteValues
			.slice(3)
			.map((value) => relativeNote(root, value))
	}

	static fromRootAndQuality(root: Note, quality: ChordQuality): Chord {
		switch (quality) {
			case "major":
				return new MajorChord(root)
			case "minor":
				return new MinorChord(root)
			case "diminished":
				return new DiminishedChord(root)
			case "augmented":
				return new AugmentedChord(root)
			default:
				throw new Error("Invalid chord quality: " + quality)
		}
	}

	static fromIR(chordIR: ChordIR): Chord {
		return Chord.fromRootAndQuality(chordIR.root, chordIR.quality)
	}

	getChord() {
		return this
	}

	static allBasicChords(): Chord[] {
		const chords: Chord[] = []
		for (const note of Object.values(Note)) {
			chords.push(new MajorChord(note))
			chords.push(new MinorChord(note))
		}
		return chords
	}

	equals(other: Chord): boolean {
		return (
			this.root == other.root &&
			arrayEquals(this.noteValues, other.noteValues)
		)
	}

	getThird() {
		return this.third
	}

	getFifth() {
		return this.fifth
	}

	toString() {
		return `${this.root} ${this.noteValues
			.map((value) => `+${value}`)
			.join("")}`
	}

	getName() {
		return this.toString()
	}

	static parseChordString(chordString: string): Chord | undefined {
		const chordIR = stringToChordIR(chordString)
		if (chordIR == undefined) return undefined
		return Chord.fromRootAndQuality(chordIR.root, chordIR.quality)
	}

	static parseChordsString(chordsString: string): Chord[] | undefined {
		if (chordsString == "") return []
		const res = chordsString
			.trim()
			.split(" ")
			.map((chordString) => Chord.parseChordString(chordString))
		if (res.includes(undefined)) return undefined
		return res as Chord[]
	}
}

export class MajorChord extends Chord {
	constructor(root: Note) {
		super(root, [0, 4, 7])
	}

	toString() {
		return `${this.root}`
	}
}

export class MinorChord extends Chord {
	constructor(root: Note) {
		super(root, [0, 3, 7])
	}

	toString() {
		return `${this.root}m`
	}
}

export class DiminishedChord extends Chord {
	constructor(root: Note) {
		super(root, [0, 3, 6])
	}

	toString() {
		return `${this.root}°`
	}
}

export class AugmentedChord extends Chord {
	constructor(root: Note) {
		super(root, [0, 4, 8])
	}

	toString() {
		return `${this.root}+`
	}
}
