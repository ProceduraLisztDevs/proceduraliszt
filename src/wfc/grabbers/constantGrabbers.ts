import { ConcreteChordQuality } from "../../music_theory/Chord"
import { Note, OctavedNote } from "../../music_theory/Note"
import { Grabber } from "../Grabber"
import { MelodyShape } from "../constraints/concepts/MelodyShape"

export function constantOctavedNoteGrabber(result: OctavedNote): Grabber<OctavedNote> {
	return () => result
}

export function constantNumberGrabber(result: number): Grabber<number> {
	return () => result
}

export function constantNumberArrayGrabber(result: number[]): Grabber<number[]> {
	return () => result
}

export function constantMelodyShapeGrabber(result: MelodyShape): Grabber<MelodyShape> {
	return () => result
}

export function constantConcreteChordQualityGrabber(result: ConcreteChordQuality): Grabber<ConcreteChordQuality> {
	return () => result
}

export function constantNoteGrabber(result: Note): Grabber<Note> {
	return () => result
}

export function constantStringArrayGrabber(result: string[]): Grabber<string[]> {
	return () => result
}