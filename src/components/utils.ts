import { Note } from "../music_theory/Note"
import { MusicalKeyType } from "./GlobalSettings"

export type SelectOption = {
	value: string
	label: string
} | null

export type SelectKeyTypeOption = {
	value: MusicalKeyType
	label: string
} | null

export type SelectNoteOption = {
	value: Note
	label: string
} | null
