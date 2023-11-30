import { Note, relativeNote } from "./Note"

export abstract class NoteSet {
	protected root: Note
	protected noteValues: number[]
	protected notes: Note[]

	getRoot(): Note {
		return this.root
	}

	constructor(root: Note, noteValues: number[]) {
		this.root = root
		this.noteValues = noteValues
		this.notes = noteValues.map((value) => relativeNote(root, value))
	}

	containsNote(note: Note): boolean {
		return this.notes.includes(note)
	}

	getNotes(): Note[] {
		return this.notes
	}
}
