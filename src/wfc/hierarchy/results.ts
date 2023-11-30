import { Chord } from "../../music_theory/Chord"
import { OctavedNote } from "../../music_theory/Note"
import { RhythmPattern } from "../../music_theory/Rhythm"

export type ChordResult = {
	chord: Chord
	notes: OctavedNote[]
}

export type ChordResultWithRhythm = ChordResult & {
	rhythmPattern: RhythmPattern
}

export type SectionResult = ChordResult[]

export type SectionResultWithRhythm = ChordResultWithRhythm[]
