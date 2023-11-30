import { MusicalKeyType } from "../components/GlobalSettings"
import { zip } from "../util/utils"
import { Chord, ChordQuality } from "./Chord"
import { Note } from "./Note"
import { NoteSet } from "./NoteSet"

export abstract class MusicalKey extends NoteSet {
	private basicChords: Chord[]

	constructor(
		root: Note,
		noteValues: number[],
		basicChordQualities: Array<ChordQuality> = [],
	) {
		super(root, noteValues)
		if (basicChordQualities.length === 0) {
			this.basicChords = []
		} else {
			this.basicChords = zip(this.notes, basicChordQualities).map(
				([note, quality]) => Chord.fromRootAndQuality(note, quality),
			)
		}
	}

	getBasicChords(): Chord[] {
		if (this.basicChords.length === 0) {
			throw new Error("No basic chords defined for this key")
		}
		return this.basicChords
	}

	containsChord(chord: Chord): boolean {
		return this.basicChords.some((basicChord) => basicChord.equals(chord))
	}

	public static fromRootAndType(
		root: Note,
		type: MusicalKeyType,
	): MusicalKey {
		switch (type) {
			case "major":
				return new MajorKey(root)
			case "minor":
				return new MinorKey(root)
			case "harmonic_minor":
				return new HarmonicMinorKey(root)
			case "melodic_minor":
				return new MelodicMinorKey(root)
			case "diminished":
				return new DiminishedKey(root)
			case "whole_tone":
				return new WholeToneKey(root)
			case "blues":
				return new BluesKey(root)
			case "major_pentatonic":
				return new MajorPentatonicKey(root)
			case "minor_pentatonic":
				return new MinorPentatonicKey(root)
			default:
				throw new Error(`Unknown key type: ${type}`)
		}
	}
}

export class MajorKey extends MusicalKey {
	constructor(root: Note) {
		super(
			root,
			[0, 2, 4, 5, 7, 9, 11],
			[
				"major",
				"minor",
				"minor",
				"major",
				"major",
				"minor",
				"diminished",
			],
		)
	}

	toString() {
		return `${this.root} major`
	}
}

export class MinorKey extends MusicalKey {
	constructor(root: Note) {
		super(
			root,
			[0, 2, 3, 5, 7, 8, 10],
			[
				"minor",
				"diminished",
				"major",
				"minor",
				"minor",
				"major",
				"major",
			],
		)
	}

	toString() {
		return `${this.root} minor`
	}
}

export class HarmonicMinorKey extends MusicalKey {
	constructor(root: Note) {
		super(
			root,
			[0, 2, 3, 5, 7, 8, 11],
			[
				"minor",
				"diminished",
				"augmented",
				"minor",
				"major",
				"major",
				"diminished",
			],
		)
	}

	toString() {
		return `${this.root} harmonic minor`
	}
}

export class MelodicMinorKey extends MusicalKey {
	constructor(root: Note) {
		super(
			root,
			[0, 2, 3, 5, 7, 9, 11],
			[
				"minor",
				"minor",
				"augmented",
				"major",
				"major",
				"diminished",
				"diminished",
			],
		)
	}

	toString() {
		return `${this.root} melodic minor`
	}
}

export class DiminishedKey extends MusicalKey {
	constructor(root: Note) {
		super(root, [0, 2, 3, 5, 6, 8, 9, 11])
	}

	toString() {
		return `${this.root} diminished`
	}
}

export class WholeToneKey extends MusicalKey {
	constructor(root: Note) {
		super(root, [0, 2, 4, 6, 8, 10])
	}

	toString() {
		return `${this.root} whole tone`
	}
}

export class BluesKey extends MusicalKey {
	constructor(root: Note) {
		super(root, [0, 3, 5, 6, 7, 10])
	}

	toString() {
		return `${this.root} blues`
	}
}

export class MajorPentatonicKey extends MusicalKey {
	constructor(root: Note) {
		super(root, [0, 2, 4, 7, 9])
	}

	toString() {
		return `${this.root} major pentatonic`
	}
}

export class MinorPentatonicKey extends MusicalKey {
	constructor(root: Note) {
		super(root, [0, 3, 5, 7, 10])
	}

	toString() {
		return `${this.root} minor pentatonic`
	}
}
