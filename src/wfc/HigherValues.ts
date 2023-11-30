import { Chord } from "../music_theory/Chord"
import { MusicalKey } from "../music_theory/MusicalKey"
import { RhythmPattern, RhythmPatternOptions } from "../music_theory/Rhythm"
import { Section } from "../wfc/hierarchy/Section"

export interface HigherValues {
	key: MusicalKey,
	melodyKey: MusicalKey,

	bpm: number,

	useRhythm: boolean,
	rhythmPatternOptions: RhythmPatternOptions,

	numSections: number,
	numChords: number,
	melodyLength: number
	
	section?: Section
	chord?: Chord
	rhythmPattern?: RhythmPattern
}
